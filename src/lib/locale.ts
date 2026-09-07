export const LOCALES = ["bn", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Bangla is the default and lives at the root; English is prefixed. */
export const DEFAULT_LOCALE: Locale = "bn";

/** Pick one of a bn/en pair. */
export function t<T>(locale: Locale, pair: { bn: T; en: T }): T {
  return pair[locale];
}

/**
 * Turn a canonical (Bangla) path into the path for a given locale.
 * The Bangla path is always the original WordPress URL — see
 * src/config/legacy-routes.ts.
 */
export function localePath(locale: Locale, path: string): string {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return normalised;
  return normalised === "/" ? "/en/" : `/en${normalised}`;
}

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;

/** 4500 -> "৪৫০০" for Bangla, unchanged for English. */
export function localeDigits(locale: Locale, value: number | string): string {
  const s = String(value);
  if (locale !== "bn") return s;
  return s.replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

/** 4500 -> "৪,৫০০" / "4,500" with locale-correct grouping. */
export function formatTaka(locale: Locale, amount: number): string {
  const grouped = new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US").format(amount);
  return locale === "bn" ? grouped : grouped;
}
