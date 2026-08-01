"use client";

export interface Occasion {
  id: string;
  label: string;
  emoji: string;
}

export const OCCASIONS: Occasion[] = [
  { id: "birthday", label: "Birthday", emoji: "🎂" },
  { id: "christmas", label: "Christmas", emoji: "🎄" },
  { id: "halloween", label: "Halloween", emoji: "🎃" },
  { id: "thanksgiving", label: "Thanksgiving", emoji: "🦃" },
  { id: "easter", label: "Easter", emoji: "🐰" },
  { id: "valentines", label: "Valentine's", emoji: "💝" },
  { id: "july4th", label: "Fourth of July", emoji: "🎆" },
  { id: "newyear", label: "New Year", emoji: "🎉" },
];

interface OccasionPickerProps {
  selected: string;
  onSelect: (id: string) => void;
  /** id of the visible heading that names this group */
  labelledBy?: string;
}

export default function OccasionPicker({ selected, onSelect, labelledBy }: OccasionPickerProps) {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : "Special occasion"}
    >
      {OCCASIONS.map((occ) => {
        const isSelected = selected === occ.id;
        return (
          <button
            key={occ.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(isSelected ? "" : occ.id)}
            className={`pick-card p-5 ${isSelected ? "selected" : ""}`}
          >
            <div className="text-4xl mb-2" aria-hidden="true">{occ.emoji}</div>
            <div className="font-semibold" style={{ fontSize: "17px" }}>
              {occ.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
