/**
 * Resolves WordPress content into a locale-specific article.
 *
 * English comes straight from WordPress. Bangla uses the repo overlay in
 * src/content/bn-posts.ts, falling back to the English body where no
 * translation exists yet — the legacy URL must still return 200.
 */

import { LEGACY_CATEGORIES, LEGACY_TAGS } from "@/config/legacy-routes";
import { BN_CATEGORIES, BN_PAGES, BN_POSTS, BN_TAGS } from "@/content/bn-posts";
import type { Locale } from "@/lib/locale";
import {
  getAllCategories,
  getAllPosts,
  getAllTags,
  getPageBySlug,
  getPostsInCategory,
  getPostsWithTag,
  plainText,
  type WpPost,
} from "@/lib/wp";

export type ArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  /** Bangla requested, but only the English text exists. */
  untranslated: boolean;
};

export type Article = ArticleSummary & {
  contentHtml: string;
  modified: string;
};

function resolveSummary(locale: Locale, post: WpPost): ArticleSummary {
  const bn = BN_POSTS[post.slug];

  if (locale === "bn" && bn) {
    return {
      slug: post.slug,
      title: bn.title,
      excerpt: bn.excerpt,
      date: post.date,
      untranslated: bn.content === undefined,
    };
  }

  return {
    slug: post.slug,
    title: plainText(post.title.rendered),
    excerpt: plainText(post.excerpt.rendered),
    date: post.date,
    untranslated: locale === "bn",
  };
}

export async function listArticles(locale: Locale): Promise<ArticleSummary[]> {
  return (await getAllPosts()).map((p) => resolveSummary(locale, p));
}

export async function getArticle(
  locale: Locale,
  slug: string,
): Promise<Article | undefined> {
  const post = (await getAllPosts()).find((p) => p.slug === slug);
  if (!post) return undefined;

  const bn = BN_POSTS[slug];
  const summary = resolveSummary(locale, post);

  return {
    ...summary,
    modified: post.modified,
    contentHtml:
      locale === "bn" && bn?.content ? bn.content : post.content.rendered,
  };
}

export type Archive = {
  /** Last path segment — the WordPress term slug. */
  slug: string;
  title: string;
  description: string;
  articles: ArticleSummary[];
};

export async function getCategoryArchive(
  locale: Locale,
  segments: readonly string[],
): Promise<Archive | undefined> {
  const slug = segments[segments.length - 1];
  const term = (await getAllCategories()).find((c) => c.slug === slug);
  if (!term) return undefined;

  const bn = BN_CATEGORIES[slug];
  const posts = await getPostsInCategory(slug);

  return {
    slug,
    title: locale === "bn" && bn ? bn.name : plainText(term.name),
    description: plainText(term.description),
    articles: posts.map((p) => resolveSummary(locale, p)),
  };
}

export async function getTagArchive(
  locale: Locale,
  slug: string,
): Promise<Archive | undefined> {
  const term = (await getAllTags()).find((t) => t.slug === slug);
  if (!term) return undefined;

  const bn = BN_TAGS[slug];
  const posts = await getPostsWithTag(slug);

  return {
    slug,
    title: locale === "bn" && bn ? bn.name : plainText(term.name),
    description: plainText(term.description),
    articles: posts.map((p) => resolveSummary(locale, p)),
  };
}

export function formatArticleDate(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/**
 * Full category permalink segments, matching WordPress's nested structure
 * (a child category's URL includes its parent's slug).
 *
 * Derived from WordPress so newly created categories appear automatically,
 * then unioned with the recorded legacy paths so an existing URL can never
 * drop out of the build.
 */
export async function getCategoryPathSegments(): Promise<string[][]> {
  const categories = await getAllCategories();
  const byId = new Map(categories.map((c) => [c.id, c]));

  const fromWordPress = categories
    .filter((c) => c.count > 0)
    .map((c) => {
      const segments: string[] = [];
      let current: (typeof categories)[number] | undefined = c;
      while (current) {
        segments.unshift(current.slug);
        current = current.parent ? byId.get(current.parent) : undefined;
      }
      return segments;
    });

  const fromLegacy = LEGACY_CATEGORIES.map((c) =>
    c.path.replace(/^\/category\//, "").replace(/\/$/, "").split("/"),
  );

  return dedupeSegments([...fromWordPress, ...fromLegacy]);
}

export async function getTagSlugs(): Promise<string[]> {
  const tags = await getAllTags();
  const fromWordPress = tags.filter((t) => t.count > 0).map((t) => t.slug);
  const fromLegacy = LEGACY_TAGS.map((t) =>
    t.path.replace(/^\/tag\//, "").replace(/\/$/, ""),
  );
  return [...new Set([...fromWordPress, ...fromLegacy])];
}

function dedupeSegments(all: string[][]): string[][] {
  const seen = new Set<string>();
  const out: string[][] = [];
  for (const segments of all) {
    const key = segments.join("/");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(segments);
  }
  return out;
}

/** Standalone WordPress pages (e.g. /ambulance-service/). */
export async function getPageContent(
  locale: Locale,
  slug: string,
): Promise<Article | undefined> {
  const page = await getPageBySlug(slug);
  if (!page) return undefined;

  const bn = BN_PAGES[slug];
  const useBangla = locale === "bn" && bn !== undefined;

  return {
    slug,
    title: useBangla ? bn.title : plainText(page.title.rendered),
    excerpt: useBangla ? bn.excerpt : plainText(page.excerpt.rendered),
    date: page.date,
    modified: page.modified,
    untranslated: locale === "bn" && bn?.content === undefined,
    contentHtml: useBangla && bn.content ? bn.content : page.content.rendered,
  };
}
