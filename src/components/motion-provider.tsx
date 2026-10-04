"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation } from "motion/react";

/**
 * Loads the small `motion` feature set once, app-wide, in strict mode —
 * components may only use the `m` entry point, so the full `motion` bundle
 * can never sneak into a page by accident. domAnimation covers the
 * interactions this site needs (enter/exit, whileHover, whileTap); the
 * heavier domMax set (drag, layout) is not pulled in.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
