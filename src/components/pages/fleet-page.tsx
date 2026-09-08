import { BookingCta } from "@/components/booking-cta";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { FLEET } from "@/config/site";
import { formatTaka, type Locale, t } from "@/lib/locale";

const COPY = {
  title: { bn: "আমাদের গাড়িবহর", en: "Our Fleet" },
  lead: {
    bn: "সব গাড়ি এসি, নিয়মিত সার্ভিসিং করা এবং অভিজ্ঞ ড্রাইভারসহ ভাড়া দেওয়া হয়।",
    en: "Every vehicle is air-conditioned, regularly serviced and rented with an experienced driver.",
  },
  seats: { bn: "আসন", en: "Seats" },
  fuel: { bn: "জ্বালানি", en: "Fuel" },
  transmission: { bn: "গিয়ার", en: "Transmission" },
  type: { bn: "ধরন", en: "Type" },
  perDay: { bn: "প্রতিদিন", en: "per day" },
} as const;

export function FleetPage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale}>
      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)} />

      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FLEET.map((v) => (
            <li
              key={v.slug}
              className="border-border bg-surface-raised overflow-hidden rounded-xl border"
            >
              {/* Placeholder until real photography lands — docs/PLAN.md §11. */}
              <div className="bg-surface text-muted flex aspect-[16/10] items-center justify-center text-sm">
                {v.name}
              </div>

              <div className="p-5">
                <h2 className="text-xl font-semibold">{v.name}</h2>
                <p className="text-brand mt-1 font-semibold">
                  ৳{formatTaka(locale, v.pricePerDay)}{" "}
                  <span className="text-muted text-sm font-normal">
                    {t(locale, COPY.perDay)}
                  </span>
                </p>

                <dl className="text-muted mt-4 grid grid-cols-2 gap-y-2 text-sm">
                  <dt>{t(locale, COPY.type)}</dt>
                  <dd className="text-fg">{t(locale, v.type)}</dd>
                  <dt>{t(locale, COPY.seats)}</dt>
                  <dd className="text-fg">{formatTaka(locale, v.seats)}</dd>
                  <dt>{t(locale, COPY.fuel)}</dt>
                  <dd className="text-fg">{t(locale, v.fuel)}</dd>
                  <dt>{t(locale, COPY.transmission)}</dt>
                  <dd className="text-fg">{t(locale, v.transmission)}</dd>
                </dl>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <BookingCta locale={locale} />
    </PageShell>
  );
}
