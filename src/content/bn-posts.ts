/**
 * Bangla overlay for the WordPress posts.
 *
 * The live site is English-only. Until Polylang is installed on WordPress
 * (needs owner admin access), Bangla titles and excerpts live here in the
 * repo and the article body falls back to the English original.
 *
 * Every entry below is `status: "draft"` — machine-drafted and NOT yet
 * checked by a native speaker. Nothing should go to production until each
 * one is reviewed and flipped to "reviewed". See docs/PLAN.md §11.
 *
 * Keys are the WordPress slugs, which are also the live URLs and must not
 * change (src/config/legacy-routes.ts).
 */

export type BanglaPost = {
  title: string;
  excerpt: string;
  /** Translated body. Absent means the page falls back to the English HTML. */
  content?: string;
  status: "draft" | "reviewed";
};

export const BN_POSTS: Record<string, BanglaPost> = {
  "varendra-research-museum-rajshahi-day-trip": {
    title: "বরেন্দ্র গবেষণা জাদুঘর: রাজশাহী শহর থেকে একদিনের ভ্রমণ গাইড",
    excerpt:
      "উপমহাদেশের অন্যতম প্রাচীন এই জাদুঘরে একদিনেই ঘুরে আসা যায়। কীভাবে যাবেন, কখন যাবেন আর গাড়িতে গেলে কী সুবিধা — সব একসাথে।",
    status: "draft",
  },
  "5-star-car-rental-reviews-rajshahi": {
    title: "গ্রাহকরা কেন বারবার ফিরে আসেন: আমাদের ৫ স্টার রিভিউ",
    excerpt:
      "সময়মতো গাড়ি, ভদ্র ড্রাইভার আর ফিক্সড রেট — গ্রাহকদের নিজের ভাষায় আমাদের সার্ভিসের অভিজ্ঞতা।",
    status: "draft",
  },
  "2-day-car-rental-discount-rajshahi-april": {
    title: "২ দিন বুক করলে অতিরিক্ত ১০% ছাড় — সীমিত সময়ের অফার",
    excerpt:
      "টানা দুই দিনের বুকিংয়ে বাড়তি ছাড়। লম্বা ট্রিপ বা পারিবারিক ভ্রমণের জন্য সবচেয়ে সাশ্রয়ী সময়।",
    status: "draft",
  },
  "how-to-choose-right-rental-car-rajshahi": {
    title: "রাজশাহীতে ভ্রমণের জন্য সঠিক ভাড়ার গাড়ি কীভাবে বাছবেন",
    excerpt:
      "কতজন যাত্রী, কত দূরের পথ, লাগেজ কেমন — এই তিনটি প্রশ্নের উত্তরেই ঠিক হয়ে যায় আপনার জন্য সেডান না মাইক্রোবাস।",
    status: "draft",
  },
  "top-7-places-visit-rajshahi-car-guide": {
    title: "রাজশাহীর সেরা ৭টি দর্শনীয় স্থান — গাড়িতে ঘোরার গাইড",
    excerpt:
      "পুঠিয়া, বাঘা মসজিদ, বরেন্দ্র জাদুঘর থেকে পদ্মার পাড় — একদিনে কোনগুলো একসাথে ঘোরা যায় তার বাস্তব রুট।",
    status: "draft",
  },
  "ac-car-fleet-rajshahi-rent-a-car": {
    title: "রাজশাহীর যেকোনো যাত্রার জন্য আমাদের প্রিমিয়াম এসি গাড়িবহর",
    excerpt:
      "প্রিমিও, এক্সিও ও হাইএস — কোন গাড়ি কোন যাত্রার জন্য উপযুক্ত, আসনসংখ্যা ও ভাড়াসহ বিস্তারিত।",
    status: "draft",
  },
  "rajshahi-city-of-silk-car-tour": {
    title: "রাজশাহী: রেশমের শহর — কেন গাড়িতে ঘুরে দেখবেন",
    excerpt:
      "রেশম কারখানা, আমবাগান আর পদ্মার পাড় — শহরের আসল রূপ দেখতে হলে নিজের সময়মতো ঘোরাই সবচেয়ে ভালো।",
    status: "draft",
  },
  "puthia-temple-day-trip-rajshahi-car": {
    title: "উইকেন্ড ট্রিপ: ভাড়ার গাড়িতে পুঠিয়া মন্দির চত্বর ভ্রমণ",
    excerpt:
      "রাজশাহী শহর থেকে মাত্র ৩০ কিলোমিটার। দেশের সবচেয়ে বড় মন্দির চত্বরে একদিনের ভ্রমণের পূর্ণ পরিকল্পনা।",
    status: "draft",
  },
  "first-time-car-rental-rajshahi-experience": {
    title: "প্রথমবার গাড়ি ভাড়া নেওয়ার অভিজ্ঞতা জানালেন এক গ্রাহক",
    excerpt:
      "বুকিং থেকে যাত্রা শেষ — প্রথমবার ভাড়ায় গাড়ি নেওয়া একজন গ্রাহকের পুরো অভিজ্ঞতা তাঁর নিজের ভাষায়।",
    status: "draft",
  },
  "april-car-rental-discount-rajshahi": {
    title: "এপ্রিল স্পেশাল: প্রথম গাড়ি ভাড়ায় ১৫% ছাড়",
    excerpt:
      "নতুন গ্রাহকদের জন্য প্রথম বুকিংয়ে ১৫% ছাড়। শর্ত ও মেয়াদ এক নজরে দেখে নিন।",
    status: "draft",
  },
  "why-rent-a-car-in-rajshahi": {
    title: "রাজশাহীতে গাড়ি ভাড়া নেবেন কেন? ৭টি কারণ",
    excerpt:
      "নিজের সময়ে চলা, পরিবারসহ আরামে ঘোরা আর খরচের নিশ্চয়তা — ভাড়ায় গাড়ি নেওয়ার সবচেয়ে বাস্তব কারণগুলো।",
    status: "draft",
  },
  "rajshahi-travel-guide": {
    title: "রাজশাহী ভ্রমণ গাইড",
    excerpt:
      "কোথায় থাকবেন, কী দেখবেন, কোন সময়ে গেলে ভালো — রাজশাহী ভ্রমণের সম্পূর্ণ গাইড এক জায়গায়।",
    status: "draft",
  },
  "best-rent-a-car-in-rajshahi": {
    title: "রাজশাহীর সেরা রেন্ট এ কার সার্ভিস",
    excerpt:
      "ভালো রেন্ট এ কার সার্ভিস চেনার উপায় কী, আর রাজশাহীতে গাড়ি ভাড়া নেওয়ার আগে কী কী দেখে নেওয়া দরকার।",
    status: "draft",
  },
};

