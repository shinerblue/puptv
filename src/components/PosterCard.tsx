"use client";

import { useState } from "react";
import { Frame, Loader2 } from "lucide-react";

interface PosterCardProps {
  petName: string;
}

export default function PosterCard({ petName }: PosterCardProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const name = petName || "Your dog";

  const handleOrder = () => {
    setStatus("loading");
    setTimeout(() => setStatus("done"), 900);
  };

  return (
    <div className="rounded-2xl p-6 border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <div
          style={{
            background: "#FFFFFF",
            border: "10px solid #FFFFFF",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08), 0 12px 30px rgba(0,0,0,0.14)",
            borderRadius: "4px",
            width: 140,
            flexShrink: 0,
          }}
        >
          <div style={{ border: "1px solid #E5E5E5" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demo/still-2.jpg"
              alt={`Framed poster of ${name}`}
              className="w-full"
              style={{ display: "block", aspectRatio: "3/4", objectFit: "cover" }}
            />
            <div
              className="text-center py-2"
              style={{
                borderTop: "1px solid #E5E5E5",
                fontFamily: "Georgia, serif",
                fontSize: "13px",
                letterSpacing: "0.08em",
                color: "#1D1D1F",
              }}
            >
              {name.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Frame className="w-4 h-4" style={{ color: "#F97316" }} />
            <span className="font-semibold" style={{ fontSize: "17px", color: "#1D1D1F" }}>
              Order a poster of {name}
            </span>
          </div>
          <p className="text-sm mb-4" style={{ color: "#6E6E73", lineHeight: 1.5 }}>
            A print of {name}&apos;s cartoon scene, framed and ready to hang. $14.99, demo mode — nothing ships.
          </p>

          {status === "done" ? (
            <div className="text-sm font-medium" style={{ color: "#10B981" }}>
              Poster ordered (demo) — we&apos;d email you a proof before printing.
            </div>
          ) : (
            <button
              onClick={handleOrder}
              disabled={status === "loading"}
              className="rounded-2xl px-6 font-semibold inline-flex items-center gap-2"
              style={{ background: "#1D1D1F", color: "#FFFFFF", fontSize: "15px", minHeight: "48px" }}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Ordering…
                </>
              ) : (
                "Order poster — $14.99 (demo)"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
