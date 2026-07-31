"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useAuthState, firstNameOf } from "@/components/AuthProvider";
import { signOutEverywhere } from "@/lib/auth-actions";

/**
 * The account/sign-in control shared by every nav bar in the app.
 *
 * Renders nothing at all when auth is unconfigured (no AUTH_SECRET /
 * GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) — that is what keeps production
 * looking exactly as it does today until those env vars are set in Vercel.
 */
export default function AccountMenu() {
  const { configured, user } = useAuthState();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!configured) return null;

  if (!user) {
    return (
      <Link href="/account" className="btn-pill-sm btn-ghost">
        Sign in
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="inline-flex items-center gap-2 rounded-full px-3 py-2"
        style={{ background: "#FFF1E0" }}
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- external Google avatar, not an app asset
          <img
            src={user.image}
            alt=""
            referrerPolicy="no-referrer"
            style={{ width: 28, height: 28, borderRadius: "9999px", objectFit: "cover" }}
          />
        ) : (
          <User className="w-5 h-5" style={{ color: "#1D1D1F" }} />
        )}
        <span className="text-sm font-semibold" style={{ color: "#1D1D1F" }}>
          {firstNameOf(user)}
        </span>
        <ChevronDown className="w-4 h-4" style={{ color: "#6B625B" }} />
      </button>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0"
            style={{ background: "transparent", zIndex: 40, cursor: "default" }}
            onClick={() => setMenuOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 mt-2 rounded-xl border overflow-hidden"
            style={{ background: "#FFFDF9", borderColor: "#F0E2D2", minWidth: "180px", zIndex: 50 }}
          >
            <Link
              href="/account"
              role="menuitem"
              className="block px-4 py-3 text-sm"
              style={{ color: "#1D1D1F" }}
              onClick={() => setMenuOpen(false)}
            >
              Account
            </Link>
            <form action={signOutEverywhere}>
              <button
                type="submit"
                role="menuitem"
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left border-t"
                style={{ color: "#B91C1C", borderColor: "#F0E2D2" }}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
