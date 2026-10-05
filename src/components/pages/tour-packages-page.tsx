import { MapPinIcon } from "@/components/icons";
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

      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
        <ul className="reveal-stagger grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((d) => (
            <li
              key={d.slug}
              className="border-border bg-surface-raised lift shadow-card flex flex-col rounded-2xl border p-6 transition"
            >
              <span className="bg-brand-soft text-brand flex size-10 items-center justify-center rounded-xl">
                <MapPinIcon className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{t(locale, d.name)}</h2>
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

    </PageShell>
  );
}
