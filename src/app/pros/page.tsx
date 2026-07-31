import { Stethoscope, Building2, Users, Mail } from "lucide-react";
import SimpleNav from "@/components/SimpleNav";
import SiteFooter from "@/components/SiteFooter";

const AUDIENCES = [
  { Icon: Building2, label: "Kennels", desc: "Calm lobby and kennel-run video, all day." },
  { Icon: Stethoscope, label: "Vets", desc: "Something soothing for the waiting room." },
  { Icon: Users, label: "Daycares", desc: "Continuous, low-stress video for playrooms." },
];

export default function ProsPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      <SimpleNav hideCta />

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-14 text-center">
        <h1
          className="font-bold mb-5"
          style={{ fontSize: "clamp(30px, 6vw, 48px)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1D1D1F" }}
        >
          Calm loops for kennels, vets, and daycares
        </h1>
        <p className="text-xl mx-auto leading-relaxed" style={{ color: "#6E6E73", maxWidth: "560px" }}>
          The same calming mode we built for anxious pups at home — sized for your lobby or kennel TVs.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {AUDIENCES.map(({ Icon, label, desc }) => (
            <div key={label} className="rounded-2xl p-6 border text-center" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "#F5F5F5" }}>
                <Icon className="w-5 h-5" style={{ color: "#F97316" }} />
              </div>
              <h3 className="font-semibold mb-1" style={{ color: "#1D1D1F" }}>{label}</h3>
              <p className="text-sm" style={{ color: "#6E6E73" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
        <div className="rounded-3xl p-10 border" style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}>
          <p className="mb-6 leading-relaxed" style={{ fontSize: "16px", color: "#6E6E73" }}>
            Continuous, gentle-pacing video — dog-vision colors, no jump cuts, no ads to manage.
            We&apos;re still early. If you run a kennel, vet clinic, or daycare and want to pilot
            calm loops on your lobby TVs, reach out and we&apos;ll set it up by hand.
          </p>
          <a
            href="mailto:hello@puptv.app?subject=PupTV%20for%20Business"
            className="btn-large rounded-2xl px-8 inline-flex items-center justify-center gap-2"
            style={{ background: "#1D1D1F", color: "#FFFFFF" }}
          >
            <Mail className="w-5 h-5" />
            Contact us
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
