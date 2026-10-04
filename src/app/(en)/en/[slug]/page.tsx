import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/article-page";
import { getArticle } from "@/lib/content";
import { localePath } from "@/lib/locale";
import { getAllPosts } from "@/lib/posts";

type Params = { params: Promise<{ slug: string }> };

/**
 * Slugs come from the repo's Markdown posts (src/content/posts/). The legacy
 * URLs are separately asserted by scripts/verify-legacy-routes.mts.
 */
export async function generateStaticParams() {
  return (await getAllPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle("en", slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: localePath("en", `/${slug}/`),
      languages: {
        bn: `/${slug}/`,
        en: `/en/${slug}/`,
        "x-default": `/${slug}/`,
      },
    },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const article = await getArticle("en", slug);
  if (!article) notFound();
  return <ArticlePage locale="en" article={article} />;
}
