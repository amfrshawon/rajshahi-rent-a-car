import type { Metadata } from "next";
import { LandingPage } from "@/components/pages/landing-page";
import { LANDING } from "@/content/landing";
import { social } from "@/lib/metadata";

const content = LANDING.ambulanceRmch;

export const metadata: Metadata = {
  title: "রাজশাহী মেডিকেল এলাকার অ্যাম্বুলেন্স — ২৪ ঘণ্টা",
  description: "রাজশাহী মেডিকেল এলাকা থেকে ২৪ ঘণ্টা অ্যাম্বুলেন্স বুকিং। পিকআপের গেট বা ওয়ার্ড, গন্তব্য এবং গাড়ির প্রাপ্যতা ফোনে নিশ্চিত করুন।",
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
