import type { Metadata } from "next";
import { social } from "@/lib/metadata";
import { AmbulancePage } from "@/components/pages/ambulance-page";

export const metadata: Metadata = {
  ...social("en", "/en/ambulance-service/"),
  title: "Ambulance Service in Rajshahi — 24/7 Booking",
  description: "Call 01714-424241 for 24/7 ambulance booking in Rajshahi. AC, non-AC, oxygen support, hospital transfers, and trips from Rajshahi to Dhaka and across Bangladesh.",
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
