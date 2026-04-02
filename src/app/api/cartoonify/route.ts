import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      await new Promise((r) => setTimeout(r, 1500));
      return NextResponse.json({
        success: true,
        cartoonUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=512&q=80",
        demo: true,
      });
    }

    // instruct-pix2pix: instruction-following image editor
    const output = await replicate.run(
      "timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60dd6a325b95a00adc82c3b65",
      {
        input: {
          image: imageUrl,
          prompt:
            "Transform this dog into an adorable Pixar-style 3D cartoon character. Bright vivid colors, soft cel-shaded fur, big expressive eyes, cheerful happy expression. High quality digital art, professional CGI, studio lighting.",
          num_inference_steps: 20,
          image_guidance_scale: 1.2,
          guidance_scale: 8.0,
        },
      }
    );

    const outputUrl = Array.isArray(output) ? output[0] : output;
    const cartoonUrl = typeof outputUrl === "string" ? outputUrl : String(outputUrl);

    return NextResponse.json({ success: true, cartoonUrl });
  } catch (error: unknown) {
    console.error("Cartoonify error:", error);
    return NextResponse.json(
      {
        error: "Failed to cartoonify image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
