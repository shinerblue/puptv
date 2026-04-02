import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const { cartoonUrl, dogName, adventureTheme } = await request.json();

    if (!cartoonUrl) {
      return NextResponse.json(
        { error: "cartoonUrl is required" },
        { status: 400 }
      );
    }

    const themePrompts: Record<string, string> = {
      park: "cartoon dog playing happily in a beautiful sunny park with butterflies and flowers, pixar animation style, looping video",
      beach: "cartoon dog running joyfully on a tropical beach with waves and palm trees, pixar animation style, looping video",
      space: "cartoon dog floating in a colorful outer space with stars and planets, astronaut helmet, pixar animation style, looping video",
      mountain: "cartoon dog hiking on a beautiful mountain trail with scenic views and wildlife, pixar animation style, looping video",
      city: "cartoon dog exploring a vibrant cartoon city with tall buildings and friendly people, pixar animation style, looping video",
    };

    const prompt =
      themePrompts[adventureTheme || "park"] ||
      themePrompts.park;

    // Use Stable Video Diffusion or similar video gen model
    const output = await replicate.run(
      "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
      {
        input: {
          input_image: cartoonUrl,
          motion_bucket_id: 180,
          fps: 12,
          cond_aug: 0.02,
          decoding_t: 7,
          seed: 0,
          sizing_strategy: "maintain_aspect_ratio",
          frames_per_second: 12,
        },
      }
    );

    const videoUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({
      success: true,
      videoUrl:
        typeof videoUrl === "string"
          ? videoUrl
          : (videoUrl as { url?: string })?.url || videoUrl,
      dogName,
      adventureTheme,
    });
  } catch (error: unknown) {
    console.error("Video generation error:", error);

    // Demo mode fallback
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({
        success: true,
        videoUrl: "/demo-video.mp4",
        demo: true,
        message: "Demo mode - set REPLICATE_API_TOKEN for real AI processing",
      });
    }

    return NextResponse.json(
      {
        error: "Failed to generate video",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
