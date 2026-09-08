import type { Locale } from "@/lib/locale";

/**
 * Canonical path for every non-article route, per locale.
 *
 * Bangla pages that are new to this build get Bangla slugs. The legacy
 * WordPress paths — /blog/, /ambulance-service/, all 13 posts, the category
 * archives and the tag — keep their original English slugs in both locales,
 * because they are indexed and must not move (src/config/legacy-routes.ts).
 * The result is deliberately mixed; that is the cost of not breaking URLs.
 *
 * WHY THE `ascii` FIELD EXISTS
 *
 * Next 16 cannot prerender a route whose directory name is non-ASCII — the
 * export throws InvalidCharacterError, since the path is passed through a
 * Latin-1-only encoder internally. So the route directories on disk stay
 * ASCII, the built pages link to the Bangla paths, and
 * scripts/localise-slugs.mts renames the exported directories afterwards.
 *
 * In `next dev` no such rename happens, so `route()` serves the ASCII path
 * during development and the Bangla path in the production build. Without
 * that, every Bangla link would 404 locally.
 *
 * Bengali slugs travel as percent-encoded UTF-8 wherever they are not
 * decoded for display. Browsers and the major messengers decode them.
 */
type RouteDef = { bn: string; en: string; ascii?: string };

export const ROUTES = {
  home: { bn: "/", en: "/en/" },

  // New in this build — Bangla slugs, ASCII directory on disk.
  fleet: { bn: "/গাড়িবহর/", en: "/en/fleet/", ascii: "/fleet/" },
  pricing: { bn: "/ভাড়ার-তালিকা/", en: "/en/pricing/", ascii: "/pricing/" },
  tours: { bn: "/ট্যুর-প্যাকেজ/", en: "/en/tour-packages/", ascii: "/tour-packages/" },
  wedding: { bn: "/বিয়ের-গাড়ি/", en: "/en/wedding-car/", ascii: "/wedding-car/" },
  about: { bn: "/আমাদের-সম্পর্কে/", en: "/en/about/", ascii: "/about/" },
  contact: { bn: "/যোগাযোগ/", en: "/en/contact/", ascii: "/contact/" },
  faq: { bn: "/সাধারণ-জিজ্ঞাসা/", en: "/en/faq/", ascii: "/faq/" },

  // Legacy — indexed, must not change.
  blog: { bn: "/blog/", en: "/en/blog/" },
  ambulance: { bn: "/ambulance-service/", en: "/en/ambulance-service/" },
} as const satisfies Record<string, RouteDef>;

export type RouteKey = keyof typeof ROUTES;

export function route(locale: Locale, key: RouteKey): string {
  const def: RouteDef = ROUTES[key];
  if (locale === "en") return def.en;
  return process.env.NODE_ENV === "development" ? (def.ascii ?? def.bn) : def.bn;
}
