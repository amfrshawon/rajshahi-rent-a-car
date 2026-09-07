import type { Metadata } from "next";
import { ArchivePage } from "@/components/archive-page";
import { listArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "ব্লগ",
  alternates: {
    canonical: "/blog/",
    languages: { bn: "/blog/", en: "/en/blog/", "x-default": "/blog/" },
  },
};

export default async function Page() {
  const articles = await listArticles("bn");
  return (
    <ArchivePage locale="bn" title="ব্লগ" articles={articles} />
  );
}
