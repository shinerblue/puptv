import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      {/* Nav */}
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
            <span className="text-xl">🐾</span>
            <span className="font-bold text-xl tracking-tight" style={{ color: "#1D1D1F" }}>
              PupTV
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm" style={{ color: "#6E6E73" }}>
              How it works
            </a>
            <a href="#mission" className="text-sm" style={{ color: "#6E6E73" }}>
              Mission
            </a>
          </div>
          <Link
            href="/create"
            className="text-sm font-semibold px-5 py-2.5 rounded-full"
            style={{ background: "#1D1D1F", color: "#FFFFFF" }}
          >
            Create Video
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-28 text-center">
        <div
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-10 border"
          style={{ background: "#FFF7ED", color: "#EA580C", borderColor: "#FED7AA" }}
        >
          <span>🐕</span>
          <span>100% of profits fund dog charities</span>
        </div>

        <h1
          className="font-bold mb-6"
          style={{
            fontSize: "clamp(48px, 8vw, 80px)",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#1D1D1F",
          }}
        >
          Your dog,
          <br />
          cartoon-ified.
        </h1>

        <p
          className="text-xl mb-12 mx-auto leading-relaxed"
          style={{ color: "#6E6E73", maxWidth: "480px" }}
        >
          Upload your pup&apos;s photos. AI transforms them into an adorable
          cartoon adventure video — perfect Dog TV, made with love.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/create"
            className="font-semibold px-8 py-4 rounded-full text-lg inline-flex items-center gap-2"
            style={{ background: "#1D1D1F", color: "#FFFFFF" }}
          >
            Upload Photos &amp; Create
            <span>→</span>
          </Link>
          <span className="text-sm" style={{ color: "#A1A1AA" }}>
            $4.99 · proceeds go to charity
          </span>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y py-24"
        style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="font-bold text-center mb-4"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
          >
            How it works
          </h2>
          <p className="text-center mb-16" style={{ color: "#6E6E73" }}>
            Three steps to a cartoon adventure
          </p>

          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                num: "01",
                emoji: "📸",
                title: "Upload photos",
                desc: "Share 1–5 photos of your dog. Different angles help the AI learn their unique look.",
              },
              {
                num: "02",
                emoji: "🎨",
                title: "AI creates magic",
                desc: "Our AI transforms your pup into an adorable cartoon character in just a few minutes.",
              },
              {
                num: "03",
                emoji: "📺",
                title: "Watch on loop",
                desc: "Download a personalized adventure video to play on your TV while your dog relaxes.",
              },
            ].map((step) => (
              <div key={step.num}>
                <span
                  className="block text-xs font-mono mb-5"
                  style={{ color: "#D4D4D4", letterSpacing: "0.1em" }}
                >
                  {step.num}
                </span>
                <span className="text-4xl block mb-4">{step.emoji}</span>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#1D1D1F" }}>
                  {step.title}
                </h3>
                <p className="leading-relaxed text-sm" style={{ color: "#6E6E73" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why PupTV */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <h2
          className="font-bold text-center mb-16"
          style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
        >
          Made for dogs who deserve better
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              emoji: "🎬",
              label: "Personalized",
              title: "Stars YOUR dog",
              desc: "Not generic stock footage — a cartoon made from your actual pup's photos.",
            },
            {
              emoji: "🐾",
              label: "Nonprofit",
              title: "Helps dogs in need",
              desc: "Every video you create donates to rescue shelters and dog charities.",
            },
            {
              emoji: "✨",
              label: "AI-powered",
              title: "Professional quality",
              desc: "State-of-the-art AI turns ordinary photos into polished cartoon adventures.",
            },
            {
              emoji: "🔁",
              label: "Dog TV",
              title: "Loops forever",
              desc: "A calming, engaging video your dog can watch on the TV while you're away.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl p-8 border"
              style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}
            >
              <span className="text-3xl block mb-4">{card.emoji}</span>
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-2"
                style={{ color: "#F97316", letterSpacing: "0.1em" }}
              >
                {card.label}
              </span>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#1D1D1F" }}>
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6E6E73" }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="pb-24 max-w-5xl mx-auto px-6">
        <div
          className="rounded-3xl p-12 md:p-16 text-center border"
          style={{ background: "#FFF7ED", borderColor: "#FED7AA" }}
        >
          <span className="text-5xl block mb-6">🐕‍🦺</span>
          <h2
            className="font-bold mb-4"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
          >
            We&apos;re a nonprofit
          </h2>
          <p
            className="text-lg mb-10 mx-auto leading-relaxed"
            style={{ color: "#6E6E73", maxWidth: "520px" }}
          >
            100% of proceeds go to dog rescue organizations and shelters after
            modest operating costs. Every video helps a dog in need.
          </p>
          <Link
            href="/create"
            className="font-semibold px-8 py-4 rounded-full text-lg inline-block"
            style={{ background: "#F97316", color: "#FFFFFF" }}
          >
            Create your first video →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-8 text-center text-sm"
        style={{ borderColor: "#E5E5E5", color: "#A1A1AA" }}
      >
        © 2024 PupTV · A nonprofit adventure · Made with ❤️ for dog lovers
      </footer>
    </div>
  );
}
