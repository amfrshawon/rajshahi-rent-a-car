import type { Metadata } from "next";
import { PricingPage } from "@/components/pages/pricing-page";

export const metadata: Metadata = {
  title: "ভাড়ার তালিকা",
  description: "রাজশাহীতে গাড়ি ভাড়ার দৈনিক রেট। ফিক্সড রেট, কোনো লুকানো খরচ নেই।",
  alternates: {
    canonical: "/pricing/",
    languages: {
      bn: "/pricing/",
      en: "/en/pricing/",
      "x-default": "/pricing/",
    },
  },
};

export default function Page() {
  return <PricingPage locale="bn" />;
}
