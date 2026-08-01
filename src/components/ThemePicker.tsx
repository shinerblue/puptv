"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export interface Theme {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  /** Decorative sky plate — see the THEME PICKER ART PLATES note in globals.css. */
  plate: string;
  /** Three of the five themes have a real clip; the rest keep the plate. */
  video?: string;
}

export const ADVENTURE_THEMES: Theme[] = [
  { id: "park", label: "Park", emoji: "🌳", desc: "Sunny grass, butterflies, fetch", plate: "plate-park", video: "/videos/park.mp4" },
  { id: "beach", label: "Beach", emoji: "🏖️", desc: "Waves, warm sand, palm trees", plate: "plate-beach", video: "/videos/beach.mp4" },
  { id: "space", label: "Space", emoji: "🚀", desc: "Stars, planets, a tiny helmet", plate: "plate-space", video: "/videos/space.mp4" },
  { id: "mountain", label: "Mountain", emoji: "🏔️", desc: "Trails, big views, fresh air", plate: "plate-mountain" },
  { id: "city", label: "City", emoji: "🏙️", desc: "Sidewalks, lights, a big night out", plate: "plate-city" },
];

interface ThemePickerProps {
  selected: string;
  onSelect: (id: string) => void;
  /** id of the visible heading that names this group */
  labelledBy?: string;
}

export default function ThemePicker({ selected, onSelect, labelledBy }: ThemePickerProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : "Adventure theme"}
    >
      {ADVENTURE_THEMES.map((theme) => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          isSelected={selected === theme.id}
          onSelect={onSelect}
          reduced={Boolean(reduced)}
        />
      ))}
    </div>
  );
}

/**
 * The card is a radio button and nothing about that changes: the plate
 * (and the clip inside it) stays `aria-hidden` and `pointer-events:
 * none`, so the accessible name is still the label text and the whole
 * card is still one tab stop with the same keyboard behaviour.
 *
 * The clip is a preview, not the picture: the gradient plate is always
 * painted underneath, nothing is fetched until you actually point at
 * the card, and with reduced motion the video element is never created.
 */
function ThemeCard({
  theme,
  isSelected,
  onSelect,
  reduced,
}: {
  theme: Theme;
  isSelected: boolean;
  onSelect: (id: string) => void;
  reduced: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(theme.video) && !reduced;

  const start = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    void el
      .play()
      .then(() => setPlaying(true))
      .catch(() => {});
  };

  const stop = () => {
    const el = videoRef.current;
    setPlaying(false);
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  };

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={() => onSelect(theme.id)}
      onMouseEnter={hasVideo ? start : undefined}
      onMouseLeave={hasVideo ? stop : undefined}
      onFocus={hasVideo ? start : undefined}
      onBlur={hasVideo ? stop : undefined}
      className={`pick-card pick-card-img ${isSelected ? "selected" : ""}`}
    >
      <div className={`pick-art-plate ${theme.plate}`} aria-hidden="true">
        <span>{theme.emoji}</span>
        {hasVideo ? (
          <video
            ref={videoRef}
            src={theme.video}
            className={`pick-art-video ${playing ? "is-playing" : ""}`}
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
          />
        ) : null}
      </div>
      <div className="pick-body">
        <div className="font-semibold" style={{ fontSize: "17px" }}>
          {theme.label}
        </div>
        <div
          className="text-xs mt-1 leading-snug"
          style={{ color: isSelected ? "#D6CCC0" : "#6B625B" }}
        >
          {theme.desc}
        </div>
      </div>
    </button>
  );
}
