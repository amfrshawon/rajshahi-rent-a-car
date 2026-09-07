import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/article-page";
import { getPageContent } from "@/lib/content";
import { localePath } from "@/lib/locale";

const SLUG = "ambulance-service";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent("bn", SLUG);
  if (!page) return {};

  return {
    title: page.title,
    description: page.excerpt,
    alternates: {
      canonical: localePath("bn", `/${SLUG}/`),
      languages: {
        bn: `/${SLUG}/`,
        en: `/en/${SLUG}/`,
        "x-default": `/${SLUG}/`,
      },
    },
  };
}

export default async function Page() {
  const page = await getPageContent("bn", SLUG);
  if (!page) notFound();
  return <ArticlePage locale="bn" article={page} showBackToBlog={false} />;
}
