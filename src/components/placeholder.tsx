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

/**
 * Where a photograph from the owner's planned shoot will go (shot list in
 * docs/audit/2026-10-05-design-audit.md). Dev and preview builds show a
 * labelled frame at the photo's ratio; production shows nothing, and no
 * stock photo stands in.
 */
export function PhotoSlot({ shot, className = "" }: { shot: string; className?: string }) {
  if (!SHOW) return null;
  return (
    <div
      data-placeholder=""
      className={`border-field text-ink-soft grid aspect-[3/2] place-items-center rounded-lg border border-dashed p-6 text-center text-sm ${className}`}
    >
      <span>
        <span className="type-display block">Photo shoot</span>
        {shot}
      </span>
    </div>
  );
}
