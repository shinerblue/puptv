/**
 * Client-side helpers for the live generation flow on /create.
 *
 * All Replicate access goes through our own API routes — the token never
 * reaches the browser. Both generation routes answer in one of two shapes:
 *   demo:  { demo: true, stills?/etaMinutes?, notice? }   → keep demo behavior
 *   live:  { demo: false, predictionId }                  → poll /api/job-status
 */

import { DEFAULT_TIER_ID, isValidTierId, type TierId } from "@/lib/tiers";

export interface StartGenerationResponse {
  success?: boolean;
  demo?: boolean;
  stills?: string[];
  notice?: string;
  predictionId?: string;
  etaMinutes?: number;
  sampleYoutubeVideoId?: string;
  error?: string;
}

const RETRY_AFTER_MS = 45_000;
const MAX_START_RETRIES = 5;
const POLL_INTERVAL_MS = 5_000;

/**
 * Thrown when a prediction reached a terminal failure state on
 * Replicate (failed / canceled / succeeded-with-no-output).
 *
 * Callers must distinguish this from a timeout or a network blip:
 * a timed-out prediction is still worth re-polling on retry, but a
 * terminally failed one never changes, so its id has to be dropped
 * or "retry" would poll the same corpse forever.
 */
export class PredictionFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PredictionFailedError";
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * POST to a generation route. On HTTP 429 (the Replicate account allows
 * ~2 concurrent predictions) waits 45s and retries automatically, up to
 * 5 times, reporting the wait through onWaiting.
 */
export async function startGeneration(
  url: string,
  body: unknown,
  onWaiting?: (message: string | null) => void
): Promise<StartGenerationResponse> {
  for (let attempt = 0; ; attempt++) {
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      throw new Error("Network hiccup — check your connection and try again.");
    }
    if (res.status === 429 && attempt < MAX_START_RETRIES) {
      onWaiting?.("High demand right now — holding your spot, retrying in about 45 seconds…");
      await sleep(RETRY_AFTER_MS);
      onWaiting?.(null);
      continue;
    }
    const data = (await res.json().catch(() => ({}))) as StartGenerationResponse;
    if (!res.ok) {
      throw new Error(data.error || "The studio couldn't start this job. Please try again.");
    }
    return data;
  }
}

/**
 * Polls /api/job-status every 5s until the prediction finishes.
 * Resolves with the output URL; throws on failure or timeout. Tolerates
 * a few transient network/status errors before giving up.
 */
export async function pollPrediction(predictionId: string, timeoutMs: number): Promise<string> {
  const startedAt = Date.now();
  let consecutiveErrors = 0;
  for (;;) {
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error("This render is taking longer than expected. Please try again.");
    }
    await sleep(POLL_INTERVAL_MS);
    let res: Response | null = null;
    try {
      res = await fetch(`/api/job-status?id=${encodeURIComponent(predictionId)}`);
    } catch {
      res = null;
    }
    if (!res || !res.ok) {
      consecutiveErrors += 1;
      if (consecutiveErrors >= 5) {
        throw new Error("Lost contact with the render job. Please try again.");
      }
      continue;
    }
    consecutiveErrors = 0;
    const data = (await res.json().catch(() => null)) as {
      status?: string;
      output?: string | null;
      error?: string | null;
    } | null;
    if (!data) continue;
    if (data.status === "succeeded") {
      if (data.output) return data.output;
      throw new PredictionFailedError("The render finished without an output. Please try again.");
    }
    if (data.status === "failed" || data.status === "canceled") {
      throw new PredictionFailedError(data.error || "The render didn't finish. Please try again.");
    }
  }
}

/* ------------------------------------------------------------------ *
 *  sessionStorage persistence for the clip phase, so a 10-20 minute
 *  animation run survives the user leaving the tab / reloading.
 * ------------------------------------------------------------------ */

const CLIP_JOB_KEY = "toontails.clipJob.v1";

/**
 * Replicate output URLs (replicate.delivery) expire after ~1 hour, so a
 * resumed job older than this would restore a screen full of broken
 * images and dead video sources. Drop it instead and let the user start
 * over cleanly.
 */
const CLIP_JOB_MAX_AGE_MS = 60 * 60 * 1000;

export interface ClipJob {
  petName: string;
  theme: string;
  /** Quality tier chosen on the details step; server re-validates independently. */
  tier: TierId;
  stills: string[];
  predictionIds: Partial<Record<number, string>>;
  clipUrls: Partial<Record<number, string>>;
  /** epoch ms; jobs without one predate this field and are treated as stale */
  createdAt?: number;
}

export function loadClipJob(): ClipJob | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CLIP_JOB_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ClipJob;
    if (!Array.isArray(parsed.stills) || parsed.stills.length !== 3) return null;
    if (typeof parsed.petName !== "string" || typeof parsed.theme !== "string") return null;
    const createdAt = typeof parsed.createdAt === "number" ? parsed.createdAt : 0;
    if (Date.now() - createdAt > CLIP_JOB_MAX_AGE_MS) {
      clearClipJob();
      return null;
    }
    return {
      petName: parsed.petName,
      theme: parsed.theme,
      tier: isValidTierId(parsed.tier) ? parsed.tier : DEFAULT_TIER_ID,
      stills: parsed.stills,
      predictionIds: parsed.predictionIds ?? {},
      clipUrls: parsed.clipUrls ?? {},
      createdAt,
    };
  } catch {
    return null;
  }
}

export function saveClipJob(job: ClipJob): void {
  try {
    window.sessionStorage.setItem(CLIP_JOB_KEY, JSON.stringify(job));
  } catch {
    // best effort — private mode / quota issues just lose resumability
  }
}

export function clearClipJob(): void {
  try {
    window.sessionStorage.removeItem(CLIP_JOB_KEY);
  } catch {
    // best effort
  }
}

/** Completed clip URLs in scene order (generation is sequential). */
export function orderedClipUrls(job: ClipJob): string[] {
  const urls: string[] = [];
  for (let i = 0; i < 3; i++) {
    const url = job.clipUrls[i];
    if (!url) break;
    urls.push(url);
  }
  return urls;
}

/** True when the preview stills are real generated images (live mode). */
export function isLiveStillSet(stills: string[]): boolean {
  return stills.length === 3 && stills.every((s) => s.startsWith("https://"));
}
