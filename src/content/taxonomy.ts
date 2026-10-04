/**
 * Blog taxonomy, generated from the retired WordPress snapshot. Categories
 * carry a parent slug so nested archive paths (parent/child/) can be derived.
 * Bangla names are machine-drafted (status "draft" in the old overlay) and
 * still need native review — see docs/PLAN.md.
 */

export type TermDef = {
  slug: string;
  name: { en: string; bn: string };
  description: string;
  /** Slug of the parent term, mirroring WordPress's nested category paths. */
  parent: string | null;
};

export const CATEGORIES: readonly TermDef[] = [
  {
    slug: "culture-heritage",
    name: { en: "Culture &amp; Heritage", bn: "সংস্কৃতি ও ঐতিহ্য" },
    description: "",
    parent: null,
  },
  {
    slug: "customer-stories",
    name: { en: "Customer Stories", bn: "গ্রাহকদের অভিজ্ঞতা" },
    description: "",
    parent: null,
  },
  {
    slug: "fleet-vehicles",
    name: { en: "Fleet &amp; Vehicles", bn: "গাড়িবহর" },
    description: "",
    parent: null,
  },
  {
    slug: "promotions-offers",
    name: { en: "Promotions &amp; Offers", bn: "অফার ও ছাড়" },
    description: "",
    parent: null,
  },
  {
    slug: "rajshahi-travel-guide",
    name: { en: "Rajshahi Travel Guide", bn: "রাজশাহী ভ্রমণ গাইড" },
    description: "",
    parent: null,
  },
  {
    slug: "local-attractions-hidden-gems-historical-sites-in-rajshahi",
    name: { en: "Local attractions, hidden gems, historical sites in Rajshahi", bn: "রাজশাহীর দর্শনীয় ও ঐতিহাসিক স্থান" },
    description: "",
    parent: "rajshahi-travel-guide",
  },
  {
    slug: "rent-a-car-rajshahi",
    name: { en: "Rent A Car Rajshahi", bn: "রেন্ট এ কার রাজশাহী" },
    description: "",
    parent: null,
  },
  {
    slug: "tips-how-to",
    name: { en: "Tips &amp; How-To", bn: "টিপস ও পরামর্শ" },
    description: "",
    parent: null,
  },
  {
    slug: "travel-guide",
    name: { en: "Travel Guide", bn: "ভ্রমণ গাইড" },
    description: "",
    parent: null,
  },
  {
    slug: "weekend-trip",
    name: { en: "Weekend Trip", bn: "উইকেন্ড ট্রিপ" },
    description: "",
    parent: null,
  },
];

export const TAGS: readonly TermDef[] = [
  {
    slug: "rent-a-car-rajshahi",
    name: { en: "Rent A Car Rajshahi", bn: "রেন্ট এ কার রাজশাহী" },
    description: "",
    parent: null,
  },
];
