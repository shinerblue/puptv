"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/** Everything focusable we ever put inside this dialog. */
const FOCUSABLE =
  'button, [href], video, input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * The full 30-second park episode, with its music, in an accessible dialog.
 *
 * Audio only ever starts because someone pressed a button that says it
 * will — the page itself never makes noise. Escape closes, Tab cycles
 * inside the panel, and focus returns to the button that opened it.
 */
export default function FullEpisodeModal({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    // Opening this dialog was itself a click, so playback here is
    // user-initiated and the browser will allow sound. If it refuses
    // anyway, the native controls are sitting right there.
    void videoRef.current?.play().catch(() => {});

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = panelRef.current;
      if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled"),
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="full-episode-title"
        aria-describedby="full-episode-note"
        className="card-warm modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="modal-close"
        >
          <X className="w-5 h-5" style={{ color: "#C2410C" }} aria-hidden="true" />
        </button>

        <h2
          id="full-episode-title"
          className="font-bold"
          style={{ fontSize: "24px", letterSpacing: "-0.02em", color: "#1D1D1F", paddingRight: "44px" }}
        >
          Dutch&apos;s park episode
        </h2>
        <p
          id="full-episode-note"
          className="text-sm mt-2 mb-5 leading-relaxed"
          style={{ color: "#6B625B" }}
        >
          The whole thing — thirty seconds, with the music. Dutch is a real French Bulldog and
          this came out of the same pipeline your dog&apos;s episode will.
        </p>

        <div className="modal-video">
          <video
            ref={videoRef}
            src="/videos/full-episode.mp4"
            poster="/demo/still-1.jpg"
            controls
            playsInline
            preload="none"
          />
        </div>

        <p className="text-sm mt-4 text-center" style={{ color: "#6B625B" }}>
          Sound is on. Press Escape or the ✕ to close.
        </p>
      </div>
    </div>
  );
}
