"use client";

import { useState } from "react";
import { Gift, Check } from "lucide-react";
import SimpleNav from "@/components/SimpleNav";
import SiteFooter from "@/components/SiteFooter";

const STEPS = [
  {
    num: "01",
    title: "You upload & pay",
    desc: "Add photos of the dog and complete payment. One time, from your phone.",
  },
  {
    num: "02",
    title: "We create the episode",
    desc: "Same process as always — a cartoon adventure starring their dog.",
  },
  {
    num: "03",
    title: "It lands on their TV",
    desc: "We email them a simple channel link. No signup, no passwords — they just click and watch.",
  },
];

export default function GiftPage() {
  const [dogName, setDogName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientEmail.trim()) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      <SimpleNav />

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-10 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8"
          style={{ background: "#FFF7ED" }}
        >
          <Gift className="w-7 h-7" style={{ color: "#F97316" }} />
        </div>
        <h1
          className="font-bold mb-5"
          style={{ fontSize: "clamp(30px, 6vw, 52px)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1D1D1F" }}
        >
          Send it to Grandma&apos;s TV
        </h1>
        <p className="text-xl mx-auto leading-relaxed" style={{ color: "#6E6E73", maxWidth: "560px" }}>
          Your parents have a TV. You have a phone. That&apos;s all this takes.
        </p>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-16">
        <div className="rounded-3xl p-8 md:p-10 border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
          <p className="mb-4 leading-relaxed" style={{ color: "#1D1D1F", fontSize: "17px" }}>
            You buy a PupTV gift — pick &ldquo;give as gift&rdquo; at checkout. Upload photos of the dog —
            you send them, you pay. That&apos;s it.
          </p>
          <p className="mb-4 leading-relaxed" style={{ color: "#6E6E73", fontSize: "16px" }}>
            We create the episode on your side. We send your parents an email with a simple YouTube
            channel link. No account signup. They click, their TV plays the new show.
          </p>
          <p className="mb-4 leading-relaxed" style={{ color: "#6E6E73", fontSize: "16px" }}>
            Every week, new episodes land on that same channel. Your parents see the dog living
            adventures. They tell their friends about it. The dog becomes the star of the family.
          </p>
          <p className="font-semibold" style={{ color: "#1D1D1F", fontSize: "16px" }}>
            No technical setup. No passwords. No &ldquo;can you help me with this?&rdquo;
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2
          className="font-bold text-center mb-14"
          style={{ fontSize: "clamp(26px, 4vw, 34px)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
        >
          Three steps, start to finish
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {STEPS.map((s) => (
            <div key={s.num}>
              <span className="block text-xs font-mono mb-4" style={{ color: "#D4D4D4", letterSpacing: "0.1em" }}>
                {s.num}
              </span>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#1D1D1F" }}>
                {s.title}
              </h3>
              <p className="leading-relaxed text-sm" style={{ color: "#6E6E73" }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-24">
        <div className="rounded-3xl p-8 md:p-10 border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
          {sent ? (
            <div className="text-center py-6">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "#ECFDF5" }}
              >
                <Check className="w-6 h-6" style={{ color: "#10B981" }} />
              </div>
              <h3 className="font-bold mb-3" style={{ fontSize: "22px", color: "#1D1D1F" }}>
                Demo: gift on its way
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6E6E73" }}>
                {recipientName} will get an email with a link to {dogName || "your dog"}&apos;s channel.
                This is a demo — no email was actually sent, and nothing was charged.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="font-bold mb-2" style={{ fontSize: "22px", color: "#1D1D1F" }}>
                Send a PupTV gift
              </h3>
              <p className="text-sm mb-6" style={{ color: "#6E6E73" }}>
                Demo form — fill this in to see how the gift flow ends.
              </p>

              <div className="mb-5">
                <label className="block font-semibold mb-2" style={{ fontSize: "15px", color: "#1D1D1F" }}>
                  Dog&apos;s name
                </label>
                <input
                  type="text"
                  value={dogName}
                  onChange={(e) => setDogName(e.target.value)}
                  placeholder="Dutch, Luna, Max…"
                  className="w-full rounded-xl px-4 py-3 outline-none border-2"
                  style={{ fontSize: "16px", background: "#FFFFFF", borderColor: "#E5E5E5", color: "#1D1D1F" }}
                />
              </div>
              <div className="mb-5">
                <label className="block font-semibold mb-2" style={{ fontSize: "15px", color: "#1D1D1F" }}>
                  Recipient&apos;s name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Grandma Sue"
                  className="w-full rounded-xl px-4 py-3 outline-none border-2"
                  style={{ fontSize: "16px", background: "#FFFFFF", borderColor: "#E5E5E5", color: "#1D1D1F" }}
                />
              </div>
              <div className="mb-8">
                <label className="block font-semibold mb-2" style={{ fontSize: "15px", color: "#1D1D1F" }}>
                  Recipient&apos;s email
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="grandma@example.com"
                  className="w-full rounded-xl px-4 py-3 outline-none border-2"
                  style={{ fontSize: "16px", background: "#FFFFFF", borderColor: "#E5E5E5", color: "#1D1D1F" }}
                />
              </div>
              <button
                type="submit"
                disabled={!recipientName.trim() || !recipientEmail.trim()}
                className="btn-large w-full rounded-2xl"
                style={{
                  background: !recipientName.trim() || !recipientEmail.trim() ? "#E5E5E5" : "#1D1D1F",
                  color: !recipientName.trim() || !recipientEmail.trim() ? "#9CA3AF" : "#FFFFFF",
                  cursor: !recipientName.trim() || !recipientEmail.trim() ? "not-allowed" : "pointer",
                }}
              >
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
