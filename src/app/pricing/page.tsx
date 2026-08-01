import Link from "next/link";
import { Check, Heart } from "lucide-react";
import SimpleNav from "@/components/SimpleNav";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { PRICING_TIERS } from "@/lib/pricing";

/** Kept alongside PRICING_TIERS so the copy stays in one place. */
const CARD_ART = [
  { src: "/demo/still-2.jpg", alt: "Cartoon of Dutch trotting through a park with a stick" },
  { src: "/demo/birthday.jpg", alt: "Cartoon of Dutch in a party hat beside a birthday cake" },
  { src: "/demo/crossover.jpg", alt: "Cartoon of Dutch playing tug-of-war with a golden retriever" },
];

/** Index 1 (the three-pack) is the one most people land on. */
const MOST_LOVED = 1;

export default function PricingPage() {
  return (
    <div className="min-h-screen warm-page">
      <SimpleNav />

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <span className="chip mb-6">
          <Heart className="w-4 h-4" />
          Every plan feeds a rescue
        </span>
        <h1
          className="font-bold mb-5"
          style={{ fontSize: "clamp(32px, 6vw, 56px)", letterSpacing: "-0.03em", lineHeight: 1.06, color: "#1D1D1F" }}
        >
          Your dog&apos;s story.
          <br />
          Your TV. <span style={{ color: "#C2410C" }}>Your rescue.</span>
        </h1>
        <p className="text-xl mx-auto leading-relaxed" style={{ color: "#6B625B", maxWidth: "540px" }}>
          Pay once, and see the preview first. Part of every plan goes straight to dog rescues.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
          {PRICING_TIERS.map((tier, i) => {
            const featured = i === MOST_LOVED;
            return (
              <Reveal key={tier.id} delay={i * 0.08} className="h-full">
                <div
                  className={`${featured ? "card-warm" : "card-tint"} card-lift p-0 h-full flex flex-col overflow-hidden`}
                  style={featured ? { borderColor: "#F97316", borderWidth: "2px" } : undefined}
                >
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element -- static demo art */}
                    <img
                      src={CARD_ART[i].src}
                      alt={CARD_ART[i].alt}
                      loading="lazy"
                      className="w-full object-cover"
                      style={{ display: "block", aspectRatio: "16 / 9" }}
                    />
                    {featured && (
                      <span className="badge-loved absolute top-3 left-3">Most loved</span>
                    )}
                  </div>

                  <div className="p-7 flex flex-col flex-1">
                    <div
                      className="text-xs font-semibold uppercase mb-3"
                      style={{ color: "#C2410C", letterSpacing: "0.08em" }}
                    >
                      {tier.tagline}
                    </div>
                    <div
                      className="font-bold mb-1"
                      style={{ fontSize: "42px", letterSpacing: "-0.02em", color: "#1D1D1F" }}
                    >
                      {tier.price}
                    </div>
                    <div className="font-semibold mb-4" style={{ fontSize: "18px", color: "#1D1D1F" }}>
                      {tier.name}
                    </div>
                    <p className="text-sm mb-6 leading-relaxed" style={{ color: "#6B625B" }}>
                      {tier.desc}
                    </p>
                    <div className="space-y-3 mb-8 flex-1">
                      {tier.features.map((f) => (
                        <div key={f} className="flex items-start gap-2 text-sm">
                          <Check
                            className="w-4 h-4 flex-shrink-0"
                            style={{ color: "#047857", marginTop: "3px" }}
                          />
                          <span style={{ color: "#6B625B" }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/create"
                      className={`btn-pill btn-soft btn-block ${featured ? "btn-sun" : "btn-ink"}`}
                    >
                      Get started
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="card-warm p-8 mt-10 max-w-2xl mx-auto">
            <h2 className="font-bold mb-3" style={{ fontSize: "20px", color: "#1D1D1F" }}>
              One more choice, and it&apos;s an easy one
            </h2>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "#6B625B" }}>
              In the create flow you also pick how smooth the animation should be. Your dog looks
              exactly the same either way — this only changes the motion.
            </p>
            <div className="space-y-3">
              <div className="card-tint p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold" style={{ fontSize: "16px", color: "#1D1D1F" }}>
                    Good — $2.99
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: "#6B625B" }}>
                    Lively, with a few small rough edges.
                  </p>
                </div>
              </div>
              <div
                className="card-tint p-4 flex items-center justify-between gap-4"
                style={{ borderColor: "#F97316", borderWidth: "2px" }}
              >
                <div>
                  <div className="font-semibold" style={{ fontSize: "16px", color: "#1D1D1F" }}>
                    Great — included in the prices above
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: "#6B625B" }}>
                    Our signature quality. This is what almost everyone picks.
                  </p>
                </div>
                <span className="badge-loved flex-shrink-0">Most loved</span>
              </div>
              <div className="card-tint p-4 flex items-center justify-between gap-4 opacity-80">
                <div>
                  <div className="font-semibold" style={{ fontSize: "16px", color: "#1D1D1F" }}>
                    Deluxe — coming soon
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: "#6B625B" }}>
                    Cinema-grade, with sound.
                  </p>
                </div>
                <span className="chip chip-quiet chip-sm uppercase flex-shrink-0">Soon</span>
              </div>
            </div>
            <p className="text-sm mt-5 leading-relaxed" style={{ color: "#6B625B" }}>
              The rescue pledge is flat and guaranteed on every plan — $1.00 for a single episode,
              $2.50 for the three-pack, $5.00 for the season — no matter which motion quality you pick.
            </p>
          </div>
        </Reveal>

        <p className="text-center text-sm mt-8" style={{ color: "#6B625B" }}>
          Thirty-day refund, no questions asked. Every plan lets you see the cartoon before you pay.
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
