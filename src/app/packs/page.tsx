"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Copy, Check, Link2, Tv, Heart } from "lucide-react";
import SimpleNav from "@/components/SimpleNav";
import SiteFooter from "@/components/SiteFooter";
import AutoVideo from "@/components/AutoVideo";
import Reveal from "@/components/Reveal";

/**
 * Packs — dogs from different households in one episode.
 *
 * Everything here is demo mode: no database, no invite service, no
 * mailing list. The "Start a pack" flow is local state only and the
 * invite link is generated in the browser purely so the idea is
 * legible. Both say "demo" on screen rather than in a footnote —
 * pretending otherwise to a 55+ audience would be the wrong kind of
 * clever.
 */

const STEPS = [
  {
    num: "1",
    badge: "badge-num",
    title: "Start your pack with your dog",
    desc:
      "Give the pack a name — the dog park crew, the cousins, the two Labradors next door. Your dog is the first member.",
  },
  {
    num: "2",
    badge: "badge-num badge-num-sky",
    title: "Send the invite link",
    desc:
      "Text or email it to your friend. They add their own dog's photos from their own phone — no account of yours, no photos passed around.",
  },
  {
    num: "3",
    badge: "badge-num badge-num-leaf",
    title: "Every pack episode stars everyone",
    desc:
      "One adventure with the whole crew in it — and each family gets it on their own YouTube channel, playing on whatever TV they have.",
  },
];

/** Kept deliberately short so the demo link reads like a real one. */
function slugify(name: string): string {
  const s = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 28);
  return s || "your-pack";
}

