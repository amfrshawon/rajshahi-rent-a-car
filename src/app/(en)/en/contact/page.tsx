import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact-page";

export const metadata: Metadata = {
  title: "Contact & Booking",
  description: "Get in touch with Rajshahi Rent A Car. Open 24 hours.",
  alternates: {
    canonical: "/en/contact/",
    languages: {
      bn: "/contact/",
      en: "/en/contact/",
      "x-default": "/contact/",
    },
  },
};

export default function Page() {
  return <ContactPage locale="en" />;
}
