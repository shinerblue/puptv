import SimpleNav from "@/components/SimpleNav";
import SiteFooter from "@/components/SiteFooter";
import { LEDGER_STATS, LEDGER_ROWS, IMPACT_RECEIPT } from "@/lib/impact";

export default function ImpactPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      <SimpleNav />

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase px-3 py-1.5 rounded-full mb-6"
          style={{ background: "#F5F5F5", color: "#6E6E73", letterSpacing: "0.08em" }}
        >
          Sample data
        </div>
        <h1
          className="font-bold mb-5"
          style={{ fontSize: "clamp(32px, 6vw, 52px)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1D1D1F" }}
        >
          A public, running ledger
        </h1>
        <p className="text-xl mx-auto leading-relaxed" style={{ color: "#6E6E73", maxWidth: "580px" }}>
          Every PupTV episode you buy funds dog rescues. Not &ldquo;someday.&rdquo; Right now. The
          numbers below are illustrative — the real ledger goes live with our first customers.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {LEDGER_STATS.map((stat) => (
            <div key={stat.label} className="rounded-2xl p-8 text-center border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
              <div className="font-bold mb-2" style={{ fontSize: "40px", color: "#1D1D1F", letterSpacing: "-0.02em" }}>
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: "#6E6E73" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="rounded-3xl p-8 md:p-10 border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
          <h2 className="font-bold mb-4" style={{ fontSize: "22px", color: "#1D1D1F" }}>
            How the money moves
          </h2>
          <table className="ledger-table mb-4">
            <thead>
              <tr>
                <th>What you buy</th>
                <th>Amount to rescue</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>One episode ($4.99)</td><td>$1.00</td></tr>
              <tr><td>Three-pack ($9.99)</td><td>$2.50</td></tr>
              <tr><td>Season ($19.99)</td><td>$5.00</td></tr>
            </tbody>
          </table>
          <p className="text-sm leading-relaxed" style={{ color: "#6E6E73" }}>
            Every week, we post which rescues received funds. You see it. No mystery. No corporate vagueness.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="rounded-3xl p-8 md:p-10 border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
          <h2 className="font-bold mb-4" style={{ fontSize: "22px", color: "#1D1D1F" }}>
            Against the content farm
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#6E6E73" }}>
            YouTube is full of &ldquo;dog TV.&rdquo; Hours of it. But most of it comes from overseas
            operations that film random dogs they don&apos;t know, owned by no one in particular.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#6E6E73" }}>
            PupTV is different. The dog is yours. The money goes to rescues that save dogs today.
            That&apos;s it.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="font-bold mb-6 text-center" style={{ fontSize: "24px", color: "#1D1D1F" }}>
          The ledger
        </h2>
        {/* overflow-hidden clipped the 5-column ledger at 375px; scroll it instead */}
        <div className="rounded-3xl border overflow-x-auto" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
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
                  <td>{row.dog}</td>
                  <td>{row.order}</td>
                  <td className="font-mono">{row.amount}</td>
                  <td>{row.rescue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-md mx-auto px-6 pb-24">
        <h2 className="font-bold mb-6 text-center" style={{ fontSize: "22px", color: "#1D1D1F" }}>
          Sample impact receipt
        </h2>
        <div
          className="rounded-2xl p-8 border"
          style={{ background: "#FFFFFF", borderColor: "#E5E5E5", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
        >
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase px-3 py-1.5 rounded-full mb-5"
            style={{ background: "#F5F5F5", color: "#6E6E73", letterSpacing: "0.08em" }}
          >
            Sample receipt
          </div>
          <p style={{ fontSize: "15px", color: "#1D1D1F", lineHeight: 1.8 }}>
            Your episode of <strong>{IMPACT_RECEIPT.dog}</strong> funded{" "}
            <strong>{IMPACT_RECEIPT.impact}</strong> at {IMPACT_RECEIPT.rescue}.
          </p>
          <div className="mt-5 pt-5 border-t text-xs" style={{ borderColor: "#E5E5E5", color: "#6E6E73" }}>
            Thank you for watching. 🐾
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
