/**
 * Blog content, read from Markdown files in the repo.
 *
 * Each post lives in src/content/posts/<slug>/ with an English index.md and,
 * when a Bangla adaptation exists, a bn.md sibling carrying its own frontmatter.
 * WordPress was retired in the 2026-10 redesign; this file is the entire
 * content source — no API, no snapshot, no network at build time.
 */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { CATEGORIES, TAGS } from "@/content/taxonomy";

export type BanglaPost = {
  title: string;
  excerpt: string;
  /** "draft" copy is machine-drafted and awaits native review (docs/PLAN.md). */
  status: "draft" | "reviewed";
  /** Rendered Bangla body. Absent means the English body is served instead. */
  contentHtml?: string;
};

export type Post = {
  slug: string;
  /** ISO 8601, no timezone — kept as strings end to end. */
  date: string;
  modified: string;
  modifiedGmt: string;
  title: string;
  excerpt: string;
  /** Term slugs, matching src/content/taxonomy.ts. */
  categories: string[];
  tags: string[];
  contentHtml: string;
  bn?: BanglaPost;
};

type RawFrontmatter = {
  title?: unknown;
  excerpt?: unknown;
  date?: unknown;
  modified?: unknown;
  modified_gmt?: unknown;
  categories?: unknown;
  tags?: unknown;
  status?: unknown;
};

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");

/** YAML auto-parses ISO timestamps into Dates when unquoted; frontmatter is written quoted, but never trust it. */
const str = (v: unknown, fallback = ""): string =>
  v instanceof Date ? v.toISOString().slice(0, 19) : typeof v === "string" ? v : fallback;

const strArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

function render(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

async function readPost(slug: string): Promise<Post | null> {
  const dir = path.join(POSTS_DIR, slug);
  const [enRaw, bnRaw] = await Promise.all([
    readFile(path.join(dir, "index.md"), "utf8"),
    readFile(path.join(dir, "bn.md"), "utf8").catch(() => null),
  ]);

  const en = matter(enRaw).data as RawFrontmatter;
  const bnFm = bnRaw ? (matter(bnRaw).data as RawFrontmatter) : null;
  const bnBody = bnRaw ? matter(bnRaw).content.trim() : "";

  return {
    slug,
    date: str(en.date),
    modified: str(en.modified),
    modifiedGmt: str(en.modified_gmt),
    title: str(en.title),
    excerpt: str(en.excerpt),
    categories: strArray(en.categories),
    tags: strArray(en.tags),
    contentHtml: render(matter(enRaw).content),
    bn: bnFm
      ? {
          title: str(bnFm.title),
          excerpt: str(bnFm.excerpt),
          status: bnFm.status === "reviewed" ? "reviewed" : "draft",
          ...(bnBody ? { contentHtml: render(bnBody) } : {}),
        }
      : undefined,
  };
}

let cache: Promise<Post[]> | undefined;

/** All posts, newest first. Read once per build; everything downstream is derived. */
export async function getAllPosts(): Promise<Post[]> {
  cache ??= (async () => {
    const slugs = (await readdir(POSTS_DIR, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    const posts = await Promise.all(slugs.map(readPost));
    return posts
      .filter((p): p is Post => p !== null)
      .sort((a, b) => b.date.localeCompare(a.date));
  })();
  return cache;
}

export async function getPostsInCategory(categorySlug: string): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.categories.includes(categorySlug));
}

export async function getPostsWithTag(tagSlug: string): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.tags.includes(tagSlug));
}

/** Every category slug that has at least one post — replaces the WordPress `count` field. */
export async function getUsedCategorySlugs(): Promise<Set<string>> {
  const posts = await getAllPosts();
  return new Set(posts.flatMap((p) => p.categories));
}

export async function getUsedTagSlugs(): Promise<Set<string>> {
  const posts = await getAllPosts();
  return new Set(posts.flatMap((p) => p.tags));
}

export { CATEGORIES, TAGS };
export type { TermDef } from "@/content/taxonomy";
