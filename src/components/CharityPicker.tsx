"use client";

import { CHARITIES } from "@/lib/impact";

interface CharityPickerProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function CharityPicker({ selected, onSelect }: CharityPickerProps) {
  return (
    <div className="space-y-3" role="radiogroup" aria-label="Where should your donation go?">
      {CHARITIES.map((c) => {
        const isSelected = selected === c.id;
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(c.id)}
            className={`pick-card rounded-2xl p-4 w-full flex items-start gap-3 ${isSelected ? "selected" : ""}`}
          >
            <div
              className="step-dot"
              style={{
                width: 20,
                height: 20,
                border: `2px solid ${isSelected ? "#FFFFFF" : "#D4D4D4"}`,
                background: isSelected ? "#FFFFFF" : "transparent",
                marginTop: "2px",
              }}
            >
              {isSelected && (
                <span style={{ width: 8, height: 8, borderRadius: 9999, background: "#1D1D1F", display: "block" }} />
              )}
            </div>
            <div>
              <div className="font-semibold" style={{ fontSize: "15px" }}>
                {c.name}
              </div>
              {c.location && (
                <div style={{ fontSize: "12px", marginTop: "2px", color: isSelected ? "#D4D4D4" : "#6E6E73" }}>
                  {c.location}
                </div>
              )}
              <div className="text-sm mt-1" style={{ color: isSelected ? "#D4D4D4" : "#6E6E73", lineHeight: 1.5 }}>
                {c.blurb}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
