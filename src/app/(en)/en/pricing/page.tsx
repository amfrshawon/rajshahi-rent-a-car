import type { Metadata } from "next";
import { PricingPage } from "@/components/pages/pricing-page";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Day rates for car rental in Rajshahi. Fixed prices with no hidden costs.",
  alternates: {
    canonical: "/en/pricing/",
    languages: {
      bn: "/ভাড়ার-তালিকা/",
      en: "/en/pricing/",
      "x-default": "/ভাড়ার-তালিকা/",
    },
  },
};

export default function Page() {
  return <PricingPage locale="en" />;
}
