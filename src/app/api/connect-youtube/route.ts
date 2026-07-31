import { NextResponse } from "next/server";

/**
 * DEMO MODE STUB.
 *
 * Real integration is Google OAuth (youtube.upload scope) storing a
 * per-user token in Supabase. That project is inactive, so this route
 * simulates a successful connection without touching Google or
 * Supabase at runtime.
 */
export async function POST() {
  return NextResponse.json({
    success: true,
    demo: true,
    connected: true,
    channelName: "Demo Channel",
    message: "Demo mode: no Google account was actually connected.",
  });
}
