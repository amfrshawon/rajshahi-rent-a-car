import type { MetadataRoute } from "next";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { getAllPosts } from "@/lib/posts";

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

  const entries: Entry[] = Object.values(ROUTES).map((r) => ({ bn: r.bn, en: r.en }));
  // Category and tag archives are noindex (thin), so they stay out of the sitemap.

  for (const post of posts) {
    entries.push({
      bn: `/${post.slug}/`,
      en: `/en/${post.slug}/`,
      lastModified: `${post.modifiedGmt}Z`,
    });
  }

  return entries.flatMap(({ bn, en, lastModified }) => {
    const bnUrl = new URL(bn, SITE.url).toString();
    const enUrl = new URL(en, SITE.url).toString();
    const alternates = { languages: { bn: bnUrl, en: enUrl, "x-default": bnUrl } };
    const isHome = bn === "/";

    return [bnUrl, enUrl].map((url) => ({
      url,
      lastModified,
      changeFrequency: isHome ? ("weekly" as const) : ("monthly" as const),
      priority: isHome ? 1 : 0.7,
      alternates,
    }));
  });
}
