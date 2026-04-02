"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Dog,
  ArrowLeft,
  Sparkles,
  Mountain,
  Palmtree,
  Rocket,
  TreePine,
  Building2,
} from "lucide-react";
import PhotoUploader from "@/components/PhotoUploader";
import ProcessingStatus, {
  ProcessingStage,
} from "@/components/ProcessingStatus";
import VideoPlayer from "@/components/VideoPlayer";

const adventureThemes = [
  { id: "park", label: "Sunny Park", icon: TreePine, emoji: "\ud83c\udf33" },
  { id: "beach", label: "Beach Day", icon: Palmtree, emoji: "\ud83c\udfd6\ufe0f" },
  { id: "space", label: "Space Explorer", icon: Rocket, emoji: "\ud83d\ude80" },
  { id: "mountain", label: "Mountain Hike", icon: Mountain, emoji: "\ud83c\udfd4\ufe0f" },
  { id: "city", label: "City Adventure", icon: Building2, emoji: "\ud83c\udfd9\ufe0f" },
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
      // Stage 1: Upload photos
      setProcessingStage("uploading");
      setProgress(0);

      // Convert first photo to base64 for the API
      const file = photos[0];
      const base64 = await fileToBase64(file);
      const dataUrl = `data:${file.type};base64,${base64}`;

      setProgress(100);

      // Stage 2: Cartoonify
      setProcessingStage("cartoonifying");
      setProgress(0);

      const cartoonRes = await fetch("/api/cartoonify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: dataUrl }),
      });

      if (!cartoonRes.ok) {
        throw new Error("Failed to create cartoon");
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

      // Small delay for UX
      await new Promise((r) => setTimeout(r, 1500));
      setProgress(100);

      setProcessingStage("complete");
      setVideoUrl(videoData.videoUrl);

      // Transition to result
      setTimeout(() => setStep("result"), 1000);
    } catch (err: unknown) {
      console.error("Processing error:", err);
      setProcessingStage("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <nav className="border-b border-white/5 backdrop-blur-md bg-[#0f0a1a]/80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <Dog className="w-6 h-6 text-purple-400" />
            <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              PupTV
            </span>
          </Link>

          {/* Step indicators */}
          <div className="flex items-center gap-2">
            {["Upload", "Customize", "Create"].map((label, i) => {
              const stepMap = ["upload", "customize", "processing"];
              const currentIdx =
                step === "result" ? 3 : stepMap.indexOf(step);
              const isActive = i <= currentIdx;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? "bg-purple-500 text-white"
                        : "bg-white/5 text-slate-600"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-sm hidden sm:inline ${
                      isActive ? "text-white" : "text-slate-600"
                    }`}
                  >
                    {label}
                  </span>
                  {i < 2 && (
                    <div
                      className={`w-8 h-px ${
                        isActive ? "bg-purple-500" : "bg-white/10"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Step 1: Upload */}
        {step === "upload" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-3">Upload Your Dog&apos;s Photos</h1>
              <p className="text-slate-400">
                Share 1-5 photos showing your pup from different angles. Better photos = better cartoons!
              </p>
            </div>

            <PhotoUploader onPhotosSelected={handlePhotosSelected} />

            {photos.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setStep("customize")}
                  className="gradient-btn-primary text-white font-semibold px-8 py-3 rounded-full inline-flex items-center gap-2"
                >
                  Next: Customize Adventure
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Tips */}
            <div className="mt-12 gradient-card rounded-2xl p-6">
              <h3 className="font-semibold mb-3 text-purple-300">Tips for best results</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">\u2713</span>
                  <span>Clear, well-lit photos of your dog</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">\u2713</span>
                  <span>Multiple angles (front, side, action)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">\u2713</span>
                  <span>Show their unique markings & features</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">\u2715</span>
                  <span>Avoid blurry or very dark photos</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Customize */}
        {step === "customize" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-3">Customize the Adventure</h1>
              <p className="text-slate-400">
                Give your pup a name and pick an adventure theme
              </p>
            </div>

            {/* Dog name */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                What&apos;s your dog&apos;s name?
              </label>
              <input
                type="text"
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                placeholder="e.g., Buddy, Luna, Max..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all"
              />
            </div>

            {/* Theme selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Choose an adventure theme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {adventureThemes.map((theme) => {
                  const Icon = theme.icon;
                  const isSelected = selectedTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-4 rounded-xl text-left transition-all ${
                        isSelected
                          ? "bg-purple-500/20 border-2 border-purple-500"
                          : "gradient-card hover:border-purple-500/30"
                      }`}
                    >
                      <div className="text-2xl mb-2">{theme.emoji}</div>
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? "text-purple-400" : "text-slate-500"}`} />
                        <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-slate-400"}`}>
                          {theme.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview summary */}
            <div className="gradient-card rounded-2xl p-6 mb-8">
              <h3 className="font-semibold mb-3 text-purple-300">Your order</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Photos uploaded</span>
                  <span className="text-white">{photos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dog&apos;s name</span>
                  <span className="text-white">{dogName || "(unnamed pup)"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Adventure theme</span>
                  <span className="text-white">
                    {adventureThemes.find((t) => t.id === selectedTheme)?.label}
                  </span>
                </div>
                <hr className="border-white/5 my-2" />
                <div className="flex justify-between">
                  <span className="text-slate-400">Price</span>
                  <span className="text-green-400 font-semibold">
                    $4.99{" "}
                    <span className="text-xs text-slate-500 font-normal">
                      (goes to dog charity)
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep("upload")}
                className="flex-1 border border-white/10 text-slate-400 hover:text-white font-medium px-6 py-3 rounded-full transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleStartProcessing}
                className="flex-1 gradient-btn-primary text-white font-semibold px-6 py-3 rounded-full inline-flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Create Video
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Processing */}
        {step === "processing" && (
          <ProcessingStatus
            stage={processingStage}
            progress={progress}
            error={error || undefined}
            cartoonPreviewUrl={cartoonPreview}
          />
        )}

        {/* Step 4: Result */}
        {step === "result" && videoUrl && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-3">
                {dogName ? `${dogName}'s` : "Your Pup's"} Adventure is Ready!
              </h1>
              <p className="text-slate-400">
                Your custom Dog TV video is ready to play on loop
              </p>
            </div>
            <VideoPlayer videoUrl={videoUrl} dogName={dogName} />

            <div className="text-center mt-12">
              <p className="text-sm text-pink-400 mb-2">
                Thank you! Your purchase helps dogs in need.
              </p>
              <Link
                href="/create"
                className="text-sm text-slate-500 hover:text-white transition-colors"
              >
                Create another adventure \u2192
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper: convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix to get raw base64
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
}
