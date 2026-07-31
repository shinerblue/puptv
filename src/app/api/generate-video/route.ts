import { NextRequest, NextResponse } from "next/server";

/**
 * DEMO MODE STUB.
 *
 * Real rendering (Kling 2.5 clips + ffmpeg stitch + YouTube upload) is
 * proven in pipeline/puptv_pipeline_test.py but is deliberately NOT
 * wired into this request path. No Replicate or Supabase calls happen
 * here — this route just returns the sample confirmation payload used
 * by the create flow's final step.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const petName = typeof body?.petName === "string" && body.petName ? body.petName : "Dutch";

  return NextResponse.json({
    success: true,
    demo: true,
    petName,
    etaMinutes: 15,
    sampleYoutubeVideoId: "PIcIfIdC1kA",
    message:
      "Demo mode: no video was actually rendered. In production this triggers the pipeline and publishes to the customer's YouTube channel.",
  });
}
