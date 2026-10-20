import Link from "next/link";
import { ArrowRightIcon, PhoneIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { Photo } from "@/components/photo";
import { route, vehicleRoute } from "@/config/routes";
import { FLEET, SITE, type Vehicle } from "@/config/site";
import { formatTaka, type Locale, t } from "@/lib/locale";
import { breadcrumbSchema, businessSchema } from "@/lib/schema";

const COPY = {
  home: { bn: "হোম", en: "Home" },
  fleet: { bn: "গাড়িবহর", en: "Fleet" },
  perDay: { bn: "প্রতিদিন, শহরের ভেতরে", en: "per day, within the city" },
  specsTitle: { bn: "গাড়ির তথ্য", en: "Vehicle details" },
  seats: { bn: "আসন", en: "Seats" },
  transmission: { bn: "গিয়ার", en: "Transmission" },
  fuel: { bn: "জ্বালানি", en: "Fuel" },
  ac: { bn: "এয়ার কন্ডিশন", en: "Air conditioning" },
  acValue: { bn: "আছে", en: "Yes" },
  driver: { bn: "ড্রাইভার", en: "Driver" },
  driverValue: { bn: "সাথে থাকেন", en: "Included" },
  includedTitle: { bn: "ভাড়ার সাথে যা থাকে", en: "What the fare includes" },
  included: [
    { bn: "অভিজ্ঞ ড্রাইভার", en: "An experienced driver" },
    { bn: "এসি চালু গাড়ি", en: "Air-conditioned car" },
    { bn: "ভাড়া আগেই ঠিক করা", en: "The fare agreed before you travel" },
    { bn: "কোনো লুকানো চার্জ নেই", en: "No hidden charges" },
  ] as const,
  usesTitle: { bn: "কোথায় ব্যবহার করবেন", en: "Where people use it" },
  uses: [
    { key: "pricing" as const, label: { bn: "শহরে একদিন", en: "A day in the city" } },
    { key: "pickup" as const, label: { bn: "বিমানবন্দর ও স্টেশন", en: "Airport and station" } },
    { key: "tours" as const, label: { bn: "পুঠিয়া একদিনের ট্রিপ", en: "Puthia day trip" } },
    { key: "wedding" as const, label: { bn: "বিয়ের গাড়ি", en: "Wedding car" } },
  ] as const,
  otherTitle: { bn: "অন্য গাড়িগুলো", en: "Other cars" },
  book: { bn: "এই গাড়ি বুক করুন", en: "Book this car" },
  call: { bn: "কল করুন", en: "Call" },
  outstation: {
    bn: "শহরের বাইরের ভাড়া দূরত্ব অনুযায়ী ফোনে নিশ্চিত করা হয়।",
    en: "Outstation fares are quoted by distance over the phone.",
  },
} as const;

/**
 * One car, one page. Everything on it comes from FLEET, so the page cannot
 * drift from the fleet listing or the price shown at booking.
 */
export function VehiclePage({ locale, vehicle }: { locale: Locale; vehicle: Vehicle }) {
  const contact = route(locale, "contact");
  const bookingHref = `${contact}?trip=city&vehicle=${encodeURIComponent(vehicle.name)}#booking`;
  const others = FLEET.filter((v) => v.slug !== vehicle.slug);
  const path = vehicleRoute(locale, vehicle.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: vehicle.name,
    url: new URL(path, SITE.url).toString(),
    vehicleSeatingCapacity: vehicle.seats,
    vehicleTransmission: t(locale, vehicle.transmission),
    fuelType: t(locale, vehicle.fuel),
    bodyType: t(locale, vehicle.type),
    image: `${SITE.url}/media/generated/${vehicle.photo.name}-1200.jpg`,
    offers: {
      "@type": "Offer",
      price: vehicle.pricePerDay,
      priceCurrency: "BDT",
      availability: "https://schema.org/InStock",
      url: new URL(path, SITE.url).toString(),
    },
  };

  const crumbs = [
    { name: t(locale, COPY.home), path: route(locale, "home") },
    { name: t(locale, COPY.fleet), path: route(locale, "fleet") },
    { name: vehicle.name, path },
  ];

  return (
    <PageShell locale={locale}>
      <JsonLd data={businessSchema(locale)} />
      <JsonLd data={schema} />
      <JsonLd data={breadcrumbSchema(locale, crumbs)} />

      <div className="mx-auto w-full max-w-6xl px-4 pt-5 md:px-6">
        <nav aria-label="Breadcrumb">
          <ol className="text-muted flex flex-wrap items-center gap-1.5 text-sm">
            {crumbs.map((crumb, i) => (
              <li key={crumb.path} className="flex items-center gap-1.5">
                {i > 0 ? <span aria-hidden="true">/</span> : null}
                {i === crumbs.length - 1 ? (
                  <span aria-current="page">{crumb.name}</span>
                ) : (
                  <Link href={crumb.path} className="hover:text-fg inline-flex min-h-11 items-center">
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 md:grid-cols-2 md:gap-10 md:px-6 md:py-10">
        <div className="tile overflow-hidden">
          <Photo
            name={vehicle.photo.name}
            width={vehicle.photo.width}
            height={vehicle.photo.height}
            alt={vehicle.name}
            sizes="(min-width: 768px) 560px, 92vw"
            priority
            className="aspect-[16/10] w-full object-cover"
          />
        </div>

        <div className="md:self-center">
          <p className="eyebrow">{t(locale, vehicle.type)}</p>
          <h1 className="mt-1 text-3xl font-bold md:text-4xl">{vehicle.name}</h1>
          <p className="text-leaf tnum mt-2 text-2xl font-bold">
            ৳{formatTaka(locale, vehicle.pricePerDay)}
            <span className="text-muted text-sm font-normal"> {t(locale, COPY.perDay)}</span>
          </p>
          <p className="text-muted mt-1 text-sm">{t(locale, COPY.outstation)}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a href={bookingHref} className="btn-primary flex-1 sm:flex-none">
              {t(locale, COPY.book)}
            </a>
            <a
              href={`tel:${SITE.phone}`}
              className="border-border inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-5 font-semibold sm:flex-none"
            >
              <PhoneIcon className="size-5" />
              {t(locale, COPY.call)}
            </a>
          </div>

          <dl className="border-border mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-4 text-sm">
            {[
              { k: t(locale, COPY.seats), v: formatTaka(locale, vehicle.seats) },
              { k: t(locale, COPY.transmission), v: t(locale, vehicle.transmission) },
              { k: t(locale, COPY.fuel), v: t(locale, vehicle.fuel) },
              { k: t(locale, COPY.ac), v: t(locale, COPY.acValue) },
            ].map((row) => (
              <div key={row.k}>
                <dt className="text-muted">{row.k}</dt>
                <dd className="font-semibold">{row.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-surface border-border border-y">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 md:grid-cols-2 md:px-6 md:py-12">
          <div>
            <h2 className="text-2xl font-bold">{t(locale, COPY.includedTitle)}</h2>
            <ul className="mt-3 space-y-2">
              {COPY.included.map((item) => (
                <li key={item.en} className="flex items-start gap-2">
                  <span aria-hidden="true" className="bg-leaf mt-2 size-1.5 shrink-0 rounded-full" />
                  <span>{t(locale, item)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t(locale, COPY.usesTitle)}</h2>
            <ul className="mt-3 divide-y divide-border border-border border-y">
              {COPY.uses.map((use) => (
                <li key={use.key}>
                  <Link
                    href={route(locale, use.key)}
                    className="flex min-h-12 items-center justify-between gap-3 py-1.5 font-medium"
                  >
                    {t(locale, use.label)}
                    <ArrowRightIcon className="text-leaf size-4 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <h2 className="text-2xl font-bold">{t(locale, COPY.otherTitle)}</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {others.map((v) => (
            <li key={v.slug}>
              <Link href={vehicleRoute(locale, v.slug)} className="tile flex items-center gap-4 p-3">
                <Photo
                  name={v.photo.name}
                  width={v.photo.width}
                  height={v.photo.height}
                  alt={v.name}
                  sizes="120px"
                  className="aspect-[16/10] w-28 shrink-0 rounded object-cover"
                />
                <span>
                  <span className="block font-bold">{v.name}</span>
                  <span className="text-muted block text-sm">
                    {formatTaka(locale, v.seats)} {t(locale, COPY.seats)} ·{" "}
                    {t(locale, v.transmission)}
                  </span>
                  <span className="text-leaf tnum mt-1 block font-semibold">
                    ৳{formatTaka(locale, v.pricePerDay)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-muted mt-6 text-sm">
          {t(locale, {
            bn: "প্রতিটি গাড়ি নিয়মিত সার্ভিসিং করা হয়।",
            en: "Every vehicle is regularly serviced.",
          })}
        </p>
      </section>
    </PageShell>
  );
}
