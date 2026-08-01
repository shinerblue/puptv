"use client";

import { useState } from "react";
import { CheckSquare, Square, ExternalLink, Loader2, Sparkles } from "lucide-react";
import SimpleNav from "@/components/SimpleNav";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";

const EPISODES = [
  { id: "park", label: "Park adventure", videoId: "PIcIfIdC1kA", note: "Fetch, butterflies, good light." },
  { id: "beach", label: "Beach adventure", videoId: "LjfZLmGnw6g", note: "Waves, warm sand, zero worries." },
  { id: "space", label: "Space adventure", videoId: "799im9gjl_I", note: "Stars, planets, a very small helmet." },
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
    <div className="min-h-screen warm-page">
      <SimpleNav />

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <span className="chip mb-6">
          <Sparkles className="w-4 h-4" />
          Build your own channel
        </span>
        <h1
          className="font-bold mb-5"
          style={{ fontSize: "clamp(30px, 6vw, 48px)", letterSpacing: "-0.03em", lineHeight: 1.08, color: "#1D1D1F" }}
        >
          Pick the episodes
          <br />
          <span style={{ color: "#C2410C" }}>they love most</span>
        </h1>
        <p className="text-xl mx-auto leading-relaxed" style={{ color: "#6B625B", maxWidth: "540px" }}>
          Stitch your dog&apos;s best adventures into one continuous loop. It plays like real
          television — nobody has to press play every minute.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {EPISODES.map((ep, i) => {
            const isSelected = selected.includes(ep.id);
            return (
              <Reveal key={ep.id} delay={i * 0.08} className="h-full">
                <div
                  className={`pick-card pick-card-img h-full ${isSelected ? "selected" : ""}`}
                  style={{ cursor: "default" }}
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isSelected}
                    onClick={() => toggle(ep.id)}
                    className="w-full text-left"
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "inherit" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.ytimg.com/vi/${ep.videoId}/hqdefault.jpg`}
                      alt={ep.label}
                      className="pick-art"
                    />
                    <div className="pick-body">
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5" style={{ color: "#FFFFFF", flexShrink: 0 }} />
                        ) : (
                          <Square className="w-5 h-5" style={{ color: "#6B625B", flexShrink: 0 }} />
                        )}
                        <span className="font-semibold" style={{ fontSize: "16px" }}>
                          {ep.label}
                        </span>
                      </div>
                      <p
                        className="text-xs mt-1 leading-snug"
                        style={{ color: isSelected ? "#D6CCC0" : "#6B625B" }}
                      >
                        {ep.note}
                      </p>
                    </div>
                  </button>
                  <div className="px-4 pb-4">
                    <a
                      href={`https://www.youtube.com/watch?v=${ep.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold"
                      style={{ color: isSelected ? "#D6CCC0" : "#C2410C" }}
                    >
                      Watch the sample <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-16 text-center">
        {status === "done" ? (
          <div className="card-warm p-6 pop-in" style={{ background: "#ECFDF5", borderColor: "#A7F3D0" }}>
            <p className="font-semibold" style={{ color: "#047857", fontSize: "18px" }}>
              🐾 Your two-hour loop is rendering — it&apos;ll appear on your dog&apos;s own
              YouTube channel tonight, ready for Apple TV, Roku, Fire TV, Google TV, or any
              smart TV.
            </p>
          </div>
        ) : (
          <button
            onClick={handleCreateLoop}
            disabled={selected.length === 0 || status === "loading"}
            className="btn-pill btn-ink"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Starting your loop…
              </>
            ) : (
              "Make my continuous loop"
            )}
          </button>
        )}
        <p className="text-sm mt-4" style={{ color: "#6B625B" }}>
          {selected.length} of {EPISODES.length} episodes picked
        </p>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="card-warm card-lift p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="tile flex-shrink-0" style={{ width: 140 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${MEGA_LOOP_ID}/hqdefault.jpg`}
                alt="Thumbnail of the five-minute mega-loop sample"
                className="w-full"
                style={{ display: "block", aspectRatio: "16/9", objectFit: "cover" }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" style={{ color: "#C2410C" }} />
                <span className="font-semibold" style={{ fontSize: "17px", color: "#1D1D1F" }}>
                  Want proof? Here&apos;s a real one
                </span>
              </div>
              <p className="text-sm mb-3" style={{ color: "#6B625B", lineHeight: 1.55 }}>
                A five-minute mega-loop, rendered end to end with exactly the technique your loop
                will use.
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${MEGA_LOOP_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold"
                style={{ color: "#C2410C" }}
              >
                Watch on YouTube <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
