/**
 * Destinations offered as day trips from Rajshahi.
 *
 * Only facts already published on the owner's own site are encoded here.
 * `distanceKm` is set solely where the existing blog states it — no prices,
 * because none are published. Everything shows "call for price" until the
 * owner confirms a rate card (docs/PLAN.md §12).
 */

export type Destination = {
  slug: string;
  name: { bn: string; en: string };
  blurb: { bn: string; en: string };
  /** Only when the figure is published on the existing site. */
  distanceKm?: number;
};

export const DESTINATIONS: readonly Destination[] = [
  {
    slug: "puthia",
    name: { bn: "পুঠিয়া রাজবাড়ি ও মন্দির চত্বর", en: "Puthia Rajbari & Temple Complex" },
    blurb: {
      bn: "দেশের সবচেয়ে বড় হিন্দু মন্দির চত্বর। একদিনের ভ্রমণের জন্য সবচেয়ে জনপ্রিয় গন্তব্য।",
      en: "Bangladesh's largest concentration of Hindu temples, and the most popular day trip from the city.",
    },
    distanceKm: 32,
  },
  {
    slug: "bagha-mosque",
    name: { bn: "বাঘা মসজিদ", en: "Bagha Mosque" },
    blurb: {
      bn: "ষোড়শ শতকের টেরাকোটা কারুকাজের মসজিদ, রাজশাহীর অন্যতম ঐতিহাসিক নিদর্শন.",
      en: "A sixteenth-century mosque known for its terracotta ornamentation.",
    },
  },
  {
    slug: "varendra-museum",
    name: { bn: "বরেন্দ্র গবেষণা জাদুঘর", en: "Varendra Research Museum" },
    blurb: {
      bn: "উপমহাদেশের অন্যতম প্রাচীন জাদুঘর, শহরের ভেতরেই।",
      en: "One of the oldest museums in the subcontinent, inside the city.",
    },
  },
  {
    slug: "natore-rajbari",
    name: { bn: "নাটোর রাজবাড়ি ও উত্তরা গণভবন", en: "Natore Rajbari & Uttara Ganabhaban" },
    blurb: {
      bn: "রাজশাহীর পাশের জেলায় ঐতিহাসিক রাজবাড়ি ও বাগানবাড়ি।",
      en: "A historic palace and garden estate in the neighbouring district.",
    },
  },
  {
    slug: "padma-riverside",
    name: { bn: "পদ্মার পাড় ও শহর ভ্রমণ", en: "Padma Riverside & City Tour" },
    blurb: {
      bn: "পদ্মা গার্ডেন, শহীদ মিনার ও শহরের প্রধান জায়গাগুলো ঘুরে দেখা।",
      en: "The riverside promenade and the city's main landmarks in a half day.",
    },
  },
];
