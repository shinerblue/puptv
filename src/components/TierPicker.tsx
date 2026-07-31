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
            className={`pick-card rounded-2xl p-4 ${isSelected ? "selected" : ""} ${!tier.selectable ? "disabled" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div className="font-bold" style={{ fontSize: "20px" }}>{tier.price}</div>
              {!tier.selectable && (
                <span
                  className="text-xs font-semibold uppercase px-2 py-1 rounded-full"
                  style={{ background: "#F5F5F5", color: "#6E6E73", letterSpacing: "0.05em" }}
                >
                  Soon
                </span>
              )}
            </div>
            <div className="font-semibold mt-1" style={{ fontSize: "16px" }}>{tier.name}</div>
            <div className="text-xs mt-2" style={{ color: isSelected ? "#D4D4D4" : "#6E6E73", lineHeight: 1.5 }}>
              {tier.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}
