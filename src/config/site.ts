/**
 * Business facts, taken from the live site on 2026-09-07.
 * These need owner re-confirmation before launch (see docs/PLAN.md §12).
 */

export const SITE = {
  url: "https://rajshahirentacar.bd",
  name: { bn: "রাজশাহী রেন্ট এ কার", en: "Rajshahi Rent A Car" },

  phone: "+8801714424241",
  /** Digits only, for wa.me links. */
  whatsapp: "8801714424241",
  phoneDisplay: { bn: "০১৭১৪-৪২৪২৪১", en: "+880 1714 424 241" },

  email: "info@rajshahirentacar.bd",
  bookingEmail: "booking@rajshahirentacar.bd",

  address: {
    bn: "কাদিরগঞ্জ, গ্রেটার রোড, রাজশাহী",
    en: "Kadirgonj Greater Road, Rajshahi, Bangladesh",
  },
  hours: { bn: "২৪/৭ খোলা", en: "Open 24/7" },
} as const;

export type Vehicle = {
  slug: string;
  name: string;
  type: { bn: string; en: string };
  seats: number;
  fuel: { bn: string; en: string };
  transmission: { bn: string; en: string };
  /** Taka per day. */
  pricePerDay: number;
  /**
   * Basename in public/media/generated/, plus the intrinsic size of the
   * original. Declared here rather than read from the generated manifest so
   * the build does not depend on image generation having run first.
   */
  photo: { name: string; width: number; height: number };
};

export const FLEET: readonly Vehicle[] = [
  {
    slug: "toyota-premio",
    name: "Toyota Premio",
    type: { bn: "প্রাইভেট কার", en: "Sedan" },
    seats: 4,
    fuel: { bn: "এলপিজি / পেট্রোল", en: "LPG / Petrol" },
    transmission: { bn: "অটোমেটিক", en: "Automatic" },
    pricePerDay: 4500,
    photo: { name: "toyota-premio", width: 1200, height: 749 },
  },
  {
    slug: "toyota-axio",
    name: "Toyota Axio",
    type: { bn: "প্রাইভেট কার", en: "Sedan" },
    seats: 4,
    fuel: { bn: "এলপিজি / পেট্রোল", en: "LPG / Petrol" },
    transmission: { bn: "অটোমেটিক", en: "Automatic" },
    pricePerDay: 4000,
    photo: { name: "toyota-axio", width: 1000, height: 666 },
  },
  {
    slug: "toyota-hiace",
    name: "Toyota Hiace",
    type: { bn: "মাইক্রোবাস", en: "Microbus" },
    seats: 15,
    fuel: { bn: "এলপিজি / পেট্রোল", en: "LPG / Petrol" },
    transmission: { bn: "ম্যানুয়াল", en: "Manual" },
    pricePerDay: 8000,
    photo: { name: "toyota-hiace", width: 700, height: 525 },
  },
];
