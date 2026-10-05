import Link from "next/link";
import { ArrowRightIcon, PhoneIcon } from "@/components/icons";
import { SectionHead } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Photo } from "@/components/photo";
import { Placeholder } from "@/components/placeholder";
import { route } from "@/config/routes";
import { FLEET, SITE } from "@/config/site";
import { ROUTE_BOARD, TRIPS, type TripKey, bookingHref } from "@/config/trips";
import { type Locale, formatTaka, localeDigits, t } from "@/lib/locale";

const COPY = {
  kicker: { bn: "রাজশাহী · ২৪ ঘণ্টা · ড্রাইভারসহ", en: "Rajshahi · 24 hours · with a driver" },
  title: { bn: "এক কলে গাড়ি দরজায়।", en: "One call, and the car is at your door." },
  lead: {
    bn: "প্রাইভেট কার আর মাইক্রোবাস, অভিজ্ঞ ড্রাইভারসহ। ভাড়া আগেই ঠিক হয়, পরে কোনো লুকানো খরচ নেই।",
    en: "Sedans and a microbus, with experienced drivers. The fare is agreed first, with no hidden costs.",
  },
  callNow: { bn: "এখনই কল করুন", en: "Call now" },
  heroAlt: {
    bn: "টয়োটা প্রিমিও, রাজশাহী রেন্ট এ কার-এর গাড়ি",
    en: "A Toyota Premio from the Rajshahi Rent A Car fleet",
  },

  where: { bn: "কোথায় যাবেন?", en: "Where to?" },
  tripDetail: {
    outstation: { bn: "পুঠিয়া, নাটোর, ঢাকা", en: "Puthia, Natore, Dhaka" },
    pickup: { bn: "পিকআপ ও ড্রপ, সময়মতো", en: "Pickup and drop-off, on time" },
    wedding: { bn: "বিয়ের দিনের গাড়ি ও ড্রাইভার", en: "A car and driver for the day" },
  },
  dayFrom: { bn: ["দিনে", "থেকে"], en: ["From", "a day"] },
  perDay: { bn: "/ দিন", en: "a day" },
  ambulance: { bn: "অ্যাম্বুলেন্স? এখনই কল করুন", en: "Ambulance? Call now" },
  hours24: { bn: "২৪ ঘণ্টা", en: "24 hours" },

  routesTitle: { bn: "রাজশাহী থেকে", en: "From Rajshahi" },
  routesLead: {
    bn: "সারিতে চাপ দিলে গন্তব্যসহ বুকিং ফর্ম খুলবে। ভাড়া রুট ও সময় দেখে ফোনে জানানো হয়।",
    en: "Tap a row to book with the destination filled in. Fares depend on route and time, and are quoted by phone.",
  },
  origin: { bn: "রাজশাহী শহর", en: "Rajshahi city" },
  km: { bn: "কিমি", en: "km" },
  inCity: { bn: "শহরেই", en: "In town" },
  unknownKm: { bn: "? কিমি", en: "? km" },
  unknownKmNote: {
    bn: "দূরত্ব নিশ্চিত নয়, মালিক যাচাই করবেন",
    en: "Distance not confirmed; the owner to check",
  },
  unknownTime: { bn: "? ঘণ্টা", en: "? hrs" },
  unknownTimeNote: {
    bn: "যাত্রার সময় নিশ্চিত নয়, মালিক যাচাই করবেন",
    en: "Travel time not confirmed; the owner to check",
  },

  fleetTitle: { bn: "চালকসহ তিনটি গাড়ি", en: "Three cars, with drivers" },
  fleetLead: {
    bn: "সব গাড়ি এসি ও নিয়মিত সার্ভিসিং করা। ভাড়া শহরের ভেতরে, দিনপ্রতি।",
    en: "Every car is air-conditioned and regularly serviced. Day rates within the city.",
  },
  fleetMore: { bn: "আসন, জ্বালানি ও গিয়ার দেখুন", en: "Seats, fuel and gearbox" },
  seats: { bn: "আসন", en: "seats" },
  bookThis: { bn: "এই গাড়ি বুক করুন", en: "Book this car" },

  stepsTitle: { bn: "বুকিং হয় তিন ধাপে", en: "Booking takes three steps" },
  steps: [
    {
      title: { bn: "কল বা মেসেজ করুন", en: "Call or message" },
      body: {
        bn: "ফোন, হোয়াটসঅ্যাপ বা বুকিং ফর্ম, যেটা সুবিধা।",
        en: "Phone, WhatsApp or the booking form, whichever suits you.",
      },
    },
    {
      title: { bn: "ভাড়া নিশ্চিত করি", en: "We confirm the fare" },
      body: {
        bn: "রুট আর সময় শুনে ভাড়া বলি। রাজি হলে বুকিং পাকা।",
        en: "Tell us the route and time; we quote. Agree, and it is booked.",
      },
    },
    {
      title: { bn: "ড্রাইভার পৌঁছে যান", en: "The driver arrives" },
      body: {
        bn: "ঠিক করা সময়ে, আপনার দেওয়া ঠিকানায়।",
        en: "At the time you set, at the address you gave.",
      },
    },
  ],
} as const;

