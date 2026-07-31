import { NextRequest, NextResponse } from "next/server";
import {
  STILL_MODEL,
  THEME_SCENES,
  ReplicateHttpError,
  buildStillPrompt,
  createPrediction,
  isAllowedOutputUrl,
  isLiveEnabled,
} from "@/lib/replicate";
import { clientIpFrom, takeRun } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DEMO_STILLS = ["/demo/still-1.jpg", "/demo/still-2.jpg", "/demo/still-3.jpg"];
const MAX_PHOTOS = 5;
const MAX_PHOTO_CHARS = 1_500_000; // ~1.1MB decoded — generous for a 1024px JPEG data URI

function demoResponse(petName: string | undefined, notice?: string) {
  return NextResponse.json({
    success: true,
    demo: true,
    petName,
    stills: DEMO_STILLS,
    ...(notice ? { notice } : {}),
    message:
      "Demo mode: showing sample stills. Live generation runs when REPLICATE_API_TOKEN is configured (see pipeline/puptv_pipeline_test.py for the reference pipeline).",
  });
}

/**
 * Cartoon still generation (one scene per request).
 *
 * DEMO MODE (no REPLICATE_API_TOKEN, or PUPTV_LIVE=off, or no photos in
 * the request): returns the sample stills — identical behavior to the
 * original stub, zero runtime deps.
 *
 * LIVE MODE: creates a google/nano-banana-pro prediction and returns
 * { predictionId } immediately (client polls /api/job-status). Scene 0
 * establishes the cartoon character from the owner's photos; scenes 1-2
 * chain the scene-0 output back in as an identity reference.
 */
export async function POST(request: NextRequest) {
  const body: Record<string, unknown> = await request.json().catch(() => ({}));
  const petName = typeof body.petName === "string" ? body.petName : undefined;

  const rawPhotos = Array.isArray(body.photos) ? body.photos : [];
  const photos = rawPhotos.filter(
    (p): p is string =>
      typeof p === "string" && p.startsWith("data:image/") && p.length <= MAX_PHOTO_CHARS
  );

  // Every photo was rejected by the filter (wrong encoding, or each one over
  // MAX_PHOTO_CHARS). Falling through to the demo response here would hand the
  // user sample stills of a different dog and call them their own — say so
  // instead. A request with no `photos` key at all is the legacy demo shape and
  // still falls through below.
  if (rawPhotos.length > 0 && photos.length === 0) {
    return NextResponse.json(
      { error: "We couldn't read those photos. Please re-add them and try again." },
      { status: 400 }
    );
  }

  // Demo mode: no token / kill switch / legacy request shape without photos.
  if (!isLiveEnabled() || photos.length === 0) {
    return demoResponse(petName);
  }

  if (photos.length > MAX_PHOTOS) {
    return NextResponse.json(
      { error: `Please send at most ${MAX_PHOTOS} photos.` },
      { status: 400 }
    );
  }

  const sceneIndexRaw = body.sceneIndex;
  const sceneIndex =
    typeof sceneIndexRaw === "number" &&
    Number.isInteger(sceneIndexRaw) &&
    sceneIndexRaw >= 0 &&
    sceneIndexRaw <= 2
      ? sceneIndexRaw
      : 0;
  const themeRaw = body.theme;
  const theme =
    typeof themeRaw === "string" && themeRaw in THEME_SCENES ? themeRaw : "park";
  const details = typeof body.details === "string" ? body.details.slice(0, 600).trim() : "";
  const cartoonRefUrl = typeof body.cartoonRefUrl === "string" ? body.cartoonRefUrl : undefined;

  if (sceneIndex > 0 && (!cartoonRefUrl || !isAllowedOutputUrl(cartoonRefUrl))) {
    return NextResponse.json(
      { error: "Scenes 2 and 3 need the scene 1 cartoon still as a reference." },
      { status: 400 }
    );
  }

  // Abuse guard: a "run" starts at scene 0. Over the cap → graceful demo fallback.
  if (sceneIndex === 0) {
    const gate = takeRun(clientIpFrom(request.headers));
    if (!gate.allowed) {
      const notice =
        gate.reason === "ip-daily"
          ? "You've used today's free live previews, so these are sample scenes. Come back tomorrow to draw your own pup for real."
          : "We've hit today's community rendering limit, so these are sample scenes. Come back tomorrow to draw your own pup for real.";
      return demoResponse(petName, notice);
    }
  }

  const prompt = buildStillPrompt({
    petName: (petName ?? "").trim() || "Buddy",
    details,
    theme,
    sceneIndex,
  });
  const imageInput = sceneIndex === 0 ? photos : [...photos, cartoonRefUrl as string];

  try {
    const prediction = await createPrediction(STILL_MODEL, {
      prompt,
      image_input: imageInput,
      aspect_ratio: "16:9",
      resolution: "2K",
      output_format: "jpg",
    });
    return NextResponse.json({ success: true, demo: false, predictionId: prediction.id });
  } catch (err) {
    if (err instanceof ReplicateHttpError && err.status === 429) {
      return NextResponse.json(
        { error: "The art studio is at capacity right now.", retryAfterSeconds: 45 },
        { status: 429, headers: { "Retry-After": "45" } }
      );
    }
    const message =
      err instanceof ReplicateHttpError
        ? err.message
        : "Something went wrong starting the drawing.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
