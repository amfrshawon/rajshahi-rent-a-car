import { PageShell } from "@/components/page-shell";
import { FLEET, SITE } from "@/config/site";
import { formatTaka, type Locale, t } from "@/lib/locale";

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
  fleetTitle: { bn: "আমাদের গাড়িবহর", en: "Our Fleet" },
  seats: { bn: "সিট", en: "seats" },
  trustTitle: { bn: "কেন আমাদের বেছে নেবেন", en: "Why choose us" },
} as const;

const TRUST = [
  { bn: "২৪/৭ সার্ভিস", en: "Available 24/7" },
  { bn: "অভিজ্ঞ ও ভদ্র ড্রাইভার", en: "Experienced, courteous drivers" },
  { bn: "ফিক্সড রেট, দরদাম নেই", en: "Fixed rates, no haggling" },
  { bn: "ইনস্যুরেন্স করা গাড়ি", en: "Fully insured vehicles" },
] as const;

export function HomePage({ locale }: { locale: Locale }) {
  const cheapest = Math.min(...FLEET.map((v) => v.pricePerDay));

  return (
    <PageShell locale={locale}>
      {/* Hero */}
      <section className="bg-brand-soft">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-20">
          <p className="text-brand mb-3 text-sm font-semibold">
            {t(locale, COPY.priceFrom)} ৳{formatTaka(locale, cheapest)}
            {t(locale, COPY.perDay)}
          </p>
          <h1 className="text-fg max-w-2xl text-3xl font-bold md:text-5xl">
            {t(locale, COPY.heroTitle)}
          </h1>
          <p className="text-muted mt-4 max-w-xl text-base md:text-lg">
            {t(locale, COPY.heroLead)}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#booking"
              className="bg-accent text-accent-fg inline-flex min-h-12 items-center rounded-lg px-6 font-semibold"
            >
              {t(locale, COPY.bookNow)}
            </a>
            <a
              href={`tel:${SITE.phone}`}
              className="border-border text-fg inline-flex min-h-12 items-center rounded-lg border px-6 font-semibold"
            >
              {t(locale, COPY.callNow)}
            </a>
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-2xl font-bold md:text-3xl">{t(locale, COPY.fleetTitle)}</h2>

        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FLEET.map((v) => (
            <li
              key={v.slug}
              className="border-border bg-surface-raised overflow-hidden rounded-xl border"
            >
              {/*
                Placeholder until real photography lands — only three car
                photos exist today (docs/PLAN.md §11).
              */}
              <div className="bg-surface text-muted flex aspect-[16/10] items-center justify-center text-sm">
                {v.name}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{v.name}</h3>
                <p className="text-muted mt-1 text-sm">
                  {t(locale, v.type)} · {formatTaka(locale, v.seats)}{" "}
                  {t(locale, COPY.seats)} · {t(locale, v.transmission)}
                </p>
                <p className="text-brand mt-3 font-bold">
                  ৳{formatTaka(locale, v.pricePerDay)}
                  <span className="text-muted font-normal">{t(locale, COPY.perDay)}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Trust */}
      <section className="bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
          <h2 className="text-2xl font-bold md:text-3xl">{t(locale, COPY.trustTitle)}</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map((item) => (
              <li
                key={item.en}
                className="border-border bg-surface-raised rounded-lg border p-4 font-medium"
              >
                {t(locale, item)}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
