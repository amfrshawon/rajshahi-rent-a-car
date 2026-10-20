import type { Metadata } from "next";
import { social } from "@/lib/metadata";
import { FaqPage } from "@/components/pages/faq-page";

export const metadata: Metadata = {
  ...social("bn", "/সাধারণ-জিজ্ঞাসা/"),
  title: "সাধারণ জিজ্ঞাসা",
  description: "গাড়ি ভাড়া, রেট, ড্রাইভার ও অ্যাম্বুলেন্স সার্ভিস নিয়ে সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্ন।",
  alternates: {
    canonical: "/সাধারণ-জিজ্ঞাসা/",
    languages: {
      bn: "/সাধারণ-জিজ্ঞাসা/",
      en: "/en/faq/",
      "x-default": "/সাধারণ-জিজ্ঞাসা/",
    },
  },
};

export default function Page() {
  return <FaqPage locale="bn" />;
}
