/**
 * Resolves repo Markdown content into a locale-specific article.
 *
 * English comes from index.md. Bangla uses the bn.md overlay, falling back to
 * the English body where no translation exists yet — the legacy URL must still
 * return 200.
 */

import { LEGACY_CATEGORIES, LEGACY_TAGS } from "@/config/legacy-routes";
import type { Locale } from "@/lib/locale";
import { CATEGORIES, TAGS } from "@/content/taxonomy";
import {
  getAllPosts,
  getPostsInCategory,
  getPostsWithTag,
  getUsedCategorySlugs,
  getUsedTagSlugs,
  type Post,
  type TermDef,
} from "@/lib/posts";

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

function resolveSummary(locale: Locale, post: Post): ArticleSummary {
  if (locale === "bn" && post.bn) {
    return {
      slug: post.slug,
      title: post.bn.title,
      excerpt: post.bn.excerpt,
      date: post.date,
      untranslated: post.bn.contentHtml === undefined,
    };
  }

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
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

  const summary = resolveSummary(locale, post);

  return {
    ...summary,
    modified: post.modified,
    contentHtml:
      locale === "bn" && post.bn?.contentHtml ? post.bn.contentHtml : post.contentHtml,
  };
}

export type Archive = {
  /** Last path segment — the term slug. */
  slug: string;
  title: string;
  description: string;
  articles: ArticleSummary[];
}

export async function getCategoryArchive(
  locale: Locale,
  segments: readonly string[],
): Promise<Archive | undefined> {
  const slug = segments[segments.length - 1];
  const term = CATEGORIES.find((c) => c.slug === slug);
  if (!term) return undefined;

  const posts = await getPostsInCategory(slug);

  return {
    slug,
    title: locale === "bn" ? term.name.bn : term.name.en,
    description: term.description,
    articles: posts.map((p) => resolveSummary(locale, p)),
  };
}

export async function getTagArchive(
  locale: Locale,
  slug: string,
): Promise<Archive | undefined> {
  const term = TAGS.find((t) => t.slug === slug);
  if (!term) return undefined;

  const posts = await getPostsWithTag(slug);

  return {
    slug,
    title: locale === "bn" ? term.name.bn : term.name.en,
    description: term.description,
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
 * Derived from the taxonomy, then unioned with the recorded legacy paths so an
 * existing URL can never drop out of the build.
 */
export async function getCategoryPathSegments(): Promise<string[][]> {
  const used = await getUsedCategorySlugs();
  const bySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));

  const fromTaxonomy = CATEGORIES.filter((c) => used.has(c.slug)).map((c) => {
    const segments: string[] = [];
    let current: TermDef | undefined = c;
    while (current) {
      segments.unshift(current.slug);
      current = current.parent ? bySlug.get(current.parent) : undefined;
    }
    return segments;
  });

  const fromLegacy = LEGACY_CATEGORIES.map((c) =>
    c.path.replace(/^\/category\//, "").replace(/\/$/, "").split("/"),
  );

  return dedupeSegments([...fromTaxonomy, ...fromLegacy]);
}

export async function getTagSlugs(): Promise<string[]> {
  const used = await getUsedTagSlugs();
  const fromTaxonomy = TAGS.filter((t) => used.has(t.slug)).map((t) => t.slug);
  const fromLegacy = LEGACY_TAGS.map((t) =>
    t.path.replace(/^\/tag\//, "").replace(/\/$/, ""),
  );
  return [...new Set([...fromTaxonomy, ...fromLegacy])];
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
