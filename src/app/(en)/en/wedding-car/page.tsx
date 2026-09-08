import type { Metadata } from "next";
import { WeddingCarPage } from "@/components/pages/wedding-car-page";

export const metadata: Metadata = {
  title: "Wedding Car Hire",
  description: "A sedan for the couple and a microbus for guests — wedding car hire in Rajshahi.",
  alternates: {
    canonical: "/en/wedding-car/",
    languages: {
      bn: "/বিয়ের-গাড়ি/",
      en: "/en/wedding-car/",
      "x-default": "/বিয়ের-গাড়ি/",
    },
  },
};

export default function Page() {
  return <WeddingCarPage locale="en" />;
}
