import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about-page";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে",
  description: "রাজশাহীর কাদিরগঞ্জে অবস্থিত রেন্ট এ কার সার্ভিস — স্থানীয় ও ভ্রমণকারী সবার জন্য।",
  alternates: {
    canonical: "/about/",
    languages: {
      bn: "/about/",
      en: "/en/about/",
      "x-default": "/about/",
    },
  },
};

export default function Page() {
  return <AboutPage locale="bn" />;
}
