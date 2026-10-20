/**
 * Trip types and the Rajshahi route board.
 *
 * Facts on record only: Puthia is 32 km from Rajshahi (the site's own guide)
 * and about 50 minutes. Every other distance is a clearly marked placeholder
 * to be confirmed by the owner — never presented as measured fact. Route fares
 * are deliberately absent: outstation fares are quoted per trip by phone.
 */

export type Bilingual = { bn: string; en: string };

export const TRIP_TYPES = [
  {
    key: "city",
    label: { bn: "শহরের ভেতরে", en: "Within the city" },
    note: { bn: "৳৪,০০০ থেকে / দিন", en: "from ৳4,000 / day" },
  },
  {
    key: "outside",
    label: { bn: "শহরের বাইরে", en: "Outside the city" },
    note: { bn: "নাটোর, পুঠিয়া, ঢাকা", en: "Natore, Puthia, Dhaka" },
  },
  {
    key: "airport",
    label: { bn: "বিমানবন্দর ও স্টেশন", en: "Airport & station" },
    note: { bn: "সময়মতো পিকআপ", en: "On-time pickup" },
  },
  {
    key: "wedding",
    label: { bn: "বিয়ের গাড়ি", en: "Wedding cars" },
    note: { bn: "আগে থেকে বুকিং", en: "Book ahead" },
  },
] as const;

export type TripKey = (typeof TRIP_TYPES)[number]["key"];

export type RouteRow = {
  /** Destination, used as the booking destination and as the row key. */
  to: Bilingual;
  note: Bilingual;
  /** Kilometres from Rajshahi. `null` when not on record. */
  km: number | null;
  /** Travel time, only where it is actually known. */
  minutes: number | null;
};

export const ROUTE_BOARD: readonly RouteRow[] = [
  {
    to: { bn: "পুঠিয়া", en: "Puthia" },
    note: { bn: "মন্দির চত্বর · একদিনের ট্রিপ", en: "Temple complex · a day trip" },
    km: 32,
    minutes: 50,
  },
  {
    to: { bn: "বাঘা", en: "Bagha" },
    note: { bn: "বাঘা মসজিদ", en: "Bagha Mosque" },
    km: null,
    minutes: null,
  },
  {
    to: { bn: "নাটোর", en: "Natore" },
    note: { bn: "রাজবাড়ি · উত্তরা গণভবন", en: "Rajbari · Uttara Ganabhaban" },
    km: null,
    minutes: null,
  },
  {
    to: { bn: "চাঁপাইনবাবগঞ্জ", en: "Chapainawabganj" },
    note: { bn: "সোনা মসজিদ · আমবাগান", en: "Sona Mosque · mango orchards" },
    km: null,
    minutes: null,
  },
  {
    to: { bn: "ঢাকা", en: "Dhaka" },
    note: { bn: "বিমানবন্দর বা যেকোনো ঠিকানা", en: "Airport or any address" },
    km: null,
    minutes: null,
  },
];

/** Confirmed Google rating — real, and small; shown with its count. */
export const GOOGLE_RATING = { score: 5.0, count: 2 } as const;
