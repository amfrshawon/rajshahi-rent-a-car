import type { Metadata } from "next";
import { LandingPage } from "@/components/pages/landing-page";
import { LANDING } from "@/content/landing";
import { social } from "@/lib/metadata";

const content = LANDING.dhaka;

export const metadata: Metadata = {
  title: "রাজশাহী থেকে ঢাকা গাড়ি ভাড়া",
  description: "রাজশাহী থেকে ঢাকায় ড্রাইভারসহ প্রাইভেট কার বা মাইক্রোবাস ভাড়া। ভাড়া আগেই ফোনে নিশ্চিত — কোনো লুকানো চার্জ নেই।",
  ...social("bn", content.paths.bn),
  alternates: {
    canonical: content.paths.bn,
    languages: {
      bn: content.paths.bn,
      en: content.paths.en,
      "x-default": content.paths.bn,
    },
  },
};

export default function Page() {
  return <LandingPage locale="bn" content={content} />;
}
