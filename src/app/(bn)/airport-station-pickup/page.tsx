import type { Metadata } from "next";
import { PickupPage } from "@/components/pages/pickup-page";
import { ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "এয়ারপোর্ট ও স্টেশন পিকআপ-ড্রপ — রাজশাহী",
  description:
    "শাহ মখদুম বিমানবন্দর ও রাজশাহী রেলওয়ে স্টেশনে ২৪ ঘণ্টা পিকআপ-ড্রপ। ফ্লাইট/ট্রেনের সময় জানান — নির্ধারিত সময়ে ড্রাইভার হাজির।",
  alternates: {
    canonical: ROUTES.pickup.bn,
    languages: {
      bn: ROUTES.pickup.bn,
      en: ROUTES.pickup.en,
      "x-default": ROUTES.pickup.bn,
    },
  },
};

export default function Page() {
  return <PickupPage locale="bn" />;
}
