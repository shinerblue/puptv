"use client";

import { Moon } from "lucide-react";

interface CalmModeToggleProps {
  enabled: boolean;
  onToggle: (v: boolean) => void;
}

export default function CalmModeToggle({ enabled, onToggle }: CalmModeToggleProps) {
  return (
    <div className={`${enabled ? "card-sky" : "card-warm"} p-5 flex items-start gap-4`}>
      <div className={`icon-well icon-well-sm ${enabled ? "icon-well-sky" : ""}`}>
        <Moon className="w-5 h-5" style={{ color: enabled ? "#1D5A80" : "#C2410C" }} />
      </div>
      <div className="flex-1">
        <div className="font-semibold" style={{ fontSize: "17px", color: "#1D1D1F" }}>
          Calm mode
        </div>
        <p className="text-sm mt-1" style={{ color: enabled ? "#1D5A80" : "#6B625B", lineHeight: 1.5 }}>
          Dog-vision colors and gentle pacing, made for anxious pups.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Calm mode"
        onClick={() => onToggle(!enabled)}
        style={{
          width: 56,
          height: 32,
          borderRadius: 9999,
          background: enabled ? "#1D5A80" : "#E4D2BE",
          position: "relative",
          flexShrink: 0,
          border: "none",
          cursor: "pointer",
          transition: "background 0.2s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: enabled ? 27 : 3,
            width: 26,
            height: 26,
            borderRadius: 9999,
            background: "#FFFDF9",
            transition: "left 0.2s cubic-bezier(0.2,0.7,0.3,1)",
            boxShadow: "0 1px 3px rgba(122,84,45,0.35)",
            display: "block",
          }}
        />
      </button>
    </div>
  );
}
