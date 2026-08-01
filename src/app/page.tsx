import Link from "next/link";
import { PawPrint, Tv, Heart, Sparkles, ArrowRight, Moon, Gift, Repeat } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import AccountMenu from "@/components/AccountMenu";
import HeroCollage from "@/components/HeroCollage";
import Reveal from "@/components/Reveal";
import { LEDGER_STATS } from "@/lib/impact";

const VALUE_PROPS = [
  {
    Icon: PawPrint,
    well: "icon-well",
    title: "It's really your dog",
    desc:
      "Their actual face, coat, and markings — right down to a stubby tail or a white patch over one eye. Not a generic cartoon dog wearing their name.",
  },
  {
    Icon: Tv,
    well: "icon-well icon-well-sky",
    title: "It just shows up on the TV",
    desc:
      "Connect YouTube once. New episodes publish themselves to your dog's own channel. Nothing to download, nothing to plug in, nothing to remember.",
  },
  {
    Icon: Heart,
    well: "icon-well icon-well-leaf",
    title: "Every episode feeds a rescue",
    desc:
      "$1 from every episode goes straight to a dog rescue — flat and guaranteed, not “profits if there are any.” The rest covers making your video, payment processing, and running ToonTails, small family team included — and we publish the running numbers, down to the dollar.",
  },
];

const EPISODE_STRIP = [
  {
    src: "/demo/still-2.jpg",
    alt: "Cartoon of Dutch trotting through a sunlit park with a stick in his mouth",
    label: "Park adventure",
    note: "The everyday one — fetch, butterflies, good light.",
  },
  {
    src: "/demo/still-3.jpg",
    alt: "Cartoon of Dutch napping against a mossy tree root with a ladybug on a leaf beside him",
    label: "Calm mode",
    note: "Gentle pacing and dog-vision colors for anxious pups.",
  },
  {
    src: "/demo/crossover.jpg",
    alt: "Cartoon of Dutch playing tug-of-war with a golden retriever in a meadow",
    label: "Pack adventure",
    note: "Two dogs in one house? Put them in one episode.",
  },
];

const STEPS = [
  {
    num: "1",
    badge: "badge-num",
    title: "Send us a few photos",
    desc:
      "One to five pictures from your phone, plus their name and breed. Add anything the drawing should get right — “very short stubby tail” does a lot of work.",
  },
  {
    num: "2",
    badge: "badge-num badge-num-sky",
    title: "Say yes to the preview",
    desc:
      "You see three cartoon scenes of your own dog before you pay a cent. Not quite them? Tell us what's off and we redraw it, free.",
  },
  {
    num: "3",
    badge: "badge-num badge-num-leaf",
    title: "Turn on the TV",
    desc:
      "Connect YouTube once and you're done forever. Every new episode lands on your dog's channel by itself — open the TV and it's just there.",
  },
];

/**
 * The showcase grid. Owner feedback was blunt: the features exist but
 * nobody can see them. So every one of them gets a picture, a plain-
 * language line and its own destination — and the whole card is the
 * link, not a small "learn more" at the bottom.
 *
 * Memorial episodes are deliberately absent. They belong in the quiet
 * footer link, not in a joyful grid.
 */
interface ShowcaseItem {
  href: string;
  kicker: string;
  title: string;
  desc: string;
  cta: string;
  /** Small ribbon beside the kicker, e.g. "New". */
  badge?: string;
  /** Either a real still from /public/demo… */
  img?: string;
  alt?: string;
  /** …or a painted plate with one decorative glyph. */
  Icon?: LucideIcon;
  plate?: string;
  iconColor?: string;
}

