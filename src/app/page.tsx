import Link from "next/link";
import { PawPrint, Tv, Heart } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import AccountMenu from "@/components/AccountMenu";
import { LEDGER_STATS } from "@/lib/impact";

const VALUE_PROPS = [
  {
    Icon: PawPrint,
    title: "Stars your dog",
    desc:
      "Our AI keeps your dog's actual face, coat, and markings — not a generic cartoon dog. Every episode is really them.",
  },
  {
    Icon: Tv,
    title: "Shows up on your TV — automatically",
    desc:
      "Connect YouTube once. New episodes publish straight to your dog's own channel. No downloads, no uploads, no files to manage — it just works on any TV.",
  },
  {
    Icon: Heart,
    title: "Proceeds fund dog rescues",
    desc:
      "Most of what you pay covers production. What's left funds dog rescue organizations — and we publish the running numbers below.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "#E5E5E5",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- small static brand asset */}
            <img src="/brand/toontails-icon.png" alt="" width={28} height={28} style={{ borderRadius: 8 }} />
            <span className="font-bold text-xl tracking-tight" style={{ color: "#1D1D1F" }}>
              ToonTails
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm" style={{ color: "#6E6E73" }}>
              How it works
            </a>
            <Link href="/pricing" className="text-sm" style={{ color: "#6E6E73" }}>
              Pricing
            </Link>
            <Link href="/gift" className="text-sm" style={{ color: "#6E6E73" }}>
              Gifts
            </Link>
            <Link href="/impact" className="text-sm" style={{ color: "#6E6E73" }}>
              Impact
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="text-sm font-semibold px-5 py-2.5 rounded-full"
              style={{ background: "#1D1D1F", color: "#FFFFFF" }}
            >
              Create your dog&apos;s show
            </Link>
            <AccountMenu />
          </div>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        <div
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-10 border"
          style={{ background: "#FFFFFF", color: "#6E6E73", borderColor: "#E5E5E5" }}
        >
          <span>Dogs first. Cats coming soon.</span>
        </div>

        <h1
          className="font-bold mb-6"
          style={{
            fontSize: "clamp(40px, 7vw, 72px)",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#1D1D1F",
          }}
        >
          Your dog&apos;s own TV show.
          <br />
          On your TV.
        </h1>

        <p
          className="text-xl mb-12 mx-auto leading-relaxed"
          style={{ color: "#6E6E73", maxWidth: "560px" }}
        >
          Upload a few photos. We turn your dog into the star of a cartoon adventure —
          and it shows up on your YouTube channel automatically. No apps to install,
          no files to manage.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/create"
            className="btn-large font-semibold px-8 py-4 rounded-full inline-flex items-center gap-2"
            style={{ background: "#1D1D1F", color: "#FFFFFF", fontSize: "18px" }}
          >
            Create your dog&apos;s show
            <span>→</span>
          </Link>
          <span className="text-sm" style={{ color: "#6E6E73" }}>
            $4.99 to start · see the preview before you pay
          </span>
        </div>
      </section>

      <section
        className="border-y py-20"
        style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            {VALUE_PROPS.map(({ Icon, title, desc }) => (
              <div key={title}>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "#F5F5F5" }}
                >
                  <Icon className="w-6 h-6" style={{ color: "#F97316" }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ fontSize: "19px", color: "#1D1D1F" }}>
                  {title}
                </h3>
                <p className="leading-relaxed text-sm" style={{ color: "#6E6E73" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 max-w-5xl mx-auto px-6">
        <h2
          className="font-bold text-center mb-4"
          style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
        >
          How it works
        </h2>
        <p className="text-center mb-16" style={{ color: "#6E6E73" }}>
          Five minutes to set up. Every episode after that is automatic.
        </p>

        <div className="grid md:grid-cols-3 gap-16">
          {[
            {
              num: "01",
              title: "Upload photos, add a detail",
              desc: "1–5 photos, your dog's name and breed, and anything the AI should get right — like a short tail or a white patch.",
            },
            {
              num: "02",
              title: "Approve the preview",
              desc: "See three cartoon scenes of your dog before you pay a cent. Not quite right? One free fix.",
            },
            {
              num: "03",
              title: "Connect YouTube, once",
              desc: "After that, every new episode publishes straight to your dog's channel — open the TV and it's just there.",
            },
          ].map((step) => (
            <div key={step.num}>
              <span
                className="block text-xs font-mono mb-5"
                style={{ color: "#D4D4D4", letterSpacing: "0.1em" }}
              >
                {step.num}
              </span>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#1D1D1F" }}>
                {step.title}
              </h3>
              <p className="leading-relaxed text-sm" style={{ color: "#6E6E73" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="ledger" className="pb-20 max-w-5xl mx-auto px-6">
        <div
          className="rounded-3xl p-10 md:p-16 border"
          style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}
        >
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase px-3 py-1.5 rounded-full mb-5"
              style={{ background: "#F5F5F5", color: "#6E6E73", letterSpacing: "0.08em" }}
            >
              Sample data
            </div>
            <h2
              className="font-bold mb-4"
              style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
            >
              A public, running ledger
            </h2>
            <p className="mx-auto leading-relaxed" style={{ color: "#6E6E73", maxWidth: "520px" }}>
              Every video sold, every dollar donated, every shelter funded — published openly.
              The numbers below are illustrative; the real ledger goes live with our first customers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {LEDGER_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-8 text-center border"
                style={{ background: "#FAFAFA", borderColor: "#E5E5E5" }}
              >
                <div className="font-bold mb-2" style={{ fontSize: "40px", color: "#1D1D1F", letterSpacing: "-0.02em" }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: "#6E6E73" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/impact" className="text-sm font-semibold" style={{ color: "#1D1D1F" }}>
              See the full impact ledger →
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-24 max-w-5xl mx-auto px-6">
        <div
          className="rounded-3xl p-12 md:p-16 text-center border"
          style={{ background: "#1D1D1F", borderColor: "#1D1D1F" }}
        >
          <h2
            className="font-bold mb-4"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.02em", color: "#FFFFFF" }}
          >
            Ready to see your dog on TV?
          </h2>
          {/* #A1A1AA is intentional here — this block sits on the #1D1D1F card (6.5:1). */}
          <p
            className="text-lg mb-10 mx-auto leading-relaxed"
            style={{ color: "#A1A1AA", maxWidth: "480px" }}
          >
            Upload a few photos and preview your dog&apos;s first episode for free —
            you only pay once you like what you see.
          </p>
          <Link
            href="/create"
            className="btn-large font-semibold px-8 py-4 rounded-full inline-block"
            style={{ background: "#F97316", color: "#FFFFFF", fontSize: "18px" }}
          >
            Create your dog&apos;s show →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
