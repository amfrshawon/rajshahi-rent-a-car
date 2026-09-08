import type { Metadata } from "next";
import { AmbulancePage } from "@/components/pages/ambulance-page";

export const metadata: Metadata = {
  title: "Ambulance Service in Rajshahi — 24 Hours",
  description: "24-hour emergency ambulance service in Rajshahi. Based at Rajshahi Medical, with patient transport across Rajshahi and nationwide.",
  alternates: {
    canonical: "/en/ambulance-service/",
    languages: {
      bn: "/ambulance-service/",
      en: "/en/ambulance-service/",
      "x-default": "/ambulance-service/",
    },
  },
};

export default function Page() {
  return <AmbulancePage locale="en" />;
}
