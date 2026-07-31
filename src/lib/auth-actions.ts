"use server";

import { redirect } from "next/navigation";
import { isAuthConfigured, isGoogleConfigured, signIn, signOut } from "@/lib/auth";

/**
 * Server actions for sign in / sign out.
 *
 * Deliberately server actions rather than the client-side `signIn()` helper:
 * Next.js gives every action its own origin-bound POST with built-in CSRF
 * protection, and finishing on the server means the RSC tree (including the
 * header's signed-in state) re-renders instead of showing a stale cache.
 * The browser never receives a client id, a secret or a token this way.
 */

/**
 * Only same-site paths may be used as a post-sign-in destination. Anything
 * else — protocol-relative "//evil.com", "/\evil.com", absolute URLs — falls
 * back to the homepage. Auth.js's redirect callback re-checks this too;
 * belt and braces, because an open redirect on a login flow is a real bug.
 */
function safeCallbackUrl(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "/";
  return value === "/" || /^\/(?![/\\])/.test(value) ? value : "/";
}

export async function signInWithGoogle(formData: FormData): Promise<void> {
  if (!isAuthConfigured() || !isGoogleConfigured()) redirect("/account");
  await signIn("google", { redirectTo: safeCallbackUrl(formData.get("callbackUrl")) });
}

export async function signOutEverywhere(): Promise<void> {
  if (!isAuthConfigured()) redirect("/");
  await signOut({ redirectTo: "/" });
}
