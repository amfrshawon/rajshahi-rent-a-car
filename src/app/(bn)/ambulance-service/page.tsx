import type { Metadata } from "next";
import { social } from "@/lib/metadata";
import { AmbulancePage } from "@/components/pages/ambulance-page";

export const metadata: Metadata = {
  ...social("bn", "/ambulance-service/"),
  title: "রাজশাহী অ্যাম্বুলেন্স সার্ভিস — ২৪ ঘণ্টা বুকিং",
  description: "রাজশাহী মেডিকেল এলাকা থেকে এসি, নন-এসি ও অক্সিজেনসহ অ্যাম্বুলেন্স। রাজশাহী থেকে ঢাকা ও সারা দেশে রোগী পরিবহন। ২৪ ঘণ্টা বুকিং ০১৭১৪-৪২৪২৪১।",
  alternates: {
    canonical: "/ambulance-service/",
    languages: {
      bn: "/ambulance-service/",
      en: "/en/ambulance-service/",
      "x-default": "/ambulance-service/",
    },
  },
};

export default function Page() {
  return <AmbulancePage locale="bn" />;
}
