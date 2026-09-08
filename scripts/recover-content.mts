/**
 * One-off recovery: rebuilds the WordPress snapshot from the last successful
 * deploy when the CMS itself is unreachable.
 *
 * Written during an outage of rajshahirentacar.bd, which took the build down
 * with it — every page fetched from the live REST API at build time. The
 * published preview still had every article, so it became the source.
 *
 * Normal refreshes use scripts/pull-content.mts against the real API. Keep
 * this for the next time the host goes down.
 */

import { writeFile } from "node:fs/promises";
import { LEGACY_POSTS } from "../src/config/legacy-routes.ts";

const SOURCE = "https://amfrshawon.github.io/rajshahi-rent-a-car";

/** Reconstructed from the live API as it was on 2026-09-07. */
const CATEGORIES = [
  { id: 27, slug: "culture-heritage", name: "Culture &amp; Heritage", parent: 0 },
  { id: 25, slug: "customer-stories", name: "Customer Stories", parent: 0 },
  { id: 29, slug: "fleet-vehicles", name: "Fleet &amp; Vehicles", parent: 0 },
  { id: 24, slug: "promotions-offers", name: "Promotions &amp; Offers", parent: 0 },
  { id: 1, slug: "rajshahi-travel-guide", name: "Rajshahi Travel Guide", parent: 0 },
  { id: 8, slug: "local-attractions-hidden-gems-historical-sites-in-rajshahi",
    name: "Local attractions, hidden gems, historical sites in Rajshahi", parent: 1 },
  { id: 6, slug: "rent-a-car-rajshahi", name: "Rent A Car Rajshahi", parent: 0 },
  { id: 23, slug: "tips-how-to", name: "Tips &amp; How-To", parent: 0 },
  { id: 22, slug: "travel-guide", name: "Travel Guide", parent: 0 },
  { id: 26, slug: "weekend-trip", name: "Weekend Trip", parent: 0 },
];

const TAGS = [{ id: 30, slug: "rent-a-car-rajshahi", name: "Rent A Car Rajshahi", parent: 0 }];

const POST_IDS: Record<string, number> = {
  "varendra-research-museum-rajshahi-day-trip": 273,
  "5-star-car-rental-reviews-rajshahi": 272,
  "2-day-car-rental-discount-rajshahi-april": 271,
  "how-to-choose-right-rental-car-rajshahi": 270,
  "top-7-places-visit-rajshahi-car-guide": 269,
  "ac-car-fleet-rajshahi-rent-a-car": 268,
  "rajshahi-city-of-silk-car-tour": 267,
  "puthia-temple-day-trip-rajshahi-car": 266,
  "first-time-car-rental-rajshahi-experience": 265,
  "april-car-rental-discount-rajshahi": 264,
  "why-rent-a-car-in-rajshahi": 263,
  "rajshahi-travel-guide": 242,
  "best-rent-a-car-in-rajshahi": 238,
};

/** Posts carrying a second category, as the live API reported. */
const EXTRA_CATEGORIES: Record<string, string[]> = {
  "rajshahi-travel-guide": ["local-attractions-hidden-gems-historical-sites-in-rajshahi"],
};

const catId = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.id;

async function get(path: string): Promise<string> {
  const res = await fetch(`${SOURCE}${path}`, {
    headers: { "user-agent": "content-recovery" },
  });
  if (!res.ok) throw new Error(`${res.status} for ${path}`);
  return res.text();
}

function extract(html: string, re: RegExp): string {
  return html.match(re)?.[1] ?? "";
}

const decode = (s: string) =>
  s
    .replace(/&#x27;|&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

type RecoveredPost = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  modified_gmt: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  categories: number[];
  tags: number[];
};

const posts: RecoveredPost[] = [];

for (const legacy of LEGACY_POSTS) {
  const html = await get(`/en/${legacy.slug}/`);

  const title = decode(
    extract(html, /<h1 class="mt-4 text-3xl font-semibold md:text-4xl">([\s\S]*?)<\/h1>/),
  );
  const content = extract(html, /<div class="prose mt-8">([\s\S]*?)<\/div><\/article>/);
  const description = decode(
    extract(html, /<meta name="description" content="([^"]*)"/),
  );

  if (!title || !content) throw new Error(`could not recover ${legacy.slug}`);

  const categories = [catId(legacy.category), ...(EXTRA_CATEGORIES[legacy.slug] ?? []).map(catId)]
    .filter((n): n is number => typeof n === "number");

  posts.push({
    id: POST_IDS[legacy.slug],
    slug: legacy.slug,
    date: `${legacy.date}T00:00:00`,
    modified: `${legacy.date}T00:00:00`,
    modified_gmt: `${legacy.date}T00:00:00`,
    title: { rendered: title },
    excerpt: { rendered: `<p>${description}</p>` },
    content: { rendered: content },
    categories,
    tags: legacy.slug === "best-rent-a-car-in-rajshahi" ? [30] : [],
  });

  console.log(`  recovered ${legacy.slug} (${content.length} chars)`);
}

const withCount = (terms: typeof CATEGORIES, key: "categories" | "tags") =>
  terms.map((t) => ({
    ...t,
    description: "",
    count: posts.filter((p) => (p[key] as number[]).includes(t.id)).length,
  }));

await writeFile(
  "src/content/wordpress.json",
  JSON.stringify(
    {
      recoveredAt: new Date().toISOString(),
      source: SOURCE,
      posts,
      categories: withCount(CATEGORIES, "categories"),
      tags: withCount(TAGS, "tags"),
      pages: [],
    },
    null,
    2,
  ) + "\n",
);

console.log(`\n✓ wrote src/content/wordpress.json — ${posts.length} posts`);
