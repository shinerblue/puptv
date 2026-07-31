"use client";

import { Moon } from "lucide-react";

interface CalmModeToggleProps {
  enabled: boolean;
  onToggle: (v: boolean) => void;
}

export default function CalmModeToggle({ enabled, onToggle }: CalmModeToggleProps) {
  return (
    <div
      className="rounded-2xl p-5 border flex items-start gap-4"
      style={{ background: enabled ? "#EFF6FF" : "#FFFFFF", borderColor: enabled ? "#BFDBFE" : "#E5E5E5" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: enabled ? "#DBEAFE" : "#F5F5F5" }}
      >
        <Moon className="w-5 h-5" style={{ color: enabled ? "#2563EB" : "#6E6E73" }} />
      </div>
      <div className="flex-1">
        <div className="font-semibold" style={{ fontSize: "16px", color: "#1D1D1F" }}>
          Calm mode
        </div>
        <p className="text-sm mt-1" style={{ color: "#6E6E73", lineHeight: 1.5 }}>
          Dog-vision colors and gentle pacing for anxious pups.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Calm mode"
        onClick={() => onToggle(!enabled)}
        style={{
          width: 52,
          height: 30,
          borderRadius: 9999,
          background: enabled ? "#1D1D1F" : "#E5E5E5",
          position: "relative",
          flexShrink: 0,
          border: "none",
          cursor: "pointer",
          transition: "background 0.15s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: enabled ? 25 : 3,
            width: 24,
            height: 24,
            borderRadius: 9999,
            background: "#FFFFFF",
            transition: "left 0.15s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            display: "block",
          }}
        />
      </button>
    </div>
  );
}
