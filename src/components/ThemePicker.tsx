"use client";

export interface Theme {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  /** Decorative sky plate — see the THEME PICKER ART PLATES note in globals.css. */
  plate: string;
}

export const ADVENTURE_THEMES: Theme[] = [
  { id: "park", label: "Park", emoji: "🌳", desc: "Sunny grass, butterflies, fetch", plate: "plate-park" },
  { id: "beach", label: "Beach", emoji: "🏖️", desc: "Waves, warm sand, palm trees", plate: "plate-beach" },
  { id: "space", label: "Space", emoji: "🚀", desc: "Stars, planets, a tiny helmet", plate: "plate-space" },
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
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : "Adventure theme"}
    >
      {ADVENTURE_THEMES.map((theme) => {
        const isSelected = selected === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(theme.id)}
            className={`pick-card pick-card-img ${isSelected ? "selected" : ""}`}
          >
            <div className={`pick-art-plate ${theme.plate}`} aria-hidden="true">
              <span>{theme.emoji}</span>
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
      })}
    </div>
  );
}
