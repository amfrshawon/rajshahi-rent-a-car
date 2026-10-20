import type { Metadata } from "next";
import { social } from "@/lib/metadata";
import { ContactPage } from "@/components/pages/contact-page";

export const metadata: Metadata = {
  ...social("bn", "/যোগাযোগ/"),
  title: "যোগাযোগ ও বুকিং",
  description: "ফোন বা হোয়াটসঅ্যাপে রাজশাহী রেন্ট এ কার-এ গাড়ি বুক করুন। ড্রাইভারসহ প্রাইভেট কার, মাইক্রোবাস ও অ্যাম্বুলেন্স — ২৪ ঘণ্টা খোলা।",
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
