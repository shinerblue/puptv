"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Check, Loader2 } from "lucide-react";

interface SendToTvModalProps {
  petName: string;
  onClose: () => void;
}

export default function SendToTvModal({ petName, onClose }: SendToTvModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const name = petName || "Your dog";
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape to dismiss + move focus into the dialog on open. Without this the
  // modal was mouse-only and left keyboard focus behind on the page under it.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSend = () => {
    if (!email.trim()) return;
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 900);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 200, padding: "24px" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-to-tv-title"
        className="rounded-2xl p-8 w-full max-w-md relative"
        style={{ background: "#FFFFFF" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute rounded-full flex items-center justify-center"
          style={{ top: 16, right: 16, width: 32, height: 32, background: "#F5F5F5", border: "none", cursor: "pointer" }}
        >
          <X className="w-4 h-4" style={{ color: "#6E6E73" }} />
        </button>

        {status === "sent" ? (
          <div className="text-center py-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "#ECFDF5" }}
            >
              <Check className="w-6 h-6" style={{ color: "#10B981" }} />
            </div>
            <p id="send-to-tv-title" className="font-semibold mb-2" style={{ fontSize: "17px", color: "#1D1D1F" }}>
              Demo: they&apos;ll get it on their channel
            </p>
            <p className="text-sm" style={{ color: "#6E6E73", lineHeight: 1.5 }}>
              In production, {email} gets an email with a link — {name}&apos;s episode shows up on their
              YouTube automatically. No account, no password.
            </p>
          </div>
        ) : (
          <>
            <h3 id="send-to-tv-title" className="font-bold mb-2" style={{ fontSize: "22px", color: "#1D1D1F" }}>
              Send this episode to another TV
            </h3>
            <p className="text-sm mb-5" style={{ color: "#6E6E73", lineHeight: 1.5 }}>
              Enter their email — we&apos;ll send {name}&apos;s episode straight to their channel. Demo mode:
              no email is actually sent.
            </p>
            <label
              htmlFor="send-to-tv-email"
              className="block font-semibold mb-2"
              style={{ fontSize: "15px", color: "#1D1D1F" }}
            >
              Their email address
            </label>
            <input
              id="send-to-tv-email"
              name="recipientEmail"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="grandma@example.com"
              className="w-full rounded-xl px-4 py-4 outline-none border-2 mb-4"
              style={{ fontSize: "16px", borderColor: "#E5E5E5", color: "#1D1D1F" }}
            />
            <button
              onClick={handleSend}
              disabled={!email.trim() || status === "sending"}
              className="btn-large w-full rounded-2xl flex items-center justify-center gap-2"
              style={{
                background: !email.trim() ? "#E5E5E5" : "#1D1D1F",
                color: !email.trim() ? "#9CA3AF" : "#FFFFFF",
                cursor: !email.trim() ? "not-allowed" : "pointer",
              }}
            >
              {status === "sending" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {status === "sending" ? "Sending…" : "Send (demo)"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