const SHOWCASE: ShowcaseItem[] = [
  {
    href: "/create",
    kicker: "Adventures",
    title: "Five worlds to run around in",
    desc: "The park, the beach, a mountain trail, the city at night, outer space — with more themes on the way.",
    cta: "Pick an adventure",
    img: "/demo/still-1.jpg",
    alt: "Cartoon of Dutch bounding across a sunlit park",
  },
  {
    href: "/packs",
    kicker: "Packs",
    badge: "New",
    title: "Your dog + their best friends, together in one cartoon",
    desc: "Different houses, different families, one episode. Invite a friend and their dog joins the cast.",
    cta: "See how packs work",
    img: "/demo/crossover.jpg",
    alt: "Cartoon of Dutch playing tug-of-war with a golden retriever in a meadow",
  },
  {
    href: "/create",
    kicker: "Occasions",
    title: "Birthdays, holidays, gotcha days",
    desc: "Tell us the occasion and we write it into the story — party hats, cake, confetti, all of it.",
    cta: "Add an occasion",
    img: "/demo/birthday.jpg",
    alt: "Cartoon of Dutch in a party hat beside a birthday cake",
  },
  {
    href: "/create",
    kicker: "Calm Mode",
    title: "Made for an anxious dog",
    desc: "Dog-vision colors, slow pacing and no sudden noises — for the ones who don't love a busy screen.",
    cta: "Turn on calm mode",
    Icon: Moon,
    plate: "plate-calm",
    iconColor: "#1D5A80",
  },
  {
    href: "/gift",
    kicker: "Gifts",
    title: "Send it straight to Grandma's TV",
    desc: "You upload and pay from your phone. They get one link, no account, no setup, nothing to install.",
    cta: "Send a gift",
    Icon: Gift,
    plate: "plate-gift",
    iconColor: "#C2410C",
  },
  {
    href: "/favorites",
    kicker: "The Continuous Loop",
    title: "Every favorite, one long video",
    desc: "Star the episodes you love and we stitch them into a single loop that just keeps playing.",
    cta: "Build a loop",
    Icon: Repeat,
    plate: "plate-loop",
    iconColor: "#047857",
  },
  {
    href: "/create",
    kicker: "Posters",
    title: "Their cartoon self, on your wall",
    desc: "The same drawing that stars in the episode, printed big enough to hang in the hallway.",
    cta: "See the poster",
    img: "/demo/poster-art.jpg",
    alt: "Framed poster of Dutch's cartoon portrait",
  },
  {
    href: "/impact",
    kicker: "Every episode gives back",
    title: "$1 from every episode, to a dog rescue",
    desc: "Pledged on every single order and published in a running public ledger — down to the dollar.",
    cta: "Read the ledger",
    Icon: Heart,
    plate: "plate-give",
    iconColor: "#9A3412",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen warm-page">
      <nav className="sticky top-0 z-50 nav-warm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 wag-host">
            {/* eslint-disable-next-line @next/next/no-img-element -- small static brand asset */}
            <img
              src="/brand/toontails-icon.png"
              alt=""
              width={32}
              height={32}
              className="wag"
              style={{ borderRadius: 10 }}
            />
            <span className="font-bold text-xl tracking-tight" style={{ color: "#1D1D1F" }}>
              ToonTails
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <a href="#how-it-works" className="nav-link">
              How it works
            </a>
            <Link href="/packs" className="nav-link">
              Packs
            </Link>
            <Link href="/pricing" className="nav-link">
              Pricing
            </Link>
            <Link href="/gift" className="nav-link">
              Gifts
            </Link>
            <Link href="/impact" className="nav-link">
              Impact
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/create" className="btn-pill-sm btn-ink">
              Create your dog&apos;s show
            </Link>
            <AccountMenu />
          </div>
        </div>
      </nav>

      {/* ---------------------------------------------------------- HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-16 md:py-24">
        <div className="hero-split">
          <div className="hero-copy text-center">
            <span className="chip mb-6">
              <PawPrint className="w-4 h-4" />
              Dogs first. Cats coming soon.
            </span>

            <h1
              className="font-bold mb-6"
              style={{
                fontSize: "clamp(40px, 6.2vw, 68px)",
                letterSpacing: "-0.03em",
                lineHeight: 1.03,
                color: "#1D1D1F",
              }}
            >
              Your dog&apos;s own
              <br />
              cartoon show.
              <br />
              <span style={{ color: "#C2410C" }}>On your TV tonight.</span>
            </h1>

            <p
              className="text-xl mb-8 mx-auto leading-relaxed"
              style={{ color: "#6B625B", maxWidth: "520px" }}
            >
              Send a few photos. We draw your actual dog into a cartoon adventure — and it
              turns up on your TV all by itself. No apps, no files, nothing to figure out.
            </p>

            <div className="hero-actions flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/create" className="btn-pill btn-ink">
                Create your dog&apos;s show
                <ArrowRight className="w-5 h-5" />
              </Link>
              <span className="text-sm leading-snug" style={{ color: "#6B625B" }}>
                $4.99 to start.
                <br />
                See the preview before you pay.
              </span>
            </div>
          </div>

          <HeroCollage />
        </div>
      </section>

      {/* ------------------------------------------ THE MAGIC MOMENT */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <Reveal>
          <div className="card-warm p-8 md:p-10">
            <div className="text-center mb-8">
              <h2
                className="font-bold mb-3"
                style={{ fontSize: "clamp(24px, 3.4vw, 34px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
              >
                From your camera roll to their own cartoon
              </h2>
              <p className="mx-auto leading-relaxed" style={{ color: "#6B625B", maxWidth: "520px" }}>
                This is the part people don&apos;t believe until they see it. The dog in the
                cartoon is the dog on your couch.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div
                className="upload-zone p-8 text-center flex-1 w-full"
                style={{ cursor: "default" }}
              >
                <div className="text-4xl mb-3" aria-hidden="true">
                  🐾
                </div>
                <p className="font-semibold mb-1" style={{ fontSize: "17px", color: "#1D1D1F" }}>
                  A few photos of your dog
                </p>
                <p className="text-sm" style={{ color: "#6B625B" }}>
                  Straight from your phone. Any angle, as long as it&apos;s clear.
                </p>
              </div>

              <div className="flex-shrink-0" aria-hidden="true">
                <div className="icon-well icon-well-sm mx-auto">
                  <Sparkles className="w-5 h-5" style={{ color: "#C2410C" }} />
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="tile tile-hover">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static demo art */}
                  <img
                    src="/demo/still-2.jpg"
                    alt="The finished cartoon: Dutch trotting through a sunlit park with a stick in his mouth"
                    loading="lazy"
                    style={{ aspectRatio: "16 / 10" }}
                  />
                </div>
                <p className="text-sm mt-3 text-center" style={{ color: "#6B625B" }}>
                  Dutch, a real French Bulldog, in episode one.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-10">
        <div className="paw-rule" aria-hidden="true">
          <span>🐾</span>
        </div>
      </div>

      {/* -------------------------------------------- EPISODE STRIP */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <Reveal>
          <h2
            className="font-bold text-center mb-3"
            style={{ fontSize: "clamp(24px, 3.4vw, 34px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
          >
            Real scenes, really made
          </h2>
          <p className="text-center mb-10 mx-auto" style={{ color: "#6B625B", maxWidth: "520px" }}>
            Every picture on this page came out of the same pipeline your dog&apos;s episode
            will. Nothing here is a stock illustration.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EPISODE_STRIP.map((ep, i) => (
            <Reveal key={ep.label} delay={i * 0.08}>
              <div className="tile tile-hover">
                {/* eslint-disable-next-line @next/next/no-img-element -- static demo art */}
                <img
                  src={ep.src}
                  alt={ep.alt}
                  loading="lazy"
                  style={{ aspectRatio: "16 / 10" }}
                />
              </div>
              <div className="pt-4">
                <h3 className="font-semibold mb-1" style={{ fontSize: "17px", color: "#1D1D1F" }}>
                  {ep.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B625B" }}>
                  {ep.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------------------- VALUE PROPS */}
      <section className="warm-band py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            {VALUE_PROPS.map(({ Icon, well, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className={`${well} mb-5`}>
                  <Icon className="w-6 h-6" style={{ color: "#C2410C" }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ fontSize: "20px", color: "#1D1D1F" }}>
                  {title}
                </h3>
                <p className="leading-relaxed" style={{ color: "#6B625B", fontSize: "15px" }}>
                  {desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------- HOW IT WORKS */}
      <section id="how-it-works" className="py-20 max-w-5xl mx-auto px-6">
        <Reveal>
          <h2
            className="font-bold text-center mb-3"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
          >
            How it works
          </h2>
          <p className="text-center mb-14" style={{ color: "#6B625B" }}>
            About five minutes to set up. Every episode after that happens on its own.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.08}>
              <div className="card-warm card-lift p-8 h-full">
                <div className={`${step.badge} mb-5`}>{step.num}</div>
                <h3 className="font-semibold mb-2" style={{ fontSize: "19px", color: "#1D1D1F" }}>
                  {step.title}
                </h3>
                <p className="leading-relaxed" style={{ color: "#6B625B", fontSize: "15px" }}>
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ----------------------------------------- FEATURE SHOWCASE */}
      <section id="everything" className="warm-band py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <span className="chip chip-quiet chip-sm uppercase mb-5">
                Everything included
              </span>
              <h2
                className="font-bold mb-4 mt-2"
                style={{
                  fontSize: "clamp(28px, 4vw, 40px)",
                  letterSpacing: "-0.02em",
                  color: "#1D1D1F",
                }}
              >
                Everything your dog can star in
              </h2>
              <p
                className="mx-auto leading-relaxed"
                style={{ color: "#6B625B", maxWidth: "560px", fontSize: "18px" }}
              >
                One dog, a lot of different shows. Every one of these is part of ToonTails —
                tap any card to see it.
              </p>
            </div>
          </Reveal>

          <div className="feature-grid">
            {SHOWCASE.map((f, i) => {
              const Icon = f.Icon;
              return (
                <Reveal key={f.kicker} delay={i * 0.06} className="h-full">
                  <Link href={f.href} className="feature-card card-warm card-lift">
                    <div className="feature-art">
                      {f.img ? (
                        /* eslint-disable-next-line @next/next/no-img-element -- static demo art */
                        <img src={f.img} alt={f.alt} loading="lazy" />
                      ) : (
                        <span className={`feature-plate ${f.plate}`} aria-hidden="true">
                          {Icon ? <Icon className="w-8 h-8" style={{ color: f.iconColor }} /> : null}
                        </span>
                      )}
                    </div>
                    <div className="feature-body">
                      <div className="feature-kicker">
                        {f.kicker}
                        {f.badge ? <span className="chip chip-blush chip-sm">{f.badge}</span> : null}
                      </div>
                      <h3 className="feature-title">{f.title}</h3>
                      <p className="feature-desc">{f.desc}</p>
                      <span className="feature-cta">{f.cta} →</span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <p className="text-center mt-12" style={{ color: "#6B625B", fontSize: "15px" }}>
              Lost a dog? We make{" "}
              <Link href="/memorial" style={{ color: "#C2410C", fontWeight: 600 }}>
                memorial episodes
              </Link>{" "}
              too — quietly, and with care.
            </p>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------- LEDGER */}
      <section id="ledger" className="pt-20 pb-20 max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="card-warm p-10 md:p-16">
            <div className="text-center mb-12">
              <span className="chip chip-quiet chip-sm uppercase mb-5">Sample data</span>
              <h2
                className="font-bold mb-4 mt-2"
                style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
              >
                A public, running ledger
              </h2>
              <p className="mx-auto leading-relaxed" style={{ color: "#6B625B", maxWidth: "520px" }}>
                Every video sold, every dollar donated, every shelter funded — published
                openly. The numbers below are illustrative; the real ledger goes live with our
                first customers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {LEDGER_STATS.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.08}>
                  <div className="card-tint card-lift p-8 text-center h-full">
                    <div
                      className="font-bold mb-2"
                      style={{ fontSize: "40px", color: "#C2410C", letterSpacing: "-0.02em" }}
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

            <div className="text-center mt-10">
              <Link href="/impact" className="font-semibold" style={{ color: "#C2410C", fontSize: "16px" }}>
                See the full impact ledger →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------------------------------------- CLOSING CTA */}
      <section className="pb-24 max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="card-ink p-12 md:p-16 text-center">
            <div className="text-4xl mb-5 float-soft" aria-hidden="true">
              🐾
            </div>
            <h2
              className="font-bold mb-4"
              style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.02em", color: "#FFFFFF" }}
            >
              Ready to see your dog on TV?
            </h2>
            {/* #D6CCC0 on the #1D1D1F card is 5.9:1. */}
            <p
              className="text-lg mb-10 mx-auto leading-relaxed"
              style={{ color: "#D6CCC0", maxWidth: "460px" }}
            >
              Send a few photos and meet your dog&apos;s cartoon for free — you only pay once
              you like what you see.
            </p>
            <Link href="/create" className="btn-pill btn-sun">
              Create your dog&apos;s show
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
