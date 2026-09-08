import type { Metadata } from "next";
import { WeddingCarPage } from "@/components/pages/wedding-car-page";

export const metadata: Metadata = {
  title: "বিয়ের জন্য গাড়ি ভাড়া",
  description: "বর-কনের প্রাইভেট কার ও অতিথিদের মাইক্রোবাস — রাজশাহীতে বিয়ের গাড়ি ভাড়া।",
  alternates: {
    canonical: "/wedding-car/",
    languages: {
      bn: "/wedding-car/",
      en: "/en/wedding-car/",
      "x-default": "/wedding-car/",
    },
  },
};

export default function Page() {
  return <WeddingCarPage locale="bn" />;
}
