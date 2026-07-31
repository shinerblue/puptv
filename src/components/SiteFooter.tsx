"use client";

import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/create", label: "Create an episode" },
      { href: "/pricing", label: "Pricing" },
      { href: "/favorites", label: "Favorites & loops" },
    ],
  },
  {
    heading: "Family",
    links: [
      { href: "/gift", label: "Send a gift" },
      { href: "/memorial", label: "Memorial episodes" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/impact", label: "Impact ledger" },
      { href: "/pros", label: "For businesses" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="warm-band py-16" style={{ borderBottom: "none" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="paw-rule mb-12" aria-hidden="true">
          <span>🐾</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-10 mb-12">
          <div>
            <span className="flex items-center gap-2 font-bold text-lg wag-host" style={{ color: "#1D1D1F" }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- small static brand asset */}
              <img
                src="/brand/toontails-icon.png"
                alt=""
                width={26}
                height={26}
                className="wag"
                style={{ borderRadius: 8 }}
              />
              ToonTails
            </span>
            <p className="text-sm mt-3 leading-relaxed" style={{ color: "#6B625B", maxWidth: "230px" }}>
              Your dog&apos;s own cartoon adventure — on your TV. Dogs first, cats coming soon.
            </p>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <div
                className="text-xs font-semibold uppercase mb-4"
                style={{ color: "#C2410C", letterSpacing: "0.08em" }}
              >
                {col.heading}
              </div>
              <div className="space-y-3">
                {col.links.map((l) => (
                  <Link key={l.href} href={l.href} className="block text-sm" style={{ color: "#6B625B" }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          className="pt-8 border-t text-center text-sm"
          style={{ borderColor: "#F0E2D2", color: "#6B625B" }}
        >
          ToonTails · Dogs first, cats coming soon · Proceeds fund dog rescues
        </div>
      </div>
    </footer>
  );
}
