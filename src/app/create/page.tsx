"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Tv, Check, Copy, Send, Moon } from "lucide-react";
import PhotoUploader, { CompressedPhoto } from "@/components/PhotoUploader";
import EpisodePlayer from "@/components/EpisodePlayer";
import {
  startGeneration,
  pollPrediction,
  loadClipJob,
  saveClipJob,
  clearClipJob,
  orderedClipUrls,
  isLiveStillSet,
  PredictionFailedError,
  type ClipJob,
} from "@/lib/liveClient";
import ThemePicker, { ADVENTURE_THEMES } from "@/components/ThemePicker";
import OccasionPicker, { OCCASIONS } from "@/components/OccasionPicker";
import PreviewGate from "@/components/PreviewGate";
import PrivacyPicker, { PrivacyOption } from "@/components/PrivacyPicker";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import PricingPicker from "@/components/PricingPicker";
import TierPicker from "@/components/TierPicker";
import CharityPicker from "@/components/CharityPicker";
import CalmModeToggle from "@/components/CalmModeToggle";
import PosterCard from "@/components/PosterCard";
import SendToTvModal from "@/components/SendToTvModal";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuthState } from "@/components/AuthProvider";
import { PRICING_TIERS } from "@/lib/pricing";
import { QUALITY_TIERS, DEFAULT_TIER_ID, type TierId } from "@/lib/tiers";
import { CHARITIES } from "@/lib/impact";

const STEP_LABELS = ["Photos", "Details", "Preview", "Checkout", "Done"];

/** Stay well under Vercel's 4.5MB request-body ceiling (data URIs are chars ≈ bytes). */
const MAX_UPLOAD_BYTES = 3_800_000;

type Step = 1 | 2 | 3 | 4 | 5;