/** Bangla names for the category archives that carry posts. */
export const BN_CATEGORIES: Record<string, { name: string; status: "draft" | "reviewed" }> = {
  "culture-heritage": { name: "সংস্কৃতি ও ঐতিহ্য", status: "draft" },
  "customer-stories": { name: "গ্রাহকদের অভিজ্ঞতা", status: "draft" },
  "fleet-vehicles": { name: "গাড়িবহর", status: "draft" },
  "promotions-offers": { name: "অফার ও ছাড়", status: "draft" },
  "rajshahi-travel-guide": { name: "রাজশাহী ভ্রমণ গাইড", status: "draft" },
  "local-attractions-hidden-gems-historical-sites-in-rajshahi": {
    name: "রাজশাহীর দর্শনীয় ও ঐতিহাসিক স্থান",
    status: "draft",
  },
  "rent-a-car-rajshahi": { name: "রেন্ট এ কার রাজশাহী", status: "draft" },
  "tips-how-to": { name: "টিপস ও পরামর্শ", status: "draft" },
  "travel-guide": { name: "ভ্রমণ গাইড", status: "draft" },
  "weekend-trip": { name: "উইকেন্ড ট্রিপ", status: "draft" },
};

/** Bangla names for tag archives. */
export const BN_TAGS: Record<string, { name: string; status: "draft" | "reviewed" }> = {
  "rent-a-car-rajshahi": { name: "রেন্ট এ কার রাজশাহী", status: "draft" },
};

/** Bangla overlay for standalone WordPress pages. */
export const BN_PAGES: Record<string, BanglaPost> = {
  "ambulance-service": {
    title: "অ্যাম্বুলেন্স সার্ভিস — রাজশাহী, ২৪ ঘণ্টা",
    excerpt:
      "রাজশাহীতে দিনরাত ২৪ ঘণ্টা অ্যাম্বুলেন্স সেবা। জরুরি প্রয়োজনে সরাসরি ফোন করুন।",
    status: "draft",
  },
};
