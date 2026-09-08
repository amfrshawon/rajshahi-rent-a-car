import type { Metadata } from "next";
import { FleetPage } from "@/components/pages/fleet-page";

export const metadata: Metadata = {
  title: "Our Fleet",
  description: "Premio, Axio and Hiace available for hire in Rajshahi — air-conditioned, with a driver.",
  alternates: {
    canonical: "/en/fleet/",
    languages: {
      bn: "/গাড়িবহর/",
      en: "/en/fleet/",
      "x-default": "/গাড়িবহর/",
    },
  },
};

export default function Page() {
  return <FleetPage locale="en" />;
}
