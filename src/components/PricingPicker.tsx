"use client";

import { PRICING_TIERS } from "@/lib/pricing";

interface PricingPickerProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function PricingPicker({ selected, onSelect }: PricingPickerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" role="radiogroup" aria-label="Choose your plan">
      {PRICING_TIERS.map((tier) => {
        const isSelected = selected === tier.id;
        return (
          <button
            key={tier.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(tier.id)}
            className={`pick-card rounded-2xl p-5 ${isSelected ? "selected" : ""}`}
          >
            <div className="font-bold" style={{ fontSize: "24px" }}>
              {tier.price}
            </div>
            <div className="font-semibold mt-1" style={{ fontSize: "15px" }}>
              {tier.name}
            </div>
            <div className="text-xs mt-2" style={{ color: isSelected ? "#D6CCC0" : "#6B625B", lineHeight: 1.5 }}>
              {tier.tagline}
            </div>
          </button>
        );
      })}
    </div>
  );
}
