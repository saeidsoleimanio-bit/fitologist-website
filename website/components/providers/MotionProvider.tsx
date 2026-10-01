"use client";

import { MotionConfig } from "framer-motion";

/**
 * reducedMotion="user" makes Framer Motion drop transform/layout animations
 * (keeping gentle opacity fades) for visitors with prefers-reduced-motion.
 * Scroll-linked effects additionally opt out via useReducedMotion().
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
