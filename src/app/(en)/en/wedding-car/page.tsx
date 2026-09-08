import type { Metadata } from "next";
import { WeddingCarPage } from "@/components/pages/wedding-car-page";

export const metadata: Metadata = {
  title: "Wedding Car Hire",
  description: "A sedan for the couple and a microbus for guests — wedding car hire in Rajshahi.",
  alternates: {
    canonical: "/en/wedding-car/",
    languages: {
      bn: "/wedding-car/",
      en: "/en/wedding-car/",
      "x-default": "/wedding-car/",
    },
  },
};

export default function Page() {
  return <WeddingCarPage locale="en" />;
}
