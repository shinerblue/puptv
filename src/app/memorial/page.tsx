import Link from "next/link";
import SimpleNav from "@/components/SimpleNav";

/**
 * Deliberately untouched by the warm redesign beyond the whites.
 *
 * Every other page got paw-print texture, tilted photo tiles, coral
 * chips and hover lift. None of that belongs here. This page keeps the
 * quiet, near-monochrome treatment it has always had — the only change
 * is that the cold #FAFAFA / #E5E5E5 greys became warm off-white and
 * warm grey, so it reads as calm rather than clinical, and it no longer
 * looks like it belongs to a different product than the rest of the
 * site. No pattern, no motion, no orange, no emoji.
 */
export default function MemorialPage() {
  return (
    <div className="min-h-screen quiet-page">
      <SimpleNav hideCta muted />

      <section className="max-w-xl mx-auto px-6 pt-24 pb-24 text-center">
        <h1
          className="font-bold mb-8"
          style={{ fontSize: "clamp(28px, 5vw, 40px)", letterSpacing: "-0.02em", lineHeight: 1.25, color: "#4A443D" }}
        >
          A quiet corner of ToonTails
        </h1>

        <p className="mb-6 leading-relaxed" style={{ fontSize: "18px", color: "#5A544C" }}>
          Some dogs are no longer with us, but their story doesn&apos;t have to stop being told.
        </p>
        <p className="mb-6 leading-relaxed" style={{ fontSize: "16px", color: "#6B655C" }}>
          If you&apos;ve lost a dog, we can still make one episode from the photos you have — a
          quiet, gentle keepsake, made with the same care as any other episode.
        </p>
        <p className="mb-12 leading-relaxed" style={{ fontSize: "16px", color: "#6B655C" }}>
          There&apos;s no rush, and there&apos;s nothing else to buy here — just one episode, made
          from the photos you already have.
        </p>

        <Link
          href="/create"
          className="inline-block px-8 py-4 font-semibold"
          style={{
            background: "#4A443D",
            color: "#FAF7F3",
            fontSize: "16px",
            borderRadius: "18px",
            minHeight: "56px",
          }}
        >
          Create a memorial episode — $4.99
        </Link>

        <p className="mt-16 text-sm" style={{ color: "#6B655C" }}>
          Take your time. We&apos;re here whenever you&apos;re ready.
        </p>
      </section>

      <footer
        className="border-t py-8 text-center text-sm"
        style={{ borderColor: "#E8E1D8", color: "#6B655C" }}
      >
        <Link href="/" style={{ color: "#6B655C" }}>
          ToonTails
        </Link>
      </footer>
    </div>
  );
}
