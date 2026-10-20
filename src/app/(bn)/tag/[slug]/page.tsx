import type { Metadata } from "next";
import { social, trimDescription } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { ArchivePage } from "@/components/archive-page";
import { getTagArchive, getTagSlugs } from "@/lib/content";
import { ARCHIVE_DESC } from "@/lib/metadata";
import { localePath } from "@/lib/locale";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getTagSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const archive = await getTagArchive("bn", slug);
  if (!archive) return {};

  const path = `/tag/${slug}/`;
  return {
    title: archive.title,
    description: trimDescription(archive.description || ARCHIVE_DESC["bn"](archive.title, archive.articles.length)),
    robots: { index: false, follow: true },
    ...social("bn", localePath("bn", path)),
    alternates: {
      canonical: localePath("bn", path),
      languages: { bn: path, en: `/en${path}`, "x-default": path },
    },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const archive = await getTagArchive("bn", slug);
  if (!archive) notFound();

  return (
    <ArchivePage
      locale="bn"
      title={archive.title}
      description={archive.description}
      articles={archive.articles}
      crumbs={[
        { name: "ব্লগ", path: "/blog/" },
        { name: archive.title, path: `/tag/${slug}/` },
      ]}
    />
  );
}
