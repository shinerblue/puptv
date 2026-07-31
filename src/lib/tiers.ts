/**
 * Quality tiers for live video generation — customer-facing "Good / Great /
 * Deluxe" picker on the create flow's details step.
 *
 * Stills are google/nano-banana-pro for every tier (see lib/replicate.ts,
 * STILL_MODEL) — only the animation (video) model varies by tier. The
 * client sends a tier id, never a model string; /api/generate-video looks
 * the model up itself via videoModelForTier() below so a tampered request
 * can never choose an arbitrary Replicate model server-side.
 */

export type TierId = "budget" | "standard" | "premium";

export interface QualityTier {
  id: TierId;
  /** Customer-facing tier name (not "budget/standard/premium"). */
  name: string;
  price: string;
  priceValue: number;
  /** One honest line shown on the picker card. */
  description: string;
  /** Replicate model slug used for the animation step for this tier. */
  videoModel: string;
  /** False for tiers not yet purchasable (shown, but disabled, in the UI). */
  selectable: boolean;
}

export const QUALITY_TIERS: QualityTier[] = [
  {
    id: "budget",
    name: "Good",
    price: "$2.99",
    priceValue: 2.99,
    description: "Lively animation, small rough edges",
    // PLACEHOLDER pending the budget-model bake-off (Wan vs Hailuo vs Kling —
    // see task #20). One-line swappable: change only this string once that
    // task confirms a winner, nothing else in the app needs to change.
    videoModel: "kwaivgi/kling-v2.1",
    selectable: true,
  },
  {
    id: "standard",
    name: "Great",
    price: "$4.99",
    priceValue: 4.99,
    description: "Our signature quality",
    videoModel: "kwaivgi/kling-v2.5-turbo-pro",
    selectable: true,
  },
  {
    id: "premium",
    name: "Deluxe",
    price: "$14.99",
    priceValue: 14.99,
    description: "Cinema-grade with sound — coming soon",
    videoModel: "google/veo-3.1-fast",
    selectable: false,
  },
];

export const DEFAULT_TIER_ID: TierId = "standard";

export function isValidTierId(value: unknown): value is TierId {
  return value === "budget" || value === "standard" || value === "premium";
}

export function tierById(tierId: unknown): QualityTier {
  const fallback = QUALITY_TIERS.find((t) => t.id === DEFAULT_TIER_ID)!;
  if (!isValidTierId(tierId)) return fallback;
  const found = QUALITY_TIERS.find((t) => t.id === tierId);
  // A tier that exists but isn't selectable (premium, today) still can't be
  // chosen just because the id is well-formed — fall back to the default.
  if (!found || !found.selectable) return fallback;
  return found;
}

/**
 * Server-side tier -> video model lookup. This is the ONLY thing
 * /api/generate-video trusts to pick a model — never a client-supplied
 * model string, which would let a tampered request run arbitrary
 * (and arbitrarily expensive) Replicate models on our account.
 */
export function videoModelForTier(tierId: unknown): string {
  return tierById(tierId).videoModel;
}
