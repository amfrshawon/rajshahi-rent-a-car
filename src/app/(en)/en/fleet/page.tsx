import type { Metadata } from "next";
import { FleetPage } from "@/components/pages/fleet-page";

export const metadata: Metadata = {
  title: "Our Fleet",
  description: "Premio, Axio and Hiace available for hire in Rajshahi — air-conditioned, with a driver.",
  alternates: {
    canonical: "/en/fleet/",
    languages: {
      bn: "/fleet/",
      en: "/en/fleet/",
      "x-default": "/fleet/",
    },
  },
};

export default function Page() {
  return <FleetPage locale="en" />;
}
