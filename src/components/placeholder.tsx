import type { ReactNode } from "react";
import { IS_PREVIEW } from "@/config/deploy";

const SHOW = IS_PREVIEW || process.env.NODE_ENV === "development";

/**
 * A figure the design has room for but nobody has confirmed: a distance, a
 * travel time. Drawn with a dashed outline on dev and preview builds so the
 * owner can see what is missing, and left out of production entirely, so a
 * customer never sees an invented or unfinished number. Each one is listed
 * in docs/audit/REDESIGN-PROGRESS.md.
 */
export function Placeholder({ children, note }: { children: ReactNode; note: string }) {
  if (!SHOW) return null;
  return (
    <span
      data-placeholder=""
      title={note}
      className="border-field text-ink-soft inline-flex items-center rounded border border-dashed px-1.5 text-sm leading-6 whitespace-nowrap"
    >
      {children}
    </span>
  );
}
