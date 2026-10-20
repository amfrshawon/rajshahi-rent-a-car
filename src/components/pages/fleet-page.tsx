import { BookingCta } from "@/components/booking-cta";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Photo } from "@/components/photo";
import { route } from "@/config/routes";
import { FLEET } from "@/config/site";
import { formatTaka, type Locale, t } from "@/lib/locale";
import { fleetSchema } from "@/lib/schema";

const COPY = {
  title: { bn: "আমাদের গাড়িবহর", en: "Our Fleet" },
  lead: {
    bn: "সব গাড়ি এসি, নিয়মিত সার্ভিসিং করা এবং অভিজ্ঞ ড্রাইভারসহ ভাড়া দেওয়া হয়।",
    en: "Every vehicle is air-conditioned, regularly serviced and rented with an experienced driver.",
  },
  seats: { bn: "আসন", en: "seats" },
  perDay: { bn: "প্রতিদিন", en: "per day" },
  book: { bn: "এই গাড়ি বুক করুন", en: "Book this car" },
} as const;

export function FleetPage({ locale }: { locale: Locale }) {
  const contact = route(locale, "contact");

  return (
    <PageShell locale={locale}>
      <JsonLd data={fleetSchema(locale)} />
      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)} />

      <section className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
        {/* Same crop and ratio on every car; the price is the decoration. */}
        <div className="grid gap-8 md:grid-cols-3">
          {FLEET.map((v) => (
            <article key={v.slug}>
              <div className="tile overflow-hidden">
                <Photo
                  name={v.photo.name}
                  width={v.photo.width}
                  height={v.photo.height}
                  alt={v.name}
                  sizes="(min-width: 768px) 360px, 92vw"
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>

              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h2 className="text-xl font-bold">{v.name}</h2>
                <p className="text-leaf tnum text-xl font-bold whitespace-nowrap">
                  ৳{formatTaka(locale, v.pricePerDay)}
                  <span className="text-muted text-sm font-normal"> {t(locale, COPY.perDay)}</span>
                </p>
              </div>
              <p className="text-muted mt-1 text-sm">
                {formatTaka(locale, v.seats)} {t(locale, COPY.seats)} · {t(locale, v.transmission)} ·{" "}
                {t(locale, v.type)} · {t(locale, v.fuel)}
              </p>

              <a
                href={`${contact}?trip=city&destination=${encodeURIComponent(v.name)}#booking`}
                className="btn-primary mt-4 w-full"
              >
                {t(locale, COPY.book)}
              </a>
            </article>
          ))}
        </div>
      </section>

      <BookingCta locale={locale} />
    </PageShell>
  );
}
