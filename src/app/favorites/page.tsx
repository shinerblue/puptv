"use client";

import { useState } from "react";
import { CheckSquare, Square, ExternalLink, Loader2, Sparkles } from "lucide-react";
import SimpleNav from "@/components/SimpleNav";
import SiteFooter from "@/components/SiteFooter";

const EPISODES = [
  { id: "park", label: "Park adventure", videoId: "PIcIfIdC1kA" },
  { id: "beach", label: "Beach adventure", videoId: "LjfZLmGnw6g" },
  { id: "space", label: "Space adventure", videoId: "799im9gjl_I" },
];

const MEGA_LOOP_ID = "XO3ExfNCFaY";

export default function FavoritesPage() {
  const [selected, setSelected] = useState<string[]>(["park", "beach"]);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleCreateLoop = () => {
    if (selected.length === 0) return;
    setStatus("loading");
    setTimeout(() => setStatus("done"), 1200);
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      <SimpleNav />

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <h1
          className="font-bold mb-5"
          style={{ fontSize: "clamp(30px, 6vw, 48px)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1D1D1F" }}
        >
          Pick your favorite episodes
        </h1>
        <p className="text-xl mx-auto leading-relaxed" style={{ color: "#6E6E73", maxWidth: "560px" }}>
          Build a continuous loop of your dog&apos;s best adventures — it plays like real TV, no
          clicking play every ten minutes.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {EPISODES.map((ep) => {
            const isSelected = selected.includes(ep.id);
            return (
              <div
                key={ep.id}
                className={`pick-card rounded-2xl overflow-hidden ${isSelected ? "selected" : ""}`}
                style={{ cursor: "default" }}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => toggle(ep.id)}
                  className="w-full text-left"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                >
                  <div className="relative aspect-video" style={{ background: "#000000" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.ytimg.com/vi/${ep.videoId}/hqdefault.jpg`}
                      alt={ep.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex items-center gap-2">
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5" style={{ color: "#FFFFFF", flexShrink: 0 }} />
                    ) : (
                      <Square className="w-5 h-5" style={{ color: "#6E6E73", flexShrink: 0 }} />
                    )}
                    <span className="font-semibold" style={{ fontSize: "15px" }}>{ep.label}</span>
                  </div>
                </button>
                <div className="px-4 pb-4">
                  <a
                    href={`https://www.youtube.com/watch?v=${ep.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs"
                    style={{ color: isSelected ? "#D4D4D4" : "#6E6E73" }}
                  >
                    Watch sample <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-16 text-center">
        {status === "done" ? (
          <div className="rounded-2xl p-6 border" style={{ background: "#ECFDF5", borderColor: "#A7F3D0" }}>
            <p className="font-semibold" style={{ color: "#047857", fontSize: "17px" }}>
              🐾 Your 2-hour loop is rendering — it will appear on your channel tonight.
            </p>
          </div>
        ) : (
          <button
            onClick={handleCreateLoop}
            disabled={selected.length === 0 || status === "loading"}
            className="btn-large rounded-2xl px-10 inline-flex items-center justify-center gap-2"
            style={{
              background: selected.length === 0 ? "#E5E5E5" : "#1D1D1F",
              color: selected.length === 0 ? "#9CA3AF" : "#FFFFFF",
              cursor: selected.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Starting your loop…
              </>
            ) : (
              "Create my continuous loop"
            )}
          </button>
        )}
        <p className="text-sm mt-4" style={{ color: "#6E6E73" }}>
          {selected.length} of {EPISODES.length} episodes selected
        </p>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-24">
        <div className="rounded-2xl p-6 border flex items-center gap-5" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
          <div className="rounded-xl overflow-hidden flex-shrink-0" style={{ width: 120 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${MEGA_LOOP_ID}/hqdefault.jpg`}
              alt="5-minute mega-loop sample"
              className="w-full"
              style={{ display: "block", aspectRatio: "16/9", objectFit: "cover" }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4" style={{ color: "#F97316" }} />
              <span className="font-semibold" style={{ fontSize: "16px", color: "#1D1D1F" }}>
                Already have a favorite? Here&apos;s a real one
              </span>
            </div>
            <p className="text-sm mb-3" style={{ color: "#6E6E73" }}>
              A 5-minute mega-loop sample, rendered end to end — the same technique your loop uses.
            </p>
            <a
              href={`https://www.youtube.com/watch?v=${MEGA_LOOP_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold"
              style={{ color: "#1D1D1F" }}
            >
              Watch on YouTube <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
