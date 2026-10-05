import { ArrowRightIcon, GearIcon, UsersIcon } from "@/components/icons";
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
  seats: { bn: "আসন", en: "Seats" },
  fuel: { bn: "জ্বালানি", en: "Fuel" },
  transmission: { bn: "গিয়ার", en: "Transmission" },
  type: { bn: "ধরন", en: "Type" },
  perDay: { bn: "/দিন", en: "/day" },
  book: { bn: "এই গাড়ি বুক করুন", en: "Book this car" },
} as const;

export function FleetPage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale}>
      <JsonLd data={fleetSchema(locale)} />
      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)} />

      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
        <ul className="reveal-stagger grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FLEET.map((v) => (
            <li
              key={v.slug}
              className="border-border bg-surface-raised tilt group shadow-card flex flex-col overflow-hidden rounded-2xl border"
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

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-xl font-semibold">{v.name}</h2>
                  <p className="text-brand text-lg font-bold whitespace-nowrap">
                    ৳{formatTaka(locale, v.pricePerDay)}
                    <span className="text-muted text-sm font-normal">
                      {t(locale, COPY.perDay)}
                    </span>
                  </p>
                </div>

                <ul className="mt-4 flex flex-wrap gap-2">
                  <Spec icon={<UsersIcon className="size-4" />}>
                    {formatTaka(locale, v.seats)} {t(locale, COPY.seats)}
                  </Spec>
                  <Spec icon={<GearIcon className="size-4" />}>
                    {t(locale, v.transmission)}
                  </Spec>
                  <Spec>{t(locale, v.type)}</Spec>
                  <Spec>{t(locale, v.fuel)}</Spec>
                </ul>

                <a
                  href={`${route(locale, "contact")}#booking`}
                  className="press border-brand/40 text-brand hover:bg-brand-soft mt-5 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border px-4 text-sm font-semibold transition"
                >
                  {t(locale, COPY.book)}
                  <ArrowRightIcon className="size-4" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

    </PageShell>
  );
}

function Spec({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="border-border bg-surface text-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm">
      {icon}
      {children}
    </li>
  );
}
