"use client";

export type PrivacyOption = "private" | "unlisted" | "public";

const OPTIONS: { id: PrivacyOption; label: string; desc: string }[] = [
  {
    id: "private",
    label: "Just for us",
    desc: "Only people you personally invite can watch. Perfect if this is just Dog TV for your own house.",
  },
  {
    id: "unlisted",
    label: "Anyone with the link",
    desc: "Family and friends can watch if you send them the link. It won't show up in YouTube search.",
  },
  {
    id: "public",
    label: "Anyone on YouTube",
    desc: "Fully public — anyone can find and watch it. Great if you want to show your dog off.",
  },
];

interface PrivacyPickerProps {
  selected: PrivacyOption;
  onSelect: (id: PrivacyOption) => void;
}

export default function PrivacyPicker({ selected, onSelect }: PrivacyPickerProps) {
  return (
    <div className="space-y-4" role="radiogroup" aria-label="Who can watch">
      {OPTIONS.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(opt.id)}
            className={`pick-card rounded-2xl p-5 w-full flex items-start gap-4 ${isSelected ? "selected" : ""}`}
          >
            <div
              className="step-dot"
              style={{
                border: `2px solid ${isSelected ? "#FFFFFF" : "#D6CCC0"}`,
                background: isSelected ? "#FFFFFF" : "transparent",
                marginTop: "2px",
              }}
            >
              {isSelected && <span style={{ width: 10, height: 10, borderRadius: 9999, background: "#1D1D1F", display: "block" }} />}
            </div>
            <div>
              <div className="font-semibold" style={{ fontSize: "17px" }}>{opt.label}</div>
              <div
                className="text-sm mt-1"
                style={{ color: isSelected ? "#D6CCC0" : "#6B625B", lineHeight: 1.5 }}
              >
                {opt.desc}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
