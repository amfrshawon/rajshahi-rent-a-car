import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { PhotoSlot } from "@/components/placeholder";
import { DESTINATIONS } from "@/config/services";
import { bookingHref } from "@/config/trips";
import { type Locale, localeDigits, t } from "@/lib/locale";

/*
 * No package prices are published anywhere on the existing site, so fares
 * are quoted by phone instead of invented. Only Puthia's distance is on
 * record. Replace with a real rate card once the owner confirms one.
 */

const COPY = {
  title: { bn: "ট্যুর প্যাকেজ", en: "Day trips" },
  lead: {
    bn: "রাজশাহী ও আশেপাশের জেলায় একদিন বা আধাবেলার ভ্রমণ, আমাদের গাড়ি ও ড্রাইভারসহ। ভাড়া রুট ও সময় দেখে ফোনে জানানো হয়।",
    en: "Full-day and half-day trips around Rajshahi and the neighbouring districts, with our car and driver. Fares depend on route and time and are quoted by phone.",
  },
  km: { bn: "কিমি", en: "km" },
  fromCity: { bn: "শহর থেকে", en: "from the city" },
  book: { bn: "এই ভ্রমণ বুক করুন", en: "Book this trip" },
  shot: {
    bn: "পুঠিয়ায় হায়েস, সাথে একদল যাত্রী",
    en: "The Hiace with a group at Puthia",
  },
} as const;

export function TourPackagesPage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale}>
      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)} />

      <div className="wrap grid gap-12 pb-20 md:pb-28 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <ol className="border-line border-t">
          {DESTINATIONS.map((d) => (
            <li key={d.slug} className="border-line border-b py-6 md:py-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h2 className="text-2xl md:text-3xl">{t(locale, d.name)}</h2>
                {d.distanceKm ? (
                  <p className="whitespace-nowrap">
                    <span className="figures text-figure">{localeDigits(locale, d.distanceKm)}</span>{" "}
                    <span className="text-ink-soft text-sm">
                      {t(locale, COPY.km)} {t(locale, COPY.fromCity)}
                    </span>
                  </p>
                ) : null}
              </div>
              <p className="text-ink-soft mt-3 max-w-2xl">{t(locale, d.blurb)}</p>
              <Link
                href={bookingHref(locale, { trip: "outstation", to: t(locale, d.name) })}
                className="text-leaf mt-2 inline-flex min-h-11 items-center gap-2 underline-offset-4 hover:underline"
              >
                {t(locale, COPY.book)}
                <ArrowRightIcon className="size-4" />
              </Link>
            </li>
          ))}
        </ol>
        <PhotoSlot shot={t(locale, COPY.shot)} className="lg:sticky lg:top-28 lg:self-start" />
      </div>
    </PageShell>
  );
}
