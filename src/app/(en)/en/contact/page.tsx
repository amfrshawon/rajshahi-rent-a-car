import type { Metadata } from "next";
import { social } from "@/lib/metadata";
import { ContactPage } from "@/components/pages/contact-page";

export const metadata: Metadata = {
  ...social("en", "/en/contact/"),
  title: "Contact & Booking",
  description: "Call or WhatsApp Rajshahi Rent A Car to book a car with driver, microbus or ambulance in Rajshahi. Open 24 hours, every day.",
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
