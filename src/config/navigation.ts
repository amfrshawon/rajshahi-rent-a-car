import type { RouteKey } from "@/config/routes";

export type NavItem = {
  key: RouteKey;
  label: { bn: string; en: string };
};

/** Main header navigation. */
export const NAV: readonly NavItem[] = [
  { key: "fleet", label: { bn: "গাড়িবহর", en: "Fleet" } },
  { key: "pricing", label: { bn: "ভাড়ার তালিকা", en: "Pricing" } },
  { key: "tours", label: { bn: "ট্যুর প্যাকেজ", en: "Tours" } },
  { key: "wedding", label: { bn: "বিয়ের গাড়ি", en: "Wedding cars" } },
  { key: "ambulance", label: { bn: "অ্যাম্বুলেন্স", en: "Ambulance" } },
  { key: "blog", label: { bn: "ব্লগ", en: "Blog" } },
  { key: "contact", label: { bn: "যোগাযোগ", en: "Contact" } },
];

/** Secondary links, footer only. */
export const FOOTER_NAV: readonly NavItem[] = [
  { key: "about", label: { bn: "আমাদের সম্পর্কে", en: "About us" } },
  { key: "faq", label: { bn: "সাধারণ জিজ্ঞাসা", en: "FAQ" } },
  // Landing pages. Linked from the footer so they are not orphans: they carry
  // the long-tail searches (Dhaka, microbus, ambulance near RMCH).
  { key: "dhaka", label: { bn: "রাজশাহী–ঢাকা ভাড়া", en: "Rajshahi–Dhaka rental" } },
  { key: "microbus", label: { bn: "মাইক্রোবাস ভাড়া", en: "Microbus rental" } },
  {
    key: "ambulanceRmch",
    label: { bn: "মেডিকেল এলাকার অ্যাম্বুলেন্স", en: "Ambulance near RMCH" },
  },
];
