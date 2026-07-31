import SimpleNav from "@/components/SimpleNav";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { Heart, PawPrint } from "lucide-react";
import { LEDGER_STATS, LEDGER_ROWS, IMPACT_RECEIPT } from "@/lib/impact";

export default function ImpactPage() {
  return (
    <div className="min-h-screen warm-page">
      <SimpleNav />

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
        <span className="chip chip-quiet chip-sm uppercase mb-5">Sample data</span>
        <h1
          className="font-bold mb-5 mt-2"
          style={{ fontSize: "clamp(32px, 6vw, 52px)", letterSpacing: "-0.03em", lineHeight: 1.08, color: "#1D1D1F" }}
        >
          Where the money
          <br />
          <span style={{ color: "#C2410C" }}>actually goes</span>
        </h1>
        <p className="text-xl mx-auto leading-relaxed" style={{ color: "#6B625B", maxWidth: "560px" }}>
          Every ToonTails episode funds dog rescues. Not &ldquo;someday&rdquo; — right now, and in
          public. The numbers below are illustrative; the real ledger goes live with our first
          customers.
        </p>
      </section>

      {/* A face, not a spreadsheet: the point of the ledger is dogs. */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <Reveal>
          <div className="tile tile-hover">
            {/* eslint-disable-next-line @next/next/no-img-element -- static demo art */}
            <img
              src="/demo/still-3.jpg"
              alt="Cartoon of Dutch asleep against a mossy tree root, a ladybug resting on a leaf beside him"
              loading="lazy"
              style={{ aspectRatio: "21 / 9" }}
            />
          </div>
          <p className="text-sm mt-4 text-center" style={{ color: "#6B625B" }}>
            Somewhere behind every line in this ledger is a dog having a much better week.
          </p>
        </Reveal>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {LEDGER_STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} className="h-full">
              <div className="card-warm card-lift p-8 text-center h-full">
                <div
                  className="font-bold mb-2"
                  style={{ fontSize: "44px", color: "#C2410C", letterSpacing: "-0.02em" }}
                >
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: "#6B625B" }}>
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="paw-rule" aria-hidden="true">
          <span>🐾</span>
        </div>
      </div>

      <section className="max-w-3xl mx-auto px-6 pb-12">
        <Reveal>
          <div className="card-warm p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="icon-well icon-well-sm">
                <Heart className="w-5 h-5" style={{ color: "#C2410C" }} />
              </div>
              <h2 className="font-bold" style={{ fontSize: "23px", color: "#1D1D1F" }}>
                How the money moves
              </h2>
            </div>
            <table className="ledger-table mb-4">
              <thead>
                <tr>
                  <th>What you buy</th>
                  <th>Amount to rescue</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>One episode ($4.99)</td><td className="font-semibold">$1.00</td></tr>
                <tr><td>Three-pack ($9.99)</td><td className="font-semibold">$2.50</td></tr>
                <tr><td>Season ($19.99)</td><td className="font-semibold">$5.00</td></tr>
              </tbody>
            </table>
            <p className="text-sm leading-relaxed" style={{ color: "#6B625B" }}>
              Every week we post which rescues received funds. You see it. No mystery, no
              corporate vagueness.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-12">
        <Reveal>
          <div className="card-sky p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="icon-well icon-well-sm icon-well-sky">
                <PawPrint className="w-5 h-5" style={{ color: "#1D5A80" }} />
              </div>
              <h2 className="font-bold" style={{ fontSize: "23px", color: "#1D1D1F" }}>
                Against the content farm
              </h2>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#1D5A80" }}>
              YouTube is full of &ldquo;dog TV.&rdquo; Hours of it. Most of it comes from overseas
              operations filming random dogs they don&apos;t know, owned by no one in particular.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#1D5A80" }}>
              ToonTails is the opposite. The dog is yours. The money goes to rescues that are
              saving dogs today. That&apos;s the whole thing.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <Reveal>
          <h2 className="font-bold mb-2 text-center" style={{ fontSize: "26px", color: "#1D1D1F" }}>
            The ledger
          </h2>
          <p className="text-center text-sm mb-6" style={{ color: "#6B625B" }}>
            Seven entries, seven dogs, seven rescues that got paid.
          </p>
          {/* overflow-x, not overflow-hidden: the 5-column table was being
              clipped at 375px rather than scrolled. */}
          <div className="card-warm overflow-x-auto">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Dog</th>
                  <th>Order</th>
                  <th>Amount</th>
                  <th>Rescue funded</th>
                </tr>
              </thead>
              <tbody>
                {LEDGER_ROWS.map((row, i) => (
                  <tr key={i}>
                    <td>{row.date}</td>
                    <td className="font-semibold">{row.dog}</td>
                    <td>{row.order}</td>
                    <td className="font-mono font-semibold" style={{ color: "#047857" }}>{row.amount}</td>
                    <td>{row.rescue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      <section className="max-w-md mx-auto px-6 pb-24">
        <Reveal>
          <h2 className="font-bold mb-6 text-center" style={{ fontSize: "23px", color: "#1D1D1F" }}>
            What a thank-you looks like
          </h2>
          <div className="card-warm p-8 tilt-b">
            <span className="chip chip-quiet chip-sm uppercase mb-5">Sample receipt</span>
            <p
              className="mt-2"
              style={{
                fontSize: "17px",
                color: "#1D1D1F",
                lineHeight: 1.75,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              Your episode of <strong>{IMPACT_RECEIPT.dog}</strong> funded{" "}
              <strong>{IMPACT_RECEIPT.impact}</strong> at {IMPACT_RECEIPT.rescue}.
            </p>
            <div
              className="mt-5 pt-5 border-t text-sm flex items-center gap-2"
              style={{ borderColor: "#F0E2D2", color: "#6B625B" }}
            >
              <span aria-hidden="true">🐾</span>
              Thank you for watching.
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
