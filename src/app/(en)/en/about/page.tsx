import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about-page";

export const metadata: Metadata = {
  title: "About Us",
  description: "A rent-a-car service based in Kadirgonj, Rajshahi, serving locals and visitors alike.",
  alternates: {
    canonical: "/en/about/",
    languages: {
      bn: "/আমাদের-সম্পর্কে/",
      en: "/en/about/",
      "x-default": "/আমাদের-সম্পর্কে/",
    },
  },
};

export default function Page() {
  return <AboutPage locale="en" />;
}
