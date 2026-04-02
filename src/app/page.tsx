"use client";

import Link from "next/link";
import { Dog, Heart, Upload, Sparkles, Play, Shield, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[#0f0a1a]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dog className="w-8 h-8 text-purple-400 paw-bounce" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              PupTV
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#mission" className="text-sm text-slate-400 hover:text-white transition-colors">
              Our Mission
            </a>
            <Link
              href="/create"
              className="gradient-btn-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full"
            >
              Create Video
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-hero pt-32 pb-20 px-6 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-sm text-purple-300">100% of profits fund dog charities</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                  Cartoon Adventures
                </span>
                <br />
                Starring{" "}
                <span className="italic text-white">Your Dog</span>
              </h1>
              <p className="text-xl text-slate-400 mb-8 leading-relaxed max-w-lg">
                Upload your pup&apos;s photos and watch AI transform them into adorable
                cartoon adventure videos. Perfect Dog TV — made with love, not by
                overseas content farms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/create"
                  className="gradient-btn-primary text-white font-semibold px-8 py-4 rounded-full text-lg flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Upload Photos & Create
                </Link>
                <a
                  href="#how-it-works"
                  className="border border-white/10 hover:border-white/20 text-white font-medium px-8 py-4 rounded-full text-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  See Examples
                </a>
              </div>
            </div>

            {/* Hero visual - animated cartoon dog placeholder */}
            <div className="relative flex justify-center">
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-3xl gradient-card p-1 float-animation video-glow">
                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-purple-900/50 to-pink-900/30 flex flex-col items-center justify-center gap-4">
                  <Dog className="w-24 h-24 text-purple-300 paw-bounce" />
                  <p className="text-purple-300 text-lg font-medium">Your pup, cartoonified</p>
                  <div className="flex gap-2">
                    {["\ud83c\udfd4\ufe0f", "\ud83c\udfd6\ufe0f", "\ud83d\ude80", "\ud83c\udfaa"].map((emoji, i) => (
                      <span key={i} className="text-2xl">{emoji}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Three simple steps to create personalized cartoon adventures for your furry friend
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Upload Photos",
                description:
                  "Share 1-5 photos of your dog. Our AI learns their unique features, markings, and personality.",
                step: "01",
                color: "purple",
              },
              {
                icon: Sparkles,
                title: "AI Creates Magic",
                description:
                  "Our AI transforms your pup into a cartoon character and generates adventure scenes starring them.",
                step: "02",
                color: "pink",
              },
              {
                icon: Play,
                title: "Watch & Share",
                description:
                  "Get a looping cartoon video perfect for Dog TV. Upload to YouTube or play on any screen at home.",
                step: "03",
                color: "amber",
              },
            ].map((item) => (
              <div key={item.step} className="gradient-card rounded-2xl p-8 relative group">
                <div className="absolute top-4 right-4 text-5xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                  {item.step}
                </div>
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                    item.color === "purple"
                      ? "bg-purple-500/20 text-purple-400"
                      : item.color === "pink"
                      ? "bg-pink-500/20 text-pink-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-24 px-6 gradient-hero">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 rounded-full px-4 py-1.5 mb-6">
            <Shield className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-pink-300">Registered 501(c)(3) Nonprofit</span>
          </div>
          <h2 className="text-4xl font-bold mb-6">
            Every Video Helps a Dog in Need
          </h2>
          <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-3xl mx-auto">
            PupTV is a nonprofit. After covering operating costs, every dollar goes directly
            to vetted dog rescue organizations, shelters, and veterinary care programs.
            Your entertainment funds real impact.
          </p>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                stat: "100%",
                label: "Profits to Charity",
                desc: "After modest operating overhead",
              },
              {
                icon: Shield,
                stat: "Vetted",
                label: "Partner Charities",
                desc: "Transparent fund allocation",
              },
              {
                icon: TrendingUp,
                stat: "Real",
                label: "Impact Reports",
                desc: "See where your money goes",
              },
            ].map((item, i) => (
              <div key={i} className="gradient-card rounded-2xl p-6 text-center">
                <item.icon className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{item.stat}</div>
                <div className="text-sm font-medium text-purple-300 mb-1">{item.label}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why PupTV */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="gradient-card rounded-3xl p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Why PupTV Over Generic Dog Videos?
                </h2>
                <div className="space-y-4 text-slate-400">
                  <p>
                    The internet is flooded with low-quality &quot;dog TV&quot; content cranked out by overseas
                    content farms — repetitive, generic, and made purely for ad revenue.
                  </p>
                  <p>
                    PupTV is different. Every video features <em className="text-white">your actual dog</em> as
                    the cartoon hero. It&apos;s personalized, high-quality, and your money goes to
                    helping real dogs — not anonymous content mills.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Personalized to your dog", check: true },
                  { label: "AI-generated cartoon style", check: true },
                  { label: "Funds dog charities", check: true },
                  { label: "Made in the USA", check: true },
                  { label: "Generic content farm videos", check: false },
                  { label: "Ad-stuffed filler content", check: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                        item.check
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {item.check ? "\u2713" : "\u2715"}
                    </div>
                    <span className={item.check ? "text-white" : "text-slate-500 line-through"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center gradient-hero">
        <div className="max-w-3xl mx-auto">
          <Dog className="w-16 h-16 text-purple-400 mx-auto mb-6 paw-bounce" />
          <h2 className="text-4xl font-bold mb-4">
            Ready to Make Your Pup a Star?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            It takes less than a minute. Upload some photos and let the magic happen.
          </p>
          <Link
            href="/create"
            className="gradient-btn-primary text-white font-semibold px-10 py-4 rounded-full text-lg inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Create Your Dog&apos;s Video
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Dog className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-slate-500">
              PupTV &copy; {new Date().getFullYear()} — A nonprofit for dogs, by dog lovers
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
