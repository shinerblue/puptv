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
];

interface OccasionPickerProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function OccasionPicker({ selected, onSelect }: OccasionPickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Special occasion">
      {OCCASIONS.map((occ) => {
        const isSelected = selected === occ.id;
        return (
          <button
            key={occ.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(isSelected ? "" : occ.id)}
            className={`pick-card rounded-2xl p-4 ${isSelected ? "selected" : ""}`}
          >
            <div className="text-3xl mb-2">{occ.emoji}</div>
            <div className="font-semibold" style={{ fontSize: "16px" }}>
              {occ.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
