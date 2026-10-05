import localFont from "next/font/local";

/**
 * English pages' type: the Latin cuts of the same family (see fonts-bn.ts).
 * Imported only by the English root layout. Text and display are preloaded
 * (34 KB together); strong loads only where an article sets bold.
 *
 * The one Bangla word on an English page, the language switch, falls
 * through to the system's Bengali font rather than pulling a 73 KB file.
 */
export const text = localFont({
  src: "../fonts/rrc-en-text-400.woff2",
  weight: "400",
  variable: "--rrc-text",
  display: "swap",
});

export const display = localFont({
  src: "../fonts/rrc-en-display-800.woff2",
  weight: "800",
  variable: "--rrc-display",
  display: "swap",
});

export const strong = localFont({
  src: "../fonts/rrc-en-strong-600.woff2",
  weight: "600",
  variable: "--rrc-strong",
  display: "swap",
  preload: false,
});

export const fontVariables = `${text.variable} ${display.variable} ${strong.variable}`;
