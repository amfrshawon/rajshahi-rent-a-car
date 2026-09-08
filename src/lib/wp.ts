/**
 * WordPress content, read from a snapshot committed to this repo.
 *
 * It used to fetch the live REST API during `next build`. When
 * rajshahirentacar.bd went down on 2026-09-08 that took the build with it —
 * CI could not produce a deploy because the CMS was unreachable. A static
 * site should not be able to fail that way.
 *
 * Builds are now offline and reproducible: the same commit always produces
 * the same pages. The cost is that new WordPress posts do not appear until
 * someone refreshes the snapshot:
 *
 *     npm run content:pull      # requires the CMS to be reachable
 *
 * That is a deliberate trade — a build that cannot break because of someone
 * else's hosting is worth an explicit refresh step.
 */

import snapshot from "@/content/wordpress.json";

export type WpPost = {
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

export type WpTerm = {
  id: number;
  slug: string;
  name: string;
  description: string;
  parent: number;
  count: number;
};

export type WpPage = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
};

const POSTS = snapshot.posts as WpPost[];
const CATEGORIES = snapshot.categories as WpTerm[];
const TAGS = snapshot.tags as WpTerm[];
const PAGES = (snapshot.pages ?? []) as WpPage[];

/** All published posts, newest first. */
export async function getAllPosts(): Promise<WpPost[]> {
  return [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getAllCategories(): Promise<WpTerm[]> {
  return CATEGORIES;
}

export async function getAllTags(): Promise<WpTerm[]> {
  return TAGS;
}

export async function getAllPages(): Promise<WpPage[]> {
  return PAGES;
}

export async function getPageBySlug(slug: string): Promise<WpPage | undefined> {
  return PAGES.find((p) => p.slug === slug);
}

export async function getPostBySlug(slug: string): Promise<WpPost | undefined> {
  return POSTS.find((p) => p.slug === slug);
}

export async function getPostsInCategory(categorySlug: string): Promise<WpPost[]> {
  const term = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!term) return [];
  return (await getAllPosts()).filter((p) => p.categories.includes(term.id));
}

export async function getPostsWithTag(tagSlug: string): Promise<WpPost[]> {
  const term = TAGS.find((t) => t.slug === tagSlug);
  if (!term) return [];
  return (await getAllPosts()).filter((p) => p.tags.includes(term.id));
}

/** WordPress returns entity-encoded titles; strip tags and decode the few that matter. */
export function plainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&#8217;|&#039;|&#39;|&#x27;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}
