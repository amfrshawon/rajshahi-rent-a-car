import { Hind_Siliguri, Inter } from "next/font/google";

/**
 * Bangla face. Hind Siliguri is the de-facto standard for Bangladeshi sites:
 * it has proper conjunct (যুক্তাক্ষর) rendering and a full Bengali subset.
 * next/font self-hosts the files at build time, so the static export makes
 * no request to Google.
 *
 * Only the Bengali subset is loaded, and only the three weights the design
 * actually uses. Bengali subsets are ~40 KB each, so every extra weight is a
 * real cost on a Bangladeshi mobile connection — and every declared subset
 * and weight gets preloaded on the page.
 *
 * Latin glyphs inside Bangla text fall through to Inter (see --font-bn in
 * globals.css) rather than being carried twice.
 */
export const bangla = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["bengali"],
  weight: ["400", "600"],
  display: "swap",
  preload: true,
});

/** Latin face, used for English pages and for Latin runs inside Bangla text. */
export const latin = Inter({
  variable: "--font-latin",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});
