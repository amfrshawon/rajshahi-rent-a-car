import type { Metadata } from "next";
import { LandingPage } from "@/components/pages/landing-page";
import { LANDING } from "@/content/landing";
import { social } from "@/lib/metadata";

const content = LANDING.ambulanceRmch;

export const metadata: Metadata = {
  title: "Ambulance near Rajshahi Medical College — 24 hours",
  description: "Book an ambulance near Rajshahi Medical 24 hours a day. Confirm the pickup gate or ward, destination, and vehicle availability by phone.",
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
