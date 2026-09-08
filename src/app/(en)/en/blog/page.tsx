import type { Metadata } from "next";
import { ArchivePage } from "@/components/archive-page";
import { listArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  alternates: {
    canonical: "/en/blog/",
    languages: { bn: "/blog/", en: "/en/blog/", "x-default": "/blog/" },
  },
};

export default async function Page() {
  const articles = await listArticles("en");
  return (
    <ArchivePage
      locale="en"
      title="Blog" articles={articles}
      crumbs={[{ name: "Blog", path: "/blog/" }]}
    />
  );
}
