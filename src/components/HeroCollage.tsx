"use client";

import { motion, useReducedMotion } from "framer-motion";
import AutoVideo from "./AutoVideo";

/** src, alt, resting rotation, and the CSS class that mirrors it. */
const TILES = [
  {
    /* The signature shot, and the only moving tile: five seconds of Dutch
       chasing a butterfly. The poster is the still that used to live in
       this frame, so with reduced motion the hero is byte-identical to
       what shipped before. */
    video: "/videos/park.mp4",
    src: "/demo/poster-art.jpg",
    alt: "Cartoon of Dutch, a tan French Bulldog, bounding through a sunlit meadow after a blue butterfly",
    rotate: -2.2,
    tilt: "tilt-a",
  },
  {
    src: "/demo/still-1.jpg",
    alt: "Cartoon of Dutch mid-bound through a wildflower meadow, chasing a blue butterfly",
    rotate: 1.8,
    tilt: "tilt-b",
  },
  {
    src: "/demo/birthday.jpg",
    alt: "Cartoon of Dutch in a party hat beside a birthday cake, surrounded by balloons",
    rotate: -1.2,
    tilt: "tilt-c",
  },
] as const;

/**
 * The hero arrangement: one tall portrait beside two stacked scenes,
 * each on a slight rotation so it reads as photos laid out on a table
 * rather than a stock grid.
 *
 * The imagery is the pitch, so it must not wait on JavaScript. The
 * animation only ever touches opacity, a few pixels of travel, and the
 * rotation the CSS already applies — if the script never runs, the
 * tiles are already in their final position via `.tilt-*`. With
 * reduced motion requested we skip framer entirely.
 *
 * Rotation is passed through framer rather than left to the class,
 * because framer writes an inline `transform` that would otherwise
 * flatten the tilt.
 */
export default function HeroCollage() {
  const reduced = useReducedMotion();

  return (
    <div className="hero-glow">
      <div className="collage">
        <div className="collage-tall">
          <Tile index={0} priority reduced={reduced} />
        </div>
        <div className="collage-stack">
          <Tile index={1} reduced={reduced} />
          <Tile index={2} reduced={reduced} />
        </div>
      </div>
    </div>
  );
}

function Tile({
  index,
  priority = false,
  reduced,
}: {
  index: number;
  priority?: boolean;
  reduced: boolean | null;
}) {
  const t = TILES[index];
  const video = "video" in t ? t.video : undefined;

  // A tile with a clip still ships its poster in the server HTML, so the
  // frame is filled on first paint whether or not the script ever runs.
  const art = video ? (
    <AutoVideo src={video} poster={t.src} alt={t.alt} eager />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element -- static demo art, sized entirely by CSS
    <img
      src={t.src}
      alt={t.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );

  if (reduced) {
    return <div className={`tile ${t.tilt}`}>{art}</div>;
  }

  return (
    <motion.div
      className="tile"
      initial={{ opacity: 0, y: 26, scale: 0.95, rotate: t.rotate }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: t.rotate }}
      whileHover={{ y: -6, scale: 1.02, rotate: t.rotate }}
      transition={{ duration: 0.7, delay: 0.09 * index, ease: [0.2, 0.7, 0.3, 1] }}
    >
      {art}
    </motion.div>
  );
}
