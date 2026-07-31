import { NextRequest, NextResponse } from "next/server";
import {
  VIDEO_MODEL,
  VIDEO_NEGATIVE_PROMPT,
  THEME_SCENES,
  ReplicateHttpError,
  buildVideoPrompt,
  createPrediction,
  isAllowedOutputUrl,
  isLiveEnabled,
} from "@/lib/replicate";
import { clientIpFrom, takeClip } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function demoResponse(petName: string, notice?: string) {
  return NextResponse.json({
    success: true,
    demo: true,
    petName,
    etaMinutes: 15,
    sampleYoutubeVideoId: "PIcIfIdC1kA",
    ...(notice ? { notice } : {}),
    message:
      "Demo mode: no video was actually rendered. Live generation runs when REPLICATE_API_TOKEN is configured.",
  });
}

/**
 * Video clip generation (one 5s scene per request).
 *
 * DEMO MODE (no REPLICATE_API_TOKEN, or PUPTV_LIVE=off, or legacy request
 * without a stillUrl): returns the original sample confirmation payload —
 * identical behavior to the original stub.
 *
 * LIVE MODE: animates an approved cartoon still with
 * kwaivgi/kling-v2.5-turbo-pro and returns { predictionId } immediately
 * (client polls /api/job-status; clips take ~3-6 minutes).
 */
export async function POST(request: NextRequest) {
  const body: Record<string, unknown> = await request.json().catch(() => ({}));
  const petName =
    typeof body.petName === "string" && body.petName.trim() ? body.petName.trim() : "Dutch";
  const stillUrl = typeof body.stillUrl === "string" ? body.stillUrl : undefined;

  // Demo mode: no token / kill switch / legacy request shape without a still URL.
  if (!isLiveEnabled() || !stillUrl) {
    return demoResponse(petName);
  }

  if (!isAllowedOutputUrl(stillUrl)) {
    return NextResponse.json(
      { error: "stillUrl must be a generated scene image." },
      { status: 400 }
    );
  }

  const themeRaw = body.theme;
  const theme =
    typeof themeRaw === "string" && themeRaw in THEME_SCENES ? themeRaw : "park";
  const sceneIndexRaw = body.sceneIndex;
  const sceneIndex =
    typeof sceneIndexRaw === "number" &&
    Number.isInteger(sceneIndexRaw) &&
    sceneIndexRaw >= 0 &&
    sceneIndexRaw <= 2
      ? sceneIndexRaw
      : 0;

  const gate = takeClip(clientIpFrom(request.headers));
  if (!gate.allowed) {
    return demoResponse(
      petName,
      "You've reached today's live animation limit — come back tomorrow to finish this episode for real."
    );
  }

  try {
    const prediction = await createPrediction(VIDEO_MODEL, {
      prompt: buildVideoPrompt(petName, theme, sceneIndex),
      start_image: stillUrl,
      duration: 5,
      negative_prompt: VIDEO_NEGATIVE_PROMPT,
    });
    return NextResponse.json({ success: true, demo: false, predictionId: prediction.id });
  } catch (err) {
    if (err instanceof ReplicateHttpError && err.status === 429) {
      return NextResponse.json(
        { error: "The animation studio is at capacity right now.", retryAfterSeconds: 45 },
        { status: 429, headers: { "Retry-After": "45" } }
      );
    }
    const message =
      err instanceof ReplicateHttpError
        ? err.message
        : "Something went wrong starting the animation.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
