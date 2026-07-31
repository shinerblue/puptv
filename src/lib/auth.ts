/**
 * Auth.js (next-auth v5) configuration for ToonTails (repo/deployment still
 * named "puptv" — see layout.tsx for the rebrand note).
 *
 * DESIGN CONSTRAINTS (do not break these):
 *  - ZERO DATABASE. No adapter is configured, so sessions are stateless
 *    JWTs held in an httpOnly cookie. Nothing about a user is persisted
 *    anywhere on our side — see /account, which says exactly that.
 *  - GOOGLE ONLY. Sign-in is Google-only by design. There is no Apple
 *    provider, scaffolded or otherwise — if that changes, it starts here.
 *  - FULLY ENV-GATED. With no AUTH_SECRET / GOOGLE_CLIENT_ID / GOOGLE_
 *    CLIENT_SECRET the app must behave exactly as it did before auth
 *    existed: no provider, no sign-in UI, and /api/auth/* answers 404.
 *    `isAuthConfigured()` is the single source of truth for that and is
 *    read at request time, so adding the env vars in Vercel switches auth
 *    on without a code change.
 *  - SERVER ONLY. This module pulls in next-auth and reads secrets from
 *    process.env; it must never be imported from a "use client" file.
 */
import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";

/** 30 days — long enough that a 55+ audience is not re-authenticating weekly. */
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

/** Treat empty/whitespace-only env vars as absent (Vercel happily stores ""). */
function env(name: string): string | undefined {
  const value = process.env[name];
  return value !== undefined && value.trim().length > 0 ? value : undefined;
}

export function isGoogleConfigured(): boolean {
  return Boolean(env("GOOGLE_CLIENT_ID") && env("GOOGLE_CLIENT_SECRET"));
}

/**
 * Auth is "on" only when a secret exists AND Google is fully configured.
 * A secret without a provider (or a provider without a secret) is a
 * half-configured deployment, and half-configured auth is worse than
 * none — we stay in degraded mode instead.
 */
export function isAuthConfigured(): boolean {
  return Boolean(env("AUTH_SECRET")) && isGoogleConfigured();
}

function buildProviders(): Provider[] {
  const providers: Provider[] = [];

  const googleId = env("GOOGLE_CLIENT_ID");
  const googleSecret = env("GOOGLE_CLIENT_SECRET");
  if (googleId && googleSecret) {
    providers.push(
      Google({
        clientId: googleId,
        clientSecret: googleSecret,
        authorization: {
          params: {
            // Identity only, for now. We ask for the narrowest thing that
            // lets us greet someone by name and remember who they are.
            scope: "openid email profile",

            // ---- ENABLING YOUTUBE UPLOAD LATER (one-line change) --------
            // Replace the scope line above with:
            //   scope: "openid email profile https://www.googleapis.com/auth/youtube.upload",
            // and uncomment the two params below so Google issues a refresh
            // token instead of a 1-hour access token:
            // access_type: "offline",
            // prompt: "consent",
            //
            // Then persist that refresh token SERVER-SIDE and encrypted --
            // never in the session JWT, which is a cookie the browser holds.
            // youtube.upload is a Google "sensitive" scope: the OAuth consent
            // screen must pass verification first. See docs/auth-setup.md and
            // docs/youtube-verification.md.
            // -------------------------------------------------------------
          },
        },
      })
    );
  }

  return providers;
}

/** Only allow post-auth redirects that stay on this site. */
function safeRedirect(url: string, baseUrl: string): string {
  // Site-relative path. Reject "//host" and "/\host", both of which the URL
  // parser resolves to a foreign origin.
  if (url === "/" || /^\/(?![/\\])/.test(url)) {
    try {
      return new URL(url, baseUrl).toString();
    } catch {
      return baseUrl;
    }
  }
  // Absolute URL: only accept an exact origin match.
  try {
    if (new URL(url).origin === new URL(baseUrl).origin) return url;
  } catch {
    /* not a URL at all */
  }
  return baseUrl;
}

export const authConfig: NextAuthConfig = {
  providers: buildProviders(),

  // Generate with: openssl rand -base64 33
  secret: env("AUTH_SECRET"),

  /**
   * Vercel terminates TLS at the edge, so the Host/X-Forwarded-Proto headers
   * have to be trusted for callback URLs to be built correctly. Vercel sets
   * VERCEL=1; AUTH_TRUST_HOST is the manual override for any other host.
   */
  trustHost: env("AUTH_TRUST_HOST") === "true" || Boolean(env("VERCEL")),

  /**
   * Stateless sessions. No adapter, no database, nothing to leak server-side.
   *
   * Cookie flags are deliberately NOT overridden here: @auth/core already
   * issues the session token as httpOnly, sameSite=lax, path=/, and marks it
   * secure with the __Secure- name prefix whenever the request is https —
   * which it derives per-request rather than from NODE_ENV, so it stays
   * correct on both http://localhost and https://puptv.vercel.app. Hardcoding
   * these would replace that logic wholesale and can only make it wrong.
   * CSRF uses Auth.js's built-in double-submit token (__Host-authjs.csrf-token).
   */
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
    updateAge: 24 * 60 * 60,
  },
  jwt: { maxAge: SESSION_MAX_AGE_SECONDS },

  // Keep people inside ToonTails' own design instead of Auth.js's default pages.
  pages: { signIn: "/account", error: "/account" },

  callbacks: {
    redirect({ url, baseUrl }) {
      return safeRedirect(url, baseUrl);
    },
    /**
     * The JWT is a cookie in the user's browser, so it carries the minimum:
     * name, email, picture and the provider subject that Auth.js puts there
     * by default. Access and refresh tokens are deliberately dropped on the
     * floor — nothing calls a Google API yet, and a token we never store is
     * a token that can never leak.
     */
    jwt({ token }) {
      return token;
    },
  },

  debug: false,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
