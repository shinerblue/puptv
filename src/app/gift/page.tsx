"use client";

import { useState } from "react";
import { Gift, Check, Heart } from "lucide-react";
import SimpleNav from "@/components/SimpleNav";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";

const STEPS = [
  {
    num: "1",
    badge: "badge-num",
    title: "You upload and pay",
    desc: "Add photos of the dog and pay once, from your phone. Takes about five minutes.",
  },
  {
    num: "2",
    badge: "badge-num badge-num-sky",
    title: "We draw the episode",
    desc: "Same process as always — a cartoon adventure starring their dog, not a stranger's.",
  },
  {
    num: "3",
    badge: "badge-num badge-num-leaf",
    title: "It lands on their TV",
    desc: "It's their dog's own YouTube channel, so it plays on whatever TV they already have — Apple TV, Roku, Fire TV, Google TV, any smart TV. One email, one link, nothing to install.",
  },
];

export default function GiftPage() {
  const [dogName, setDogName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [sent, setSent] = useState(false);

  const canSend = Boolean(recipientName.trim() && recipientEmail.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen warm-page">
      <SimpleNav />

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
        <div className="icon-well mx-auto mb-7 float-soft">
          <Gift className="w-6 h-6" style={{ color: "#C2410C" }} />
        </div>
        <h1
          className="font-bold mb-5"
          style={{ fontSize: "clamp(30px, 6vw, 52px)", letterSpacing: "-0.03em", lineHeight: 1.08, color: "#1D1D1F" }}
        >
          Send it straight to
          <br />
          <span style={{ color: "#C2410C" }}>Grandma&apos;s TV</span>
        </h1>
        <p className="text-xl mx-auto leading-relaxed" style={{ color: "#6B625B", maxWidth: "540px" }}>
          Your parents have a TV. You have a phone. That is genuinely all this takes.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-14">
        <Reveal>
          <div className="tile tile-hover tilt-b">
            {/* eslint-disable-next-line @next/next/no-img-element -- static demo art */}
            <img
              src="/demo/birthday.jpg"
              alt="Cartoon of Dutch in a party hat beside a birthday cake, surrounded by balloons and confetti"
              loading="lazy"
              style={{ aspectRatio: "21 / 9" }}
            />
          </div>
          <p className="text-sm mt-5 text-center" style={{ color: "#6B625B" }}>
            Birthdays, Christmas, or a plain Tuesday — we&apos;ll work the occasion into the story.
          </p>
        </Reveal>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-16">
        <Reveal>
          <div className="card-warm p-8 md:p-10">
            <p className="mb-4 leading-relaxed" style={{ color: "#1D1D1F", fontSize: "18px" }}>
              You buy a ToonTails gift — pick &ldquo;give as gift&rdquo; at checkout. You upload
              the photos, you pay. That&apos;s your whole job.
            </p>
            <p className="mb-4 leading-relaxed" style={{ color: "#6B625B", fontSize: "16px" }}>
              We make the episode on your side and email them a link to their own private
              YouTube channel. No account to create. Any TV that has YouTube — Apple TV, Roku,
              Fire TV, Google TV, or a smart TV — plays it, so Grandma&apos;s TV is exactly the
              right TV.
            </p>
            <p className="mb-5 leading-relaxed" style={{ color: "#6B625B", fontSize: "16px" }}>
              Every week, new episodes land on that same channel. They watch the dog live
              adventures. They tell their friends. The dog becomes the star of the family.
            </p>
            <div className="card-tint p-5 flex items-start gap-3">
              <Heart className="w-5 h-5 flex-shrink-0" style={{ color: "#C2410C", marginTop: "2px" }} />
              <p className="font-semibold" style={{ color: "#1D1D1F", fontSize: "16px" }}>
                No technical setup. No passwords. No &ldquo;can you come over and help me with
                this?&rdquo;
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20">
        <Reveal>
          <h2
            className="font-bold text-center mb-10"
            style={{ fontSize: "clamp(26px, 4vw, 34px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
          >
            Three steps, start to finish
          </h2>
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

      <section className="max-w-2xl mx-auto px-6 pb-24">
        <div className="card-warm p-8 md:p-10">
          {sent ? (
            <div className="text-center py-6">
              <div className="icon-well icon-well-leaf mx-auto mb-5 pop-in">
                <Check className="w-6 h-6" style={{ color: "#047857" }} />
              </div>
              <h3 className="font-bold mb-3" style={{ fontSize: "23px", color: "#1D1D1F" }}>
                On its way (in the demo, anyway)
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B625B" }}>
                {recipientName} would get an email with a link to {dogName || "your dog"}&apos;s
                channel. This is a demo — no email was sent, and nothing was charged.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="font-bold mb-2" style={{ fontSize: "23px", color: "#1D1D1F" }}>
                Send a ToonTails gift
              </h3>
              <p className="text-sm mb-7" style={{ color: "#6B625B" }}>
                Demo form — fill it in and you&apos;ll see exactly how the gift flow ends.
              </p>

              <div className="mb-5">
                <label
                  htmlFor="gift-dog-name"
                  className="block font-semibold mb-2"
                  style={{ fontSize: "16px", color: "#1D1D1F" }}
                >
                  What&apos;s the dog&apos;s name?
                </label>
                <input
                  id="gift-dog-name"
                  name="dogName"
                  type="text"
                  value={dogName}
                  onChange={(e) => setDogName(e.target.value)}
                  placeholder="Dutch, Luna, Max…"
                  className="field field-sm"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="gift-recipient-name"
                  className="block font-semibold mb-2"
                  style={{ fontSize: "16px", color: "#1D1D1F" }}
                >
                  Who&apos;s it for?
                </label>
                <input
                  id="gift-recipient-name"
                  name="recipientName"
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Grandma Sue"
                  className="field field-sm"
                />
              </div>
              <div className="mb-8">
                <label
                  htmlFor="gift-recipient-email"
                  className="block font-semibold mb-2"
                  style={{ fontSize: "16px", color: "#1D1D1F" }}
                >
                  Their email address
                </label>
                <input
                  id="gift-recipient-email"
                  name="recipientEmail"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="grandma@example.com"
                  className="field field-sm"
                />
              </div>
              <button type="submit" disabled={!canSend} className="btn-pill btn-soft btn-block btn-ink">
                <Gift className="w-5 h-5" />
                Send the gift (demo) →
              </button>
            </form>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
