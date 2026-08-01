"use client";

import { Heart } from "lucide-react";

interface PreviewGateProps {
  stills: string[];
  petName: string;
  onApprove: () => void;
  onRetry: () => void;
  retryUsed: boolean;
}

export default function PreviewGate({ stills, petName, onApprove, onRetry, retryUsed }: PreviewGateProps) {
  // Lowercase fallback so "Does this look like your pup?" / "That's your
  // pup — keep going" read naturally when no name was given — the parent
  // passes the raw (possibly empty) petName here on purpose, see create/page.tsx.
  const name = petName.trim() || "your pup";
  return (
    <div>
      {/* Deliberately not tilted like the marketing tiles: this is the moment
          the customer checks whether the drawing is actually their dog, so
          the art gets shown straight. */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {stills.map((src, i) => (
          <div key={i} className="tile tile-hover aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${name}'s cartoon scene ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <div className="card-tint p-6 mb-8 flex items-start gap-4">
        <div className="icon-well icon-well-sm">
          <Heart className="w-5 h-5" style={{ color: "#C2410C" }} />
        </div>
        <div>
          <p className="font-semibold mb-1" style={{ fontSize: "18px", color: "#1D1D1F" }}>
            Does this look like {name}?
          </p>
          <p className="text-sm" style={{ color: "#6B625B", lineHeight: 1.6 }}>
            These are the three scenes we&apos;ll turn into video. If the coat, the ears, or a
            marking are off, go back and add a detail — something like &ldquo;very short stubby
            tail&rdquo; or &ldquo;white patch over the left eye&rdquo; — and we&apos;ll redraw it
            for free, once. Nothing has been charged yet.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onRetry}
          disabled={retryUsed}
          className={`btn-pill btn-soft flex-1 ${retryUsed ? "" : "btn-ghost"}`}
        >
          {retryUsed ? "Free redraw already used" : "← Not quite — let me fix a detail"}
        </button>
        <button type="button" onClick={onApprove} className="btn-pill btn-soft btn-ink flex-[1.4]">
          That&apos;s {name} — keep going →
        </button>
      </div>
    </div>
  );
}
