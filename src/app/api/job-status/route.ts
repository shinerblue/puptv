import { NextRequest, NextResponse } from "next/server";
import { ReplicateHttpError, getPrediction, isLiveEnabled } from "@/lib/replicate";

export const dynamic = "force-dynamic";

const ID_PATTERN = /^[\w-]{8,64}$/;

/**
 * Server-side proxy for Replicate prediction status. The client polls
 * this every ~5s; the Replicate token never leaves the server.
 * Returns { status, output, error }.
 */
export async function GET(request: NextRequest) {
  if (!isLiveEnabled()) {
    return NextResponse.json({ error: "Live generation is not enabled." }, { status: 503 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id || !ID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Missing or invalid prediction id." }, { status: 400 });
  }
  try {
    const prediction = await getPrediction(id);
    return NextResponse.json(prediction);
  } catch (err) {
    if (err instanceof ReplicateHttpError) {
      if (err.status === 429) {
        return NextResponse.json(
          { error: err.message, retryAfterSeconds: 15 },
          { status: 429, headers: { "Retry-After": "15" } }
        );
      }
      if (err.status === 404) {
        return NextResponse.json({ error: err.message }, { status: 404 });
      }
    }
    return NextResponse.json({ error: "Couldn't check the job status." }, { status: 502 });
  }
}
