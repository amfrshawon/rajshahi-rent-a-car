import type { Metadata } from "next";
import { FleetPage } from "@/components/pages/fleet-page";

export const metadata: Metadata = {
  title: "আমাদের গাড়িবহর",
  description: "রাজশাহীতে ভাড়ার জন্য প্রিমিও, এক্সিও ও হাইএস — এসি গাড়ি, অভিজ্ঞ ড্রাইভারসহ।",
  alternates: {
    canonical: "/গাড়িবহর/",
    languages: {
      bn: "/গাড়িবহর/",
      en: "/en/fleet/",
      "x-default": "/গাড়িবহর/",
    },
  },
};

export default function Page() {
  return <FleetPage locale="bn" />;
}
