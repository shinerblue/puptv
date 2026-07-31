import { NextResponse } from "next/server";
import { isLiveEnabled } from "@/lib/replicate";

export const dynamic = "force-dynamic";

/**
 * Reports whether live AI generation is enabled on this ToonTails deployment
 * (REPLICATE_API_TOKEN present and PUPTV_LIVE not set to "off" — the env var
 * name is unchanged post-rebrand to avoid touching Vercel config).
 * Never exposes the token itself.
 */
export async function GET() {
  return NextResponse.json({ live: isLiveEnabled() });
}
