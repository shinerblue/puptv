"use client";

import { QUALITY_TIERS, type TierId } from "@/lib/tiers";

interface TierPickerProps {
  selected: TierId;
  onSelect: (id: TierId) => void;
  /** id of the visible heading that names this group */
  labelledBy?: string;
}

/**
 * Quality tier radio cards for the create-flow details step. Deluxe is
 * rendered but disabled ("Coming soon") — it can't be selected yet, so a
 * client can never send tier=premium and have the server honor it (the
 * server validates independently in lib/tiers.ts regardless).
 */
export default function TierPicker({ selected, onSelect, labelledBy }: TierPickerProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : "Quality tier"}
    >
      {QUALITY_TIERS.map((tier) => {
        const isSelected = selected === tier.id;
        return (
          <button
            key={tier.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-disabled={!tier.selectable}
            disabled={!tier.selectable}
            onClick={() => tier.selectable && onSelect(tier.id)}
            className={`pick-card p-5 ${isSelected ? "selected" : ""} ${!tier.selectable ? "disabled" : ""}`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="font-bold" style={{ fontSize: "22px" }}>{tier.price}</div>
              {!tier.selectable ? (
                <span className="chip chip-quiet chip-sm uppercase">Soon</span>
              ) : isSelected ? (
                <span className="chip chip-sm" style={{ background: "#FFFFFF", borderColor: "#FFFFFF" }}>
                  Picked
                </span>
              ) : null}
            </div>
            <div className="font-semibold mt-1" style={{ fontSize: "17px" }}>{tier.name}</div>
            <div className="text-xs mt-2" style={{ color: isSelected ? "#D6CCC0" : "#6B625B", lineHeight: 1.5 }}>
              {tier.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}
