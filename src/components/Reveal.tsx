"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger helper — seconds to wait before this element animates in. */
  delay?: number;
  /** How far it travels. Keep it small; this should feel calm, not flashy. */
  y?: number;
  className?: string;
}

/**
 * Gentle scroll-in for a block of content.
 *
 * Two things keep this honest for the 55+ audience the product is built
 * for. First, `useReducedMotion()` reads the same OS setting as the
 * `prefers-reduced-motion` block in globals.css, and when it is on we
 * render a plain <div> with no transform at all. Second, `once: true`
 * means nothing ever re-animates as you scroll back up — content that
 * keeps moving is what makes motion feel busy.
 */
export default function Reveal({ children, delay = 0, y = 18, className }: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.55, delay, ease: [0.2, 0.7, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
