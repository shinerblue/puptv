/**
 * Server-side Replicate helpers for ToonTails live generation.
 *
 * Live mode is env-gated: it requires REPLICATE_API_TOKEN and can be
 * force-disabled with PUPTV_LIVE=off. Without a token, every API route
 * falls back to the original demo-mode behavior (which is also what a
 * plain local `next build` exercises — zero required env vars).
 *
 * Prompts, model choices, and model inputs deliberately mirror the
 * proven reference pipeline in pipeline/puptv_pipeline_test.py. Do not
 * tweak them here without re-validating with that script offline first.
 *
 * This module is server-only. Never import it from client components —
 * the token must never reach the browser.
 */

const REPLICATE_API = "https://api.replicate.com/v1";

/** Used for every quality tier — only the animation model varies (see lib/tiers.ts). */
export const STILL_MODEL = "google/nano-banana-pro";
/**
 * Default/reference animation model (the "Great" tier). Quality-tier
 * selection is authoritative in lib/tiers.ts (videoModelForTier) — this
 * constant is kept only as the historical default and is no longer read
 * directly by /api/generate-video.
 */
export const VIDEO_MODEL = "kwaivgi/kling-v2.5-turbo-pro";

/** Scene descriptions per theme — copied verbatim from the reference pipeline. */
export const THEME_SCENES: Record<string, readonly [string, string, string]> = {
  park: [
    "joyfully chasing a colorful butterfly across a sunny green meadow with wildflowers",
    "happily running through a park carrying a big stick, tail wagging, golden afternoon light",
    "peacefully napping under a large oak tree, soft dappled sunlight, a ladybug on a leaf nearby",
  ],
  beach: [
    "bounding through gentle surf on a sunny beach, splashing sparkling water",
    "digging an enormous hole in golden sand next to a sandcastle, seagulls overhead",
    "relaxing on a beach towel under an umbrella wearing sunglasses, calm turquoise waves",
  ],
  space: [
    "floating happily in a colorful spaceship cockpit wearing a tiny astronaut helmet",
    "bouncing in low gravity on a purple alien planet chasing a glowing space ball",
    "gazing out a spaceship window at Earth and twinkling stars, cozy and calm",
  ],
  mountain: [
    "hiking up a scenic mountain trail with a tiny backpack, snowcapped peaks behind",
    "playing in fresh snow, catching snowflakes on its tongue, pine trees around",
    "sitting at a summit at sunset overlooking a golden valley, wind in its fur",
  ],
  city: [
    "trotting proudly down a colorful city sidewalk past cafes and flower stands",
    "catching a frisbee in a lively city park with a skyline in the background",
    "riding in a little red wagon through a farmers market, sniffing the air happily",
  ],
};

/** Kling negative prompt — from the reference pipeline, plus "long tail"
 *  (the fix that produced the verified breed-correct Dutch renders). */
export const VIDEO_NEGATIVE_PROMPT =
  "distortion, morphing, extra limbs, extra tails, long tail, text, watermark, " +
  "flickering, jump cuts, scary, dark";

const IDENTITY_PROMPT =
  "Using the attached reference photos of this exact real dog, create a Pixar-style 3D " +
  "animated cartoon version of the SAME dog — keep its exact fur colors, markings, ear shape, " +
  "face structure, eye color, and body proportions so its owner instantly recognizes it. ";

const CHAINED_PROMPT =
  "Using the attached reference photos AND the attached cartoon still of the same dog, " +
  "render the IDENTICAL cartoon character (same design, same proportions, same colors) ";

const STYLE_SUFFIX =
  " Bright cheerful colors, soft lighting, high-quality 3D animation film still, " +
  "16:9 wide shot, no text, no watermark.";

/** True when this deployment should call Replicate for real. */
export function isLiveEnabled(): boolean {
  return Boolean(process.env.REPLICATE_API_TOKEN) && process.env.PUPTV_LIVE !== "off";
}

