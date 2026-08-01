import { NextRequest, NextResponse } from "next/server";
import { ReplicateHttpError, getPrediction, isLiveEnabled } from "@/lib/replicate";
import { clientIpFrom, refundRun } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const ID_PATTERN = /^[\w-]{8,64}$/;
const MAX_TRACKED_IDS = 2000;

/**
 * Refunds a single daily preview run when a scene-0 prediction that WE
 * created (and already charged via takeRun, see /api/cartoonify) later
 * resolved to a terminal Replicate failure — "failed" or "canceled" — as
 * opposed to a creation-time failure (402/5xx), which /api/cartoonify's
 * own catch block already refunds directly without a round trip here.
 *
 * Deliberately re-checks the prediction's status against Replicate itself
 * instead of trusting the client's word — otherwise any visitor could POST
 * a fabricated id here and refund unlimited runs. refundedIds below caps a
 * given prediction id to a single refund even across repeated calls.
 *
 * In-memory only, matching rateLimit.ts's abuse-guard tradeoffs: a cold
 * lambda start loses this set, so in the worst case a prediction could be
 * refunded twice across cold starts. Acceptable — the goal is "don't lock
 * a legitimate user out over our own failure," not a billing-grade ledger.
 */
const refundedIds = new Set<string>();

export async function POST(request: NextRequest) {
  if (!isLiveEnabled()) {
    return NextResponse.json({ error: "Live generation is not enabled." }, { status: 503 });
  }
  const body: Record<string, unknown> = await request.json().catch(() => ({}));
  const id = typeof body.predictionId === "string" ? body.predictionId : "";
  if (!id || !ID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Missing or invalid prediction id." }, { status: 400 });
  }
  if (refundedIds.has(id)) {
    return NextResponse.json({ refunded: false });
  }

  try {
    const prediction = await getPrediction(id);
    if (prediction.status !== "failed" && prediction.status !== "canceled") {
      return NextResponse.json({ refunded: false });
    }
  } catch (err) {
    if (err instanceof ReplicateHttpError && err.status === 404) {
      return NextResponse.json({ refunded: false });
    }
    return NextResponse.json({ error: "Couldn't verify that job." }, { status: 502 });
  }

  if (refundedIds.size >= MAX_TRACKED_IDS) refundedIds.clear();
  refundedIds.add(id);
  refundRun(clientIpFrom(request.headers));
  return NextResponse.json({ refunded: true });
}
