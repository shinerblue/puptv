/**
 * Best-effort in-memory abuse guard for live generation.
 *
 * Serverless caveat: each warm lambda instance keeps its own counters,
 * so these caps are approximate (bursts across cold starts can exceed
 * them). That is acceptable — the goal is to stop casual abuse of the
 * paid Replicate token, not to be a billing-grade quota system.
 */

const RUNS_PER_IP_PER_DAY = 3; // one "run" = one preview generation (starts at scene 0)
const CLIPS_PER_IP_PER_DAY = 9; // 3 runs x 3 clips
const GLOBAL_RUNS_PER_DAY = 20; // soft cap across all visitors
const MAX_TRACKED_IPS = 1000;

interface IpBucket {
  day: string;
  runs: number;
  clips: number;
}

const ipBuckets = new Map<string, IpBucket>();
let globalBucket: { day: string; runs: number } = { day: "", runs: 0 };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function bucketFor(ip: string): IpBucket {
  const day = today();
  let bucket = ipBuckets.get(ip);
  if (!bucket || bucket.day !== day) {
    if (ipBuckets.size >= MAX_TRACKED_IPS) ipBuckets.clear();
    bucket = { day, runs: 0, clips: 0 };
    ipBuckets.set(ip, bucket);
  }
  return bucket;
}

export type GateResult = { allowed: true } | { allowed: false; reason: "ip-daily" | "global-daily" };

/** Consume one preview run (called for sceneIndex 0 only). */
export function takeRun(ip: string): GateResult {
  const day = today();
  if (globalBucket.day !== day) globalBucket = { day, runs: 0 };
  const bucket = bucketFor(ip);
  if (bucket.runs >= RUNS_PER_IP_PER_DAY) return { allowed: false, reason: "ip-daily" };
  if (globalBucket.runs >= GLOBAL_RUNS_PER_DAY) return { allowed: false, reason: "global-daily" };
  bucket.runs += 1;
  globalBucket.runs += 1;
  return { allowed: true };
}

/** Consume one video-clip generation. */
export function takeClip(ip: string): GateResult {
  const bucket = bucketFor(ip);
  if (bucket.clips >= CLIPS_PER_IP_PER_DAY) return { allowed: false, reason: "ip-daily" };
  bucket.clips += 1;
  return { allowed: true };
}

/**
 * Refund one preview run that was charged by takeRun() but didn't actually
 * produce anything for the user. Two call sites:
 *
 *  1. /api/cartoonify's catch block — a scene-0 prediction CREATION
 *     failure (402 insufficient credit, 5xx, network error). Unconditionally
 *     safe to refund: the run never started.
 *  2. /api/refund-run — a scene-0 prediction that WAS created but later
 *     resolved to a terminal Replicate status ("failed"/"canceled"). That
 *     route re-verifies the prediction's status against Replicate before
 *     calling this, so a client can't fabricate a prediction id to farm
 *     free runs.
 *
 * Only touches TODAY's bucket (via a plain get, not bucketFor's
 * create-if-missing) — a bucket from a previous day, or one evicted by
 * MAX_TRACKED_IPS, simply has nothing to refund. That's fine: the goal is
 * "don't lock a user out over our own failure," not billing-grade accounting.
 */
export function refundRun(ip: string): void {
  const day = today();
  const bucket = ipBuckets.get(ip);
  if (bucket && bucket.day === day && bucket.runs > 0) bucket.runs -= 1;
  if (globalBucket.day === day && globalBucket.runs > 0) globalBucket.runs -= 1;
}

/** Client IP as seen through Vercel's proxy headers. */
export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0];
    if (first && first.trim()) return first.trim();
  }
  const real = headers.get("x-real-ip");
  return real && real.trim() ? real.trim() : "unknown";
}
