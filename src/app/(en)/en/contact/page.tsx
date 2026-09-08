import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact-page";

export const metadata: Metadata = {
  title: "Contact & Booking",
  description: "Get in touch with Rajshahi Rent A Car. Open 24 hours.",
  alternates: {
    canonical: "/en/contact/",
    languages: {
      bn: "/যোগাযোগ/",
      en: "/en/contact/",
      "x-default": "/যোগাযোগ/",
    },
  },
};

export default function Page() {
  return <ContactPage locale="en" />;
}
