"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Tv, Check, Copy, Send, Moon } from "lucide-react";
import PhotoUploader, { CompressedPhoto } from "@/components/PhotoUploader";
import ThemePicker, { ADVENTURE_THEMES } from "@/components/ThemePicker";
import OccasionPicker, { OCCASIONS } from "@/components/OccasionPicker";
import PreviewGate from "@/components/PreviewGate";
import PrivacyPicker, { PrivacyOption } from "@/components/PrivacyPicker";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import PricingPicker from "@/components/PricingPicker";
import CharityPicker from "@/components/CharityPicker";
import CalmModeToggle from "@/components/CalmModeToggle";
import PosterCard from "@/components/PosterCard";
import SendToTvModal from "@/components/SendToTvModal";
import { PRICING_TIERS } from "@/lib/pricing";
import { CHARITIES } from "@/lib/impact";

const STEP_LABELS = ["Photos", "Details", "Preview", "Checkout", "Done"];

type Step = 1 | 2 | 3 | 4 | 5;

export default function CreatePage() {
  const [step, setStep] = useState<Step>(1);

  const [photos, setPhotos] = useState<CompressedPhoto[]>([]);
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [details, setDetails] = useState("");
  const [theme, setTheme] = useState("park");
  const [occasion, setOccasion] = useState("");

  const [hasSecondPet, setHasSecondPet] = useState(false);
  const [pet2Name, setPet2Name] = useState("");
  const [pet2Breed, setPet2Breed] = useState("");
  const [pet2Details, setPet2Details] = useState("");
  const [packAdventure, setPackAdventure] = useState(false);

  const [calmMode, setCalmMode] = useState(false);

  const [stills, setStills] = useState<string[]>([]);
  const [retryUsed, setRetryUsed] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const [sku, setSku] = useState<string>("single");
  const [charity, setCharity] = useState<string>("choose-for-me");

  const [privacy, setPrivacy] = useState<PrivacyOption>("unlisted");
  const [youtubeConnected, setYoutubeConnected] = useState(false);
  const [youtubeChannelName, setYoutubeChannelName] = useState("");
  const [isConnectingYoutube, setIsConnectingYoutube] = useState(false);

  const [isFinishing, setIsFinishing] = useState(false);
  const [confirmEta, setConfirmEta] = useState(15);
  const [confirmVideoId, setConfirmVideoId] = useState("PIcIfIdC1kA");

  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [showShareModal, setShowShareModal] = useState(false);

  const displayName = hasSecondPet && pet2Name.trim()
    ? `${petName.trim() || "Your dog"} & ${pet2Name.trim()}`
    : petName.trim() || "Your dog";

  const selectedTier = PRICING_TIERS.find((t) => t.id === sku) ?? PRICING_TIERS[0];
  const selectedCharityObj = CHARITIES.find((c) => c.id === charity) ?? CHARITIES[CHARITIES.length - 1];

  const handlePhotosSelected = useCallback((p: CompressedPhoto[]) => setPhotos(p), []);

  const goToPreview = useCallback(async () => {
    setStep(3);
    setIsLoadingPreview(true);
    try {
      const res = await fetch("/api/cartoonify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petName, breed, details, theme, occasion, calmMode }),
      });
      const data = await res.json();
      setStills(data.stills || []);
    } finally {
      setIsLoadingPreview(false);
    }
  }, [petName, breed, details, theme, occasion, calmMode]);

  const handleApprovePreview = () => setStep(4);

  const handleRetryPreview = () => {
    setRetryUsed(true);
    setStep(2);
  };

  const handleConnectYoutube = async () => {
    setIsConnectingYoutube(true);
    try {
      const res = await fetch("/api/connect-youtube", { method: "POST" });
      const data = await res.json();
      setYoutubeConnected(true);
      setYoutubeChannelName(data.channelName || "Demo Channel");
    } finally {
      setIsConnectingYoutube(false);
    }
  };

  const handleFinishDemoCheckout = async () => {
    setIsFinishing(true);
    try {
      await fetch("/api/checkout", { method: "POST" });
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petName,
          breed,
          details,
          theme,
          occasion,
          privacy,
          sku,
          charity,
          calmMode,
          pack: hasSecondPet && packAdventure,
          secondPet: hasSecondPet ? { name: pet2Name, breed: pet2Breed, details: pet2Details } : null,
        }),
      });
      const data = await res.json();
      setConfirmEta(data.etaMinutes ?? 15);
      setConfirmVideoId(data.sampleYoutubeVideoId || "PIcIfIdC1kA");
      setStep(5);
    } finally {
      setIsFinishing(false);
    }
  };

  const handleCopyLink = async () => {
    const slug = (petName || "dutch").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const url = `https://puptv.vercel.app/watch/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // demo mode — clipboard may be unavailable, still show feedback
    }
    setCopyState("copied");
    setTimeout(() => setCopyState("idle"), 2000);
  };

  const resetFlow = () => {
    setStep(1);
    setPhotos([]);
    setPetName("");
    setBreed("");
    setDetails("");
    setTheme("park");
    setOccasion("");
    setHasSecondPet(false);
    setPet2Name("");
    setPet2Breed("");
    setPet2Details("");
    setPackAdventure(false);
    setCalmMode(false);
    setStills([]);
    setRetryUsed(false);
    setSku("single");
    setCharity("choose-for-me");
    setPrivacy("unlisted");
    setYoutubeConnected(false);
    setYoutubeChannelName("");
    setCopyState("idle");
    setShowShareModal(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
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
          <Link href="/" className="flex items-center gap-2" style={{ color: "#6E6E73" }}>
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold text-lg" style={{ color: "#1D1D1F" }}>PupTV</span>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5">
            {STEP_LABELS.map((label, i) => {
              const idx = (i + 1) as Step;
              const isActive = idx === step;
              const isComplete = idx < step;
              return (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="step-dot"
                      style={{
                        background: isComplete ? "#10B981" : isActive ? "#1D1D1F" : "#E5E5E5",
                        color: isComplete || isActive ? "#FFFFFF" : "#9CA3AF",
                      }}
                    >
                      {isComplete ? <Check className="w-4 h-4" /> : idx}
                    </div>
                    <span
                      className="text-sm hidden md:inline"
                      style={{ color: isActive ? "#1D1D1F" : "#9CA3AF", fontWeight: isActive ? 600 : 400 }}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className="w-4 h-px" style={{ background: idx < step ? "#10B981" : "#E5E5E5" }} />
                  )}
                </div>
              );
            })}
          </div>

          <span className="sm:hidden text-sm font-medium" style={{ color: "#6E6E73" }}>
            Step {step} of 5
          </span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">

        {step === 1 && (
          <div className="max-w-xl mx-auto">
            <h1
              className="font-bold mb-3"
              style={{ fontSize: "clamp(28px,5vw,38px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
            >
              Add photos of your dog
            </h1>
            <p className="mb-8" style={{ fontSize: "17px", color: "#6E6E73", lineHeight: 1.6 }}>
              1 to 5 photos, any angle. Clear, well-lit shots work best — they&apos;re how the AI
              keeps your dog looking like your dog.
            </p>

            <PhotoUploader onPhotosSelected={handlePhotosSelected} />

            {photos.length > 0 && (
              <button
                onClick={() => setStep(2)}
                className="btn-large mt-8 w-full rounded-2xl flex items-center justify-center gap-2"
                style={{ background: "#1D1D1F", color: "#FFFFFF" }}
              >
                Next: Tell us about your dog <span>→</span>
              </button>
            )}

            <div className="mt-8 rounded-2xl p-6 border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
              <h3 className="font-semibold mb-4" style={{ color: "#1D1D1F" }}>
                Tips for the best result
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { ok: true, text: "Clear, well-lit photos" },
                  { ok: true, text: "A few different angles" },
                  { ok: true, text: "Show any unique markings" },
                  { ok: false, text: "Blurry or very dark photos" },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span style={{ color: tip.ok ? "#10B981" : "#EF4444" }}>{tip.ok ? "✓" : "✕"}</span>
                    <span style={{ color: "#6E6E73" }}>{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-xl mx-auto">
            <h1
              className="font-bold mb-3"
              style={{ fontSize: "clamp(28px,5vw,38px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
            >
              Tell us about your dog
            </h1>
            <p className="mb-8" style={{ fontSize: "17px", color: "#6E6E73", lineHeight: 1.6 }}>
              A name, breed, and any details help the AI get {displayName} right.
            </p>

            <div className="mb-6">
              <label className="block font-semibold mb-2" style={{ fontSize: "16px", color: "#1D1D1F" }}>
                Dog&apos;s name
              </label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Dutch, Luna, Max…"
                className="w-full rounded-xl px-4 py-4 outline-none border-2"
                style={{ fontSize: "18px", background: "#FFFFFF", borderColor: "#E5E5E5", color: "#1D1D1F" }}
                onFocus={(e) => (e.target.style.borderColor = "#1D1D1F")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
              />
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2" style={{ fontSize: "16px", color: "#1D1D1F" }}>
                Breed (or your best guess)
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="French Bulldog, Lab mix, not sure…"
                className="w-full rounded-xl px-4 py-4 outline-none border-2"
                style={{ fontSize: "18px", background: "#FFFFFF", borderColor: "#E5E5E5", color: "#1D1D1F" }}
                onFocus={(e) => (e.target.style.borderColor = "#1D1D1F")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
              />
            </div>

            <div className="mb-8">
              <label className="block font-semibold mb-2" style={{ fontSize: "16px", color: "#1D1D1F" }}>
                Anything the AI should get right?
              </label>
              <p className="text-sm mb-3" style={{ color: "#A1A1AA" }}>
                e.g. &ldquo;very short stubby tail&rdquo; or &ldquo;white patch over one eye&rdquo;
              </p>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Optional — but this is what fixes anything the AI gets wrong"
                className="w-full rounded-xl px-4 py-4 outline-none border-2"
                style={{
                  fontSize: "17px",
                  background: "#FFFFFF",
                  borderColor: "#E5E5E5",
                  color: "#1D1D1F",
                  lineHeight: 1.5,
                  resize: "vertical",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1D1D1F")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
              />
            </div>

            {!hasSecondPet ? (
              <button
                type="button"
                onClick={() => setHasSecondPet(true)}
                className="mb-10 text-sm font-semibold rounded-full px-5 py-2.5 border-2 inline-flex items-center gap-2"
                style={{ borderColor: "#E5E5E5", color: "#1D1D1F", background: "#FFFFFF" }}
              >
                + Add another pet
              </button>
            ) : (
              <div className="rounded-2xl p-6 mb-10 border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: "#1D1D1F" }}>Second dog</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setHasSecondPet(false);
                      setPet2Name("");
                      setPet2Breed("");
                      setPet2Details("");
                      setPackAdventure(false);
                    }}
                    className="text-sm"
                    style={{ color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}
                  >
                    Remove
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-2" style={{ fontSize: "15px", color: "#1D1D1F" }}>
                    Dog&apos;s name
                  </label>
                  <input
                    type="text"
                    value={pet2Name}
                    onChange={(e) => setPet2Name(e.target.value)}
                    placeholder="Luna, Max…"
                    className="w-full rounded-xl px-4 py-3 outline-none border-2"
                    style={{ fontSize: "16px", background: "#FFFFFF", borderColor: "#E5E5E5", color: "#1D1D1F" }}
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-2" style={{ fontSize: "15px", color: "#1D1D1F" }}>
                    Breed
                  </label>
                  <input
                    type="text"
                    value={pet2Breed}
                    onChange={(e) => setPet2Breed(e.target.value)}
                    placeholder="Lab mix, not sure…"
                    className="w-full rounded-xl px-4 py-3 outline-none border-2"
                    style={{ fontSize: "16px", background: "#FFFFFF", borderColor: "#E5E5E5", color: "#1D1D1F" }}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2" style={{ fontSize: "15px", color: "#1D1D1F" }}>
                    Anything the AI should get right?
                  </label>
                  <textarea
                    value={pet2Details}
                    onChange={(e) => setPet2Details(e.target.value)}
                    rows={2}
                    placeholder="Optional"
                    className="w-full rounded-xl px-4 py-3 outline-none border-2"
                    style={{ fontSize: "15px", background: "#FFFFFF", borderColor: "#E5E5E5", color: "#1D1D1F", resize: "vertical" }}
                  />
                </div>
                <p className="text-xs mt-3" style={{ color: "#A1A1AA" }}>Up to 2 pets for now.</p>
              </div>
            )}

            <div className="mb-8">
              <label className="block font-semibold mb-3" style={{ fontSize: "16px", color: "#1D1D1F" }}>
                Pick an adventure
              </label>
              <ThemePicker selected={theme} onSelect={setTheme} />
            </div>

            <div className="mb-8">
              <label className="block font-semibold mb-1" style={{ fontSize: "16px", color: "#1D1D1F" }}>
                Special occasion? <span style={{ fontWeight: 400, color: "#A1A1AA" }}>(optional)</span>
              </label>
              <p className="text-sm mb-3" style={{ color: "#A1A1AA" }}>We&apos;ll work it into the adventure.</p>
              <OccasionPicker selected={occasion} onSelect={setOccasion} />
            </div>

            {hasSecondPet && (
              <div
                className="rounded-2xl p-5 mb-8 border flex items-center justify-between gap-4"
                style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}
              >
                <div>
                  <div className="font-semibold" style={{ fontSize: "16px", color: "#1D1D1F" }}>
                    Pack adventure
                  </div>
                  <p className="text-sm mt-1" style={{ color: "#6E6E73" }}>
                    Put both pets in the same episode, together.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={packAdventure}
                  aria-label="Pack adventure"
                  onClick={() => setPackAdventure(!packAdventure)}
                  style={{
                    width: 52,
                    height: 30,
                    borderRadius: 9999,
                    background: packAdventure ? "#1D1D1F" : "#E5E5E5",
                    position: "relative",
                    flexShrink: 0,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      left: packAdventure ? 25 : 3,
                      width: 24,
                      height: 24,
                      borderRadius: 9999,
                      background: "#FFFFFF",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      display: "block",
                    }}
                  />
                </button>
              </div>
            )}

            <div className="mb-10">
              <CalmModeToggle enabled={calmMode} onToggle={setCalmMode} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep(1)}
                className="btn-large flex-1 rounded-2xl border-2"
                style={{ borderColor: "#E5E5E5", color: "#6E6E73", background: "#FFFFFF" }}
              >
                ← Back
              </button>
              <button
                onClick={goToPreview}
                className="btn-large flex-[2] rounded-2xl"
                style={{ background: "#1D1D1F", color: "#FFFFFF" }}
              >
                {retryUsed ? "See the new preview →" : "See the preview →"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1
              className="font-bold mb-3"
              style={{ fontSize: "clamp(28px,5vw,38px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
            >
              Here&apos;s a first look
            </h1>
            <p className="mb-8" style={{ fontSize: "17px", color: "#6E6E73", lineHeight: 1.6 }}>
              Three scenes from {displayName}&apos;s{" "}
              {ADVENTURE_THEMES.find((t) => t.id === theme)?.label.toLowerCase()}
              {occasion ? ` ${OCCASIONS.find((o) => o.id === occasion)?.label.toLowerCase()}` : ""} adventure
              {calmMode ? ", rendered in calm mode" : ""} — approve them before we charge you anything.
            </p>

            {isLoadingPreview ? (
              <div className="text-center py-20">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: "#6E6E73" }} />
                <p style={{ color: "#6E6E73" }}>Generating {displayName}&apos;s cartoon scenes…</p>
              </div>
            ) : (
              <PreviewGate
                stills={stills}
                petName={petName}
                onApprove={handleApprovePreview}
                onRetry={handleRetryPreview}
                retryUsed={retryUsed}
              />
            )}
          </div>
        )}

        {step === 4 && (
          <div className="max-w-xl mx-auto">
            <h1
              className="font-bold mb-3"
              style={{ fontSize: "clamp(28px,5vw,38px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
            >
              Almost there
            </h1>
            <p className="mb-8" style={{ fontSize: "17px", color: "#6E6E73", lineHeight: 1.6 }}>
              One payment, one YouTube connection, and you choose who can watch.
            </p>

            <div className="mb-6">
              <h3 className="font-semibold mb-4" style={{ color: "#1D1D1F", fontSize: "17px" }}>
                Choose your plan
              </h3>
              <PricingPicker selected={sku} onSelect={setSku} />
            </div>

            <div className="rounded-2xl p-6 mb-6 border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
              <h3 className="font-semibold mb-4" style={{ color: "#1D1D1F" }}>Order summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "#6E6E73" }}>{hasSecondPet ? "Dogs" : "Dog"}</span>
                  <span className="font-medium" style={{ color: "#1D1D1F" }}>{displayName}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#6E6E73" }}>Adventure</span>
                  <span className="font-medium" style={{ color: "#1D1D1F" }}>
                    {ADVENTURE_THEMES.find((t) => t.id === theme)?.label}
                    {occasion ? ` + ${OCCASIONS.find((o) => o.id === occasion)?.label}` : ""}
                    {hasSecondPet && packAdventure ? " (pack)" : ""}
                  </span>
                </div>
                {calmMode && (
                  <div className="flex justify-between">
                    <span style={{ color: "#6E6E73" }}>Mode</span>
                    <span className="font-medium" style={{ color: "#1D1D1F" }}>Calm mode</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span style={{ color: "#6E6E73" }}>Plan</span>
                  <span className="font-medium" style={{ color: "#1D1D1F" }}>{selectedTier.name}</span>
                </div>
                <div className="flex justify-between pt-3 border-t" style={{ borderColor: "#E5E5E5" }}>
                  <span style={{ color: "#6E6E73" }}>Total</span>
                  <div className="text-right">
                    <span className="font-bold" style={{ color: "#1D1D1F" }}>{selectedTier.price}</span>
                    <p className="text-xs font-medium" style={{ color: "#F97316" }}>most of this funds dog rescues</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6 mb-6 border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
              <h3 className="font-semibold mb-2" style={{ color: "#1D1D1F" }}>Payment</h3>
              <p className="text-sm mb-4" style={{ color: "#6E6E73" }}>
                This is a live demo — no card will ever be charged here.
              </p>
              <button
                disabled
                className="btn-large w-full rounded-2xl cursor-not-allowed"
                style={{ background: "#E5E5E5", color: "#9CA3AF" }}
              >
                Pay {selectedTier.price} — Demo mode
              </button>
            </div>

            <div className="rounded-2xl p-6 mb-6 border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
              <h3 className="font-semibold mb-1" style={{ color: "#1D1D1F" }}>Where should your donation go?</h3>
              <p className="text-sm mb-5" style={{ color: "#6E6E73" }}>
                Part of every order funds a dog rescue. Pick one, or let us choose.
              </p>
              <CharityPicker selected={charity} onSelect={setCharity} />
            </div>

            <div className="rounded-2xl p-6 mb-6 border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
              <h3 className="font-semibold mb-2" style={{ color: "#1D1D1F" }}>Connect your YouTube account</h3>
              <p className="text-sm mb-4" style={{ color: "#6E6E73", lineHeight: 1.6 }}>
                This is the whole trick: once you connect your account, every new episode shows up
                on your dog&apos;s own YouTube channel by itself. No files, no apps, nothing to remember.
              </p>
              {youtubeConnected ? (
                <div
                  className="flex items-center gap-2 rounded-xl px-4 py-3"
                  style={{ background: "#ECFDF5", color: "#047857" }}
                >
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">Connected as {youtubeChannelName}</span>
                </div>
              ) : (
                <button
                  onClick={handleConnectYoutube}
                  disabled={isConnectingYoutube}
                  className="btn-large w-full rounded-2xl flex items-center justify-center gap-2"
                  style={{ background: "#FF0000", color: "#FFFFFF" }}
                >
                  {isConnectingYoutube ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Tv className="w-5 h-5" />
                  )}
                  {isConnectingYoutube ? "Connecting…" : "Connect YouTube"}
                </button>
              )}
            </div>

            <div className="rounded-2xl p-6 mb-8 border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
              <h3 className="font-semibold mb-1" style={{ color: "#1D1D1F" }}>Who can watch?</h3>
              <p className="text-sm mb-5" style={{ color: "#6E6E73" }}>
                You can change this later. It only affects this episode.
              </p>
              <PrivacyPicker selected={privacy} onSelect={setPrivacy} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep(3)}
                className="btn-large flex-1 rounded-2xl border-2"
                style={{ borderColor: "#E5E5E5", color: "#6E6E73", background: "#FFFFFF" }}
              >
                ← Back
              </button>
              <button
                onClick={handleFinishDemoCheckout}
                disabled={!youtubeConnected || isFinishing}
                className="btn-large flex-[2] rounded-2xl"
                style={{
                  background: !youtubeConnected || isFinishing ? "#E5E5E5" : "#1D1D1F",
                  color: !youtubeConnected || isFinishing ? "#9CA3AF" : "#FFFFFF",
                  cursor: !youtubeConnected || isFinishing ? "not-allowed" : "pointer",
                }}
              >
                {isFinishing
                  ? "Finishing up…"
                  : youtubeConnected
                  ? "Complete demo order →"
                  : "Connect YouTube to continue"}
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="max-w-xl mx-auto text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "#ECFDF5" }}
            >
              <Check className="w-8 h-8" style={{ color: "#10B981" }} />
            </div>
            <h1
              className="font-bold mb-3"
              style={{ fontSize: "clamp(28px,5vw,38px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
            >
              {displayName}&apos;s episode is on its way
            </h1>
            <p className="mb-10" style={{ fontSize: "17px", color: "#6E6E73", lineHeight: 1.6 }}>
              {displayName}&apos;s episode will appear on your YouTube channel in about{" "}
              {confirmEta} minutes. Here&apos;s a sample of what a finished PupTV episode looks like:
            </p>

            <YouTubeEmbed videoId={confirmVideoId} title={`${displayName}'s sample episode`} />

            {calmMode && (
              <div
                className="rounded-2xl p-5 mt-8 border text-left flex items-start gap-3"
                style={{ background: "#EFF6FF", borderColor: "#BFDBFE" }}
              >
                <Moon className="w-5 h-5 flex-shrink-0" style={{ color: "#2563EB", marginTop: "2px" }} />
                <p className="text-sm" style={{ color: "#1D1D1F", lineHeight: 1.5 }}>
                  Rendered in <strong>calm mode</strong> — gentle pacing and dog-vision colors, made for anxious pups.
                </p>
              </div>
            )}

            <div className="rounded-2xl p-6 mt-8 mb-6 border text-left" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
              <h3 className="font-semibold mb-3" style={{ color: "#1D1D1F" }}>How to watch on your TV</h3>
              <ol className="space-y-2 text-sm" style={{ color: "#6E6E73", lineHeight: 1.7 }}>
                <li>1. Open the YouTube app on your TV — most smart TVs already have it.</li>
                <li>2. Sign in with the same Google account you just connected.</li>
                <li>3. Look under &ldquo;Your channels&rdquo; for {displayName}&apos;s channel.</li>
              </ol>
            </div>

            <div className="rounded-2xl p-6 mb-6 border text-left" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
              <h3 className="font-semibold mb-4" style={{ color: "#1D1D1F" }}>Share {displayName}&apos;s episode</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopyLink}
                  className="rounded-2xl border-2 flex items-center justify-center gap-2 flex-1"
                  style={{ borderColor: "#E5E5E5", color: "#1D1D1F", background: "#FFFFFF", fontSize: "15px", minHeight: "48px", fontWeight: 600 }}
                >
                  <Copy className="w-4 h-4" />
                  {copyState === "copied" ? "Link copied!" : "Copy link"}
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="rounded-2xl border-2 flex items-center justify-center gap-2 flex-1"
                  style={{ borderColor: "#E5E5E5", color: "#1D1D1F", background: "#FFFFFF", fontSize: "15px", minHeight: "48px", fontWeight: 600 }}
                >
                  <Send className="w-4 h-4" />
                  Send to another TV
                </button>
              </div>
            </div>

            <div className="mb-8 text-left">
              <PosterCard petName={displayName} />
            </div>

            <p className="text-sm font-medium mb-1" style={{ color: "#F97316" }}>
              🐾 Thank you — part of what you paid is going to{" "}
              {charity === "choose-for-me" ? "a dog rescue we choose for you" : selectedCharityObj.name}.
            </p>
            <p className="text-sm mb-6">
              <Link href="/impact" style={{ color: "#6E6E73" }}>
                See the public impact ledger →
              </Link>
            </p>

            <button
              onClick={resetFlow}
              className="btn-large rounded-2xl px-10"
              style={{ background: "#1D1D1F", color: "#FFFFFF" }}
            >
              Create another episode
            </button>
          </div>
        )}
      </main>

      {showShareModal && (
        <SendToTvModal petName={displayName} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
}
