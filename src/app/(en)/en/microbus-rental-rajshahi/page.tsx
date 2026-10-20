import type { Metadata } from "next";
import { LandingPage } from "@/components/pages/landing-page";
import { LANDING } from "@/content/landing";
import { social } from "@/lib/metadata";

const content = LANDING.microbus;

export const metadata: Metadata = {
  title: "Microbus rental in Rajshahi — 15 seats",
  description: "Toyota Hiace microbus (15 seats, air-conditioned) with a driver in Rajshahi — for families, groups and offices. Fares quoted by phone.",
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
