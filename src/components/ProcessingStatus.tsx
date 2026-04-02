"use client";

import { Dog, Sparkles, Film, Check, Loader2 } from "lucide-react";

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
}

const stages = [
  { key: "uploading", label: "Uploading photos", icon: Dog },
  { key: "cartoonifying", label: "Creating cartoon character", icon: Sparkles },
  { key: "generating_video", label: "Generating adventure video", icon: Film },
  { key: "finalizing", label: "Finalizing your video", icon: Check },
];

export default function ProcessingStatus({
  stage,
  progress,
  error,
  cartoonPreviewUrl,
}: ProcessingStatusProps) {
  const currentIndex = stages.findIndex((s) => s.key === stage);

  return (
    <div className="gradient-card rounded-2xl p-8 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <Dog className="w-12 h-12 text-purple-400 mx-auto mb-3 paw-bounce" />
        <h3 className="text-xl font-semibold mb-1">Creating Your Dog&apos;s Adventure</h3>
        <p className="text-sm text-slate-400">This typically takes 2-3 minutes</p>
      </div>

      {/* Cartoon preview */}
      {cartoonPreviewUrl && (
        <div className="mb-6 rounded-xl overflow-hidden video-glow">
          <img
            src={cartoonPreviewUrl}
            alt="Cartoon preview"
            className="w-full h-48 object-cover"
          />
          <div className="bg-purple-500/10 px-4 py-2 text-center">
            <span className="text-sm text-purple-300">Your pup as a cartoon character!</span>
          </div>
        </div>
      )}

      {/* Progress steps */}
      <div className="space-y-4">
        {stages.map((s, i) => {
          const isActive = s.key === stage;
          const isComplete = i < currentIndex || stage === "complete";
          const isPending = i > currentIndex && stage !== "complete";
          const Icon = s.icon;

          return (
            <div
              key={s.key}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                isActive ? "bg-purple-500/10 border border-purple-500/20" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isComplete
                    ? "bg-green-500/20 text-green-400"
                    : isActive
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-white/5 text-slate-600"
                }`}
              >
                {isComplete ? (
                  <Check className="w-5 h-5" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    isComplete
                      ? "text-green-400"
                      : isActive
                      ? "text-white"
                      : "text-slate-600"
                  }`}
                >
                  {s.label}
                </p>
                {isActive && progress !== undefined && (
                  <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Error state */}
      {stage === "error" && error && (
        <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
