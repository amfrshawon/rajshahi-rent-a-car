import { Anek_Latin, Hind_Siliguri } from "next/font/google";

/**
 * Hind Siliguri is used for every Bangla page. Load only the Bengali subset
 * and the 400/600 static weights needed for body and heading text to stay
 * within the mobile preload budget.
 */
export const bangla = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["bengali"],
  weight: "400",
  display: "swap",
  preload: true,
});

export const banglaSemibold = Hind_Siliguri({
  variable: "--font-bangla-semibold",
  subsets: ["bengali"],
  weight: "600",
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