export default function PacksPage() {
  const [packName, setPackName] = useState("");
  const [dogName, setDogName] = useState("");
  const [created, setCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [waitEmail, setWaitEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const inviteLink = `https://puptv.vercel.app/join/${slugify(packName)}-7f2a`;
  const memberName = dogName.trim() || "Your dog";

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packName.trim()) return;
    setCreated(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch {
      /* Clipboard is blocked in some in-app browsers — the link is
         still on screen and selectable, so this is not worth an alert. */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitEmail.trim()) return;
    // Demo mode: nothing is stored and nothing is sent anywhere.
    setJoined(true);
  };

  return (
    <div className="min-h-screen warm-page">
      <SimpleNav />

      {/* ------------------------------------------------------ HERO */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
        <div className="icon-well mx-auto mb-7 float-soft">
          <Users className="w-6 h-6" style={{ color: "#C2410C" }} />
        </div>
        <span className="chip chip-blush mb-6">Coming soon</span>
        <h1
          className="font-bold mb-5 mt-2"
          style={{
            fontSize: "clamp(30px, 6vw, 52px)",
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            color: "#1D1D1F",
          }}
        >
          Your dog and their
          <br />
          <span style={{ color: "#C2410C" }}>best friends, together</span>
        </h1>
        <p className="text-xl mx-auto leading-relaxed" style={{ color: "#6B625B", maxWidth: "560px" }}>
          A pack is a group of dogs from different houses. Your dog, your brother&apos;s dog,
          the neighbor&apos;s dog — all in the same cartoon, all on everyone&apos;s TV.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-14">
        <Reveal>
          <div className="tile tile-hover tilt-b">
            <AutoVideo
              src="/videos/pack.mp4"
              poster="/demo/crossover.jpg"
              alt="Cartoon of Dutch playing tug-of-war with a golden retriever in a sunlit meadow"
              style={{ aspectRatio: "21 / 9" }}
            />
          </div>
          <p className="text-sm mt-5 text-center" style={{ color: "#6B625B" }}>
            Dutch &amp; Buddy — a ToonTails Pack episode. Two dogs, two houses, one adventure.
          </p>
        </Reveal>
      </section>

      {/* --------------------------------------------- HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <Reveal>
          <h2
            className="font-bold text-center mb-3"
            style={{ fontSize: "clamp(26px, 4vw, 36px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
          >
            How a pack works
          </h2>
          <p className="text-center mb-12 mx-auto" style={{ color: "#6B625B", maxWidth: "540px" }}>
            Three steps, and only the first one is yours to do.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.08} className="h-full">
              <div className="card-warm card-lift p-7 h-full">
                <div className={`${s.badge} mb-4`}>{s.num}</div>
                <h3 className="font-semibold mb-2" style={{ fontSize: "18px", color: "#1D1D1F" }}>
                  {s.title}
                </h3>
                <p className="leading-relaxed text-sm" style={{ color: "#6B625B" }}>
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* -------------------------------------------- THE DEMO FLOW */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="card-warm p-8 md:p-10">
          {!created ? (
            <form onSubmit={handleCreate}>
              <span className="chip chip-quiet chip-sm uppercase mb-5">Try it — demo</span>
              <h2
                className="font-bold mb-2 mt-3"
                style={{ fontSize: "26px", letterSpacing: "-0.02em", color: "#1D1D1F" }}
              >
                Start a pack
              </h2>
              <p className="mb-8 leading-relaxed" style={{ color: "#6B625B", fontSize: "16px" }}>
                Give it a name and see exactly what your friend would get. Nothing is saved and
                nobody is emailed — this is a walkthrough of the real thing.
              </p>

              <div className="mb-5">
                <label
                  htmlFor="pack-name"
                  className="block font-semibold mb-2"
                  style={{ fontSize: "16px", color: "#1D1D1F" }}
                >
                  Name your pack
                </label>
                <input
                  id="pack-name"
                  name="packName"
                  type="text"
                  autoComplete="off"
                  value={packName}
                  onChange={(e) => setPackName(e.target.value)}
                  placeholder="The Tuesday Dog Park Crew"
                  className="field field-sm"
                />
              </div>

              <div className="mb-8">
                <label
                  htmlFor="pack-dog"
                  className="block font-semibold mb-2"
                  style={{ fontSize: "16px", color: "#1D1D1F" }}
                >
                  Your dog&apos;s name{" "}
                  <span style={{ fontWeight: 400, color: "#6B625B" }}>(optional)</span>
                </label>
                <input
                  id="pack-dog"
                  name="dogName"
                  type="text"
                  autoComplete="off"
                  value={dogName}
                  onChange={(e) => setDogName(e.target.value)}
                  placeholder="Dutch"
                  className="field field-sm"
                />
              </div>

              <button
                type="submit"
                disabled={!packName.trim()}
                className="btn-pill btn-soft btn-block btn-ink"
              >
                <Users className="w-5 h-5" />
                Start the pack (demo) →
              </button>
            </form>
          ) : (
            <div>
              <div className="icon-well icon-well-leaf mb-5 pop-in">
                <Check className="w-6 h-6" style={{ color: "#047857" }} />
              </div>
              <h2
                className="font-bold mb-2"
                style={{ fontSize: "26px", letterSpacing: "-0.02em", color: "#1D1D1F" }}
              >
                {packName.trim()} is ready
              </h2>
              <p className="mb-8 leading-relaxed" style={{ color: "#6B625B", fontSize: "16px" }}>
                Here is the invite link you would send. Anyone who opens it adds their own
                dog&apos;s photos and joins the cast.
              </p>

              <div className="mb-3">
                <div
                  className="font-semibold mb-2 flex items-center gap-2"
                  style={{ fontSize: "15px", color: "#1D1D1F" }}
                >
                  <Link2 className="w-4 h-4" style={{ color: "#C2410C" }} aria-hidden="true" />
                  Your invite link
                  <span className="chip chip-quiet chip-sm uppercase">Demo link</span>
                </div>
                <div className="invite-box">
                  <span className="invite-link">{inviteLink}</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="btn-pill-sm btn-ghost whitespace-nowrap"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" aria-hidden="true" />
                        Copy link
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-sm mb-9" style={{ color: "#6B625B" }}>
                This link is a demo — it doesn&apos;t open anything yet. In the live version it
                takes your friend straight to a photo upload page for their dog.
              </p>

              <div className="font-semibold mb-4" style={{ fontSize: "17px", color: "#1D1D1F" }}>
                Who&apos;s in the pack
              </div>
              <div className="pack-roster mb-8">
                <div className="pack-slot">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static demo art */}
                  <img
                    src="/demo/still-1.jpg"
                    alt=""
                    loading="lazy"
                    className="pack-slot-art"
                  />
                  <div className="pack-slot-body">
                    <div className="font-semibold" style={{ fontSize: "15px", color: "#1D1D1F" }}>
                      {memberName}
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#6B625B" }}>
                      Your household
                    </div>
                  </div>
                </div>
                {[1, 2, 3].map((n) => (
                  <div key={n} className="pack-slot is-empty">
                    <div className="pack-slot-placeholder" aria-hidden="true">
                      🐾
                    </div>
                    <div className="pack-slot-body">
                      <div className="font-semibold" style={{ fontSize: "15px", color: "#6B625B" }}>
                        Open spot
                      </div>
                      <div className="text-xs mt-1" style={{ color: "#6B625B" }}>
                        Waiting for a friend
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setCreated(false);
                  setCopied(false);
                }}
                className="btn-pill btn-soft btn-block btn-ghost"
              >
                ← Start over
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------- WHAT IT COSTS */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <Reveal>
          <div className="card-tint p-8 md:p-10">
            <div className="flex items-start gap-4 mb-5">
              <div className="icon-well icon-well-sm">
                <Tv className="w-5 h-5" style={{ color: "#C2410C" }} aria-hidden="true" />
              </div>
              <div>
                <h2
                  className="font-bold mb-2"
                  style={{ fontSize: "23px", letterSpacing: "-0.02em", color: "#1D1D1F" }}
                >
                  What a pack episode costs
                </h2>
                <p className="leading-relaxed" style={{ color: "#1D1D1F", fontSize: "17px" }}>
                  Pack episodes are regular episodes — each family orders their own copy for
                  their own TV and their own $1 pledge.
                </p>
              </div>
            </div>
            <p className="leading-relaxed mb-5" style={{ color: "#6B625B", fontSize: "16px" }}>
              There is no pack plan and no group bill to split. You buy your copy, your friend
              buys theirs, and the same adventure lands on both channels. Nobody is stuck
              chasing anyone for money.
            </p>
            <div className="flex items-center gap-2" style={{ flexWrap: "wrap" }}>
              <Heart className="w-4 h-4 flex-shrink-0" style={{ color: "#C2410C" }} aria-hidden="true" />
              <span style={{ color: "#6B625B", fontSize: "15px" }}>
                Which also means a four-dog pack sends four dollars to a rescue.
              </span>
              <Link href="/pricing" style={{ color: "#C2410C", fontWeight: 600, fontSize: "15px" }}>
                See pricing →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------- WAITLIST */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <div className="card-warm p-8 md:p-10">
          {joined ? (
            <div className="text-center py-6">
              <div className="icon-well icon-well-leaf mx-auto mb-5 pop-in">
                <Check className="w-6 h-6" style={{ color: "#047857" }} aria-hidden="true" />
              </div>
              <h3 className="font-bold mb-3" style={{ fontSize: "23px", color: "#1D1D1F" }}>
                You&apos;re on the list (in the demo)
              </h3>
              <p className="text-sm leading-relaxed mx-auto" style={{ color: "#6B625B", maxWidth: "420px" }}>
                In the live version we&apos;d email you the day packs open. This is a demo — nothing
                was stored and no address was sent anywhere.
              </p>
              <p className="mt-6">
                <Link href="/create" style={{ color: "#C2410C", fontWeight: 600, fontSize: "16px" }}>
                  Make an episode for your own dog now →
                </Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleWaitlist}>
              <span className="chip chip-blush chip-sm uppercase mb-5">Coming soon</span>
              <h3 className="font-bold mb-2 mt-3" style={{ fontSize: "23px", color: "#1D1D1F" }}>
                Tell me when packs go live
              </h3>
              <p className="text-sm mb-7 leading-relaxed" style={{ color: "#6B625B" }}>
                Packs are still being built. Single-dog and two-dog episodes work today — packs
                add dogs from other households, and we&apos;ll open them to the waitlist first.
              </p>
              <div className="mb-6">
                <label
                  htmlFor="pack-waitlist-email"
                  className="block font-semibold mb-2"
                  style={{ fontSize: "16px", color: "#1D1D1F" }}
                >
                  Your email address
                </label>
                <input
                  id="pack-waitlist-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={waitEmail}
                  onChange={(e) => setWaitEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="field field-sm"
                />
              </div>
              <button
                type="submit"
                disabled={!waitEmail.trim()}
                className="btn-pill btn-soft btn-block btn-ink"
              >
                Join the waitlist (demo) →
              </button>
            </form>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
