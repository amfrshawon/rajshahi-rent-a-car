import type { Metadata } from "next";
import { LandingPage } from "@/components/pages/landing-page";
import { LANDING } from "@/content/landing";
import { social } from "@/lib/metadata";

const content = LANDING.dhaka;

export const metadata: Metadata = {
  title: "Rajshahi to Dhaka car rental",
  description: "Car or microbus with a driver from Rajshahi to Dhaka. The fare is agreed by phone before you travel, with no hidden charges.",
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
