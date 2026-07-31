import Link from "next/link";
import SimpleNav from "@/components/SimpleNav";

export default function MemorialPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      <SimpleNav hideCta muted />

      <section className="max-w-xl mx-auto px-6 pt-24 pb-24 text-center">
        <h1
          className="font-bold mb-8"
          style={{ fontSize: "clamp(28px, 5vw, 40px)", letterSpacing: "-0.02em", lineHeight: 1.2, color: "#3F3F46" }}
        >
          A quiet corner of PupTV
        </h1>

        <p className="mb-6 leading-relaxed" style={{ fontSize: "17px", color: "#52525B" }}>
          Some dogs are no longer with us, but their story doesn&apos;t have to stop being told.
        </p>
        <p className="mb-6 leading-relaxed" style={{ fontSize: "16px", color: "#71717A" }}>
          If you&apos;ve lost a dog, we can still make one episode from the photos you have — a
          quiet, gentle keepsake, made with the same care as any other episode.
        </p>
        <p className="mb-12 leading-relaxed" style={{ fontSize: "16px", color: "#71717A" }}>
          There&apos;s no rush, and there&apos;s nothing else to buy here — just one episode, made
          from the photos you already have.
        </p>

        <Link
          href="/create"
          className="inline-block rounded-2xl px-8 py-4 font-semibold"
          style={{ background: "#3F3F46", color: "#FAFAFA", fontSize: "16px" }}
        >
          Create a memorial episode — $4.99
        </Link>

        <p className="mt-16 text-sm" style={{ color: "#6E6E73" }}>
          Take your time. We&apos;re here whenever you&apos;re ready.
        </p>
      </section>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: "#E5E5E5", color: "#6E6E73" }}>
        <Link href="/" style={{ color: "#6E6E73" }}>
          PupTV
        </Link>
      </footer>
    </div>
  );
}
