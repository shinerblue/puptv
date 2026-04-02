import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required" },
        { status: 400 }
      );
    }

    // Use a cartoon/anime style transfer model on Replicate
    // Using the tooncrafter / style transfer approach
    const output = await replicate.run(
      "tencentarc/photomaker-style:467d062309da518648ba89d226490e02b8c38571f1199b7174b1c189b3449614",
      {
        input: {
          input_image: imageUrl,
          prompt:
            "adorable cartoon illustration of this dog, pixar style, bright colors, happy expression, adventure setting, high quality cartoon, cute character design, vibrant background",
          style_name: "Cartoon",
          negative_prompt:
            "realistic, photo, dark, scary, violent, low quality, blurry",
          num_steps: 30,
          guidance_scale: 7.5,
          style_strength_ratio: 35,
          num_outputs: 1,
        },
      }
    );

    // Replicate returns an array of URLs or a single URL
    const cartoonUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({
      success: true,
      cartoonUrl:
        typeof cartoonUrl === "string"
          ? cartoonUrl
          : (cartoonUrl as { url?: string })?.url || cartoonUrl,
    });
  } catch (error: unknown) {
    console.error("Cartoonify error:", error);

    // For MVP demo, return a placeholder response if API key is missing
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({
        success: true,
        cartoonUrl: "/demo-cartoon.png",
        demo: true,
        message: "Demo mode - set REPLICATE_API_TOKEN for real AI processing",
      });
    }

    return NextResponse.json(
      {
        error: "Failed to cartoonify image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
