"use client";

export interface Theme {
  id: string;
  label: string;
  emoji: string;
  desc: string;
}

export const ADVENTURE_THEMES: Theme[] = [
  { id: "park", label: "Park", emoji: "🌳", desc: "Sunny park, butterflies, fetch" },
  { id: "beach", label: "Beach", emoji: "🏖️", desc: "Waves, sand, palm trees" },
  { id: "space", label: "Space", emoji: "🚀", desc: "Stars, planets, tiny helmet" },
  { id: "mountain", label: "Mountain", emoji: "🏔️", desc: "Trails, views, fresh air" },
  { id: "city", label: "City", emoji: "🏙️", desc: "Sidewalks, lights, adventure" },
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
      className="grid grid-cols-2 sm:grid-cols-3 gap-3"
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
            className={`pick-card rounded-2xl p-4 ${isSelected ? "selected" : ""}`}
          >
            <div className="text-3xl mb-2">{theme.emoji}</div>
            <div className="font-semibold" style={{ fontSize: "16px" }}>{theme.label}</div>
            <div className="text-xs mt-1" style={{ color: isSelected ? "#D4D4D4" : "#6E6E73" }}>
              {theme.desc}
            </div>
          </button>
        );
      })}
    </div>
  );
}
