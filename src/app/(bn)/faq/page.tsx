import type { Metadata } from "next";
import { FaqPage } from "@/components/pages/faq-page";

export const metadata: Metadata = {
  title: "সাধারণ জিজ্ঞাসা",
  description: "গাড়ি ভাড়া, রেট, ড্রাইভার ও অ্যাম্বুলেন্স সার্ভিস নিয়ে সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্ন।",
  alternates: {
    canonical: "/faq/",
    languages: {
      bn: "/faq/",
      en: "/en/faq/",
      "x-default": "/faq/",
    },
  },
};

export default function Page() {
  return <FaqPage locale="bn" />;
}
