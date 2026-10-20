import type { Metadata } from "next";
import { social } from "@/lib/metadata";
import { ArchivePage } from "@/components/archive-page";
import { listArticles } from "@/lib/content";

export const metadata: Metadata = {
  ...social("bn", "/blog/"),
  title: "ব্লগ",
  description: "রাজশাহী ভ্রমণ, গাড়ি ভাড়ার টিপস ও যাত্রার গাইড — রাজশাহী রেন্ট এ কার-এর ব্লগ।",
  alternates: {
    canonical: "/blog/",
    languages: { bn: "/blog/", en: "/en/blog/", "x-default": "/blog/" },
  },
};

export default async function Page() {
  const articles = await listArticles("bn");
  return (
    <ArchivePage
      locale="bn"
      title="ব্লগ" articles={articles}
      crumbs={[{ name: "ব্লগ", path: "/blog/" }]}
    />
  );
}
