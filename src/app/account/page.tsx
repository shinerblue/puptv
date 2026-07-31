"use client";

import { User } from "lucide-react";
import SimpleNav from "@/components/SimpleNav";
import SiteFooter from "@/components/SiteFooter";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuthState, firstNameOf } from "@/components/AuthProvider";
import { signOutEverywhere } from "@/lib/auth-actions";

/**
 * /account is three pages in one, switched purely on client-side auth
 * state (populated server-side in the root layout, so there's no flash):
 *  1. Auth unconfigured (production today) -> coming-soon explainer.
 *  2. Configured, signed out -> Google sign-in prompt.
 *  3. Configured, signed in -> session details + sign out.
 */
export default function AccountPage() {
  const { configured, user } = useAuthState();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FAFAFA" }}>
      <SimpleNav hideCta />
      <main className="flex-1 max-w-xl mx-auto px-6 pt-20 pb-24 w-full">
        <h1
          className="font-bold mb-8"
          style={{ fontSize: "clamp(28px,5vw,38px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
        >
          Your account
        </h1>

        {!configured && (
          <div className="rounded-2xl p-6 border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
            <p className="font-semibold mb-2" style={{ color: "#1D1D1F", fontSize: "17px" }}>
              Sign-in is coming soon
            </p>
            <p className="text-sm" style={{ color: "#6E6E73", lineHeight: 1.6 }}>
              We&apos;re finishing Google sign-in so your dog&apos;s episodes can publish straight to
              your own YouTube channel automatically. There&apos;s nothing to do here yet — you can
              still create episodes in demo mode right now.
            </p>
          </div>
        )}

        {configured && !user && (
          <div className="rounded-2xl p-6 border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
            <p className="mb-5" style={{ color: "#6E6E73", lineHeight: 1.6, fontSize: "17px" }}>
              Sign in with Google so your dog&apos;s episodes can publish straight to your own
              YouTube channel.
            </p>
            <GoogleSignInButton callbackUrl="/account" label="Sign in with Google" />
          </div>
        )}

        {configured && user && (
          <div className="rounded-2xl p-6 border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
            <div className="flex items-center gap-4 mb-6">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- external Google avatar
                <img
                  src={user.image}
                  alt=""
                  referrerPolicy="no-referrer"
                  style={{ width: 56, height: 56, borderRadius: "9999px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{ width: 56, height: 56, background: "#F5F5F5" }}
                >
                  <User className="w-6 h-6" style={{ color: "#6E6E73" }} />
                </div>
              )}
              <div>
                <p className="font-semibold" style={{ color: "#1D1D1F", fontSize: "18px" }}>
                  {firstNameOf(user)}
                </p>
                <p className="text-sm" style={{ color: "#6E6E73" }}>
                  {user.email}
                </p>
              </div>
            </div>

            <div className="rounded-xl p-4 mb-6" style={{ background: "#FFF7ED" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "#1D1D1F" }}>
                What we store
              </p>
              <p className="text-sm" style={{ color: "#6E6E73", lineHeight: 1.6 }}>
                Just this session cookie in your browser — your name, email and photo, exactly as
                Google gave them to us. ToonTails has no database. Nothing about you is saved on our
                servers, and signing out anywhere clears it everywhere.
              </p>
            </div>

            <form action={signOutEverywhere}>
              <button
                type="submit"
                className="btn-large w-full rounded-2xl border-2"
                style={{ borderColor: "#E5E5E5", color: "#1D1D1F", background: "#FFFFFF" }}
              >
                Sign out
              </button>
            </form>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
