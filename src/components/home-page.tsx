import Link from "next/link";
import { BookingForm } from "@/components/booking-form";
import {
  AmbulanceIcon,
  ArrowRightIcon,
  BoltIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldIcon,
  SteeringIcon,
  TagIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { PageShell } from "@/components/page-shell";
import { Photo } from "@/components/photo";
import { route } from "@/config/routes";
import { FLEET, SITE } from "@/config/site";
import { formatArticleDate, listArticles } from "@/lib/content";
import { type Locale, formatTaka, localePath, t } from "@/lib/locale";

const COPY = {
  heroTitleA: { bn: "রাজশাহীতে গাড়ি ভাড়া", en: "Car rental in Rajshahi" },
  heroTitleB: { bn: "ড্রাইভারসহ, ফিক্সড রেটে", en: "With a driver, at a fixed rate" },
  heroLead: {
    bn: "প্রাইভেট কার, মাইক্রোবাস ও অ্যাম্বুলেন্স। ভাড়া আগেই নির্দিষ্ট — কোনো লুকানো খরচ নেই।",
    en: "Sedans, microbuses and an ambulance. The rate is fixed up front — no hidden costs.",
  },
  priceFrom: { bn: "ভাড়া শুরু", en: "From" },
  perDay: { bn: "/দিন", en: "/day" },
  callNow: { bn: "এখনই কল করুন", en: "Call now" },
  whatsapp: { bn: "হোয়াটসঅ্যাপ", en: "WhatsApp" },
  heroAlt: {
    bn: "রাজশাহী রেন্ট এ কার-এর টয়োটা প্রিমিও",
    en: "A Toyota Premio from Rajshahi Rent A Car",
  },

  bookingTitle: { bn: "দ্রুত বুকিং", en: "Quick booking" },
  bookingLead: {
    bn: "নাম আর নম্বর দিন — আমরা ফোন করে বাকিটা ঠিক করে নেব।",
    en: "Leave a name and number — we call back and settle the rest.",
  },

  trust: [
    {
      label: { bn: "ফিক্সড রেট", en: "Fixed rates" },
      body: { bn: "ভাড়া আগেই নির্দিষ্ট, দরদামের ঝামেলা নেই।", en: "The price is agreed up front. No haggling." },
    },
    {
      label: { bn: "অভিজ্ঞ ড্রাইভার", en: "Experienced drivers" },
      body: { bn: "রাস্তা চেনা, ভদ্র ও সময়ানুবর্তী।", en: "Courteous, punctual, and they know the roads." },
    },
    {
      label: { bn: "২৪/৭ ফোন সাপোর্ট", en: "24/7 phone support" },
      body: { bn: "দিন হোক বা গভীর রাত — ফোন ধরা হয়।", en: "Day or the middle of the night, someone answers." },
    },
  ] as const,

  fleetTitle: { bn: "আমাদের গাড়িবহর", en: "Our fleet" },
  fleetLead: {
    bn: "সব গাড়ি এসি ও নিয়মিত সার্ভিসিং করা।",
    en: "Every vehicle is air-conditioned and regularly serviced.",
  },
  seeAll: { bn: "সব গাড়ি দেখুন", en: "See all vehicles" },
  seats: { bn: "আসন", en: "seats" },
  book: { bn: "বুক করুন", en: "Book" },

  routesTitle: { bn: "শহরের বাইরের রুট", en: "Outstation routes" },
  routesLead: {
    bn: "কাস্টম রুটের ভাড়া রুট ও সময় অনুযায়ী নির্ধারিত হয় — কল করে জেনে নিন।",
    en: "Custom-route fares depend on the route and timing — call to get yours.",
  },
  routesAsk: { bn: "ভাড়া জানতে কল করুন", en: "Call for the fare" },
  routesAnywhere: { bn: "আরও যেকোনো গন্তব্য", en: "Anywhere else" },

  whyTitle: { bn: "কেন আমাদের বেছে নেবেন", en: "Why ride with us" },
  bentoAlt: {
    bn: "রাজশাহী রেন্ট এ কার-এর টয়োটা এক্সিও",
    en: "A Toyota Axio from Rajshahi Rent A Car",
  },
  stat247: "২৪/৭",
  statBody: { bn: "যেকোনো সময় বুকিং ও সাপোর্ট", en: "Bookings and support at any hour" },
  fleetCare: {
    bn: "সব গাড়ি এসি · নিয়মিত সার্ভিসিং · ইনস্যুরেন্স করা",
    en: "All AC · regularly serviced · insured",
  },

  servicesTitle: { bn: "আমাদের সার্ভিস", en: "Our services" },
  services: [
    {
      key: "tours" as const,
      label: { bn: "ট্যুর প্যাকেজ", en: "Tour packages" },
      body: {
        bn: "পুঠিয়া, বাঘা, নাটোর — দিনভিত্তিক ট্যুর প্যাকেজ, ভাড়াসহ পরিষ্কার।",
        en: "Puthia, Bagha, Natore — day tours priced clearly, car included.",
      },
    },
    {
      key: "wedding" as const,
      label: { bn: "বিয়ের গাড়ি", en: "Wedding cars" },
      body: {
        bn: "সাজানো গাড়ি ও নির্দিষ্ট সময়ে উপস্থিতির নিশ্চয়তা।",
        en: "Decorated cars, guaranteed to arrive on the hour.",
      },
    },
    {
      key: "pickup" as const,
      label: { bn: "পিকআপ-ড্রপ", en: "Pickup & drop" },
      body: {
        bn: "শাহ মখদুম বিমানবন্দর ও রেলওয়ে স্টেশন — সময় মতো ড্রাইভার হাজির।",
        en: "Shah Makhdum Airport and the railway station — a driver on time, every time.",
      },
    },
    {
      key: "ambulance" as const,
      label: { bn: "অ্যাম্বুলেন্স সার্ভিস", en: "Ambulance service" },
      body: {
        bn: "জরুরি প্রয়োজনে ২৪ ঘণ্টা অ্যাম্বুলেন্স, রাজশাহী ও সারা দেশে।",
        en: "A 24-hour ambulance for emergencies, Rajshahi and nationwide.",
      },
    },
  ] as const,

  blogTitle: { bn: "ভ্রমণ গাইড ও টিপস", en: "Travel guides & tips" },
  readMore: { bn: "সব লেখা", en: "All articles" },
  read: { bn: "পড়ুন", en: "Read" },

  ctaTitle: { bn: "যাত্রার প্ল্যান ঠিক হয়ে গেছে?", en: "Trip planned?" },
  ctaLead: {
    bn: "এক ফোনে গাড়ি ও ড্রাইভার নিশ্চিত করুন — ঢাকা–রাজশাহীসহ যেকোনো রুট।",
    en: "One call confirms the car and the driver — Dhaka–Rajshahi and beyond.",
  },
} as const;

export async function HomePage({ locale }: { locale: Locale }) {
  const cheapest = Math.min(...FLEET.map((v) => v.pricePerDay));
  const hero = FLEET[0];
  const bentoPhoto = FLEET[1];
  const articles = (await listArticles(locale)).slice(0, 3);
  const homePath = localePath(locale, "/");

  const waText = encodeURIComponent(
    t(locale, {
      bn: "আসসালামু আলাইকুম, আমি গাড়ি ভাড়া নিতে চাই।",
      en: "Hello, I would like to rent a car.",
    }),
  );

  return (
    <PageShell locale={locale}>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Photo
            name={hero.photo.name}
            width={hero.photo.width}
            height={hero.photo.height}
            alt={t(locale, COPY.heroAlt)}
            sizes="100vw"
            priority
            className="h-full w-full object-cover"
          />
          {/*
            Bottom-up on phones so the text sits over the darkest area; a
            left-to-right wash on wide screens keeps the car visible.
          */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/40 md:bg-gradient-to-r md:from-black/90 md:via-black/65 md:to-black/10" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 pt-16 pb-24 text-white md:px-6 md:pt-28 md:pb-32">
          <p className="bg-accent/95 mb-5 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold">
            {t(locale, COPY.priceFrom)} ৳{formatTaka(locale, cheapest)}
            {t(locale, COPY.perDay)}
          </p>

          {/* rise-move: translates without fading — the h1 is a likely LCP
              text node and an opacity animation could defer LCP attribution. */}
          <h1 className="max-w-2xl text-4xl leading-tight font-semibold drop-shadow-sm md:text-6xl">
            {t(locale, COPY.heroTitleA)}
            <span className="block text-white/85 md:text-5xl">
              {t(locale, COPY.heroTitleB)}
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base text-white/85 md:text-lg">
            {t(locale, COPY.heroLead)}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`tel:${SITE.phone}`}
              className="press bg-accent text-accent-fg inline-flex min-h-12 items-center gap-2 rounded-xl px-6 font-semibold shadow-lg transition hover:brightness-110"
            >
              <PhoneIcon className="size-5" />
              {t(locale, COPY.callNow)}
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=${waText}`}
              className="press inline-flex min-h-12 items-center gap-2 rounded-xl bg-white/10 px-6 font-semibold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20"
            >
              <WhatsAppIcon className="size-5" />
              {t(locale, COPY.whatsapp)}
            </a>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Quick booking card */}
      <section id="booking" className="relative z-10 -mt-14 scroll-mt-24">
        <div className="border-border bg-surface-raised shadow-card mx-auto w-full max-w-6xl rounded-2xl border p-5 md:-mt-16 md:p-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold">{t(locale, COPY.bookingTitle)}</h2>
            <p className="text-muted text-sm">{t(locale, COPY.bookingLead)}</p>
          </div>
          <BookingForm locale={locale} variant="quick" />
        </div>
      </section>

      {/* ---------------------------------------------------------- Trust strip */}
      <section className="border-border mt-14 border-y md:mt-20">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3 md:px-6">
          {COPY.trust.map((item) => (
            <div key={item.label.en} className="flex items-start gap-3">
              <span className="bg-brand-soft text-brand mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full">
                {item.label.en === "Fixed rates" ? (
                  <TagIcon className="size-5" />
                ) : item.label.en === "Experienced drivers" ? (
                  <SteeringIcon className="size-5" />
                ) : (
                  <ClockIcon className="size-5" />
                )}
              </span>
              <div>
                <h3 className="font-semibold">{t(locale, item.label)}</h3>
                <p className="text-muted mt-0.5 text-sm">{t(locale, item.body)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- Fleet */}
      <section className="content-auto mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">
              {t(locale, COPY.fleetTitle)}
            </h2>
            <p className="text-muted mt-2">{t(locale, COPY.fleetLead)}</p>
          </div>
          <Link
            href={route(locale, "fleet")}
            className="text-brand hover:text-brand-strong inline-flex items-center gap-1.5 font-semibold"
          >
            {t(locale, COPY.seeAll)}
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        {/*
          A scrollable region needs a keyboard route in; without tabIndex a
          keyboard user cannot reach the cards that are off screen.
        */}
        <ul
          tabIndex={0}
          aria-label={t(locale, COPY.fleetTitle)}
          className="no-scrollbar reveal-stagger -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3"
        >
          {FLEET.map((v) => (
            <li
              key={v.slug}
              className="border-border bg-surface-raised tilt group shadow-card w-[82%] shrink-0 snap-center overflow-hidden rounded-2xl border sm:w-auto sm:shrink"
            >
              <div className="bg-surface aspect-[16/10] overflow-hidden">
                <Photo
                  name={v.photo.name}
                  width={v.photo.width}
                  height={v.photo.height}
                  alt={v.name}
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 92vw"
                  className="parallax-img h-full w-full object-cover"
                />
              </div>

              <div className="p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-semibold">{v.name}</h3>
                  <p className="text-brand text-lg font-bold whitespace-nowrap">
                    ৳{formatTaka(locale, v.pricePerDay)}
                    <span className="text-muted text-sm font-normal">
                      {t(locale, COPY.perDay)}
                    </span>
                  </p>
                </div>
                <p className="text-muted mt-1.5 text-sm">
                  {t(locale, v.type)} · {formatTaka(locale, v.seats)}{" "}
                  {t(locale, COPY.seats)} · {t(locale, v.transmission)}
                </p>
                <a
                  href={`${homePath}#booking`}
                  className="press border-brand/40 text-brand hover:bg-brand-soft mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-xl border px-4 text-sm font-semibold transition"
                >
                  {t(locale, COPY.book)}
                  <ArrowRightIcon className="size-4" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* --------------------------------------------------- Outstation routes */}
      <section className="content-auto bg-surface border-border border-y">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold md:text-3xl">
                {t(locale, COPY.routesTitle)}
              </h2>
              <p className="text-muted mt-2 max-w-xl">{t(locale, COPY.routesLead)}</p>
            </div>
            <a
              href={`tel:${SITE.phone}`}
              className="press bg-accent text-accent-fg inline-flex min-h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold transition hover:brightness-110"
            >
              <PhoneIcon className="size-4" />
              {t(locale, COPY.routesAsk)}
            </a>
          </div>

          {/*
            Routes we are on record serving (the FAQ already publishes these);
            fares are deliberately absent — they are quoted per route and time.
          */}
          <ul className="reveal-stagger mt-8 flex flex-wrap gap-3">
            {[
              { bn: "রাজশাহী → ঢাকা", en: "Rajshahi → Dhaka" },
              { bn: "নাটোর", en: "Natore" },
              { bn: "চাঁপাইনবাবগঞ্জ", en: "Chapainawabganj" },
              { bn: "পুঠিয়া", en: "Puthia" },
              { bn: "বাঘা", en: "Bagha" },
            ].map((r) => (
              <li key={r.en}>
                <Link
                  href={`${route(locale, "contact")}?to=${encodeURIComponent(t(locale, r))}#booking`}
                  className="border-border bg-surface-raised lift shadow-card flex min-h-11 items-center gap-2.5 rounded-full border px-5 py-2.5 font-medium transition"
                >
                  <MapPinIcon className="text-brand-vivid size-4.5 shrink-0" />
                  {t(locale, r)}
                </Link>
              </li>
            ))}
            <li className="text-muted flex items-center gap-2.5 px-2 py-2.5 text-sm">
              {t(locale, COPY.routesAnywhere)} — {t(locale, COPY.routesAsk)}
            </li>
          </ul>
        </div>
      </section>

      {/* ----------------------------------------------------------- Bento grid */}
      <section className="content-auto bg-surface border-border border-y">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <h2 className="reveal text-2xl font-semibold md:text-3xl">
            {t(locale, COPY.whyTitle)}
          </h2>

          <div className="reveal-stagger mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Photo tile */}
            <div className="border-border bg-surface-raised shadow-card relative isolate col-span-2 row-span-2 min-h-64 overflow-hidden rounded-2xl border">
              <Photo
                name={bentoPhoto.photo.name}
                width={bentoPhoto.photo.width}
                height={bentoPhoto.photo.height}
                alt={t(locale, COPY.bentoAlt)}
                sizes="(min-width: 1024px) 640px, 92vw"
                className="parallax-img absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-5 text-sm font-medium text-white md:text-base">
                {t(locale, COPY.fleetCare)}
              </p>
            </div>

            {/* Stat tile */}
            <div className="bg-brand text-brand-fg shadow-card flex flex-col justify-center rounded-2xl p-6">
              <p className="text-4xl font-bold md:text-5xl">{COPY.stat247}</p>
              <p className="mt-2 text-sm opacity-85">{t(locale, COPY.statBody)}</p>
            </div>

            {/* Driver tile */}
            <div className="border-border bg-surface-raised shadow-card rounded-2xl border p-6">
              <SteeringIcon className="text-brand size-7" />
              <h3 className="mt-3 font-semibold">
                {t(locale, { bn: "ড্রাইভারসহ ভাড়া", en: "Driver included" })}
              </h3>
              <p className="text-muted mt-1 text-sm">
                {t(locale, {
                  bn: "প্রতিটি ভাড়ায় অভিজ্ঞ ড্রাইভার — আলাদা কোনো খরচ নেই।",
                  en: "An experienced driver comes with every booking, at no separate cost.",
                })}
              </p>
            </div>

            {/* Insurance tile */}
            <div className="border-border bg-surface-raised shadow-card rounded-2xl border p-6">
              <ShieldIcon className="text-brand size-7" />
              <h3 className="mt-3 font-semibold">
                {t(locale, { bn: "ইনস্যুরেন্স করা গাড়ি", en: "Insured vehicles" })}
              </h3>
              <p className="text-muted mt-1 text-sm">
                {t(locale, {
                  bn: "কাগজপত্র ঠিক, প্রতিটি যাত্রার আগে গাড়ি চেক করা হয়।",
                  en: "Papers in order; every vehicle is checked before a trip.",
                })}
              </p>
            </div>

            {/* Long trips / pickup tile — links to the airport & station page */}
            <Link
              href={route(locale, "pickup")}
              className="border-border bg-surface-raised lift shadow-card group rounded-2xl border p-6 transition"
            >
              <MapPinIcon className="text-brand size-7" />
              <h3 className="mt-3 font-semibold">
                {t(locale, { bn: "লং ট্রিপ ও পিকআপ", en: "Long trips & pickup" })}
              </h3>
              <p className="text-muted mt-1 text-sm">
                {t(locale, {
                  bn: "ঢাকা–রাজশাহী, বিমানবন্দর ও রেলস্টেশন পিকআপ-ড্রপ।",
                  en: "Dhaka–Rajshahi runs, airport and rail station pickup and drop.",
                })}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                {t(locale, { bn: "বিস্তারিত", en: "Learn more" })}
                <ArrowRightIcon className="size-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>

            {/* Ambulance tile: in an emergency the tile itself places the call. */}
            <a
              href={`tel:${SITE.phone}`}
              className="border-emergency/30 bg-emergency-soft text-emergency-ink lift shadow-card group rounded-2xl border p-6 transition"
            >
              <AmbulanceIcon className="size-7" />
              <h3 className="mt-3 font-semibold">
                {t(locale, { bn: "অ্যাম্বুলেন্স ২৪ ঘণ্টা", en: "24-hour ambulance" })}
              </h3>
              <p className="mt-1 text-sm">
                {t(locale, {
                  bn: "জরুরি প্রয়োজনে সরাসরি ফোন করুন — রোগী পরিবহন সারা দেশে।",
                  en: "In an emergency, call directly — patient transport nationwide.",
                })}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                {t(locale, { bn: "এখনই কল করুন", en: "Call now" })}
                <ArrowRightIcon className="size-4 transition group-hover:translate-x-0.5" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Services */}
      <section className="content-auto mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <h2 className="reveal text-2xl font-semibold md:text-3xl">
          {t(locale, COPY.servicesTitle)}
        </h2>

        <div className="reveal-stagger mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COPY.services.map((svc) => (
            <Link
              key={svc.key}
              href={route(locale, svc.key)}
              className="border-border bg-surface-raised lift shadow-card group flex flex-col rounded-2xl border p-6 transition"
            >
              <span className="bg-brand-soft text-brand flex size-11 items-center justify-center rounded-xl">
                {svc.key === "tours" ? (
                  <MapPinIcon className="size-6" />
                ) : svc.key === "wedding" ? (
                  <CalendarIcon className="size-6" />
                ) : svc.key === "pickup" ? (
                  <BoltIcon className="size-6" />
                ) : (
                  <AmbulanceIcon className="size-6" />
                )}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{t(locale, svc.label)}</h3>
              <p className="text-muted mt-1.5 flex-1 text-sm">{t(locale, svc.body)}</p>
              <span className="text-brand mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                {t(locale, { bn: "বিস্তারিত", en: "Learn more" })}
                <ArrowRightIcon className="size-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ Blog teaser */}
      {articles.length > 0 && (
        <section className="content-auto bg-surface border-border border-y">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-20">
            <div className="reveal flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold md:text-3xl">
                {t(locale, COPY.blogTitle)}
              </h2>
              <Link
                href={route(locale, "blog")}
                className="text-brand hover:text-brand-strong inline-flex items-center gap-1.5 font-semibold"
              >
                {t(locale, COPY.readMore)}
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>

            <div className="reveal-stagger mt-8 grid gap-4 md:grid-cols-3">
              {articles.map((a) => (
                <Link
                  key={a.slug}
                  href={localePath(locale, `/${a.slug}/`)}
                  className="border-border bg-surface-raised lift shadow-card group flex flex-col rounded-2xl border p-6 transition"
                >
                  <p className="text-muted text-sm">
                    <time dateTime={a.date}>{formatArticleDate(locale, a.date)}</time>
                  </p>
                  <h3 className="mt-2 flex-1 font-semibold group-hover:underline">
                    {a.title}
                  </h3>
                  <span className="text-brand mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                    {t(locale, COPY.read)}
                    <ArrowRightIcon className="size-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ Closing CTA */}
      <section className="bg-brand text-brand-fg">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-12 md:px-6 md:py-16">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">
              {t(locale, COPY.ctaTitle)}
            </h2>
            <p className="mt-2 max-w-xl opacity-85">{t(locale, COPY.ctaLead)}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${SITE.phone}`}
              className="press inline-flex min-h-12 items-center gap-2 rounded-xl bg-white/10 px-6 font-semibold ring-1 ring-white/40 backdrop-blur transition hover:bg-white/20"
            >
              <PhoneIcon className="size-5" />
              {t(locale, SITE.phoneDisplay)}
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=${waText}`}
              className="press inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-black transition hover:brightness-95"
            >
              <WhatsAppIcon className="size-5" />
              {t(locale, COPY.whatsapp)}
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
