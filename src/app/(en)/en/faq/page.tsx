import type { Metadata } from "next";
import { FaqPage } from "@/components/pages/faq-page";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about car rental, rates, drivers and our ambulance service.",
  alternates: {
    canonical: "/en/faq/",
    languages: {
      bn: "/সাধারণ-জিজ্ঞাসা/",
      en: "/en/faq/",
      "x-default": "/সাধারণ-জিজ্ঞাসা/",
    },
  },
};

export default function Page() {
  return <FaqPage locale="en" />;
}
