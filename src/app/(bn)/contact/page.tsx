import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact-page";

export const metadata: Metadata = {
  title: "যোগাযোগ ও বুকিং",
  description: "রাজশাহী রেন্ট এ কার-এর সাথে যোগাযোগ করুন। ২৪ ঘণ্টা খোলা।",
  alternates: {
    canonical: "/যোগাযোগ/",
    languages: {
      bn: "/যোগাযোগ/",
      en: "/en/contact/",
      "x-default": "/যোগাযোগ/",
    },
  },
};

export default function Page() {
  return <ContactPage locale="bn" />;
}