export function HomePage({ locale }: { locale: Locale }) {
  const cheapest = Math.min(...FLEET.map((v) => v.pricePerDay));
  const hero = FLEET[0];

  // "দিনে ৳৪,০০০ থেকে" / "From ৳4,000 a day": the price sits mid-phrase.
  const [before, after] = COPY.dayFrom[locale];
  const tripDetail = (key: TripKey) =>
    key === "city" ? (
      <span>
        {before} <span className="figures text-ink text-base md:text-lg">৳{formatTaka(locale, cheapest)}</span> {after}
      </span>
    ) : (
      t(locale, COPY.tripDetail[key])
    );

  return (
    <PageShell locale={locale}>
      {/* ------------------------------------------------------------ Opening
          One green panel holds the promise, the first question and the
          photo. On a phone the four trip tiles sit inside the first screen;
          the photo follows them. Nothing here animates. */}
      <section className="surface-padma">
        <div className="wrap grid gap-y-8 pt-7 pb-8 md:pt-12 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-14 lg:pt-16 lg:pb-16">
          <div className="lg:col-span-7 lg:self-center">
            <p className="text-ink-soft flex items-center gap-2 text-sm md:text-base">
              <span aria-hidden="true" className="bg-pin size-2 shrink-0 rounded-full" />
              {t(locale, COPY.kicker)}
            </p>
            <h1 className="text-hero mt-3 md:mt-5">{t(locale, COPY.title)}</h1>
            <p className="text-ink-soft text-lead mt-4 max-w-xl md:mt-6">{t(locale, COPY.lead)}</p>
            <a
              href={`tel:${SITE.phone}`}
              aria-label={`${t(locale, COPY.callNow)} ${t(locale, SITE.phoneDisplay)}`}
              className="mt-8 hidden items-center gap-4 sm:inline-flex"
            >
              <span className="btn-primary grid size-12 place-items-center rounded-full">
                <PhoneIcon className="size-5" />
              </span>
              <span>
                <span className="text-ink-soft block text-sm">{t(locale, COPY.callNow)}</span>
                <span className="figures block text-2xl md:text-3xl">{t(locale, SITE.phoneDisplay)}</span>
              </span>
            </a>
          </div>

          {/* Wide screens only. On a phone the first screen is the question
              and the tiles, and the same car leads the fleet a scroll later,
              so the photo is not downloaded there at all. */}
          <div className="hidden lg:col-span-5 lg:block lg:self-center">
            <Photo
              name={hero.photo.name}
              width={hero.photo.width}
              height={hero.photo.height}
              alt={t(locale, COPY.heroAlt)}
              sizes="42vw"
              media="(min-width: 1024px)"
              priority
              className="aspect-[8/5] h-auto w-full rounded-lg object-cover"
            />
          </div>

          <div className="lg:col-span-12">
            <h2 className="text-2xl md:text-4xl">{t(locale, COPY.where)}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-2 md:mt-6 md:gap-3 lg:grid-cols-4">
              {TRIPS.map((trip) => (
                <li key={trip.key}>
                  <Link
                    href={bookingHref(locale, { trip: trip.key })}
                    className="group bg-tile hover:bg-tile-hover border-line flex h-full min-h-24 flex-col justify-between gap-2 rounded-lg border p-3.5 transition-colors md:min-h-36 md:gap-4 md:p-5"
                  >
                    <span className="type-display text-[1.0625rem] leading-snug md:text-2xl">
                      {t(locale, trip.label)}
                    </span>
                    <span className="flex items-end justify-between gap-2">
                      <span className="text-ink-soft text-sm leading-snug md:text-base">
                        {tripDetail(trip.key)}
                      </span>
                      <ArrowRightIcon className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* The one red element on the page: it is the emergency. */}
            <a
              href={`tel:${SITE.phone}`}
              className="border-pin-ink mt-2 flex min-h-14 items-center justify-between gap-3 rounded-lg border-[1.5px] px-4 md:mt-3 md:px-5"
            >
              <span className="type-display text-base md:text-lg">{t(locale, COPY.ambulance)}</span>
              <span className="text-pin-ink flex shrink-0 items-center gap-2 text-sm">
                <span className="hidden sm:inline">{t(locale, COPY.hours24)}</span>
                <PhoneIcon className="size-5" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- Route board
          Numbers are the decoration. A line runs down the left like a
          route map, starting from a red pin at Rajshahi. */}
      <section aria-labelledby="routes" className="section-y">
        <div className="wrap grid gap-x-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead id="routes" title={t(locale, COPY.routesTitle)} lead={t(locale, COPY.routesLead)} />
          </div>

          <ol className="relative">
            <span aria-hidden="true" className="bg-line absolute top-3 bottom-8 start-[0.4375rem] w-px" />
            <li className="relative flex items-center gap-4 pb-2">
              <span aria-hidden="true" className="bg-pin ring-ground relative size-3.5 shrink-0 rounded-full ring-4" />
              <span className="text-ink-soft text-sm">{t(locale, COPY.origin)}</span>
            </li>
            {ROUTE_BOARD.map((row) => (
              <li key={row.slug} className="relative">
                <Link
                  href={bookingHref(locale, { trip: "outstation", to: t(locale, row.name) })}
                  className="group border-line flex min-h-16 items-center gap-4 border-b py-2.5 md:min-h-20"
                >
                  <span aria-hidden="true" className="border-leaf bg-ground relative size-3.5 shrink-0 rounded-full border-2" />
                  <span className="min-w-0 flex-1">
                    <span className="type-display block text-lg md:text-2xl">{t(locale, row.name)}</span>
                    <span className="text-ink-soft block text-sm md:text-base">{t(locale, row.detail)}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    {row.distanceKm ? (
                      <span className="whitespace-nowrap">
                        <span className="figures text-figure">{localeDigits(locale, row.distanceKm)}</span>{" "}
                        <span className="text-ink-soft text-sm">{t(locale, COPY.km)}</span>
                      </span>
                    ) : row.inCity ? (
                      <span className="type-display text-ink-soft">{t(locale, COPY.inCity)}</span>
                    ) : (
                      <Placeholder note={t(locale, COPY.unknownKmNote)}>{t(locale, COPY.unknownKm)}</Placeholder>
                    )}
                    {row.inCity ? null : (
                      <Placeholder note={t(locale, COPY.unknownTimeNote)}>{t(locale, COPY.unknownTime)}</Placeholder>
                    )}
                  </span>
                  <ArrowRightIcon className="text-ink-soft group-hover:text-ink size-5 shrink-0 transition-colors" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------ Fleet
          Rendered only as it nears the screen, so its photos are not
          fetched during the first paint, when they would compete with the
          fonts. The reserved height is the section's real height on a
          phone, so the page does not jump. */}
      <section
        aria-labelledby="fleet"
        className="bg-mist section-y [contain-intrinsic-size:auto_660px] [content-visibility:auto]"
      >
        <div className="wrap">
          <SectionHead
            id="fleet"
            title={t(locale, COPY.fleetTitle)}
            lead={t(locale, COPY.fleetLead)}
            action={
              <Link href={route(locale, "fleet")} className="text-leaf inline-flex min-h-11 items-center gap-2 underline-offset-4 hover:underline">
                {t(locale, COPY.fleetMore)}
                <ArrowRightIcon className="size-4" />
              </Link>
            }
          />
          {/* A swipe rail on phones keeps three cars to one screen of height. */}
          <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
            {FLEET.map((v) => (
              <li key={v.slug} className="w-[80%] shrink-0 snap-start sm:w-[45%] md:w-auto">
                <Photo
                  name={v.photo.name}
                  width={v.photo.width}
                  height={v.photo.height}
                  alt={v.name}
                  sizes="(min-width: 768px) 33vw, 80vw"
                  className="aspect-[3/2] h-auto w-full rounded-lg object-cover"
                />
                <h3 className="mt-4 text-xl md:text-2xl">{v.name}</h3>
                <p className="text-ink-soft text-sm md:text-base">
                  {t(locale, v.type)} · {localeDigits(locale, v.seats)} {t(locale, COPY.seats)}
                </p>
                <div className="border-line mt-3 flex flex-wrap items-center justify-between gap-x-4 border-t pt-3">
                  <p className="whitespace-nowrap">
                    <span className="figures text-figure">৳{formatTaka(locale, v.pricePerDay)}</span>{" "}
                    <span className="text-ink-soft text-sm">{t(locale, COPY.perDay)}</span>
                  </p>
                  <Link
                    href={bookingHref(locale, { vehicle: v.slug })}
                    className="text-leaf inline-flex min-h-11 items-center gap-2 underline-offset-4 hover:underline"
                  >
                    {t(locale, COPY.bookThis)}
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----------------------------------------------------- How it works
          Numbered because the order is real. */}
      <section aria-labelledby="steps" className="section-y">
        <div className="wrap">
          <SectionHead id="steps" title={t(locale, COPY.stepsTitle)} />
          <ol className="grid gap-4 md:grid-cols-3 md:gap-10">
            {COPY.steps.map((step, i) => (
              <li key={step.title.en} className="border-line flex gap-4 border-t pt-4 md:block md:pt-7">
                <span aria-hidden="true" className="figures text-leaf w-8 shrink-0 text-4xl md:text-6xl">
                  {localeDigits(locale, i + 1)}
                </span>
                <div className="md:mt-6">
                  <h3 className="text-lg md:text-2xl">{t(locale, step.title)}</h3>
                  <p className="text-ink-soft mt-1 md:mt-3">{t(locale, step.body)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageShell>
  );
}