export default function CreatePage() {
  const { configured: authConfigured, user: authUser } = useAuthState();
  const [step, setStep] = useState<Step>(1);

  const [photos, setPhotos] = useState<CompressedPhoto[]>([]);
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [details, setDetails] = useState("");
  const [theme, setTheme] = useState("park");
  const [occasion, setOccasion] = useState("");
  const [tier, setTier] = useState<TierId>(DEFAULT_TIER_ID);

  const [hasSecondPet, setHasSecondPet] = useState(false);
  const [pet2Name, setPet2Name] = useState("");
  const [pet2Breed, setPet2Breed] = useState("");
  const [pet2Details, setPet2Details] = useState("");
  const [packAdventure, setPackAdventure] = useState(false);

  const [calmMode, setCalmMode] = useState(false);

  const [stills, setStills] = useState<string[]>([]);
  const [retryUsed, setRetryUsed] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Live-generation state (only used when the server has a Replicate token).
  const [liveNotice, setLiveNotice] = useState<string | null>(null);
  const [previewProgress, setPreviewProgress] = useState<string | null>(null);
  const [previewWaitMsg, setPreviewWaitMsg] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [clipPhase, setClipPhase] = useState<"none" | "generating" | "done" | "error">("none");
  const [clipUrls, setClipUrls] = useState<string[]>([]);
  const [clipScene, setClipScene] = useState(0);
  const [clipError, setClipError] = useState<string | null>(null);
  const [clipWaitMsg, setClipWaitMsg] = useState<string | null>(null);
  const clipRunActive = useRef(false);

  const [sku, setSku] = useState<string>("single");
  const [charity, setCharity] = useState<string>("choose-for-me");

  const [privacy, setPrivacy] = useState<PrivacyOption>("unlisted");
  const [youtubeConnected, setYoutubeConnected] = useState(false);
  const [youtubeChannelName, setYoutubeChannelName] = useState("");
  const [isConnectingYoutube, setIsConnectingYoutube] = useState(false);

  const [isFinishing, setIsFinishing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [confirmEta, setConfirmEta] = useState(15);
  const [confirmVideoId, setConfirmVideoId] = useState("PIcIfIdC1kA");

  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [showShareModal, setShowShareModal] = useState(false);

  const displayName = hasSecondPet && pet2Name.trim()
    ? `${petName.trim() || "Your dog"} & ${pet2Name.trim()}`
    : petName.trim() || "Your dog";

  const selectedTier = PRICING_TIERS.find((t) => t.id === sku) ?? PRICING_TIERS[0];
  const selectedQualityTier = QUALITY_TIERS.find((t) => t.id === tier) ?? QUALITY_TIERS[1];
  const selectedCharityObj = CHARITIES.find((c) => c.id === charity) ?? CHARITIES[CHARITIES.length - 1];

  const handlePhotosSelected = useCallback((p: CompressedPhoto[]) => setPhotos(p), []);

  /**
   * Generate the three preview stills. In live mode (server has a
   * Replicate token) each scene is a real nano-banana-pro render: scene 0
   * establishes the cartoon character from the photos, scenes 1-2 chain
   * the scene-0 output back in so the character stays identical. In demo
   * mode the server answers with sample stills in a single round trip.
   */
  const goToPreview = useCallback(async () => {
    setStep(3);
    setIsLoadingPreview(true);
    setPreviewError(null);
    setLiveNotice(null);
    setStills([]);
    const name = petName.trim() || "your dog";
    try {
      const combinedDetails = [breed.trim() ? `Breed: ${breed.trim()}` : "", details.trim()]
        .filter(Boolean)
        .join(". ");
      const photoData = photos.map((p) => p.previewUrl);
      // Vercel rejects request bodies over 4.5MB at the platform edge, which
      // surfaces as an opaque failure rather than one of our messages. The
      // client already downscales to 1024px, but five dense photos can still
      // clear the limit — catch it here with something the user can act on.
      const payloadBytes = photoData.reduce((n, d) => n + d.length, 0);
      if (payloadBytes > MAX_UPLOAD_BYTES) {
        throw new Error(
          "Those photos add up to more than we can send at once. Please remove one or two and try again."
        );
      }
      setPreviewProgress(`Warming up the art studio for ${name}…`);
      const first = await startGeneration(
        "/api/cartoonify",
        {
          photos: photoData,
          petName,
          breed,
          details: combinedDetails,
          theme,
          occasion,
          calmMode,
          sceneIndex: 0,
        },
        setPreviewWaitMsg
      );
      if (first.demo || !first.predictionId) {
        setStills(first.stills ?? []);
        setLiveNotice(first.notice ?? null);
        return;
      }
      const drawn: string[] = [];
      let cartoonRefUrl: string | undefined;
      for (let scene = 0; scene < 3; scene++) {
        setPreviewProgress(`Drawing ${name}… scene ${scene + 1} of 3, about a minute`);
        let predictionId: string;
        if (scene === 0) {
          predictionId = first.predictionId;
        } else {
          const next = await startGeneration(
            "/api/cartoonify",
            {
              photos: photoData,
              petName,
              details: combinedDetails,
              theme,
              sceneIndex: scene,
              cartoonRefUrl,
            },
            setPreviewWaitMsg
          );
          if (next.demo || !next.predictionId) {
            throw new Error(next.notice || "Live generation paused mid-run. Please try again.");
          }
          predictionId = next.predictionId;
        }
        const url = await pollPrediction(predictionId, 5 * 60 * 1000);
        drawn.push(url);
        setStills([...drawn]);
        if (scene === 0) cartoonRefUrl = url;
      }
    } catch (err) {
      setStills([]);
      setPreviewError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoadingPreview(false);
      setPreviewProgress(null);
      setPreviewWaitMsg(null);
    }
  }, [photos, petName, breed, details, theme, occasion, calmMode]);

  /**
   * Animate the three approved stills into 5s clips, sequentially
   * (~3-6 minutes each). Prediction ids and finished clip URLs are kept
   * in sessionStorage so the run survives a reload or the user leaving
   * the tab — on return we resume instead of paying for new renders.
   */
  const runClipGeneration = useCallback(
    async (liveStills: string[], name: string, themeId: string, tierId: TierId) => {
      if (clipRunActive.current) return;
      clipRunActive.current = true;
      setClipPhase("generating");
      setClipError(null);
      const job: ClipJob = loadClipJob() ?? {
        petName: name,
        theme: themeId,
        tier: tierId,
        stills: liveStills,
        predictionIds: {},
        clipUrls: {},
        createdAt: Date.now(),
      };
      let failedScene: number | null = null;
      try {
        saveClipJob(job);
        for (let scene = 0; scene < 3; scene++) {
          setClipScene(scene);
          if (job.clipUrls[scene]) {
            setClipUrls(orderedClipUrls(job));
            continue;
          }
          failedScene = scene;
          let predictionId = job.predictionIds[scene];
          if (!predictionId) {
            const started = await startGeneration(
              "/api/generate-video",
              {
                stillUrl: job.stills[scene],
                petName: job.petName,
                theme: job.theme,
                sceneIndex: scene,
                tier: job.tier,
              },
              setClipWaitMsg
            );
            if (started.demo || !started.predictionId) {
              throw new Error(
                started.notice || "Live animation is paused for today. Please come back tomorrow."
              );
            }
            predictionId = started.predictionId;
            job.predictionIds[scene] = predictionId;
            saveClipJob(job);
          }
          const url = await pollPrediction(predictionId, 15 * 60 * 1000);
          job.clipUrls[scene] = url;
          saveClipJob(job);
          setClipUrls(orderedClipUrls(job));
        }
        failedScene = null;
        setClipPhase("done");
      } catch (err) {
        // A terminally failed prediction never changes state, so keeping
        // its id would make "Resume animating" re-poll a dead job forever.
        // Drop just that scene's id — finished scenes keep their URLs, so
        // the retry never re-renders (or re-bills) work already done.
        if (err instanceof PredictionFailedError && failedScene !== null) {
          delete job.predictionIds[failedScene];
          saveClipJob(job);
        }
        setClipError(
          err instanceof Error ? err.message : "Something went wrong animating the episode."
        );
        setClipPhase("error");
      } finally {
        clipRunActive.current = false;
        setClipWaitMsg(null);
      }
    },
    []
  );

  // Resume an in-flight (or finished) clip run after a reload / tab return.
  //
  // This has to stay in an effect: /create is prerendered, so seeding these
  // from sessionStorage in a lazy useState initializer would make the client's
  // first render disagree with the server HTML and blow up hydration. Reading
  // browser-only storage after mount and then syncing state is the intended
  // pattern; the cascading render it causes happens once, on resume only.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const job = loadClipJob();
    if (!job) return;
    const done = orderedClipUrls(job);
    setPetName(job.petName);
    setTheme(job.theme);
    setTier(job.tier);
    setStills(job.stills);
    setClipUrls(done);
    setStep(5);
    if (done.length === 3) {
      setClipPhase("done");
    } else {
      void runClipGeneration(job.stills, job.petName, job.theme, job.tier);
    }
  }, [runClipGeneration]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleApprovePreview = () => setStep(4);

  const handleRetryPreview = () => {
    setRetryUsed(true);
    setStep(2);
  };

  const handleConnectYoutube = async () => {
    setIsConnectingYoutube(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/connect-youtube", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { channelName?: string };
      if (!res.ok) throw new Error("Connect failed");
      setYoutubeConnected(true);
      setYoutubeChannelName(data.channelName || "Demo Channel");
    } catch {
      // Without this the button just quietly re-enabled and the user was
      // left guessing whether anything happened.
      setCheckoutError("We couldn't reach YouTube just then. Please try connecting again.");
    } finally {
      setIsConnectingYoutube(false);
    }
  };

  const handleFinishDemoCheckout = async () => {
    setIsFinishing(true);
    setCheckoutError(null);
    try {
      await fetch("/api/checkout", { method: "POST" });
      if (isLiveStillSet(stills)) {
        // Live mode: payment stays demo, but the clips are real.
        clearClipJob();
        setClipUrls([]);
        setStep(5);
        void runClipGeneration(stills, petName, theme, tier);
        return;
      }
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
          tier,
          charity,
          calmMode,
          pack: hasSecondPet && packAdventure,
          secondPet: hasSecondPet ? { name: pet2Name, breed: pet2Breed, details: pet2Details } : null,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        etaMinutes?: number;
        sampleYoutubeVideoId?: string;
      };
      setConfirmEta(data.etaMinutes ?? 15);
      setConfirmVideoId(data.sampleYoutubeVideoId || "PIcIfIdC1kA");
      setStep(5);
    } catch {
      setCheckoutError(
        "Something went wrong finishing your order. Nothing was charged — please try again."
      );
    } finally {
      setIsFinishing(false);
    }
  };

  const handleCopyLink = async () => {
    // The old value pointed at /watch/<slug>, which is not a route on this
    // deployment — the "Link copied!" toast handed the user a 404. Share a
    // link that actually resolves: the finished clip in live mode, the
    // sample episode in demo mode.
    const url = clipUrls[0] ?? `https://www.youtube.com/watch?v=${confirmVideoId}`;
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
    setTier(DEFAULT_TIER_ID);
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
    setCheckoutError(null);
    clearClipJob();
    setClipPhase("none");
    setClipUrls([]);
    setClipScene(0);
    setClipError(null);
    setClipWaitMsg(null);
    setLiveNotice(null);
    setPreviewError(null);
    setPreviewProgress(null);
    setPreviewWaitMsg(null);
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
            {/* eslint-disable-next-line @next/next/no-img-element -- small static brand asset */}
            <img src="/brand/toontails-icon.png" alt="" width={22} height={22} style={{ borderRadius: 6 }} />
            <span className="font-bold text-lg" style={{ color: "#1D1D1F" }}>ToonTails</span>
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
                        color: isComplete || isActive ? "#FFFFFF" : "#52525B",
                      }}
                    >
                      {isComplete ? <Check className="w-4 h-4" /> : idx}
                    </div>
                    <span
                      className="text-sm hidden md:inline"
                      style={{ color: isActive ? "#1D1D1F" : "#6E6E73", fontWeight: isActive ? 600 : 400 }}
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
              <label htmlFor="pet-name" className="block font-semibold mb-2" style={{ fontSize: "16px", color: "#1D1D1F" }}>
                Dog&apos;s name
              </label>
              <input
                id="pet-name"
                name="petName"
                autoComplete="off"
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
              <label htmlFor="pet-breed" className="block font-semibold mb-2" style={{ fontSize: "16px", color: "#1D1D1F" }}>
                Breed (or your best guess)
              </label>
              <input
                id="pet-breed"
                name="breed"
                autoComplete="off"
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
              <label htmlFor="pet-details" className="block font-semibold mb-2" style={{ fontSize: "16px", color: "#1D1D1F" }}>
                Anything the AI should get right?
              </label>
              <p id="pet-details-hint" className="text-sm mb-3" style={{ color: "#6E6E73" }}>
                e.g. &ldquo;very short stubby tail&rdquo; or &ldquo;white patch over one eye&rdquo;
              </p>
              <textarea
                id="pet-details"
                name="details"
                aria-describedby="pet-details-hint"
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
                  <label htmlFor="pet2-name" className="block font-semibold mb-2" style={{ fontSize: "15px", color: "#1D1D1F" }}>
                    Second dog&apos;s name
                  </label>
                  <input
                    id="pet2-name"
                    name="pet2Name"
                    autoComplete="off"
                    type="text"
                    value={pet2Name}
                    onChange={(e) => setPet2Name(e.target.value)}
                    placeholder="Luna, Max…"
                    className="w-full rounded-xl px-4 py-3 outline-none border-2"
                    style={{ fontSize: "16px", background: "#FFFFFF", borderColor: "#E5E5E5", color: "#1D1D1F" }}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="pet2-breed" className="block font-semibold mb-2" style={{ fontSize: "15px", color: "#1D1D1F" }}>
                    Second dog&apos;s breed
                  </label>
                  <input
                    id="pet2-breed"
                    name="pet2Breed"
                    autoComplete="off"
                    type="text"
                    value={pet2Breed}
                    onChange={(e) => setPet2Breed(e.target.value)}
                    placeholder="Lab mix, not sure…"
                    className="w-full rounded-xl px-4 py-3 outline-none border-2"
                    style={{ fontSize: "16px", background: "#FFFFFF", borderColor: "#E5E5E5", color: "#1D1D1F" }}
                  />
                </div>
                <div>
                  <label htmlFor="pet2-details" className="block font-semibold mb-2" style={{ fontSize: "15px", color: "#1D1D1F" }}>
                    Anything the AI should get right about them?
                  </label>
                  <textarea
                    id="pet2-details"
                    name="pet2Details"
                    value={pet2Details}
                    onChange={(e) => setPet2Details(e.target.value)}
                    rows={2}
                    placeholder="Optional"
                    className="w-full rounded-xl px-4 py-3 outline-none border-2"
                    style={{ fontSize: "15px", background: "#FFFFFF", borderColor: "#E5E5E5", color: "#1D1D1F", resize: "vertical" }}
                  />
                </div>
                <p className="text-xs mt-3" style={{ color: "#6E6E73" }}>Up to 2 pets for now.</p>
              </div>
            )}

            {/* These head groups of buttons, not single form controls, so they
                are <div>s labelling the radiogroup via aria-labelledby rather
                than <label>s pointing at nothing. */}
            <div className="mb-8">
              <div id="theme-label" className="block font-semibold mb-3" style={{ fontSize: "16px", color: "#1D1D1F" }}>
                Pick an adventure
              </div>
              <ThemePicker selected={theme} onSelect={setTheme} labelledBy="theme-label" />
            </div>

            <div className="mb-8">
              <div id="occasion-label" className="block font-semibold mb-1" style={{ fontSize: "16px", color: "#1D1D1F" }}>
                Special occasion? <span style={{ fontWeight: 400, color: "#6E6E73" }}>(optional)</span>
              </div>
              <p className="text-sm mb-3" style={{ color: "#6E6E73" }}>We&apos;ll work it into the adventure.</p>
              <OccasionPicker selected={occasion} onSelect={setOccasion} labelledBy="occasion-label" />
            </div>

            <div className="mb-8">
              <div id="tier-label" className="block font-semibold mb-1" style={{ fontSize: "16px", color: "#1D1D1F" }}>
                Choose your quality tier
              </div>
              <p className="text-sm mb-3" style={{ color: "#6E6E73" }}>
                Every tier keeps your dog&apos;s exact look — this only changes how smooth the animation is.
              </p>
              <TierPicker selected={tier} onSelect={setTier} labelledBy="tier-label" />
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
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl overflow-hidden border aspect-square relative"
                      style={{ borderColor: "#E5E5E5", background: "#F5F5F5" }}
                    >
                      {stills[i] ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={stills[i]}
                          alt={`${displayName}'s cartoon scene ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          <span className="text-3xl paw-bounce">🐾</span>
                          <span className="text-xs" style={{ color: "#6E6E73" }}>
                            Scene {i + 1}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: "#6E6E73" }} />
                  <p style={{ color: "#6E6E73" }}>
                    {previewProgress ?? `Generating ${displayName}'s cartoon scenes…`}
                  </p>
                  {previewWaitMsg && (
                    <p className="text-sm mt-2" style={{ color: "#6E6E73" }}>
                      {previewWaitMsg}
                    </p>
                  )}
                </div>
              </div>
            ) : previewError ? (
              <div
                className="rounded-2xl p-8 border text-center"
                style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}
              >
                <p className="font-semibold mb-2" style={{ color: "#1D1D1F" }}>
                  The studio hit a snag
                </p>
                <p className="text-sm mb-6" style={{ color: "#6E6E73" }}>
                  {previewError}
                </p>
                <button
                  onClick={goToPreview}
                  className="btn-large rounded-2xl px-10"
                  style={{ background: "#1D1D1F", color: "#FFFFFF" }}
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {liveNotice && (
                  <div
                    className="rounded-2xl p-4 mb-6 border text-sm"
                    style={{ background: "#FFF7ED", borderColor: "#FED7AA", color: "#9A3412" }}
                  >
                    {liveNotice}
                  </div>
                )}
                <PreviewGate
                  stills={stills}
                  petName={petName}
                  onApprove={handleApprovePreview}
                  onRetry={handleRetryPreview}
                  retryUsed={retryUsed}
                />
              </>
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
                <div className="flex justify-between">
                  <span style={{ color: "#6E6E73" }}>Quality</span>
                  <span className="font-medium" style={{ color: "#1D1D1F" }}>{selectedQualityTier.name}</span>
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

            {checkoutError && (
              <div
                role="alert"
                className="rounded-2xl p-4 mb-6 border text-sm"
                style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#B91C1C" }}
              >
                {checkoutError}
              </div>
            )}

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

        {step === 5 && clipPhase !== "none" && (
          <div className="max-w-2xl mx-auto">
            {clipPhase === "generating" && (
              <div className="text-center">
                <h1
                  className="font-bold mb-3"
                  style={{ fontSize: "clamp(28px,5vw,38px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
                >
                  Animating {displayName}&apos;s episode
                </h1>
                <p className="mb-8" style={{ fontSize: "17px", color: "#6E6E73", lineHeight: 1.6 }}>
                  Each scene takes about 3–6 minutes to animate. You can leave this page —
                  we&apos;ll pick up right where you left off when you come back.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl overflow-hidden border relative aspect-video"
                      style={{ borderColor: "#E5E5E5", background: "#F5F5F5" }}
                    >
                      {stills[i] && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={stills[i]}
                          alt={`Scene ${i + 1}`}
                          className="w-full h-full object-cover"
                          style={{ opacity: i < clipUrls.length ? 1 : 0.45 }}
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {i < clipUrls.length ? (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: "#10B981" }}
                          >
                            <Check className="w-5 h-5" style={{ color: "#FFFFFF" }} />
                          </div>
                        ) : i === clipScene ? (
                          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#1D1D1F" }} />
                        ) : (
                          <span className="text-xs font-semibold" style={{ color: "#6E6E73" }}>
                            Waiting
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm" style={{ color: "#6E6E73" }}>
                  {clipWaitMsg ?? `Animating scene ${Math.min(clipScene, 2) + 1} of 3…`}
                </p>
              </div>
            )}

            {clipPhase === "error" && (
              <div>
                <div
                  role="alert"
                  className="rounded-2xl p-8 border text-center mb-8"
                  style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}
                >
                  <p className="font-semibold mb-2" style={{ color: "#1D1D1F" }}>
                    The animation hit a snag
                  </p>
                  <p className="text-sm mb-2" style={{ color: "#6E6E73" }}>
                    {clipError}
                  </p>
                  <p className="text-sm mb-6" style={{ color: "#6E6E73" }}>
                    {clipUrls.length > 0
                      ? `Scene${clipUrls.length > 1 ? "s" : ""} ${clipUrls
                          .map((_, i) => i + 1)
                          .join(" and ")} finished and ${
                          clipUrls.length > 1 ? "are" : "is"
                        } safe — picking up again only redoes what's left.`
                      : "Nothing has been charged. Picking up again starts fresh."}
                  </p>
                  <button
                    onClick={() => void runClipGeneration(stills, petName, theme, tier)}
                    className="btn-large rounded-2xl px-10"
                    style={{ background: "#1D1D1F", color: "#FFFFFF" }}
                  >
                    Resume animating
                  </button>
                </div>

                {/* Don't strand the finished scenes behind the error — the
                    URLs expire in about an hour, so show them right away. */}
                {clipUrls.length > 0 && (
                  <div>
                    <p className="text-sm mb-3 text-center" style={{ color: "#6E6E73" }}>
                      What&apos;s ready so far:
                    </p>
                    <EpisodePlayer clips={clipUrls} petName={displayName} />
                  </div>
                )}
              </div>
            )}

            {clipPhase === "done" && (
              <div>
                <div className="text-center mb-8">
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
                    {displayName}&apos;s episode is ready
                  </h1>
                  <p style={{ fontSize: "17px", color: "#6E6E73", lineHeight: 1.6 }}>
                    Three scenes playing on a loop, just like on the TV. Your channel version
                    arrives as one continuous video.
                  </p>
                </div>

                <EpisodePlayer clips={clipUrls} petName={displayName} />

                <p className="text-sm mt-4 text-center" style={{ color: "#6E6E73" }}>
                  Download links stay fresh for about an hour — save your favorite scenes now.
                </p>

                {/* Parity with the demo confirmation: sharing and the poster
                    offer were previously only reachable in demo mode. */}
                <div className="rounded-2xl p-6 mt-8 border text-left" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
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

                <div className="mt-6 text-left">
                  <PosterCard petName={displayName} />
                </div>

                <p className="text-sm font-medium mt-8 mb-1 text-center" style={{ color: "#F97316" }}>
                  🐾 Thank you — part of every real order goes to a dog rescue.
                </p>
                <p className="text-sm text-center mb-8">
                  <Link href="/impact" style={{ color: "#6E6E73" }}>
                    See the public impact ledger →
                  </Link>
                </p>

                <div className="text-center">
                  <button
                    onClick={resetFlow}
                    className="btn-large rounded-2xl px-10"
                    style={{ background: "#1D1D1F", color: "#FFFFFF" }}
                  >
                    Create another episode
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 5 && clipPhase === "none" && (
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
              {confirmEta} minutes. Here&apos;s a sample of what a finished ToonTails episode looks like:
            </p>

            <YouTubeEmbed videoId={confirmVideoId} title={`${displayName}'s sample episode`} />

            {authConfigured && (
              <div className="rounded-2xl p-6 mt-8 mb-6 border text-left" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
                {authUser ? (
                  <>
                    <h3 className="font-semibold mb-2" style={{ color: "#1D1D1F" }}>
                      Signed in as {authUser.email}
                    </h3>
                    <p className="text-sm" style={{ color: "#6E6E73", lineHeight: 1.6 }}>
                      Your episodes will publish to this account&apos;s YouTube channel (coming soon).
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold mb-2" style={{ color: "#1D1D1F" }}>
                      Want future episodes on your own channel?
                    </h3>
                    <p className="text-sm mb-4" style={{ color: "#6E6E73", lineHeight: 1.6 }}>
                      Sign in with Google and we&apos;ll remember your account for when auto-publishing
                      goes live.
                    </p>
                    <GoogleSignInButton callbackUrl="/create" label="Sign in with Google" />
                  </>
                )}
              </div>
            )}

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
