import type { Metadata } from "next";
import { TourPackagesPage } from "@/components/pages/tour-packages-page";

export const metadata: Metadata = {
  title: "ট্যুর প্যাকেজ",
  description: "পুঠিয়া, বাঘা, নাটোরসহ রাজশাহীর আশেপাশে একদিনের ভ্রমণ, গাড়ি ও ড্রাইভারসহ।",
  alternates: {
    canonical: "/tour-packages/",
    languages: {
      bn: "/tour-packages/",
      en: "/en/tour-packages/",
      "x-default": "/tour-packages/",
    },
  },
};

export default function Page() {
  return <TourPackagesPage locale="bn" />;
}
