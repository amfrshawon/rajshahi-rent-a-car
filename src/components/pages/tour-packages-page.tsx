import { BookingCta } from "@/components/booking-cta";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
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
  quote: { bn: "ভাড়া জানতে কল করুন", en: "Call for a quote" },
} as const;

export function TourPackagesPage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale}>
      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)} />

      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((d) => (
            <li
              key={d.slug}
              className="border-border bg-surface-raised flex flex-col rounded-xl border p-5"
            >
              <h2 className="text-lg font-semibold">{t(locale, d.name)}</h2>
              {d.distanceKm ? (
                <p className="text-muted mt-1 text-sm">
                  {t(locale, COPY.distance)} {formatTaka(locale, d.distanceKm)}{" "}
                  {t(locale, COPY.km)}
                </p>
              ) : null}
              <p className="text-muted mt-3 flex-1">{t(locale, d.blurb)}</p>
              <p className="text-brand mt-4 text-sm font-semibold">
                {t(locale, COPY.quote)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <BookingCta locale={locale} />
    </PageShell>
  );
}
