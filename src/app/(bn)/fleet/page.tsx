import type { Metadata } from "next";
import { FleetPage } from "@/components/pages/fleet-page";

export const metadata: Metadata = {
  title: "আমাদের গাড়িবহর",
  description: "রাজশাহীতে ভাড়ার জন্য প্রিমিও, এক্সিও ও হাইএস — এসি গাড়ি, অভিজ্ঞ ড্রাইভারসহ।",
  alternates: {
    canonical: "/fleet/",
    languages: {
      bn: "/fleet/",
      en: "/en/fleet/",
      "x-default": "/fleet/",
    },
  },
};

export default function Page() {
  return <FleetPage locale="bn" />;
}
