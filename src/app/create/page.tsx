"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PhotoUploader from "@/components/PhotoUploader";
import ProcessingStatus, { ProcessingStage } from "@/components/ProcessingStatus";
import VideoPlayer from "@/components/VideoPlayer";

const adventureThemes = [
  { id: "park", label: "Sunny Park", emoji: "🌳" },
  { id: "beach", label: "Beach Day", emoji: "🏖️" },
  { id: "space", label: "Space Explorer", emoji: "🚀" },
  { id: "mountain", label: "Mountain Hike", emoji: "🏔️" },
  { id: "city", label: "City Adventure", emoji: "🏙️" },
];

export default function CreatePage() {
  const [step, setStep] = useState<"upload" | "customize" | "processing" | "result">("upload");
  const [photos, setPhotos] = useState<File[]>([]);
  const [dogName, setDogName] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("park");
  const [processingStage, setProcessingStage] = useState<ProcessingStage>("uploading");
  const [progress, setProgress] = useState(0);
  const [cartoonPreview, setCartoonPreview] = useState<string | undefined>();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePhotosSelected = useCallback((files: File[]) => {
    setPhotos(files);
  }, []);

  const handleStartProcessing = async () => {
    if (photos.length === 0) return;

    setStep("processing");
    setError(null);

    try {
      // Stage 1: Compress image client-side (avoids Vercel 4.5MB body limit)
      setProcessingStage("uploading");
      setProgress(0);

      const file = photos[0];
      const compressedDataUrl = await compressImage(file, 768);
      setProgress(100);

      // Stage 2: Cartoonify
      setProcessingStage("cartoonifying");
      setProgress(0);

      const cartoonRes = await fetch("/api/cartoonify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: compressedDataUrl }),
      });

      if (!cartoonRes.ok) {
        const errData = await cartoonRes.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || "Failed to create cartoon");
      }

      const cartoonData = await cartoonRes.json();
      setCartoonPreview(cartoonData.cartoonUrl);
      setProgress(100);

      // Stage 3: Generate video
      setProcessingStage("generating_video");
      setProgress(0);

      const videoRes = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartoonUrl: cartoonData.cartoonUrl,
          dogName,
          adventureTheme: selectedTheme,
        }),
      });

      if (!videoRes.ok) {
        throw new Error("Failed to generate video");
      }

      const videoData = await videoRes.json();
      setProgress(100);

      // Stage 4: Finalize
      setProcessingStage("finalizing");
      setProgress(50);
      await new Promise((r) => setTimeout(r, 1000));
      setProgress(100);

      setProcessingStage("complete");
      setVideoUrl(videoData.videoUrl);
      setTimeout(() => setStep("result"), 800);
    } catch (err: unknown) {
      console.error("Processing error:", err);
      setProcessingStage("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  const steps = ["Upload", "Customize", "Create"];
  const stepKeys = ["upload", "customize", "processing"];
  const currentStepIdx = step === "result" ? 3 : stepKeys.indexOf(step);

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      {/* Header */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "#E5E5E5",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2"
            style={{ color: "#6E6E73" }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold text-lg" style={{ color: "#1D1D1F" }}>
              PupTV
            </span>
          </Link>

          <div className="flex items-center gap-1.5">
            {steps.map((label, i) => {
              const isActive = i === currentStepIdx;
              const isComplete = i < currentStepIdx;
              return (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                      style={{
                        background: isComplete ? "#10B981" : isActive ? "#1D1D1F" : "#E5E5E5",
                        color: isComplete || isActive ? "#FFFFFF" : "#9CA3AF",
                      }}
                    >
                      {isComplete ? "✓" : i + 1}
                    </div>
                    <span
                      className="text-sm hidden sm:inline"
                      style={{
                        color: isActive ? "#1D1D1F" : "#9CA3AF",
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className="w-5 h-px mx-0.5"
                      style={{ background: i < currentStepIdx ? "#10B981" : "#E5E5E5" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {step === "upload" && (
          <div className="max-w-xl mx-auto">
            <h1
              className="font-bold mb-3"
              style={{ fontSize: "clamp(28px,5vw,38px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
            >
              Upload your dog&apos;s photos
            </h1>
            <p className="mb-8" style={{ color: "#6E6E73" }}>
              Share 1–5 photos showing your pup from different angles. More variety = better cartoon.
            </p>

            <PhotoUploader onPhotosSelected={handlePhotosSelected} />

            {photos.length > 0 && (
              <button
                onClick={() => setStep("customize")}
                className="mt-8 w-full font-semibold py-4 rounded-2xl text-lg flex items-center justify-center gap-2"
                style={{ background: "#1D1D1F", color: "#FFFFFF" }}
              >
                Next: Customize <span>→</span>
              </button>
            )}

            <div
              className="mt-8 rounded-2xl p-6 border"
              style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}
            >
              <h3 className="font-semibold mb-4" style={{ color: "#1D1D1F" }}>
                Tips for the best cartoon
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { ok: true, text: "Clear, well-lit photos" },
                  { ok: true, text: "Multiple angles" },
                  { ok: true, text: "Show unique markings" },
                  { ok: false, text: "Blurry or very dark photos" },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span style={{ color: tip.ok ? "#10B981" : "#EF4444" }}>
                      {tip.ok ? "✓" : "✕"}
                    </span>
                    <span style={{ color: "#6E6E73" }}>{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === "customize" && (
          <div className="max-w-xl mx-auto">
            <h1
              className="font-bold mb-3"
              style={{ fontSize: "clamp(28px,5vw,38px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
            >
              Customize the adventure
            </h1>
            <p className="mb-8" style={{ color: "#6E6E73" }}>
              Give your pup a name and choose their adventure setting
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: "#1D1D1F" }}>
                Dog&apos;s name
              </label>
              <input
                type="text"
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                placeholder="Buddy, Luna, Max…"
                className="w-full rounded-xl px-4 py-3 text-base outline-none border-2"
                style={{ background: "#FFFFFF", borderColor: "#E5E5E5", color: "#1D1D1F" }}
                onFocus={(e) => (e.target.style.borderColor = "#1D1D1F")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3" style={{ color: "#1D1D1F" }}>
                Adventure theme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {adventureThemes.map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className="p-4 rounded-2xl text-left border-2"
                      style={{
                        background: isSelected ? "#1D1D1F" : "#FFFFFF",
                        borderColor: isSelected ? "#1D1D1F" : "#E5E5E5",
                        color: isSelected ? "#FFFFFF" : "#1D1D1F",
                      }}
                    >
                      <div className="text-2xl mb-2">{theme.emoji}</div>
                      <div className="text-sm font-medium">{theme.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="rounded-2xl p-6 mb-8 border"
              style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}
            >
              <h3 className="font-semibold mb-4" style={{ color: "#1D1D1F" }}>Order summary</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Photos", value: String(photos.length) },
                  { label: "Name", value: dogName || "—" },
                  { label: "Theme", value: adventureThemes.find((t) => t.id === selectedTheme)?.label || "" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span style={{ color: "#6E6E73" }}>{row.label}</span>
                    <span className="font-medium" style={{ color: "#1D1D1F" }}>{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 border-t" style={{ borderColor: "#E5E5E5" }}>
                  <span style={{ color: "#6E6E73" }}>Total</span>
                  <div className="text-right">
                    <span className="font-bold" style={{ color: "#1D1D1F" }}>$4.99</span>
                    <p className="text-xs font-medium" style={{ color: "#F97316" }}>goes to dog charity 🐾</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("upload")}
                className="flex-1 font-semibold py-4 rounded-2xl border-2"
                style={{ borderColor: "#E5E5E5", color: "#6E6E73", background: "#FFFFFF" }}
              >
                ← Back
              </button>
              <button
                onClick={handleStartProcessing}
                className="flex-[2] font-semibold py-4 rounded-2xl text-lg"
                style={{ background: "#F97316", color: "#FFFFFF" }}
              >
                Create Video ✨
              </button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <ProcessingStatus
            stage={processingStage}
            progress={progress}
            error={error || undefined}
            cartoonPreviewUrl={cartoonPreview}
            onRetry={() => { setStep("customize"); setError(null); }}
          />
        )}

        {step === "result" && videoUrl && (
          <div>
            <div className="text-center mb-10">
              <h1
                className="font-bold mb-3"
                style={{ fontSize: "clamp(28px,5vw,38px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
              >
                {dogName ? `${dogName}'s adventure` : "Your pup's adventure"} is ready!
              </h1>
              <p style={{ color: "#6E6E73" }}>Your custom Dog TV video is ready to watch and share</p>
            </div>
            <VideoPlayer videoUrl={videoUrl} dogName={dogName} />
            <div className="text-center mt-10">
              <p className="text-sm font-medium mb-3" style={{ color: "#F97316" }}>
                🐾 Thank you! Your purchase helps dogs in need.
              </p>
              <Link href="/create" className="text-sm" style={{ color: "#A1A1AA" }}>
                Create another adventure →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

async function compressImage(file: File, maxDimension: number = 768): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width >= height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    };
    img.src = objectUrl;
  });
}
