import { Stethoscope, Building2, Users, Mail, Moon } from "lucide-react";
import SimpleNav from "@/components/SimpleNav";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";

const AUDIENCES = [
  {
    Icon: Building2,
    well: "icon-well",
    label: "Kennels",
    desc: "Calm lobby and kennel-run video, running all day without anyone touching it.",
  },
  {
    Icon: Stethoscope,
    well: "icon-well icon-well-sky",
    label: "Vets",
    desc: "Something genuinely soothing on the waiting-room screen instead of daytime news.",
  },
  {
    Icon: Users,
    well: "icon-well icon-well-leaf",
    label: "Daycares",
    desc: "Continuous, low-stress video for playrooms and quiet corners.",
  },
];

export default function ProsPage() {
  return (
    <div className="min-h-screen warm-page">
      <SimpleNav hideCta />

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <span className="chip chip-sky mb-6">
          <Moon className="w-4 h-4" />
          Calm mode, at business scale
        </span>
        <h1
          className="font-bold mb-5"
          style={{ fontSize: "clamp(30px, 6vw, 48px)", letterSpacing: "-0.03em", lineHeight: 1.08, color: "#1D1D1F" }}
        >
          Calm loops for kennels,
          <br />
          <span style={{ color: "#C2410C" }}>vets, and daycares</span>
        </h1>
        <p className="text-xl mx-auto leading-relaxed" style={{ color: "#6B625B", maxWidth: "540px" }}>
          The same calming mode we built for anxious pups at home — sized for your lobby and
          kennel TVs.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-14">
        <Reveal>
          <div className="tile tile-hover tilt-c">
            {/* eslint-disable-next-line @next/next/no-img-element -- static demo art */}
            <img
              src="/demo/still-3.jpg"
              alt="Cartoon of a French Bulldog asleep against a mossy tree root — a frame from a calm-mode loop"
              loading="lazy"
              style={{ aspectRatio: "21 / 9" }}
            />
          </div>
          <p className="text-sm mt-5 text-center" style={{ color: "#6B625B" }}>
            A frame from an actual calm-mode loop: gentle pacing, no jump cuts, dog-vision colors.
          </p>
        </Reveal>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {AUDIENCES.map(({ Icon, well, label, desc }, i) => (
            <Reveal key={label} delay={i * 0.08} className="h-full">
              <div className="card-warm card-lift p-7 text-center h-full">
                <div className={`${well} mx-auto mb-4`}>
                  <Icon className="w-6 h-6" style={{ color: "#C2410C" }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ fontSize: "18px", color: "#1D1D1F" }}>
                  {label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B625B" }}>
                  {desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
        <Reveal>
          <div className="card-warm p-10">
            <p className="mb-7 leading-relaxed" style={{ fontSize: "17px", color: "#6B625B" }}>
              Continuous, gentle-pacing video — dog-vision colors, no jump cuts, no ads to
              manage. We&apos;re still early. If you run a kennel, vet clinic, or daycare and
              want to pilot calm loops on your lobby TVs, get in touch and we&apos;ll set it up
              by hand.
            </p>
            <a
              href="mailto:hello@toontails.tv?subject=ToonTails%20for%20Business"
              className="btn-pill btn-ink"
            >
              <Mail className="w-5 h-5" />
              Get in touch
            </a>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
