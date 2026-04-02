"use client";

import { Loader2, Check } from "lucide-react";

export type ProcessingStage =
  | "uploading"
  | "cartoonifying"
  | "generating_video"
  | "finalizing"
  | "complete"
  | "error";

interface ProcessingStatusProps {
  stage: ProcessingStage;
  progress?: number;
  error?: string;
  cartoonPreviewUrl?: string;
  onRetry?: () => void;
}

const stages = [
  { key: "uploading", label: "Preparing photos" },
  { key: "cartoonifying", label: "Creating cartoon character" },
  { key: "generating_video", label: "Generating adventure video" },
  { key: "finalizing", label: "Finishing up" },
];

export default function ProcessingStatus({
  stage,
  error,
  cartoonPreviewUrl,
  onRetry,
}: ProcessingStatusProps) {
  const currentIndex = stages.findIndex((s) => s.key === stage);

  return (
    <div className="max-w-sm mx-auto text-center">
      {stage === "error" ? (
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "#FEF2F2" }}
        >
          <span className="text-2xl">⚠️</span>
        </div>
      ) : (
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "#F5F5F5" }}
        >
          <span className="text-3xl paw-bounce">🐾</span>
        </div>
      )}

      <h2
        className="font-bold mb-2"
        style={{ fontSize: "24px", letterSpacing: "-0.02em", color: "#1D1D1F" }}
      >
        {stage === "error" ? "Something went wrong" : "Creating your adventure…"}
      </h2>
      <p className="text-sm mb-10" style={{ color: "#6E6E73" }}>
        {stage === "error"
          ? error || "An unexpected error occurred"
          : "This typically takes 2–3 minutes"}
      </p>

      {cartoonPreviewUrl && stage !== "error" && (
        <div className="mb-8 rounded-2xl overflow-hidden border" style={{ borderColor: "#E5E5E5" }}>
          <img src={cartoonPreviewUrl} alt="Cartoon preview" className="w-full h-48 object-cover" />
          <div
            className="px-4 py-2.5 text-center border-t text-sm font-medium"
            style={{ background: "#FAFAFA", borderColor: "#E5E5E5", color: "#6E6E73" }}
          >
            ✨ Your pup as a cartoon!
          </div>
        </div>
      )}

      {stage !== "error" && (
        <div
          className="rounded-2xl border p-6 text-left space-y-4"
          style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}
        >
          {stages.map((s, i) => {
            const isActive = s.key === stage;
            const isComplete = i < currentIndex || stage === "complete";
            const isPending = i > currentIndex && stage !== "complete";
            return (
              <div key={s.key} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isComplete ? "#ECFDF5" : isActive ? "#1D1D1F" : "#F5F5F5",
                  }}
                >
                  {isComplete ? (
                    <Check className="w-4 h-4" style={{ color: "#10B981" }} />
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <span className="text-xs font-semibold" style={{ color: isPending ? "#D4D4D4" : "#9CA3AF" }}>
                      {i + 1}
                    </span>
                  )}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: isComplete ? "#10B981" : isActive ? "#1D1D1F" : "#D4D4D4" }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {stage === "error" && onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 font-semibold px-8 py-3 rounded-full"
          style={{ background: "#1D1D1F", color: "#FFFFFF" }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
