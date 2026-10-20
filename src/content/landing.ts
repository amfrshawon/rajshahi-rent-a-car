import { FLEET } from "@/config/site";
import type { LandingContent } from "@/components/pages/landing-page";

/**
 * Copy for the long-tail landing pages. Every claim here is already published
 * elsewhere in this repo (fleet list, FAQ, ambulance page, tour page); nothing
 * is measured or promised that the owner has not confirmed. Distances exist
 * only for Puthia. Outstation fares are always "quoted by phone".
 */

const premio = FLEET[0];
const hiace = FLEET[2];

export const LANDING = {
  dhaka: {
    paths: { bn: "/রাজশাহী-ঢাকা-গাড়ি-ভাড়া/", en: "/en/rajshahi-dhaka-car-rental/" },
    eyebrow: { bn: "ঢাকা · দূরপাল্লা", en: "Dhaka · long distance" },
    title: {
      bn: "রাজশাহী থেকে ঢাকা গাড়ি ভাড়া",
      en: "Rajshahi to Dhaka car rental",
    },
    lead: {
      bn: "ড্রাইভারসহ প্রাইভেট কার বা মাইক্রোবাস — ভাড়া আগেই ফোনে নিশ্চিত করা হয়।",
      en: "A sedan or microbus with a driver — the fare agreed over the phone before you travel.",
    },
    photo: {
      ...premio.photo,
      alt: { bn: `${premio.name} — রাজশাহী থেকে ঢাকা যাত্রার জন্য`, en: `${premio.name} for a Rajshahi–Dhaka trip` },
    },
    sections: [
      {
        heading: { bn: "রাজশাহী–ঢাকা যাত্রা", en: "The Rajshahi–Dhaka run" },
        body: {
          bn: "ঢাকা যাওয়ার জন্য টয়োটা প্রিমিও বা এক্সিও (৪ আসন) নিতে পারেন, আর বেশি যাত্রী বা লাগেজ থাকলে টয়োটা হাইএস মাইক্রোবাস (১৫ আসন)। গাড়ি ও অভিজ্ঞ ড্রাইভার দুটোই ভাড়ার সাথে থাকে।",
          en: "Take a Toyota Premio or Axio sedan (4 seats) for Dhaka, or a Toyota Hiace microbus (15 seats) when there are more passengers or luggage. The car and an experienced driver are both part of the rental.",
        },
      },
      {
        heading: { bn: "ভাড়া কীভাবে ঠিক হয়", en: "How the fare is set" },
        body: {
          bn: "শহরের ভেতরের দৈনিক ভাড়া তালিকায় দেওয়া আছে। ঢাকার মতো দূরের গন্তব্যের ভাড়া দূরত্ব ও গাড়ি অনুযায়ী ফোনে জানানো হয় — যাত্রার আগেই চূড়ান্ত ভাড়া জেনে নিতে পারবেন, কোনো লুকানো চার্জ নেই।",
          en: "Day rates within Rajshahi are listed on the pricing page. For a destination like Dhaka the fare is quoted by distance and by car when you call — so you know the final amount before you travel, with no hidden charges.",
        },
      },
      {
        heading: { bn: "বিমানবন্দর বা ঠিকানায় পৌঁছে দেওয়া", en: "Dropped at the airport or your address" },
        body: {
          bn: "ঢাকায় বিমানবন্দরে, রেলস্টেশনে বা নির্দিষ্ট ঠিকানায় নামতে চাইলে কল করার সময় বলুন — রুট আগেই ঠিক করে নেওয়া যায়।",
          en: "If you want to be dropped at the airport, a railway station or a specific address in Dhaka, say so when you call and the route is settled in advance.",
        },
      },
    ],
    inclusions: [
      { bn: "অভিজ্ঞ ড্রাইভার", en: "An experienced driver" },
      { bn: "এসি গাড়ি", en: "Air-conditioned car" },
      { bn: "ভাড়া আগেই ঠিক করা", en: "The fare agreed before you travel" },
      { bn: "কোনো লুকানো চার্জ নেই", en: "No hidden charges" },
      { bn: "২৪ ঘণ্টা ফোন ও হোয়াটসঅ্যাপ", en: "Phone and WhatsApp, 24 hours" },
    ],
    links: [
      { label: { bn: "গাড়িবহর দেখুন", en: "See the fleet" }, route: "fleet" as const },
      { label: { bn: "ভাড়ার তালিকা", en: "Pricing" }, route: "pricing" as const },
      { label: { bn: "এয়ারপোর্ট ও স্টেশন পিকআপ", en: "Airport & station pickup" }, route: "pickup" as const },
    ],
    faqs: [
      {
        q: { bn: "ঢাকার ভাড়া কত?", en: "What does a Dhaka trip cost?" },
        a: {
          bn: "দূরত্ব ও গাড়ি অনুযায়ী ভাড়া বদলায়, তাই ফোনে জানানো হয়। কল করলে যাত্রার আগেই চূড়ান্ত ভাড়া বলে দেওয়া হয়।",
          en: "It depends on the car and the route, so it is quoted by phone. Call us and you get the final fare before you travel.",
        },
      },
      {
        q: { bn: "একদিনে যাওয়া-আসা করা যাবে?", en: "Can I do a same-day return?" },
        a: {
          bn: "যাবে। কল করার সময় বলুন কখন যেতে চান এবং কখন ফিরতে চান — সেই অনুযায়ী পরিকল্পনা করে ভাড়া জানানো হয়।",
          en: "Yes. Tell us when you want to leave and when you want to return, and we plan the trip and quote on that basis.",
        },
      },
      {
        q: { bn: "বেশি যাত্রী হলে কী গাড়ি?", en: "Which car for more passengers?" },
        a: {
          bn: "টয়োটা হাইএস মাইক্রোবাসে ১৫ আসন, ড্রাইভারসহ।",
          en: "The Toyota Hiace microbus seats 15, with the driver included.",
        },
      },
    ],
  },

  microbus: {
    paths: { bn: "/মাইক্রোবাস-ভাড়া-রাজশাহী/", en: "/en/microbus-rental-rajshahi/" },
    eyebrow: { bn: "১৫ আসন · ড্রাইভারসহ", en: "15 seats · with driver" },
    title: {
      bn: "রাজশাহীতে মাইক্রোবাস ভাড়া",
      en: "Microbus rental in Rajshahi",
    },
    lead: {
      bn: "টয়োটা হাইএস — ১৫ আসন, এসি, অভিজ্ঞ ড্রাইভারসহ। পরিবার, দল বা অফিসের জন্য।",
      en: "Toyota Hiace — 15 seats, air-conditioned, with an experienced driver. For families, groups and offices.",
    },
    photo: {
      ...hiace.photo,
      alt: { bn: `${hiace.name} মাইক্রোবাস`, en: `The ${hiace.name} microbus` },
    },
    sections: [
      {
        heading: { bn: "একসাথে ১৫ জন", en: "Fifteen people at once" },
        body: {
          bn: "টয়োটা হাইএস আমাদের একমাত্র মাইক্রোবাস — ১৫ আসন, এসি এবং ড্রাইভারসহ। বড় পরিবার, অফিসের দল বা অতিথি আনা-নেওয়ার জন্য এক গাড়িতেই হয়ে যায়।",
          en: "The Toyota Hiace is our microbus: 15 seats, air-conditioned, with a driver. It covers a large family, an office group or guest transfers in one vehicle.",
        },
      },
      {
        heading: { bn: "শহরে ও শহরের বাইরে", en: "In the city and beyond" },
        body: {
          bn: "শহরের ভেতরে দৈনিক ভাড়া তালিকায় আছে। নাটোর, চাঁপাইনবাবগঞ্জ, পুঠিয়া বা ঢাকার মতো বাইরের গন্তব্যের ভাড়া ফোনে জানানো হয়।",
          en: "The day rate within the city is on the pricing page. Fares to Natore, Chapainawabganj, Puthia or Dhaka are quoted over the phone.",
        },
      },
    ],
    inclusions: [
      { bn: "১৫ আসন, এসি", en: "15 seats, air-conditioned" },
      { bn: "অভিজ্ঞ ড্রাইভার", en: "An experienced driver" },
      { bn: "ভাড়া আগেই ঠিক করা", en: "The fare agreed before you travel" },
      { bn: "বড় দল বা লাগেজের জায়গা", en: "Room for a group or their luggage" },
    ],
    links: [
      { label: { bn: "হাইএস-এর বিস্তারিত", en: "Hiace details" }, route: "fleet" as const },
      { label: { bn: "ট্যুর প্যাকেজ", en: "Tour packages" }, route: "tours" as const },
      { label: { bn: "ভাড়ার তালিকা", en: "Pricing" }, route: "pricing" as const },
    ],
    faqs: [
      {
        q: { bn: "মাইক্রোবাসে কতজন বসতে পারে?", en: "How many people fit in the microbus?" },
        a: {
          bn: "টয়োটা হাইএস-এ ১৫টি আসন আছে, ড্রাইভার আলাদা।",
          en: "The Toyota Hiace has 15 seats; the driver is separate.",
        },
      },
      {
        q: { bn: "বিয়ের অনুষ্ঠানে নেওয়া যাবে?", en: "Can I use it for a wedding?" },
        a: {
          bn: "যাবে। বিয়ের গাড়ির পেজে বিস্তারিত আছে, অথবা সরাসরি কল করুন।",
          en: "Yes. The wedding car page has the details, or just call us.",
        },
      },
      {
        q: { bn: "একাধিক দিনের জন্য ভাড়া?", en: "Can I rent it for several days?" },
        a: {
          bn: "দিন সংখ্যা ও রুট জানালে ভাড়া জানানো হয় — মাসিক বা দীর্ঘমেয়াদি ভাড়ার জন্যও ফোন করতে পারেন।",
          en: "Tell us the number of days and the route and we quote. Corporate or longer-term hire is also arranged by phone.",
        },
      },
    ],
  },

  ambulanceRmch: {
    paths: { bn: "/রাজশাহী-মেডিকেল-অ্যাম্বুলেন্স/", en: "/en/ambulance-near-rajshahi-medical/" },
    eyebrow: { bn: "২৪ ঘণ্টা · জরুরি", en: "24 hours · emergency" },
    title: {
      bn: "রাজশাহী মেডিকেল কলেজ এলাকার অ্যাম্বুলেন্স",
      en: "Ambulance near Rajshahi Medical College",
    },
    lead: {
      bn: "রাজশাহী মেডিকেল এলাকায় অবস্থান — শহরের ভেতরে, বিভাগজুড়ে এবং ঢাকাসহ সারা দেশে রোগী পরিবহন।",
      en: "Based in the Rajshahi Medical area — patient transport across the city, the division and as far as Dhaka.",
    },
    sections: [
      {
        heading: { bn: "রাজশাহী মেডিকেল এলাকা থেকে", en: "From the Rajshahi Medical area" },
        body: {
          bn: "আমাদের অ্যাম্বুলেন্স রাজশাহী মেডিকেল এলাকায় অবস্থান করে। হাসপাতালে ভর্তি, হাসপাতাল বদল বা বাসা থেকে রোগী নেওয়া — যেকোনো প্রয়োজনে ২৪ ঘণ্টা কল করা যায়।",
          en: "Our ambulance is based in the Rajshahi Medical area. Admission, a transfer between hospitals or a pickup from home — call any time, day or night.",
        },
      },
      {
        heading: { bn: "প্রশিক্ষিত স্টাফসহ", en: "With trained staff" },
        body: {
          bn: "রোগী পরিবহনে অভিজ্ঞ ও প্রশিক্ষিত কর্মী সঙ্গে থাকেন। জরুরি চিকিৎসার সরঞ্জামসহ সজ্জিত অ্যাম্বুলেন্স পাওয়া যায়।",
          en: "Staff experienced in patient transport travel with the patient, and the ambulance is equipped for emergency care.",
        },
      },
      {
        heading: { bn: "কল করার সময় যা বলবেন", en: "What to tell us when you call" },
        body: {
          bn: "রোগী এখন কোথায় আছেন, অবস্থা সংক্ষেপে, কোথায় নিয়ে যেতে হবে এবং আপনার যোগাযোগের নম্বর — এই চারটি তথ্য থাকলে সবচেয়ে কম সময়ে অ্যাম্বুলেন্স পাঠানো যায়।",
          en: "Where the patient is now, the condition in brief, where they need to go, and a number we can call back — with those four things we can dispatch fastest.",
        },
      },
    ],
    links: [
      { label: { bn: "অ্যাম্বুলেন্স সার্ভিসের বিস্তারিত", en: "Full ambulance service" }, route: "ambulance" as const },
      { label: { bn: "যোগাযোগ", en: "Contact" }, route: "contact" as const },
    ],
    faqs: [
      {
        q: { bn: "রাতেও পাওয়া যাবে?", en: "Is the ambulance available at night?" },
        a: {
          bn: "হ্যাঁ। ২৪ ঘণ্টা লাইন খোলা — দিন হোক বা রাত, সরাসরি কল করুন।",
          en: "Yes. The line is open 24 hours — call directly, day or night.",
        },
      },
      {
        q: { bn: "ঢাকায় রোগী নেওয়া যাবে?", en: "Can you take a patient to Dhaka?" },
        a: {
          bn: "যাবে। রাজশাহী বিভাগের জেলাগুলো এবং ঢাকাসহ দেশের যেকোনো জেলায় দূরপাল্লার পরিবহন করা হয়।",
          en: "Yes. Long-distance transport covers the districts of Rajshahi division and any district in the country, including Dhaka.",
        },
      },
      {
        q: { bn: "কল করার সময় কী জানাবো?", en: "What should I say when I call?" },
        a: {
          bn: "রোগী কোথায় আছেন, অবস্থা কেমন, কোথায় নিয়ে যেতে হবে এবং আপনার নম্বর — এই তথ্যগুলো বলুন।",
          en: "Where the patient is, how they are, where they need to go, and your phone number.",
        },
      },
    ],
  },
} as const satisfies Record<string, LandingContent>;
