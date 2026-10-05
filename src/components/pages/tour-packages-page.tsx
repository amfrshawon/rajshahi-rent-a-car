import { BookingCta } from "@/components/booking-cta";
import { ArrowRightIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { route } from "@/config/routes";
import { DESTINATIONS } from "@/config/services";
import { formatTaka, type Locale, t } from "@/lib/locale";

/*
 * No package prices are published anywhere on the existing site, so each
 * destination shows "call for a quote" instead of an invented figure.
 * Replace with a real rate card once the owner confirms one.
 */

const COPY = {
  title: { bn: "ট্যুর প্যাকেজ", en: "Tour Packages" },
  lead: {
    bn: "রাজশাহী ও আশেপাশের জেলায় একদিন বা আধাবেলার ভ্রমণ — আমাদের গাড়ি ও ড্রাইভারসহ।",
    en: "Full-day and half-day trips around Rajshahi and the neighbouring districts, with our vehicle and driver.",
  },
  distance: { bn: "শহর থেকে", en: "From the city" },
  km: { bn: "কিমি", en: "km" },
  quote: { bn: "ভাড়া কলে জানুন", en: "Quoted by phone" },
  book: { bn: "এই ট্রিপ বুক করুন", en: "Book this trip" },
} as const;

export function TourPackagesPage({ locale }: { locale: Locale }) {
  const contact = route(locale, "contact");

  return (
    <PageShell locale={locale}>
      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)} />

      <section className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
        {/* Flat entries with hairlines — the distance is the decoration. */}
        <ul className="grid gap-x-10 md:grid-cols-2">
          {DESTINATIONS.map((d) => (
            <li key={d.slug} className="border-border border-t py-5">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-xl font-bold">{t(locale, d.name)}</h2>
                {d.distanceKm ? (
                  <span className="tnum text-leaf shrink-0 font-semibold whitespace-nowrap">
                    {formatTaka(locale, d.distanceKm)} {t(locale, COPY.km)}
                  </span>
                ) : (
                  <span className="text-muted shrink-0 text-sm">{t(locale, COPY.quote)}</span>
                )}
              </div>
              <p className="text-muted mt-2">{t(locale, d.blurb)}</p>
              <a
                href={`${contact}?destination=${encodeURIComponent(t(locale, d.name))}#booking`}
                className="text-leaf mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"
              >
                {t(locale, COPY.book)}
                <ArrowRightIcon className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <BookingCta locale={locale} />
    </PageShell>
  );
}
