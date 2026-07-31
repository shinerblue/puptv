"use client";

interface PreviewGateProps {
  stills: string[];
  petName: string;
  onApprove: () => void;
  onRetry: () => void;
  retryUsed: boolean;
}

export default function PreviewGate({ stills, petName, onApprove, onRetry, retryUsed }: PreviewGateProps) {
  const name = petName || "Your dog";
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stills.map((src, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden border aspect-square"
            style={{ borderColor: "#E5E5E5" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${name}'s cartoon scene ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-6 border mb-8"
        style={{ background: "#FFFFFF", borderColor: "#E5E5E5" }}
      >
        <p className="font-semibold mb-1" style={{ fontSize: "17px", color: "#1D1D1F" }}>
          Does this look like {name}?
        </p>
        <p className="text-sm" style={{ color: "#6E6E73", lineHeight: 1.6 }}>
          These are the three scenes we&apos;ll turn into video. If the coat, ears, or a marking
          are off, go back and add a detail — for example &ldquo;very short stubby tail&rdquo; or
          &ldquo;white patch over left eye&rdquo; — and we&apos;ll regenerate for free, once.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onRetry}
          disabled={retryUsed}
          className="btn-large flex-1 rounded-2xl border-2"
          style={{
            borderColor: "#E5E5E5",
            color: retryUsed ? "#D4D4D4" : "#6E6E73",
            background: "#FFFFFF",
            cursor: retryUsed ? "not-allowed" : "pointer",
          }}
        >
          {retryUsed ? "Free retry used" : "← Not quite right, let me fix a detail"}
        </button>
        <button
          type="button"
          onClick={onApprove}
          className="btn-large flex-[1.4] rounded-2xl"
          style={{ background: "#1D1D1F", color: "#FFFFFF" }}
        >
          Looks like {name} — continue →
        </button>
      </div>
    </div>
  );
}
