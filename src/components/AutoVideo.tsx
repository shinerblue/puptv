"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface AutoVideoProps {
  /** A clip in /public/videos. */
  src: string;
  /** The still that already occupies this frame, so nothing flashes empty. */
  poster: string;
  /** Describes the scene. Used verbatim as the reduced-motion still's alt. */
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  /**
   * The hero clip is the pitch, so it may fetch metadata straight away.
   * Everything else stays at preload="none" until it scrolls into view —
   * which is why there is no `autoplay` attribute on those: `autoplay`
   * overrides `preload="none"` and would pull every clip on first paint.
   */
  eager?: boolean;
}

/**
 * A muted, looping clip that behaves like the still it replaces.
 *
 * Three rules, all of them about not punishing the visitor:
 *  1. With reduced motion requested we render the poster as a plain
 *     <img> — same picture, same alt, no video element at all.
 *  2. Nothing downloads until the frame is near the viewport, and
 *     playback stops again once it leaves.
 *  3. If autoplay is refused (low power mode, data saver), the poster
 *     stays up. That is the exact picture this page used to show, so a
 *     refusal looks like the old page rather than like a bug.
 */
export default function AutoVideo({
  src,
  poster,
  alt,
  className,
  style,
  eager = false,
}: AutoVideoProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { rootMargin: "200px 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (inView) {
      // Safari only honours autoplay when muted is set on the element
      // itself, and React does not always reflect it as an attribute.
      el.muted = true;
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [inView, reduced]);

  if (reduced) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static demo art, sized entirely by CSS
      <img src={poster} alt={alt} className={className} style={style} loading="lazy" />
    );
  }

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      aria-label={alt}
      muted
      loop
      playsInline
      autoPlay={eager || undefined}
      preload={eager ? "metadata" : "none"}
      className={className}
      style={style}
    />
  );
}
