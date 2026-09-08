import Link from "next/link";
import {
  ClockIcon,
  PhoneIcon,
  ShieldIcon,
  SteeringIcon,
  TagIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { PageShell } from "@/components/page-shell";
import { Photo } from "@/components/photo";
import { FLEET, SITE } from "@/config/site";
import { formatTaka, type Locale, localePath, t } from "@/lib/locale";

const COPY = {
  heroTitle: {
    bn: "রাজশাহীতে গাড়ি ভাড়া — ড্রাইভারসহ, ২৪ ঘণ্টা",
    en: "Car Rental in Rajshahi — With Driver, 24/7",
  },
  heroLead: {
    bn: "প্রাইভেট কার, মাইক্রোবাস ও অ্যাম্বুলেন্স সার্ভিস। ফিক্সড রেট, কোনো লুকানো খরচ নেই।",
    en: "Sedans, microbuses and ambulance service. Fixed rates, no hidden costs.",
  },
  priceFrom: { bn: "ভাড়া শুরু", en: "From" },
  perDay: { bn: " / দিন", en: " / day" },
  bookNow: { bn: "বুক করুন", en: "Book now" },
  callNow: { bn: "এখনই কল করুন", en: "Call now" },
  whatsapp: { bn: "হোয়াটসঅ্যাপ", en: "WhatsApp" },
  fleetTitle: { bn: "আমাদের গাড়িবহর", en: "Our Fleet" },
  fleetLead: {
    bn: "সব গাড়ি এসি ও নিয়মিত সার্ভিসিং করা।",
    en: "Every vehicle is air-conditioned and regularly serviced.",
  },
  seeAll: { bn: "সব গাড়ি দেখুন", en: "See all vehicles" },
  seats: { bn: "সিট", en: "seats" },
  trustTitle: { bn: "কেন আমাদের বেছে নেবেন", en: "Why choose us" },
  heroAlt: {
    bn: "রাজশাহী রেন্ট এ কার-এর টয়োটা প্রিমিও",
    en: "A Toyota Premio from Rajshahi Rent A Car",
  },
} as const;

const TRUST = [
  {
    Icon: ClockIcon,
    label: { bn: "২৪/৭ সার্ভিস", en: "Available 24/7" },
    body: {
      bn: "দিন হোক বা গভীর রাত — ফোন ধরা হয়।",
      en: "Day or the middle of the night, someone answers.",
    },
  },
  {
    Icon: SteeringIcon,
    label: { bn: "অভিজ্ঞ ড্রাইভার", en: "Experienced drivers" },
    body: {
      bn: "রাস্তা চেনা, ভদ্র ও সময়ানুবর্তী ড্রাইভার।",
      en: "Drivers who know the roads and turn up on time.",
    },
  },
  {
    Icon: TagIcon,
    label: { bn: "ফিক্সড রেট", en: "Fixed rates" },
    body: {
      bn: "আগেই ভাড়া বলা হয়, দরদামের ঝামেলা নেই।",
      en: "The price is agreed up front. No haggling.",
    },
  },
  {
    Icon: ShieldIcon,
    label: { bn: "ইনস্যুরেন্স করা গাড়ি", en: "Insured vehicles" },
    body: {
      bn: "কাগজপত্র ঠিক, গাড়ি নিয়মিত চেক করা।",
      en: "Papers in order and vehicles checked regularly.",
    },
  },
] as const;

export function HomePage({ locale }: { locale: Locale }) {
  const cheapest = Math.min(...FLEET.map((v) => v.pricePerDay));
  const hero = FLEET[0];

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

        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-white md:py-28">
          <p className="bg-accent/95 mb-5 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold">
            {t(locale, COPY.priceFrom)} ৳{formatTaka(locale, cheapest)}
            {t(locale, COPY.perDay)}
          </p>

          <h1 className="max-w-2xl text-3xl font-semibold drop-shadow-sm md:text-5xl">
            {t(locale, COPY.heroTitle)}
          </h1>

          <p className="mt-4 max-w-xl text-base text-white/85 md:text-lg">
            {t(locale, COPY.heroLead)}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`tel:${SITE.phone}`}
              className="bg-accent text-accent-fg inline-flex min-h-12 items-center gap-2 rounded-xl px-6 font-semibold shadow-lg transition hover:brightness-110 active:scale-[0.97]"
            >
              <PhoneIcon className="size-5" />
              {t(locale, COPY.callNow)}
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=${waText}`}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white/10 px-6 font-semibold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20 active:scale-[0.97]"
            >
              <WhatsAppIcon className="size-5" />
              {t(locale, COPY.whatsapp)}
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            {TRUST.map(({ label }) => (
              <li key={label.en} className="flex items-center gap-2">
                <span aria-hidden="true" className="bg-accent size-1.5 rounded-full" />
                {t(locale, label)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------------------- Fleet */}
      <section className="content-auto mx-auto w-full max-w-6xl px-4 py-14 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">
              {t(locale, COPY.fleetTitle)}
            </h2>
            <p className="text-muted mt-2">{t(locale, COPY.fleetLead)}</p>
          </div>
          <Link
            href={localePath(locale, "/fleet/")}
            className="text-brand font-semibold hover:underline"
          >
            {t(locale, COPY.seeAll)} →
          </Link>
        </div>

        <ul className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {FLEET.map((v) => (
            <li
              key={v.slug}
              className="border-border bg-surface-raised group shadow-card w-[82%] shrink-0 snap-center overflow-hidden rounded-2xl border transition hover:-translate-y-0.5 hover:shadow-lg sm:w-auto sm:shrink"
            >
              <div className="bg-surface aspect-[16/10] overflow-hidden">
                <Photo
                  name={v.photo.name}
                  width={v.photo.width}
                  height={v.photo.height}
                  alt={v.name}
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 92vw"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-semibold">{v.name}</h3>
                  <p className="text-brand font-semibold whitespace-nowrap">
                    ৳{formatTaka(locale, v.pricePerDay)}
                  </p>
                </div>
                <p className="text-muted mt-1 text-sm">
                  {t(locale, v.type)} · {formatTaka(locale, v.seats)}{" "}
                  {t(locale, COPY.seats)} · {t(locale, v.transmission)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* --------------------------------------------------------------- Trust */}
      <section className="content-auto bg-surface border-border border-y">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 md:py-20">
          <h2 className="text-2xl font-semibold md:text-3xl">
            {t(locale, COPY.trustTitle)}
          </h2>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map(({ Icon, label, body }) => (
              <li key={label.en}>
                <span className="bg-brand-soft text-brand flex size-11 items-center justify-center rounded-xl">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-4 font-semibold">{t(locale, label)}</h3>
                <p className="text-muted mt-1 text-sm">{t(locale, body)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
