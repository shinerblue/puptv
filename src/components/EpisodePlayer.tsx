"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";

interface EpisodePlayerProps {
  clips: string[];
  petName: string;
}

/**
 * Seamless looping player: every clip is mounted and preloaded, stacked
 * in one 16:9 frame. When the active clip ends we switch instantly to
 * the next one (wrapping around), so the episode plays as a continuous
 * loop with no server-side stitching. Muted + playsInline so autoplay
 * is allowed everywhere.
 */
export default function EpisodePlayer({ clips, petName }: EpisodePlayerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const first = videoRefs.current[0];
    if (first) {
      first.play().catch(() => {
        // Autoplay blocked — the user can tap the video to start it.
      });
    }
  }, []);

  const handleEnded = (index: number) => {
    const next = (index + 1) % clips.length;
    setActiveIndex(next);
    const video = videoRefs.current[next];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {
        // ignore — user gesture will resume
      });
    }
  };

  const slug = petName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "puptv";

  return (
    <div>
      <div
        className="relative aspect-video w-full rounded-2xl overflow-hidden video-glow"
        style={{ background: "#000000" }}
      >
        {clips.map((src, i) => (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={src}
            muted
            playsInline
            preload="auto"
            onEnded={() => handleEnded(i)}
            onClick={() => {
              const video = videoRefs.current[activeIndex];
              if (video && video.paused) {
                video.play().catch(() => {});
              }
            }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: i === activeIndex ? 1 : 0 }}
            aria-label={`${petName} episode scene ${i + 1}`}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        {clips.map((src, i) => (
          <a
            key={src}
            href={src}
            download={`${slug}-scene-${i + 1}.mp4`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border-2 flex items-center justify-center gap-2 flex-1 py-3"
            style={{
              borderColor: "#E5E5E5",
              color: "#1D1D1F",
              background: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Download className="w-4 h-4" />
            Scene {i + 1}
          </a>
        ))}
      </div>
    </div>
  );
}
