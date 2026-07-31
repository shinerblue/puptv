import { NextRequest, NextResponse } from "next/server";

/**
 * DEMO MODE STUB.
 *
 * The real pipeline (Nano Banana Pro stills -> Kling 2.5 clips -> ffmpeg
 * stitch) is proven and lives in pipeline/puptv_pipeline_test.py. This
 * route intentionally does NOT call Replicate or touch Supabase at
 * runtime — the Supabase project backing this app is inactive, and the
 * app must run with zero required env vars. This route always returns
 * the sample cartoon stills used for the preview-gate step.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const petName = typeof body?.petName === "string" ? body.petName : undefined;

  return NextResponse.json({
    success: true,
    demo: true,
    petName,
    stills: ["/demo/still-1.jpg", "/demo/still-2.jpg", "/demo/still-3.jpg"],
    message:
      "Demo mode: showing sample stills. In production this calls Nano Banana Pro per pipeline/puptv_pipeline_test.py.",
  });
}