export function sceneDescription(theme: string, sceneIndex: number): string {
  const scenes = THEME_SCENES[theme] ?? THEME_SCENES.park;
  return scenes[sceneIndex] ?? scenes[0];
}

/** Identity-preserving still prompt, exactly like the reference script. */
export function buildStillPrompt(opts: {
  petName: string;
  details: string;
  theme: string;
  sceneIndex: number;
}): string {
  const { petName, details, theme, sceneIndex } = opts;
  const scene = sceneDescription(theme, sceneIndex);
  let lead: string;
  if (sceneIndex === 0) {
    lead = IDENTITY_PROMPT;
    if (details) {
      lead += `IMPORTANT breed/appearance details the owner specified — follow them exactly: ${details}. `;
    }
  } else {
    lead = CHAINED_PROMPT;
  }
  return `${lead}The cartoon dog named ${petName} is ${scene}.${STYLE_SUFFIX}`;
}

/** Kling image-to-video prompt, exactly like the reference script. */
export function buildVideoPrompt(petName: string, theme: string, sceneIndex: number): string {
  const scene = sceneDescription(theme, sceneIndex);
  return (
    `The Pixar-style cartoon dog ${petName} ${scene}. Smooth, gentle, natural animation. ` +
    "Calm cheerful mood, subtle camera movement, seamless motion, consistent character design."
  );
}

export class ReplicateHttpError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ReplicateHttpError";
  }
}

interface PredictionCreated {
  id: string;
  status: string;
}

/**
 * Create a prediction (fire-and-forget — no Prefer: wait, no blocking).
 * Throws ReplicateHttpError(429) when the account's concurrency limit is
 * hit so routes can surface a friendly retry-after to the client.
 */
export async function createPrediction(
  model: string,
  input: Record<string, unknown>
): Promise<PredictionCreated> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new ReplicateHttpError(503, "Live generation is not configured.");
  const res = await fetch(`${REPLICATE_API}/models/${model}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input }),
    cache: "no-store",
  });
  if (res.status === 429) {
    throw new ReplicateHttpError(429, "The rendering service is at capacity.");
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`[replicate] create ${model} failed: HTTP ${res.status} ${detail.slice(0, 400)}`);
    throw new ReplicateHttpError(502, "The rendering service returned an error.");
  }
  const data = (await res.json()) as Partial<PredictionCreated>;
  if (!data.id) {
    throw new ReplicateHttpError(502, "The rendering service returned an unexpected response.");
  }
  return { id: data.id, status: data.status ?? "starting" };
}

export interface PredictionStatus {
  status: string;
  output: string | null;
  error: string | null;
}

/** Fetch prediction state; output normalized to a single URL (or null). */
export async function getPrediction(id: string): Promise<PredictionStatus> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new ReplicateHttpError(503, "Live generation is not configured.");
  const res = await fetch(`${REPLICATE_API}/predictions/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 404) throw new ReplicateHttpError(404, "Unknown prediction id.");
  if (res.status === 429) throw new ReplicateHttpError(429, "The rendering service is at capacity.");
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`[replicate] status ${id} failed: HTTP ${res.status} ${detail.slice(0, 400)}`);
    throw new ReplicateHttpError(502, "The rendering service returned an error.");
  }
  const data = (await res.json()) as { status?: string; output?: unknown; error?: unknown };
  let output: string | null = null;
  if (typeof data.output === "string") {
    output = data.output;
  } else if (Array.isArray(data.output) && typeof data.output[0] === "string") {
    output = data.output[0];
  }
  return {
    status: data.status ?? "unknown",
    output,
    error: data.error == null ? null : String(data.error),
  };
}

/**
 * Only accept generated-output URLs we handed out ourselves (Replicate's
 * CDN) when the client echoes one back as a chain reference or start image.
 */
export function isAllowedOutputUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    return url.hostname === "replicate.delivery" || url.hostname.endsWith(".replicate.delivery");
  } catch {
    return false;
  }
}
