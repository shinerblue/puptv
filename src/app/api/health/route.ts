import { NextResponse } from "next/server";
import { isLiveEnabled } from "@/lib/replicate";

export const dynamic = "force-dynamic";

/**
 * Reports whether live AI generation is enabled on this deployment
 * (REPLICATE_API_TOKEN present and PUPTV_LIVE not set to "off").
 * Never exposes the token itself.
 */
export async function GET() {
  return NextResponse.json({ live: isLiveEnabled() });
}
