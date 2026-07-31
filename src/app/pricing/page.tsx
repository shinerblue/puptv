import Link from "next/link";
import { Check } from "lucide-react";
import SimpleNav from "@/components/SimpleNav";
import SiteFooter from "@/components/SiteFooter";
import { PRICING_TIERS } from "@/lib/pricing";

export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      <SimpleNav />

      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1
          className="font-bold mb-5"
          style={{ fontSize: "clamp(32px, 6vw, 56px)", letterSpacing: "-0.03em", lineHeight: 1.08, color: "#1D1D1F" }}
        >
          Your dog&apos;s story.
          <br />
          Your TV. Your rescue.
        </h1>
        <p className="text-xl mx-auto leading-relaxed" style={{ color: "#6E6E73", maxWidth: "560px" }}>
          Pay once, see the preview first. Every plan sends part of what you pay straight to dog rescues.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier, i) => (
            <div
              key={tier.id}
              className="rounded-3xl p-8 border flex flex-col"
              style={{
                background: i === 2 ? "#1D1D1F" : "#FFFFFF",
                borderColor: i === 2 ? "#1D1D1F" : "#E5E5E5",
              }}
            >
              <div
                className="text-xs font-semibold uppercase mb-4"
                style={{ color: i === 2 ? "#F97316" : "#A1A1AA", letterSpacing: "0.08em" }}
              >
                {tier.tagline}
              </div>
              <div
                className="font-bold mb-1"
                style={{ fontSize: "40px", letterSpacing: "-0.02em", color: i === 2 ? "#FFFFFF" : "#1D1D1F" }}
              >
                {tier.price}
              </div>
              <div className="font-semibold mb-4" style={{ fontSize: "18px", color: i === 2 ? "#FFFFFF" : "#1D1D1F" }}>
                {tier.name}
              </div>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: i === 2 ? "#D4D4D4" : "#6E6E73" }}>
                {tier.desc}
              </p>
              <div className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#F97316", marginTop: "2px" }} />
                    <span style={{ color: i === 2 ? "#D4D4D4" : "#6E6E73" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/create"
                className="btn-large rounded-2xl text-center block"
                style={{ background: i === 2 ? "#F97316" : "#1D1D1F", color: "#FFFFFF" }}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm mt-10" style={{ color: "#A1A1AA" }}>
          Thirty-day refund, no questions. Every plan lets you preview the cartoon before you pay.
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
