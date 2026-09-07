import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { RootHtml } from "@/components/root-html";
import { SITE } from "@/config/site";

/**
 * Bangla root layout. Bangla is the default locale and is served at the
 * original WordPress URLs — see src/config/legacy-routes.ts.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "রাজশাহী রেন্ট এ কার — ড্রাইভারসহ গাড়ি ভাড়া, ২৪/৭",
    template: "%s | রাজশাহী রেন্ট এ কার",
  },
  description:
    "রাজশাহীতে প্রাইভেট কার, মাইক্রোবাস ও অ্যাম্বুলেন্স ভাড়া। ফিক্সড রেট, অভিজ্ঞ ড্রাইভার, ২৪ ঘণ্টা সার্ভিস।",
  alternates: {
    canonical: "/",
    languages: { bn: "/", en: "/en/", "x-default": "/" },
  },
};

export default function BanglaRootLayout({ children }: { children: ReactNode }) {
  return <RootHtml locale="bn">{children}</RootHtml>;
}
