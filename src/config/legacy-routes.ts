/**
 * Canonical inventory of every URL that exists on the live WordPress site
 * as of 2026-09-07, captured from sitemap_index.xml and the WP REST API.
 *
 * HARD REQUIREMENT: every path below must still return 200 after the
 * redesign. The Bangla version is served at the original path; the English
 * version is mirrored under /en<path>. Nothing here may be renamed or
 * redirected away.
 *
 * Verified by the route coverage test in tests/legacy-routes.test.ts.
 */

/** Standalone pages. */
export const LEGACY_PAGES = [
  "/",
  "/blog/",
  "/ambulance-service/",
] as const;

/** Blog posts, in reverse-chronological order as published. */
export const LEGACY_POSTS = [
  { slug: "varendra-research-museum-rajshahi-day-trip", date: "2026-04-11", category: "weekend-trip" },
  { slug: "5-star-car-rental-reviews-rajshahi", date: "2026-04-10", category: "customer-stories" },
  { slug: "2-day-car-rental-discount-rajshahi-april", date: "2026-04-09", category: "promotions-offers" },
  { slug: "how-to-choose-right-rental-car-rajshahi", date: "2026-04-08", category: "tips-how-to" },
  { slug: "top-7-places-visit-rajshahi-car-guide", date: "2026-04-07", category: "travel-guide" },
  { slug: "ac-car-fleet-rajshahi-rent-a-car", date: "2026-04-06", category: "fleet-vehicles" },
  { slug: "rajshahi-city-of-silk-car-tour", date: "2026-04-05", category: "culture-heritage" },
  { slug: "puthia-temple-day-trip-rajshahi-car", date: "2026-04-04", category: "weekend-trip" },
  { slug: "first-time-car-rental-rajshahi-experience", date: "2026-04-03", category: "customer-stories" },
  { slug: "april-car-rental-discount-rajshahi", date: "2026-04-02", category: "promotions-offers" },
  { slug: "why-rent-a-car-in-rajshahi", date: "2026-04-01", category: "tips-how-to" },
  { slug: "rajshahi-travel-guide", date: "2026-02-04", category: "rajshahi-travel-guide" },
  { slug: "best-rent-a-car-in-rajshahi", date: "2026-02-04", category: "rent-a-car-rajshahi" },
] as const;

/**
 * Category archives. `path` is the full WordPress permalink, which for the
 * nested "local attractions" category includes its parent segment.
 */
export const LEGACY_CATEGORIES = [
  { path: "/category/culture-heritage/" },
  { path: "/category/customer-stories/" },
  { path: "/category/fleet-vehicles/" },
  { path: "/category/promotions-offers/" },
  { path: "/category/rajshahi-travel-guide/" },
  { path: "/category/rajshahi-travel-guide/local-attractions-hidden-gems-historical-sites-in-rajshahi/" },
  { path: "/category/rent-a-car-rajshahi/" },
  { path: "/category/tips-how-to/" },
  { path: "/category/travel-guide/" },
  { path: "/category/weekend-trip/" },
] as const;

/** Tag archives. */
export const LEGACY_TAGS = [{ path: "/tag/rent-a-car-rajshahi/" }] as const;

/** Every legacy path, flattened. 27 URLs total. */
export const ALL_LEGACY_PATHS: readonly string[] = [
  ...LEGACY_PAGES,
  ...LEGACY_POSTS.map((p) => `/${p.slug}/`),
  ...LEGACY_CATEGORIES.map((c) => c.path),
  ...LEGACY_TAGS.map((t) => t.path),
];
