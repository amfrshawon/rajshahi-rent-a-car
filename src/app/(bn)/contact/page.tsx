import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact-page";

export const metadata: Metadata = {
  title: "বুকিং ও যোগাযোগ",
  description: "রাজশাহীতে ড্রাইভারসহ গাড়ি বুক করুন: ফর্ম, ফোন বা হোয়াটসঅ্যাপে। ২৪ ঘণ্টা খোলা।",
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
