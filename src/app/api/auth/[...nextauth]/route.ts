import { NextResponse, type NextRequest } from "next/server";
import { handlers, isAuthConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Auth.js route handler.
 *
 * When no auth env vars are set this endpoint does not exist as far as the
 * outside world is concerned: it answers 404 rather than letting @auth/core
 * throw a MissingSecret/Configuration error (which would leak the fact that
 * auth is half-wired and produce 500s in the logs). The check runs per
 * request, so setting the env vars in Vercel turns the endpoint on without
 * shipping new code.
 */
function notConfigured(): NextResponse {
  return NextResponse.json({ error: "auth_not_configured" }, { status: 404 });
}

export async function GET(request: NextRequest): Promise<Response> {
  if (!isAuthConfigured()) return notConfigured();
  return handlers.GET(request);
}

export async function POST(request: NextRequest): Promise<Response> {
  if (!isAuthConfigured()) return notConfigured();
  return handlers.POST(request);
}
