import { Anek_Bangla, Anek_Latin } from "next/font/google";

/**
 * One family, used with range: Anek Bangla + Anek Latin (both Ek Type, SIL
 * Open Font License). They share a design, so Latin runs inside Bangla text do
 * not change voice. Inter is gone.
 *
 * WHY BANGLA LOADS TWO STATIC WEIGHTS
 *
 * next/font/google coalesces a weight array on a variable family into a single
 * variable file: the Bengali variable is 152 KB, which on its own is over the
 * 150 KB preload budget once Latin is added. Asking for one weight at a time
 * yields the static instances instead — 55 KB (400) and 54 KB (700) — so
 * Bangla loads both explicitly and stays inside budget.
 *
 * WHY THE WIDTH AXIS IS ON LATIN, WITHOUT PRELOAD
 *
 * Anek Bangla with its width axis is a 437 KB file. The Latin subset with the
 * width axis is ~100 KB — affordable, but not worth preloading on a Bangla
 * page where almost nothing is Latin. Latin is preloaded off and arrives only
 * when a Latin glyph is actually rendered; English pages, which are all Latin,
 * pay it once. All measurements are in docs/audit/REDESIGN-PROGRESS.md.
 */
export const bangla = Anek_Bangla({
  variable: "--font-bangla",
  subsets: ["bengali"],
  weight: "400",
  display: "swap",
  preload: true,
});

export const banglaBold = Anek_Bangla({
  variable: "--font-bangla-bold",
  subsets: ["bengali"],
  weight: "700",
  display: "swap",
  preload: true,
});

/** Latin face: English pages, and Latin runs inside Bangla text. */
export const latin = Anek_Latin({
  variable: "--font-latin",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  preload: false,
});
