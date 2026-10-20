import type { Metadata } from "next";
import { SITE } from "@/config/site";
import type { Locale } from "@/lib/locale";

/**
 * Per-page Open Graph and Twitter fields. Next does not derive og:url from the
 * canonical, so each page passes its own path. Images come from the
 * opengraph-image route in each root layout.
 */
export function social(
  locale: Locale,
  path: string,
  type: "website" | "article" = "website",
): Pick<Metadata, "openGraph"> {
  return {
    openGraph: {
      type,
      url: path,
      siteName: SITE.name[locale],
      locale: locale === "bn" ? "bn_BD" : "en_US",
      alternateLocale: locale === "bn" ? "en_US" : "bn_BD",
    },
  };
}

/** Trim to a SERP-friendly length at a word boundary. */
export function trimDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > 80 ? cut.slice(0, space) : cut).replace(/[,;:.\-–—]+$/, "")}…`;
}

/** Fallback for archives whose taxonomy entry has no hand-written description. */
export const ARCHIVE_DESC = {
  bn: (title: string, count: number) =>
    `${title} বিষয়ে ${count}টি গাইড ও টিপস — রাজশাহী রেন্ট এ কার-এর ভ্রমণ ও গাড়ি ভাড়া ব্লগ।`,
  en: (title: string, count: number) =>
    `${count} guides and tips on ${title} from the Rajshahi Rent A Car travel and car rental blog.`,
};
