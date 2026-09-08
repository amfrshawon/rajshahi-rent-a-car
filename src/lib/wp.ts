/**
 * WordPress REST client.
 *
 * Runs at build time only — the production site is a static export, so no
 * request reaches WordPress from a visitor's browser. After cutover the CMS
 * moves to cms.rajshahirentacar.bd; override with WP_API_URL.
 */

/*
 * `||`, not `??`. CI passes WP_API_URL through from a repository variable,
 * and an unset variable arrives as an empty string rather than undefined —
 * which `??` happily accepts, leaving every request pointed at "/posts?..."
 * and failing the build with ERR_INVALID_URL.
 */
const WP_API =
  process.env.WP_API_URL?.trim() || "https://rajshahirentacar.bd/wp-json/wp/v2";

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

async function wpFetch<T>(path: string): Promise<T> {
  const url = `${WP_API}${path}`;
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    // Build-time only; cache aggressively within a single build.
    next: { revalidate: false },
  });
  if (!res.ok) {
    throw new Error(`WordPress REST ${res.status} for ${url}`);
  }
  return (await res.json()) as T;
}

let postsCache: Promise<WpPost[]> | null = null;
let categoriesCache: Promise<WpTerm[]> | null = null;
let tagsCache: Promise<WpTerm[]> | null = null;

/** All published posts, newest first. */
export function getAllPosts(): Promise<WpPost[]> {
  postsCache ??= wpFetch<WpPost[]>(
    "/posts?per_page=100&orderby=date&order=desc&_fields=id,slug,date,modified,modified_gmt,title,excerpt,content,categories,tags",
  );
  return postsCache;
}

export function getAllCategories(): Promise<WpTerm[]> {
  categoriesCache ??= wpFetch<WpTerm[]>(
    "/categories?per_page=100&_fields=id,slug,name,description,parent,count",
  );
  return categoriesCache;
}

export function getAllTags(): Promise<WpTerm[]> {
  tagsCache ??= wpFetch<WpTerm[]>(
    "/tags?per_page=100&_fields=id,slug,name,description,parent,count",
  );
  return tagsCache;
}

export async function getPostBySlug(slug: string): Promise<WpPost | undefined> {
  return (await getAllPosts()).find((p) => p.slug === slug);
}

export async function getPostsInCategory(categorySlug: string): Promise<WpPost[]> {
  const categories = await getAllCategories();
  const term = categories.find((c) => c.slug === categorySlug);
  if (!term) return [];
  return (await getAllPosts()).filter((p) => p.categories.includes(term.id));
}

export async function getPostsWithTag(tagSlug: string): Promise<WpPost[]> {
  const tags = await getAllTags();
  const term = tags.find((t) => t.slug === tagSlug);
  if (!term) return [];
  return (await getAllPosts()).filter((p) => p.tags.includes(term.id));
}

/** WordPress returns entity-encoded titles; strip tags and decode the few that matter. */
export function plainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&#8217;|&#039;|&#39;/g, "’")
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

export type WpPage = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
};

let pagesCache: Promise<WpPage[]> | null = null;

export function getAllPages(): Promise<WpPage[]> {
  pagesCache ??= wpFetch<WpPage[]>(
    "/pages?per_page=100&_fields=id,slug,date,modified,title,excerpt,content",
  );
  return pagesCache;
}

export async function getPageBySlug(slug: string): Promise<WpPage | undefined> {
  return (await getAllPages()).find((p) => p.slug === slug);
}
