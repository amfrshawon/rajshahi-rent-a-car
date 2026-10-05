import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Photo } from "@/components/photo";
import { route } from "@/config/routes";
import { FLEET } from "@/config/site";
import { bookingHref } from "@/config/trips";
import { type Locale, formatTaka, localeDigits, t } from "@/lib/locale";
import { fleetSchema } from "@/lib/schema";

const COPY = {
  title: { bn: "গাড়িবহর", en: "The fleet" },
  lead: {
    bn: "তিনটি গাড়ি, প্রতিটি অভিজ্ঞ ড্রাইভারসহ। সব গাড়ি এসি ও নিয়মিত সার্ভিসিং করা।",
    en: "Three cars, each with an experienced driver. Every one is air-conditioned and regularly serviced.",
  },
  seats: { bn: "আসন", en: "Seats" },
  fuel: { bn: "জ্বালানি", en: "Fuel" },
  transmission: { bn: "গিয়ার", en: "Gearbox" },
  type: { bn: "ধরন", en: "Type" },
  perDay: { bn: "দিনপ্রতি, শহরের ভেতরে", en: "a day, within the city" },
  book: { bn: "এই গাড়ি বুক করুন", en: "Book this car" },
  pricing: { bn: "শহরের বাইরের ভাড়া কীভাবে হয়", en: "How out-of-town fares work" },
} as const;

export function FleetPage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale}>
      <JsonLd data={fleetSchema(locale)} />
      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)} />

      <ul className="wrap grid gap-16 pb-20 md:gap-24 md:pb-28">
        {FLEET.map((v, i) => (
          <li key={v.slug} className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
            <Photo
              name={v.photo.name}
              width={v.photo.width}
              height={v.photo.height}
              alt={v.name}
              sizes="(min-width: 768px) 50vw, 100vw"
              priority={i === 0}
              className="aspect-[3/2] h-auto w-full rounded-lg object-cover"
            />
            <div>
              <h2 className="text-section">{v.name}</h2>
              <p className="mt-3">
                <span className="figures text-figure">৳{formatTaka(locale, v.pricePerDay)}</span>{" "}
                <span className="text-ink-soft">{t(locale, COPY.perDay)}</span>
              </p>
              <dl className="border-line mt-6 grid grid-cols-2 border-t">
                {[
                  [COPY.type, t(locale, v.type)],
                  [COPY.seats, localeDigits(locale, v.seats)],
                  [COPY.transmission, t(locale, v.transmission)],
                  [COPY.fuel, t(locale, v.fuel)],
                ].map(([label, value]) => (
                  <div key={(label as { en: string }).en} className="border-line border-b py-3">
                    <dt className="text-ink-soft text-sm">{t(locale, label as { bn: string; en: string })}</dt>
                    <dd className="type-display mt-0.5 text-lg">{value as string}</dd>
                  </div>
                ))}
              </dl>
              <Link href={bookingHref(locale, { vehicle: v.slug })} className="btn btn-primary mt-7">
                {t(locale, COPY.book)}
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <div className="wrap pb-20">
        <Link
          href={route(locale, "pricing")}
          className="text-leaf inline-flex min-h-11 items-center gap-2 underline-offset-4 hover:underline"
        >
          {t(locale, COPY.pricing)}
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </PageShell>
  );
}
