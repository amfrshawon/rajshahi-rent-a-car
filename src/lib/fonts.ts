import { Anek_Latin, Noto_Sans_Bengali } from "next/font/google";

/**
 * Noto Sans Bengali covers Bangla text and Bengali numerals. Preload only
 * the Bengali subset; the variable face supplies real body and heading
 * weights through one family.
 */
export const bangla = Noto_Sans_Bengali({
  variable: "--font-bangla",
  subsets: ["bengali"],
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
