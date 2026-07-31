import { NextResponse } from "next/server";

/**
 * DEMO MODE STUB.
 *
 * Stripe is not wired up. This route exists so the create flow has a
 * real request to make from the checkout step, without any payment
 * provider credentials or runtime dependency. No charge is created.
 */
export async function POST() {
  return NextResponse.json({
    success: true,
    demo: true,
    charged: false,
    message: "Demo mode: no payment was processed. Stripe checkout is not connected yet.",
  });
}
