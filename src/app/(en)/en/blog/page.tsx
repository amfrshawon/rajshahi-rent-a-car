import type { Metadata } from "next";
import { social } from "@/lib/metadata";
import { ArchivePage } from "@/components/archive-page";
import { listArticles } from "@/lib/content";

export const metadata: Metadata = {
  ...social("en", "/en/blog/"),
  title: "Blog",
  description: "Rajshahi travel guides and car rental tips from the Rajshahi Rent A Car team.",
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
