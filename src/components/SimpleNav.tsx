"use client";

import Link from "next/link";
import AccountMenu from "@/components/AccountMenu";

interface SimpleNavProps {
  hideCta?: boolean;
  /** /memorial only — drops the colour and the wag, keeps the layout. */
  muted?: boolean;
}

export default function SimpleNav({ hideCta = false, muted = false }: SimpleNavProps) {
  return (
    <nav
      className="sticky top-0 z-50 nav-warm"
      style={muted ? { background: "rgba(250,247,243,0.92)", borderColor: "#E8E1D8" } : undefined}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className={`flex items-center gap-2 font-bold text-xl tracking-tight ${muted ? "" : "wag-host"}`}
          style={{ color: muted ? "#6B625B" : "#1D1D1F" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- small static brand asset */}
          <img
            src="/brand/toontails-icon.png"
            alt=""
            width={32}
            height={32}
            className={muted ? "" : "wag"}
            style={{ borderRadius: 10, opacity: muted ? 0.75 : 1 }}
          />
          ToonTails
        </Link>
        <div className="flex items-center gap-3">
          {!hideCta && (
            <Link href="/create" className="btn-pill-sm btn-ink">
              Create your dog&apos;s show
            </Link>
          )}
          <AccountMenu />
        </div>
      </div>
    </nav>
  );
}
