import type { Metadata } from "next";
import { LandingPage } from "@/components/pages/landing-page";
import { LANDING } from "@/content/landing";
import { social } from "@/lib/metadata";

const content = LANDING.ambulanceRmch;

export const metadata: Metadata = {
  title: "রাজশাহী মেডিকেল এলাকার অ্যাম্বুলেন্স — ২৪ ঘণ্টা",
  description: "রাজশাহী মেডিকেল এলাকায় অবস্থানরত ২৪ ঘণ্টা অ্যাম্বুলেন্স — প্রশিক্ষিত স্টাফসহ রোগী পরিবহন, শহর থেকে সারা দেশে। সরাসরি কল করুন।",
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
