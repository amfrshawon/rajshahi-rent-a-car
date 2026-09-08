import type { Metadata } from "next";
import { PricingPage } from "@/components/pages/pricing-page";

export const metadata: Metadata = {
  title: "ভাড়ার তালিকা",
  description: "রাজশাহীতে গাড়ি ভাড়ার দৈনিক রেট। ফিক্সড রেট, কোনো লুকানো খরচ নেই।",
  alternates: {
    canonical: "/ভাড়ার-তালিকা/",
    languages: {
      bn: "/ভাড়ার-তালিকা/",
      en: "/en/pricing/",
      "x-default": "/ভাড়ার-তালিকা/",
    },
  },
};

export default function Page() {
  return <PricingPage locale="bn" />;
}
