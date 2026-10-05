import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact-page";

export const metadata: Metadata = {
  title: "Booking & contact",
  description: "Book a car with a driver in Rajshahi: by form, phone or WhatsApp. Open 24 hours.",
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
