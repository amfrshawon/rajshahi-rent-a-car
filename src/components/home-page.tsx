import Link from "next/link";
import {
  AmbulanceIcon,
  ArrowRightIcon,
  ChecklistIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { Photo } from "@/components/photo";
import { route, vehicleRoute } from "@/config/routes";
import { FLEET, SITE } from "@/config/site";
import { GOOGLE_RATING, ROUTE_BOARD, TRIP_TYPES } from "@/config/trips";
import { listArticles } from "@/lib/content";
import { type Locale, formatTaka, localeDigits, t } from "@/lib/locale";

const COPY = {
  eyebrow: { bn: "রাজশাহী · ২৪ ঘণ্টা · ড্রাইভারসহ", en: "Rajshahi · 24 hours · With driver" },
  headline: { bn: "এক কলে বুকিং, ড্রাইভারসহ গাড়ি।", en: "One call to book, a car with a driver." },
  support: {
    bn: "শহরে, বিমানবন্দরে কিংবা ঢাকায় — ভাড়া আগেই জানিয়ে দিই।",
    en: "Across the city, to the airport, or Dhaka — the fare agreed up front.",
  },
  callNow: { bn: "কল করুন", en: "Call now" },
  whatsapp: { bn: "হোয়াটসঅ্যাপ", en: "WhatsApp" },
  heroAlt: { bn: "রাজশাহী রেন্ট এ কার-এর টয়োটা প্রিমিও", en: "A Toyota Premio from Rajshahi Rent A Car" },
  proof: {
    bn: `গুগলে ${localeDigits("bn", GOOGLE_RATING.score.toFixed(1))} · ${localeDigits("bn", GOOGLE_RATING.count)}টি রিভিউ`,
    en: `${GOOGLE_RATING.score.toFixed(1)} on Google · ${GOOGLE_RATING.count} reviews`,
  },

  whereTitle: { bn: "কোথায় যাবেন?", en: "Where are you going?" },
  ambulance: { bn: "জরুরি অ্যাম্বুলেন্স", en: "Emergency ambulance" },
  ambulanceNote: { bn: "২৪ ঘণ্টা · সরাসরি কল", en: "24 hours · call directly" },

  routesKicker: { bn: "ড্রাইভারসহ, ভাড়া আগেই জানা", en: "With a driver, fare agreed first" },
  routesTitle: { bn: "রাজশাহী থেকে", en: "From Rajshahi" },
  minutes: { bn: "মিনিট", en: "min" },
  km: { bn: "কিমি", en: "km" },

  fleetTitle: { bn: "গাড়িবহর", en: "The fleet" },
  fleetLead: { bn: "প্রতিটি গাড়ি এসি, ড্রাইভারসহ।", en: "Every car is air-conditioned and comes with a driver." },
  seats: { bn: "আসন", en: "seats" },
  book: { bn: "বুক করুন", en: "Book" },
  seeAll: { bn: "সব গাড়ি", en: "See all cars" },

  stepsTitle: { bn: "যেভাবে বুকিং হয়", en: "How booking works" },
  steps: [
    { bn: "কল বা হোয়াটসঅ্যাপ করুন", en: "Call or message on WhatsApp" },
    { bn: "আমরা ভাড়া নিশ্চিত করি", en: "We confirm the fare" },
    { bn: "ড্রাইভার সময়মতো হাজির", en: "The driver arrives on time" },
  ] as const,

  ctaTitle: { bn: "যাত্রার প্ল্যান ঠিক হয়ে গেছে?", en: "Trip planned?" },
  ctaLead: {
    bn: "এক কলেই গাড়ি ও ড্রাইভার নিশ্চিত করুন — ঢাকা–রাজশাহীসহ যেকোনো রুট।",
    en: "One call confirms the car and the driver — Dhaka–Rajshahi and beyond.",
  },
  guides: { bn: "ভ্রমণ গাইড পড়ুন", en: "Read the travel guides" },
  fareLine: {
    bn: "শহরের বাইরের ভাড়া ফোনে নিশ্চিত করা হয় — কোনো লুকানো চার্জ নেই।",
    en: "Outstation fares are quoted by phone — no hidden charges.",
  },

  standardTitle: { bn: "আমাদের স্ট্যান্ডার্ড", en: "Our standard" },
  standardLead: {
    bn: "যা সবসময় একই থাকে — গাড়ি, ড্রাইভার আর ভাড়ার নিয়ম।",
    en: "What is the same on every trip — the car, the driver, the fare.",
  },
  standard: [
    { bn: "সব গাড়ি এসি ও ড্রাইভারসহ", en: "Every car is air-conditioned, with a driver" },
    { bn: "অভিজ্ঞ ড্রাইভার", en: "An experienced driver" },
    { bn: "ভাড়া আগেই ঠিক করা", en: "The fare agreed before you travel" },
    { bn: "কোনো লুকানো চার্জ নেই", en: "No hidden charges" },
    { bn: "২৪ ঘণ্টা ফোন ও হোয়াটসঅ্যাপ", en: "Phone and WhatsApp, 24 hours" },
    { bn: "বিকাশ, নগদ, রকেট, উপায়, বাংলা QR, ব্যাংক", en: "bKash, Nagad, Rocket, Upay, Bangla QR, bank" },
  ] as const,

  ambulanceTitle: { bn: "অ্যাম্বুলেন্স — আলাদা জরুরি সেবা", en: "Ambulance — a separate emergency service" },
  ambulanceLead: {
    bn: "রাজশাহী মেডিকেল এলাকায় অবস্থান। প্রশিক্ষিত স্টাফসহ রোগী পরিবহন, ২৪ ঘণ্টা।",
    en: "Based in the Rajshahi Medical area. Patient transport with trained staff, 24 hours.",
  },
  ambulanceCta: { bn: "অ্যাম্বুলেন্সের বিস্তারিত", en: "Ambulance details" },

  packagesTitle: { bn: "প্যাকেজ", en: "Packages" },
  packagesLead: {
    bn: "যাত্রা আগেই ঠিক থাকলে বুকিংও সহজ।",
    en: "Easier booking when the trip is already planned.",
  },
  packages: [
    { bn: "শহরে একদিন", en: "A day in the city", note: { bn: "প্রাইভেট কার, ৪ আসন", en: "Sedan, 4 seats" } },
    { bn: "বিমানবন্দর ও স্টেশন", en: "Airport & station", note: { bn: "ফ্লাইট/ট্রেনের সময় অনুযায়ী", en: "Timed to your flight or train" } },
    { bn: "বিয়ের গাড়ি", en: "Wedding car", note: { bn: "আগে থেকে বুকিং", en: "Booked ahead" } },
    { bn: "পুঠিয়া একদিনের ট্রিপ", en: "Puthia day trip", note: { bn: "৩২ কিমি · প্রায় ৫০ মিনিট", en: "32 km · about 50 minutes" } },
  ] as const,

  corporateTitle: { bn: "কোম্পানি ও মাসিক ভাড়া", en: "Corporate & monthly" },
  corporateLead: {
    bn: "কোম্পানি, এনজিও, প্রজেক্ট বা মাসিক ভাড়ার জন্য ফোনে জানান — প্রয়োজনের কথা শুনে ভাড়া জানানো হয়।",
    en: "For companies, NGOs, projects or monthly hire, call us — we quote after hearing what you need.",
  },
  corporateCta: { bn: "ফোনে জানান", en: "Call to discuss" },

  faqTitle: { bn: "সাধারণ প্রশ্ন", en: "Common questions" },
  faqAll: { bn: "সব প্রশ্ন", en: "All questions" },

  areaTitle: { bn: "যেখানে সেবা দিই", en: "Where we serve" },
  areaLead: {
    bn: "রাজশাহী শহর ও বিভাগজুড়ে, ঢাকাসহ দেশের যেকোনো জেলায়।",
    en: "Rajshahi city and across the division, to Dhaka and any district.",
  },
  area: {
    bn: ["রাজশাহী শহর", "রাজশাহী মেডিকেল এলাকা", "নাটোর", "চাঁপাইনবাবগঞ্জ", "নওগাঁ", "ঢাকা"],
    en: ["Rajshahi city", "Rajshahi Medical area", "Natore", "Chapainawabganj", "Naogaon", "Dhaka"],
  },
} as const;

const HOMEPAGE_FAQS = [
  {
    q: { bn: "কীভাবে গাড়ি বুক করবো?", en: "How do I book a car?" },
    a: {
      bn: `সরাসরি ${SITE.phoneDisplay.bn} নম্বরে কল করুন, হোয়াটসঅ্যাপে মেসেজ দিন, অথবা ওয়েবসাইটের বুকিং ফর্ম পূরণ করুন। দিনরাত ২৪ ঘণ্টা যোগাযোগ করা যায়।`,
      en: `Call ${SITE.phoneDisplay.en}, message us on WhatsApp, or fill in the booking form on this site. We answer 24 hours a day.`,
    },
  },
  {
    q: { bn: "কী কী গাড়ি পাওয়া যায়?", en: "Which vehicles are available?" },
    a: {
      bn: "টয়োটা প্রিমিও ও এক্সিও (প্রাইভেট কার, ৪ আসন) এবং টয়োটা হাইএস (মাইক্রোবাস, ১৫ আসন)। সবগুলোই এসি।",
      en: "Toyota Premio and Axio sedans (4 seats) and a Toyota Hiace microbus (15 seats). All are air-conditioned.",
    },
  },
  {
    q: { bn: "ড্রাইভার কি সাথে থাকে?", en: "Does the car come with a driver?" },
    a: {
      bn: "হ্যাঁ, সব গাড়ি অভিজ্ঞ ড্রাইভারসহ ভাড়া দেওয়া হয়।",
      en: "Yes. Every vehicle is rented with an experienced driver.",
    },
  },
  {
    q: { bn: "ভাড়া কত?", en: "What are the rates?" },
    a: {
      bn: "শহরের ভেতরে দৈনিক ভাড়া গাড়ি অনুযায়ী ৳৪,০০০ থেকে ৳৮,০০০। শহরের বাইরের ভাড়া দূরত্ব অনুযায়ী ফোনে জানানো হয়।",
      en: "Day rates within the city run from ৳4,000 to ৳8,000 depending on the car. Outstation fares are quoted by distance over the phone.",
    },
  },
] as const;

export async function HomePage({ locale }: { locale: Locale }) {
  const hero = FLEET[0];
  const contact = route(locale, "contact");
  const articles = await listArticles(locale);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOMEPAGE_FAQS.map((item) => ({
      "@type": "Question",
      name: t(locale, item.q),
      acceptedAnswer: { "@type": "Answer", text: t(locale, item.a) },
    })),
  };

  const waText = encodeURIComponent(
    t(locale, { bn: "আসসালামু আলাইকুম, আমি গাড়ি ভাড়া নিতে চাই।", en: "Hello, I would like to rent a car." }),
  );

  return (
    <PageShell locale={locale}>
      {/* ------------------------------------------------------------- Hero */}
      <section className="bg-brand text-brand-fg">
        <div className="mx-auto w-full max-w-6xl px-4 pt-4 pb-4 md:px-6 md:pt-10 md:pb-8">
          {/*
            Phones read top to bottom: promise, then "where to?", then the car.
            The photo used to sit between the buttons and the trip tiles, which
            pushed the tiles below the fold on 360x640 and 320x568 screens. On
            desktop the photo returns to the right-hand column.
          */}
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-6">
            <div className="lg:col-start-1 lg:row-start-1 lg:self-center">
              <p className="flex items-center gap-2 text-sm font-semibold opacity-90">
                <span aria-hidden="true" className="bg-pin size-2 rounded-full" />
                {t(locale, COPY.eyebrow)}
              </p>
              <h1 className="mt-2 text-4xl leading-tight font-bold md:text-6xl">
                {t(locale, COPY.headline)}
              </h1>
              <p className="mt-2 max-w-md text-base opacity-90 md:text-lg">
                {t(locale, COPY.support)}
              </p>

              <div className="mt-4 flex flex-wrap gap-2.5">
                <a
                  href={`tel:${SITE.phone}`}
                  className="bg-bg text-leaf inline-flex min-h-12 items-center gap-2 rounded-lg px-6 font-semibold transition active:scale-[0.98]"
                >
                  <PhoneIcon className="size-5" />
                  {t(locale, COPY.callNow)}
                </a>
                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=${waText}`}
                  className="btn-whatsapp"
                >
                  <WhatsAppIcon className="size-5" />
                  {t(locale, COPY.whatsapp)}
                </a>
              </div>
            </div>

            {/* Trip tiles and the ambulance row. */}
            <div className="lg:col-span-2 lg:row-start-2">
              <h2 className="sr-only">{t(locale, COPY.whereTitle)}</h2>
              <p className="text-lg font-bold">{t(locale, COPY.whereTitle)}</p>
              <ul className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
                {TRIP_TYPES.map((trip) => (
                  <li key={trip.key}>
                    <a
                      href={`${contact}?trip=${trip.key}#booking`}
                      className="bg-bg text-fg flex h-full flex-col gap-0.5 rounded-lg p-2.5 transition active:scale-[0.98]"
                    >
                      <span className="font-semibold">{t(locale, trip.label)}</span>
                      <span className="text-muted text-[13px]">{t(locale, trip.note)}</span>
                    </a>
                  </li>
                ))}
              </ul>

              {/* Ambulance — the one red-outlined row, a direct call. It sits on
                  its own white ground: the pin red is only 4.96:1 on white, and
                  would fail on the green panel. */}
              <a
                href={`tel:${SITE.phone}`}
                className="border-pin bg-bg text-pin mt-2 flex min-h-11 items-center justify-between gap-3 rounded-lg border px-3 py-2 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <AmbulanceIcon className="size-5" />
                  {t(locale, COPY.ambulance)}
                </span>
                <span className="text-[13px] font-semibold">{t(locale, COPY.ambulanceNote)}</span>
              </a>
            </div>

            {/* Full colour — the car is the subject, not a backdrop. */}
            <div className="relative order-last overflow-hidden rounded-lg lg:order-none lg:col-start-2 lg:row-start-1 lg:self-center">
              <Photo
                name={hero.photo.name}
                width={hero.photo.width}
                height={hero.photo.height}
                alt={t(locale, COPY.heroAlt)}
                sizes="(min-width: 1024px) 560px, 92vw"
                priority
                className="aspect-[16/9] w-full object-cover"
              />
              {GOOGLE_RATING.count >= 10 ? (
                <span className="text-fg absolute bottom-3 left-3 rounded bg-white/95 px-2.5 py-1 text-[13px] font-semibold">
                  <span aria-hidden="true" className="text-pin">★</span> {t(locale, COPY.proof)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Route board */}
      <section className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <p className="eyebrow">{t(locale, COPY.routesKicker)}</p>
        <h2 className="mt-1 text-2xl font-bold md:text-4xl">{t(locale, COPY.routesTitle)}</h2>

        <ul className="mt-4 border-t border-border">
          {ROUTE_BOARD.map((r) => (
            <li key={r.to.en} className="border-border border-b">
              <a
                href={`${contact}?destination=${encodeURIComponent(t(locale, r.to))}#booking`}
                className="flex min-h-11 items-center gap-3 py-2 transition active:bg-surface"
              >
                <span aria-hidden="true" className="bg-pin size-2.5 shrink-0 rounded-full" />
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{t(locale, r.to)}</span>
                  <span className="text-muted block text-sm">{t(locale, r.note)}</span>
                </span>
                <span className="tnum text-leaf shrink-0 text-right text-lg font-semibold">
                  {r.km === null ? null : (
                    <>
                      {localeDigits(locale, r.km)} {t(locale, COPY.km)}
                      {r.minutes ? (
                        <small className="text-muted block text-[13px] font-normal">
                          {localeDigits(locale, r.minutes)} {t(locale, COPY.minutes)}
                        </small>
                      ) : null}
                    </>
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="text-muted mt-2 text-sm">{t(locale, COPY.fareLine)}</p>
      </section>

      {/* -------------------------------------------------------------- Fleet */}
      <section className="bg-surface border-border border-y">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold md:text-4xl">{t(locale, COPY.fleetTitle)}</h2>
              <p className="text-muted mt-1">{t(locale, COPY.fleetLead)}</p>
            </div>
            <Link href={route(locale, "fleet")} className="text-leaf inline-flex min-h-11 items-center gap-1.5 font-semibold">
              {t(locale, COPY.seeAll)}
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>

          <ul
            tabIndex={0}
            aria-label={t(locale, COPY.fleetTitle)}
            className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0"
          >
            {FLEET.map((v) => (
              <li key={v.slug} className="w-[80%] shrink-0 snap-start sm:w-auto">
                <div className="tile overflow-hidden">
                  <Photo
                    name={v.photo.name}
                    width={v.photo.width}
                    height={v.photo.height}
                    alt={v.name}
                    sizes="(min-width: 640px) 340px, 80vw"
                    className="aspect-[16/9] w-full object-cover"
                  />
                  <div className="p-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-lg font-bold">
                        <Link href={vehicleRoute(locale, v.slug)} className="hover:text-leaf inline-flex min-h-11 items-center">
                          {v.name}
                        </Link>
                      </h3>
                      <p className="tnum text-leaf text-xl font-bold whitespace-nowrap">
                        ৳{formatTaka(locale, v.pricePerDay)}
                        <span className="text-muted text-sm font-normal">/{locale === "bn" ? "দিন" : "day"}</span>
                      </p>
                    </div>
                    <p className="text-muted mt-1 text-sm">
                      {formatTaka(locale, v.seats)} {t(locale, COPY.seats)} · {t(locale, v.transmission)}
                    </p>
                    <a
                      href={`${contact}?trip=city&vehicle=${encodeURIComponent(v.name)}#booking`}
                      className="btn-primary mt-3 w-full"
                    >
                      {t(locale, COPY.book)}
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>


      {/* --------------------------------------------------- Our standard */}
      <section className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <h2 className="text-2xl font-bold md:text-4xl">{t(locale, COPY.standardTitle)}</h2>
        <p className="text-muted mt-1 text-sm">{t(locale, COPY.standardLead)}</p>
        <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {COPY.standard.map((item) => (
            <li key={item.en} className="flex items-start gap-2">
              <ChecklistIcon className="text-leaf mt-0.5 size-4 shrink-0" />
              <span className="font-medium">{t(locale, item)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------- Packages */}
      <section className="bg-surface border-border border-y">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold md:text-4xl">{t(locale, COPY.packagesTitle)}</h2>
              <p className="text-muted mt-1 text-sm">{t(locale, COPY.packagesLead)}</p>
            </div>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 border-t border-border">
            {COPY.packages.map((pkg, i) => {
              const href = [route(locale, "pricing"), route(locale, "pickup"), route(locale, "wedding"), route(locale, "tours")][i];
              return (
                <li key={pkg.en} className="border-border border-b">
                  <Link
                    href={href}
                    className="flex min-h-11 items-center justify-between gap-2 py-1.5"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold">{t(locale, { bn: pkg.bn, en: pkg.en })}</span>
                      <span className="text-muted block text-[13px]">{t(locale, pkg.note)}</span>
                    </span>
                    <ArrowRightIcon className="text-leaf size-4 shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------ Ambulance */}
      <section className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <div className="border-pin/30 bg-pin/5 rounded-lg border p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="max-w-xl">
              <h2 className="flex items-center gap-2 text-xl font-bold md:text-2xl">
                <AmbulanceIcon className="text-pin size-5 shrink-0" />
                {t(locale, COPY.ambulanceTitle)}
              </h2>
              <p className="text-muted mt-1 text-sm">{t(locale, COPY.ambulanceLead)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a href={`tel:${SITE.phone}`} className="bg-pin inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition active:scale-[0.98]">
                <PhoneIcon className="size-4" />
                {t(locale, SITE.phoneDisplay)}
              </a>
              <Link href={route(locale, "ambulance")} className="border-border inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-sm font-semibold">
                {t(locale, COPY.ambulanceCta)}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Corporate */}
      <section className="bg-brand text-brand-fg">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 md:px-6 md:py-8">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold md:text-2xl">{t(locale, COPY.corporateTitle)}</h2>
            <p className="mt-1 text-sm opacity-90">{t(locale, COPY.corporateLead)}</p>
          </div>
          <a
            href={`tel:${SITE.phone}`}
            className="bg-bg text-leaf inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition active:scale-[0.98]"
          >
            <PhoneIcon className="size-4" />
            {t(locale, COPY.corporateCta)}
          </a>
        </div>
      </section>

      {/* -------------------------------------------------- How booking works */}
      <section className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <h2 className="text-2xl font-bold md:text-4xl">{t(locale, COPY.stepsTitle)}</h2>
        <ol className="mt-3 grid gap-1.5 sm:grid-cols-3 sm:gap-3">
          {COPY.steps.map((step, index) => (
            <li key={step.en} className="flex items-center gap-2">
              <span className="tnum bg-brand text-brand-fg flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                {localeDigits(locale, index + 1)}
              </span>
              <p className="text-sm leading-snug font-medium">{t(locale, step)}</p>
            </li>
          ))}
        </ol>
      </section>


      {/* ------------------------------------------------------------- FAQ */}
      <section className="bg-surface border-border border-y">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-bold md:text-4xl">{t(locale, COPY.faqTitle)}</h2>
            <Link href={route(locale, "faq")} className="text-leaf inline-flex min-h-11 items-center gap-1.5 font-semibold">
              {t(locale, COPY.faqAll)}
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-border border-border border-y">
            {HOMEPAGE_FAQS.map((item) => (
              <li key={item.q.en} className="py-1">
                <details className="group">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-semibold">
                    {t(locale, item.q)}
                    <span aria-hidden="true" className="text-leaf text-xl leading-none group-open:rotate-45">+</span>
                  </summary>
                  <p className="text-muted mt-1 max-w-3xl text-sm">{t(locale, item.a)}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------- Service area */}
      <section className="mx-auto w-full max-w-6xl px-4 py-5 md:px-6 md:py-8">
        <h2 className="text-xl font-bold md:text-3xl">{t(locale, COPY.areaTitle)}</h2>
        <p className="text-muted mt-1 text-sm">{t(locale, COPY.areaLead)}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {COPY.area[locale].map((area) => (
            <li key={area} className="border-border bg-surface rounded-full border px-3 py-1 text-[13px] font-medium">
              {area}
            </li>
          ))}
        </ul>
        {articles.length > 0 ? (
          <Link
            href={route(locale, "blog")}
            className="text-leaf mt-2 inline-flex min-h-11 items-center gap-1.5 font-semibold"
          >
            {t(locale, COPY.guides)}
            <ArrowRightIcon className="size-4" />
          </Link>
        ) : null}
      </section>
      <JsonLd data={faqSchema} />

      {/* ------------------------------------------------------- Closing strip */}
      <section className="bg-brand text-brand-fg">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-7 md:px-6 md:py-9">
          <div>
            <h2 className="text-xl font-bold md:text-3xl">{t(locale, COPY.ctaTitle)}</h2>
            <p className="mt-1 max-w-xl text-sm opacity-90">{t(locale, COPY.ctaLead)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={`tel:${SITE.phone}`}
              className="bg-bg text-leaf inline-flex min-h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold transition active:scale-[0.98]"
            >
              <PhoneIcon className="size-5" />
              {t(locale, SITE.phoneDisplay)}
            </a>
            <a href={`https://wa.me/${SITE.whatsapp}?text=${waText}`} className="btn-whatsapp">
              <WhatsAppIcon className="size-5" />
              {t(locale, COPY.whatsapp)}
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
