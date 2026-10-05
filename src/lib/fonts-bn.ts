import localFont from "next/font/local";

/**
 * Bangla pages' type. Imported only by the Bangla root layout, so this file
 * is preloaded on Bangla pages and nowhere else.
 *
 * One web font: the display cut of Anek Bangla (Ek Type, SIL Open Font
 * License), width 125, weight 800, made by scripts/build-fonts.py. It sets
 * headlines, figures, buttons and labels — the brand's voice. It includes
 * ASCII, so car names in it need no second font. 59 KB.
 *
 * Reading text uses the phone's own Bengali font (Noto Sans Bengali on
 * Android, Kohinoor Bangla on iPhone, Nirmala UI on Windows); see
 * --font-text in globals.css. Measured: with Anek's reading cut as well,
 * 130 KB of font loads before the first paint and Lighthouse's mobile LCP
 * for the home page was 2.8 s against a 2.5 s budget; without it, see
 * docs/audit/REDESIGN-PROGRESS.md. Every Bangla reader already has a
 * well-made Bengali system font, and body text in it costs nothing.
 *
 * Shurjo, the face Prothom Alo uses, is proprietary and not an option.
 *
 * adjustFontFallback is off: its metric match is computed for Arial, which
 * has no Bengali, so the adjusted fallback would never be the one drawn.
 */
export const display = localFont({
  src: "../fonts/rrc-bn-display-800.woff2",
  weight: "800",
  variable: "--rrc-display",
  display: "swap",
  adjustFontFallback: false,
});

export const fontVariables = display.variable;
