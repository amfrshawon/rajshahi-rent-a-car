import type { MetadataRoute } from "next";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { getCategoryPathSegments, getTagSlugs } from "@/lib/content";
import { getAllPosts } from "@/lib/wp";

/**
 * Every URL, in both locales, with hreflang alternates.
 *
 * New pages have different slugs per locale (Bangla for bn, English for en),
 * so each entry carries its own pair rather than deriving one from the other.
 * Article, category and tag URLs are the original WordPress paths and share a
 * slug across locales, with /en/ as the only difference.
 */
export const dynamic = "force-static";

type Entry = { bn: string; en: string; lastModified?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const categorySegments = await getCategoryPathSegments();
  const tagSlugs = await getTagSlugs();

  const entries: Entry[] = Object.values(ROUTES).map((r) => ({ bn: r.bn, en: r.en }));

  for (const post of posts) {
    entries.push({
      bn: `/${post.slug}/`,
      en: `/en/${post.slug}/`,
      lastModified: `${post.modified_gmt}Z`,
    });
  }
  for (const segments of categorySegments) {
    const path = `/category/${segments.join("/")}/`;
    entries.push({ bn: path, en: `/en${path}` });
  }
  for (const slug of tagSlugs) {
    const path = `/tag/${slug}/`;
    entries.push({ bn: path, en: `/en${path}` });
  }

  return entries.map(({ bn, en, lastModified }) => {
    const bnUrl = new URL(bn, SITE.url).toString();
    const enUrl = new URL(en, SITE.url).toString();

    return {
      url: bnUrl,
      lastModified,
      changeFrequency: bn === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: bn === "/" ? 1 : 0.7,
      alternates: { languages: { bn: bnUrl, en: enUrl, "x-default": bnUrl } },
    };
  });
}
