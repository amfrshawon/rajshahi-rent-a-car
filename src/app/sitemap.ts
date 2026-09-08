import type { MetadataRoute } from "next";
import { getCategoryPathSegments, getTagSlugs } from "@/lib/content";
import { NAV, FOOTER_NAV } from "@/config/navigation";
import { SITE } from "@/config/site";
import { getAllPosts } from "@/lib/wp";

/**
 * Every URL, in both locales, with hreflang alternates.
 *
 * The Bangla URL is canonical and is the original WordPress path; English is
 * the /en/ twin. Google needs the alternates to understand that the language
 * at a given URL changed rather than the page disappearing.
 */
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const categorySegments = await getCategoryPathSegments();
  const tagSlugs = await getTagSlugs();

  const staticPaths = [
    "/",
    "/blog/",
    ...NAV.map((n) => n.path),
    ...FOOTER_NAV.map((n) => n.path),
  ];

  const entries: { path: string; lastModified?: string | Date }[] = [
    ...new Set(staticPaths),
  ].map((path) => ({ path }));

  for (const post of posts) {
    // WordPress omits the offset on `modified`; the GMT field plus Z is
    // a valid W3C datetime.
    entries.push({ path: `/${post.slug}/`, lastModified: `${post.modified_gmt}Z` });
  }
  for (const segments of categorySegments) {
    entries.push({ path: `/category/${segments.join("/")}/` });
  }
  for (const slug of tagSlugs) {
    entries.push({ path: `/tag/${slug}/` });
  }

  return entries.map(({ path, lastModified }) => {
    const bn = new URL(path, SITE.url).toString();
    const en = new URL(path === "/" ? "/en/" : `/en${path}`, SITE.url).toString();

    return {
      url: bn,
      lastModified,
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : 0.7,
      alternates: { languages: { bn, en, "x-default": bn } },
    };
  });
}
