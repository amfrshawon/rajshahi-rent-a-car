import type { Metadata } from "next";
import { TourPackagesPage } from "@/components/pages/tour-packages-page";

export const metadata: Metadata = {
  title: "ট্যুর প্যাকেজ",
  description: "পুঠিয়া, বাঘা, নাটোরসহ রাজশাহীর আশেপাশে একদিনের ভ্রমণ, গাড়ি ও ড্রাইভারসহ।",
  alternates: {
    canonical: "/ট্যুর-প্যাকেজ/",
    languages: {
      bn: "/ট্যুর-প্যাকেজ/",
      en: "/en/tour-packages/",
      "x-default": "/ট্যুর-প্যাকেজ/",
    },
  },
};

export default function Page() {
  return <TourPackagesPage locale="bn" />;
}
