import { Hind_Siliguri, Inter } from "next/font/google";

/**
 * Bangla face. Hind Siliguri is the de-facto standard for Bangladeshi sites:
 * it has proper conjunct (যুক্তাক্ষর) rendering and a full Bengali subset.
 * next/font self-hosts the files at build time, so the static export makes
 * no request to Google.
 */
export const bangla = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

/** Latin face, used for English pages and for numerals/labels throughout. */
export const latin = Inter({
  variable: "--font-latin",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});
