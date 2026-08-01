"use client";

import { useState } from "react";
import Link from "next/link";
import SimpleNav from "@/components/SimpleNav";

/**
 * Deliberately untouched by the warm redesign beyond the whites.
 *
 * Every other page got paw-print texture, tilted photo tiles, coral
 * chips and hover lift. None of that belongs here. This page keeps the
 * quiet, near-monochrome treatment it has always had — the only change
 * is that the cold #FAFAFA / #E5E5E5 greys became warm off-white and
 * warm grey, so it reads as calm rather than clinical, and it no longer
 * looks like it belongs to a different product than the rest of the
 * site. No pattern, no motion, no orange, no emoji.
 *
 * Framing note (owner feedback): never say "lost a dog" — it reads like
 * a missing-pet flyer, and it's blunt. This page is a celebration of a
 * life well-loved, not a loss. Pricing is honor-system in demo mode: free
 * for anyone who has ever made a ToonTails episode, $4.99 standalone.
 */
export default function MemorialPage() {
  const [hasMadeBefore, setHasMadeBefore] = useState<boolean | null>(null);
  const isFree = hasMadeBefore === true;

  return (
    <div className="min-h-screen quiet-page">
      <SimpleNav hideCta muted />

      <section className="max-w-xl mx-auto px-6 pt-24 pb-24 text-center">
        <h1
          className="font-bold mb-8"
          style={{ fontSize: "clamp(28px, 5vw, 40px)", letterSpacing: "-0.02em", lineHeight: 1.25, color: "#4A443D" }}
        >
          A celebration of life
        </h1>

        <p className="mb-6 leading-relaxed" style={{ fontSize: "18px", color: "#5A544C" }}>
          Some of the best stories are about a life well loved. A celebration-of-life episode is a
          gentle way to keep telling your dog&apos;s.
        </p>
        <p className="mb-6 leading-relaxed" style={{ fontSize: "16px", color: "#6B655C" }}>
          We make one episode from the photos you have — the same quiet care as any other episode,
          made to honor a life rather than an ordinary day.
        </p>
        <p className="mb-12 leading-relaxed" style={{ fontSize: "16px", color: "#6B655C" }}>
          There&apos;s no rush, and there&apos;s nothing else to buy here — just one episode, made
          from the photos you already have.
        </p>

        <div
          className="text-left p-6 mb-10"
          style={{ background: "#F3EEE6", border: "1px solid #E8E1D8", borderRadius: "18px" }}
        >
          <p className="font-semibold mb-2" style={{ fontSize: "16px", color: "#4A443D" }}>
            Is it free?
          </p>
          <p className="leading-relaxed mb-5" style={{ fontSize: "15px", color: "#6B655C" }}>
            If your dog has ever starred in a ToonTails episode — or you&apos;ve made one for any
            pet — a celebration-of-life episode is free. It&apos;s the least we can do. Otherwise,
            it&apos;s $4.99, the same as any single episode.
          </p>

          <div
            role="radiogroup"
            aria-label="Have you made a ToonTails episode before?"
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              type="button"
              role="radio"
              aria-checked={hasMadeBefore === true}
              onClick={() => setHasMadeBefore(true)}
              className="flex-1"
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                border: hasMadeBefore === true ? "1px solid #4A443D" : "1px solid #D9D2C6",
                background: hasMadeBefore === true ? "#4A443D" : "#FFFFFF",
                color: hasMadeBefore === true ? "#FAF7F3" : "#4A443D",
              }}
            >
              Yes — I&apos;ve made one before
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={hasMadeBefore === false}
              onClick={() => setHasMadeBefore(false)}
              className="flex-1"
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                border: hasMadeBefore === false ? "1px solid #4A443D" : "1px solid #D9D2C6",
                background: hasMadeBefore === false ? "#4A443D" : "#FFFFFF",
                color: hasMadeBefore === false ? "#FAF7F3" : "#4A443D",
              }}
            >
              No — this is my first
            </button>
          </div>

          <p className="text-xs mt-4 leading-relaxed" style={{ color: "#8A8378" }}>
            This is a demo, so it&apos;s honor system — made an episode with us before? It&apos;s
            free, just tell us. No account or order lookup required.
          </p>
        </div>

        <Link
          href="/create"
          className="inline-block px-8 py-4 font-semibold"
          style={{
            background: "#4A443D",
            color: "#FAF7F3",
            fontSize: "16px",
            borderRadius: "18px",
            minHeight: "56px",
          }}
        >
          {isFree
            ? "Create a celebration-of-life episode — Free"
            : "Create a celebration-of-life episode — $4.99"}
        </Link>

        <p className="mt-16 text-sm" style={{ color: "#6B655C" }}>
          Take your time. We&apos;re here whenever you&apos;re ready.
        </p>
      </section>

      <footer
        className="border-t py-8 text-center text-sm"
        style={{ borderColor: "#E8E1D8", color: "#6B655C" }}
      >
        <Link href="/" style={{ color: "#6B655C" }}>
          ToonTails
        </Link>
      </footer>
    </div>
  );
}
