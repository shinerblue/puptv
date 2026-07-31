"use client";

import Link from "next/link";

interface SimpleNavProps {
  hideCta?: boolean;
  muted?: boolean;
}

export default function SimpleNav({ hideCta = false, muted = false }: SimpleNavProps) {
  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: "#E5E5E5",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight" style={{ color: muted ? "#6E6E73" : "#1D1D1F" }}>
          PupTV
        </Link>
        {!hideCta && (
          <Link
            href="/create"
            className="text-sm font-semibold px-5 py-2.5 rounded-full"
            style={{ background: "#1D1D1F", color: "#FFFFFF" }}
          >
            Create your dog&apos;s show
          </Link>
        )}
      </div>
    </nav>
  );
}
