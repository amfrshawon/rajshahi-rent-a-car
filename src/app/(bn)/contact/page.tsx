import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact-page";

export const metadata: Metadata = {
  title: "যোগাযোগ ও বুকিং",
  description: "রাজশাহী রেন্ট এ কার-এর সাথে যোগাযোগ করুন। ২৪ ঘণ্টা খোলা।",
  alternates: {
    canonical: "/contact/",
    languages: {
      bn: "/contact/",
      en: "/en/contact/",
      "x-default": "/contact/",
    },
  },
};

export default function Page() {
  return <ContactPage locale="bn" />;
}
