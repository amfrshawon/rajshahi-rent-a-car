import type { Metadata } from "next";
import { TourPackagesPage } from "@/components/pages/tour-packages-page";

export const metadata: Metadata = {
  title: "Tour Packages",
  description: "Day trips to Puthia, Bagha, Natore and around Rajshahi, with vehicle and driver.",
  alternates: {
    canonical: "/en/tour-packages/",
    languages: {
      bn: "/ট্যুর-প্যাকেজ/",
      en: "/en/tour-packages/",
      "x-default": "/ট্যুর-প্যাকেজ/",
    },
  },
};

export default function Page() {
  return <TourPackagesPage locale="en" />;
}
