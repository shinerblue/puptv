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
        className="card-warm p-8 w-full max-w-md relative"
        style={{ boxShadow: "0 24px 60px rgba(43,28,12,0.35)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute rounded-full flex items-center justify-center"
          style={{ top: 16, right: 16, width: 36, height: 36, background: "#FFEDD5", border: "none", cursor: "pointer" }}
        >
          <X className="w-4 h-4" style={{ color: "#C2410C" }} />
        </button>

        {status === "sent" ? (
          <div className="text-center py-4">
            <div
              className="icon-well icon-well-leaf mx-auto mb-4 pop-in"
              style={{ borderRadius: 9999 }}
            >
              <Check className="w-6 h-6" style={{ color: "#047857" }} />
            </div>
            <p id="send-to-tv-title" className="font-semibold mb-2" style={{ fontSize: "17px", color: "#1D1D1F" }}>
              Demo: they&apos;ll get it on their channel
            </p>
            <p className="text-sm" style={{ color: "#6B625B", lineHeight: 1.5 }}>
              In production, {email} gets an email with a link — {name}&apos;s episode shows up on their
              YouTube automatically. No account, no password.
            </p>
          </div>
        ) : (
          <>
            <h3 id="send-to-tv-title" className="font-bold mb-2" style={{ fontSize: "22px", color: "#1D1D1F" }}>
              Send this episode to another TV
            </h3>
            <p className="text-sm mb-5" style={{ color: "#6B625B", lineHeight: 1.5 }}>
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
              className="field field-sm mb-4"
            />
            <button
              onClick={handleSend}
              disabled={!email.trim() || status === "sending"}
              className="btn-pill btn-soft btn-block btn-ink"
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
