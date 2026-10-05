import { route } from "@/config/routes";
import type { Locale } from "@/lib/locale";

/**
 * The four ways people book, shown as the home page's first question and as
 * the booking form's first step. A tile or a route row links to the form
 * with these already chosen (?trip=, ?to=, ?vehicle=).
 */
export type TripKey = "city" | "outstation" | "pickup" | "wedding";

export const TRIPS: readonly { key: TripKey; label: { bn: string; en: string } }[] = [
  { key: "city", label: { bn: "শহরের ভেতরে", en: "Around the city" } },
  { key: "outstation", label: { bn: "শহরের বাইরে", en: "Out of town" } },
  { key: "pickup", label: { bn: "বিমানবন্দর ও স্টেশন", en: "Airport & station" } },
  { key: "wedding", label: { bn: "বিয়ের গাড়ি", en: "Wedding car" } },
];

export function isTripKey(value: string | null): value is TripKey {
  return TRIPS.some((trip) => trip.key === value);
}

/**
 * Rows on the home page's route board. Only figures already published on
 * the owner's site are filled in: Puthia's 32 km comes from the site's own
 * guide. Every other distance and every travel time is unconfirmed and shows
 * as a marked placeholder on dev and preview builds (see Placeholder).
 * Prices are quoted by phone, as the pricing page says.
 */
export type RouteRow = {
  slug: string;
  name: { bn: string; en: string };
  detail: { bn: string; en: string };
  /** Kilometres from Rajshahi, only where published. */
  distanceKm?: number;
  /** Inside the city, so a distance would mislead. */
  inCity?: boolean;
};

export const ROUTE_BOARD: readonly RouteRow[] = [
  {
    slug: "puthia",
    name: { bn: "পুঠিয়া", en: "Puthia" },
    detail: { bn: "রাজবাড়ি ও মন্দির চত্বর", en: "The Rajbari and its temples" },
    distanceKm: 32,
  },
  {
    slug: "bagha",
    name: { bn: "বাঘা", en: "Bagha" },
    detail: { bn: "ষোড়শ শতকের টেরাকোটা মসজিদ", en: "A sixteenth-century terracotta mosque" },
  },
  {
    slug: "natore",
    name: { bn: "নাটোর", en: "Natore" },
    detail: { bn: "রাজবাড়ি ও উত্তরা গণভবন", en: "The Rajbari and Uttara Ganabhaban" },
  },
  {
    slug: "padma",
    name: { bn: "পদ্মার পাড়", en: "The Padma" },
    detail: { bn: "পদ্মা গার্ডেন, শহীদ মিনার, শহর ঘোরা", en: "Padma Garden and a city tour" },
    inCity: true,
  },
  {
    slug: "dhaka",
    name: { bn: "ঢাকা", en: "Dhaka" },
    detail: { bn: "দূরের লম্বা ট্রিপ", en: "The long run to the capital" },
  },
];

/** Link to the booking form with choices already made. */
export function bookingHref(
  locale: Locale,
  choice: { trip?: TripKey; to?: string; vehicle?: string } = {},
): string {
  const params = new URLSearchParams();
  if (choice.trip) params.set("trip", choice.trip);
  if (choice.to) params.set("to", choice.to);
  if (choice.vehicle) params.set("vehicle", choice.vehicle);
  const query = params.toString();
  return `${route(locale, "contact")}${query ? `?${query}` : ""}#booking`;
}
