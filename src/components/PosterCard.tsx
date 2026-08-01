"use client";

import { useState } from "react";
import { Frame, Loader2, Check } from "lucide-react";

interface PosterCardProps {
  petName: string;
}

export default function PosterCard({ petName }: PosterCardProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  // Lowercase fallback — used mid-sentence ("Put {name} on the wall", "A
  // framed print of {name}'s cartoon scene"), where a capitalized "Your dog"
  // placeholder reads like a typo.
  const name = petName.trim() || "your pup";

  const handleOrder = () => {
    setStatus("loading");
    setTimeout(() => setStatus("done"), 900);
  };

  return (
    <div className="card-warm p-6">
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <div
          className="tilt-a"
          style={{
            background: "#FFFDF9",
            border: "10px solid #FFFDF9",
            boxShadow: "0 2px 6px rgba(122,84,45,0.14), 0 16px 36px rgba(122,84,45,0.20)",
            borderRadius: "6px",
            width: 150,
            flexShrink: 0,
          }}
        >
          <div style={{ border: "1px solid #E4D2BE" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demo/poster-art.jpg"
              alt={`Framed poster of ${name}`}
              className="w-full"
              style={{ display: "block", aspectRatio: "3/4", objectFit: "cover" }}
            />
            <div
              className="text-center py-2"
              style={{
                borderTop: "1px solid #E4D2BE",
                fontFamily: "Georgia, serif",
                fontSize: "13px",
                letterSpacing: "0.10em",
                color: "#1D1D1F",
              }}
            >
              {name.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Frame className="w-4 h-4" style={{ color: "#C2410C" }} />
            <span className="font-semibold" style={{ fontSize: "18px", color: "#1D1D1F" }}>
              Put {name} on the wall
            </span>
          </div>
          <p className="text-sm mb-4" style={{ color: "#6B625B", lineHeight: 1.55 }}>
            A framed print of {name}&apos;s cartoon scene, ready to hang. $14.99 — demo mode, so
            nothing ships and nothing is charged.
          </p>

          {status === "done" ? (
            <div className="chip" style={{ background: "#ECFDF5", borderColor: "#A7F3D0", color: "#047857" }}>
              <Check className="w-4 h-4" />
              Ordered (demo) — we&apos;d email a proof before printing.
            </div>
          ) : (
            <button
              onClick={handleOrder}
              disabled={status === "loading"}
              className="btn-pill btn-soft btn-ink"
              style={{ minHeight: "50px", fontSize: "16px" }}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Ordering…
                </>
              ) : (
                "Order the poster — $14.99 (demo)"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
