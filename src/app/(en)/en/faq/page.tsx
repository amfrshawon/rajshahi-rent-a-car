import type { Metadata } from "next";
import { FaqPage } from "@/components/pages/faq-page";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about car rental, rates, drivers and our ambulance service.",
  alternates: {
    canonical: "/en/faq/",
    languages: {
      bn: "/faq/",
      en: "/en/faq/",
      "x-default": "/faq/",
    },
  },
};

export default function Page() {
  return <FaqPage locale="en" />;
}
