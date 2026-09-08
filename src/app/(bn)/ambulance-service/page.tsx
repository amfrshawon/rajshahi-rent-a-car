import type { Metadata } from "next";
import { AmbulancePage } from "@/components/pages/ambulance-page";

export const metadata: Metadata = {
  title: "অ্যাম্বুলেন্স সার্ভিস — রাজশাহী, ২৪ ঘণ্টা",
  description: "রাজশাহীতে ২৪ ঘণ্টা জরুরি অ্যাম্বুলেন্স সেবা। রাজশাহী মেডিকেল এলাকায় অবস্থান, রাজশাহী ও সারা দেশে রোগী পরিবহন।",
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
