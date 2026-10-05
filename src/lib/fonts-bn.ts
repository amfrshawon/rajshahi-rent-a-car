import localFont from "next/font/local";

/**
 * Bangla pages' type. Imported only by the Bangla root layout, so these
 * files are preloaded on Bangla pages and nowhere else.
 *
 * Anek Bangla (Ek Type, SIL Open Font License), cut into static files by
 * scripts/build-fonts.py: Bengali plus ASCII, so car names and "WhatsApp"
 * need no second font. Shurjo, the face Prothom Alo uses, is proprietary and
 * not an option at any price.
 *
 * Preloaded: text (73 KB) and display (62 KB), 135 KB in all. The strong cut
 * (74 KB) is only for bold words inside articles and downloads only on pages
 * that set one.
 *
 * adjustFontFallback is off: its metric match is computed for Arial, which
 * has no Bengali, so the adjusted fallback would never be the one drawn.
 */
export const text = localFont({
  src: "../fonts/rrc-bn-text-400.woff2",
  weight: "400",
  variable: "--rrc-text",
  display: "swap",
  adjustFontFallback: false,
});

export const display = localFont({
  src: "../fonts/rrc-bn-display-800.woff2",
  weight: "800",
  variable: "--rrc-display",
  display: "swap",
  adjustFontFallback: false,
});

export const strong = localFont({
  src: "../fonts/rrc-bn-strong-600.woff2",
  weight: "600",
  variable: "--rrc-strong",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const fontVariables = `${text.variable} ${display.variable} ${strong.variable}`;
