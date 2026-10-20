import type { Metadata } from "next";
import { LandingPage } from "@/components/pages/landing-page";
import { LANDING } from "@/content/landing";
import { social } from "@/lib/metadata";

const content = LANDING.microbus;

export const metadata: Metadata = {
  title: "রাজশাহীতে মাইক্রোবাস ভাড়া — ১৫ আসন",
  description: "টয়োটা হাইএস মাইক্রোবাস (১৫ আসন, এসি) ড্রাইভারসহ ভাড়া — রাজশাহীতে পরিবার, দল বা অফিসের জন্য। ভাড়া ফোনে জানানো হয়।",
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
