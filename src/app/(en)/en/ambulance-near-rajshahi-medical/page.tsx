import type { Metadata } from "next";
import { LandingPage } from "@/components/pages/landing-page";
import { LANDING } from "@/content/landing";
import { social } from "@/lib/metadata";

const content = LANDING.ambulanceRmch;

export const metadata: Metadata = {
  title: "Ambulance near Rajshahi Medical College — 24 hours",
  description: "A 24-hour ambulance based in the Rajshahi Medical area — patient transport with trained staff, across the city and nationwide.",
  ...social("en", content.paths.en),
  alternates: {
    canonical: content.paths.en,
    languages: {
      bn: content.paths.bn,
      en: content.paths.en,
      "x-default": content.paths.bn,
    },
  },
};

export default function Page() {
  return <LandingPage locale="en" content={content} />;
}
