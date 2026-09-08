import { Anek_Bangla, Inter } from "next/font/google";

/**
 * Bangla face.
 *
 * The owner asked for the face Prothom Alo uses. That is Shurjo — a bespoke
 * typeface by Jacob Thomas, copyright held exclusively by Prothom Alo, with
 * "Shurjo" registered as Thomas's trademark. The sites offering it as a free
 * download are redistributing it without authorisation, so it is not usable
 * here at any price we can pay.
 *
 * Anek Bangla (Ek Type, SIL Open Font License) is the closest freely licensed
 * match: contemporary, squarish letterforms with open counters and properly
 * finished conjuncts (যুক্তাক্ষর), in the same editorial register as Shurjo.
 * Noto Sans Bengali is the alternative if wider, more neutral text is wanted.
 *
 * next/font self-hosts the files at build time, so the static export makes no
 * request to Google. Only the Bengali subset is loaded, and only the two
 * weights the design uses — Bengali subsets are large, so every extra weight
 * is a real cost on a Bangladeshi mobile connection.
 *
 * Latin runs inside Bangla text fall through to Inter (see --font-bn in
 * globals.css) rather than being carried twice.
 */
export const bangla = Anek_Bangla({
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
