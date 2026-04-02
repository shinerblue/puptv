import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

// Allow up to 60s for AI model inference
export const maxDuration = 60;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    // Demo mode when no API token
    if (!process.env.REPLICATE_API_TOKEN) {
      await new Promise((r) => setTimeout(r, 1500));
      return NextResponse.json({
        success: true,
        cartoonUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=512&q=80",
        demo: true,
      });
    }

    // Use SDXL img2img for cartoon-style transformation
    // Version: 7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc (latest as of 2025)
    const output = await replicate.run(
      "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
      {
        input: {
          image: imageUrl,
          prompt:
            "Pixar 3D cartoon dog, adorable character, big expressive eyes, soft cel-shaded fur, bright vivid colors, cheerful happy expression, studio lighting, high quality digital art, professional CGI render, 4k",
          negative_prompt:
            "realistic, photo, blurry, low quality, dark, scary, ugly, deformed, human, person",
          prompt_strength: 0.7,
          num_inference_steps: 30,
          guidance_scale: 7.5,
        },
      }
    );

    // SDXL returns an array of image URLs
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
