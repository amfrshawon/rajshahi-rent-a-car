/**
 * Site navigation. Paths are the canonical (Bangla) paths; localePath()
 * prefixes /en for English.
 */

export type NavItem = {
  path: string;
  label: { bn: string; en: string };
};

/** Main header navigation. */
export const NAV: readonly NavItem[] = [
  { path: "/fleet/", label: { bn: "গাড়িবহর", en: "Fleet" } },
  { path: "/pricing/", label: { bn: "ভাড়ার তালিকা", en: "Pricing" } },
  { path: "/tour-packages/", label: { bn: "ট্যুর প্যাকেজ", en: "Tours" } },
  { path: "/wedding-car/", label: { bn: "বিয়ের গাড়ি", en: "Wedding cars" } },
  { path: "/ambulance-service/", label: { bn: "অ্যাম্বুলেন্স", en: "Ambulance" } },
  { path: "/blog/", label: { bn: "ব্লগ", en: "Blog" } },
  { path: "/contact/", label: { bn: "যোগাযোগ", en: "Contact" } },
];

/** Secondary links, footer only. */
export const FOOTER_NAV: readonly NavItem[] = [
  { path: "/about/", label: { bn: "আমাদের সম্পর্কে", en: "About us" } },
  { path: "/faq/", label: { bn: "সাধারণ জিজ্ঞাসা", en: "FAQ" } },
];
