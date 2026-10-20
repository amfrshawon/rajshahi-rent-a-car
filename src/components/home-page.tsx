import Link from "next/link";
import {
  AmbulanceIcon,
  ArrowRightIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { PageShell } from "@/components/page-shell";
import { Photo } from "@/components/photo";
import { route } from "@/config/routes";
import { FLEET, SITE } from "@/config/site";
import { GOOGLE_RATING, ROUTE_BOARD, TRIP_TYPES } from "@/config/trips";
import { listArticles } from "@/lib/content";
import { type Locale, formatTaka, localeDigits, t } from "@/lib/locale";

const COPY = {
  eyebrow: { bn: "রাজশাহী · ২৪ ঘণ্টা · ড্রাইভারসহ", en: "Rajshahi · 24 hours · With driver" },
  headline: { bn: "এক কলে গাড়ি দরজায়।", en: "One call, a car at your door." },
  support: {
    bn: "শহরে, বিমানবন্দরে কিংবা ঢাকায় — ভাড়া আগেই জানিয়ে দিই।",
    en: "Across the city, to the airport, or Dhaka — the fare agreed up front.",
  },
  callNow: { bn: "একল করুন", en: "Call now" },
  whatsapp: { bn: "হোয়াটসঅ্যাপ", en: "WhatsApp" },
  heroAlt: { bn: "রাজশাহী রেন্ট এ কার-এর টয়োটা প্রিমিও", en: "A Toyota Premio from Rajshahi Rent A Car" },
  proof: {
    bn: `গুগলে ${localeDigits("bn", GOOGLE_RATING.score.toFixed(1))} · ${localeDigits("bn", GOOGLE_RATING.count)}টি রিভিউ`,
    en: `${GOOGLE_RATING.score.toFixed(1)} on Google · ${GOOGLE_RATING.count} reviews`,
  },

  whereTitle: { bn: "কোথায় যাবেন?", en: "Where are you going?" },
  ambulance: { bn: "জরুরি অ্যাম্বুলেন্স", en: "Emergency ambulance" },
  ambulanceNote: { bn: "২৪ ঘণ্টা · সরাসরি কল", en: "24 hours · call directly" },

  routesKicker: { bn: "ড্রাইভারসহ, ভাড়া আগেই জানা", en: "With a driver, fare agreed first" },
  routesTitle: { bn: "রাজশাহী থেকে", en: "From Rajshahi" },
  routesNote: {
    bn: "গন্তব্যে চাপ দিলে বুকিং খুলবে, গন্তব্য আগেই বসানো থাকবে।",
    en: "Tap a destination to open booking with it filled in.",
  },
  verify: { bn: "যাচাই করুন", en: "to confirm" },
  minutes: { bn: "মিনিট", en: "min" },
  km: { bn: "কিমি", en: "km" },

  fleetTitle: { bn: "গাড়িবহর", en: "The fleet" },
  fleetLead: { bn: "প্রতিটি গাড়ি এসি, ড্রাইভারসহ।", en: "Every car is air-conditioned and comes with a driver." },
  seats: { bn: "আসন", en: "seats" },
  book: { bn: "বুক করুন", en: "Book" },
  seeAll: { bn: "সব গাড়ি", en: "See all cars" },

  stepsTitle: { bn: "যেভাবে বুকিং হয়", en: "How booking works" },
  steps: [
    { bn: "কল বা হোয়াটসঅ্যাপ করুন", en: "Call or message on WhatsApp" },
    { bn: "আমরা ভাড়া নিশ্চিত করি", en: "We confirm the fare" },
    { bn: "ড্রাইভার সময়মতো হাজির", en: "The driver arrives on time" },
  ] as const,

  ctaTitle: { bn: "যাত্রার প্ল্যান ঠিক হয়ে গেছে?", en: "Trip planned?" },
  ctaLead: {
    bn: "একল ফোনে গাড়ি ও ড্রাইভার নিশ্চিত করুন — ঢাকা–রাজশাহীসহ যেকোনো রুট।",
    en: "One call confirms the car and the driver — Dhaka–Rajshahi and beyond.",
  },
  guides: { bn: "ভ্রমণ গাইড পড়ুন", en: "Read the travel guides" },
} as const;

export async function HomePage({ locale }: { locale: Locale }) {
  const hero = FLEET[0];
  const contact = route(locale, "contact");
  const articles = await listArticles(locale);

  const waText = encodeURIComponent(
    t(locale, { bn: "আসসালামু আলাইকুম, আমি গাড়ি ভাড়া নিতে চাই।", en: "Hello, I would like to rent a car." }),
  );

  return (
    <PageShell locale={locale}>
      {/* ------------------------------------------------------------- Hero */}
      <section className="bg-brand text-brand-fg">
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-5 md:px-6 md:pt-12 md:pb-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-10">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold opacity-90">
                <span aria-hidden="true" className="bg-pin size-2 rounded-full" />
                {t(locale, COPY.eyebrow)}
              </p>
              <h1 className="mt-3 text-4xl leading-tight font-bold md:text-6xl">
                {t(locale, COPY.headline)}
              </h1>
              <p className="mt-3 max-w-md text-base opacity-90 md:text-lg">
                {t(locale, COPY.support)}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`tel:${SITE.phone}`}
                  className="bg-bg text-leaf inline-flex min-h-12 items-center gap-2 rounded-lg px-6 font-semibold transition active:scale-[0.98]"
                >
                  <PhoneIcon className="size-5" />
                  {t(locale, COPY.callNow)}
                </a>
                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=${waText}`}
                  className="btn-whatsapp"
                >
                  <WhatsAppIcon className="size-5" />
                  {t(locale, COPY.whatsapp)}
                </a>
              </div>
            </div>

            {/* Full colour — the car is the subject, not a backdrop. */}
            <div className="relative overflow-hidden rounded-lg">
              <Photo
                name={hero.photo.name}
                width={hero.photo.width}
                height={hero.photo.height}
                alt={t(locale, COPY.heroAlt)}
                sizes="(min-width: 1024px) 560px, 92vw"
                priority
                className="aspect-[16/10] w-full object-cover"
              />
              <span className="text-fg absolute bottom-3 left-3 rounded bg-white/95 px-2.5 py-1 text-xs font-semibold">
                <span aria-hidden="true" className="text-pin">★</span> {t(locale, COPY.proof)}
              </span>
            </div>
          </div>

          {/* Trip tiles */}
          <h2 className="sr-only">{t(locale, COPY.whereTitle)}</h2>
          <p className="mt-7 text-lg font-bold">{t(locale, COPY.whereTitle)}</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {TRIP_TYPES.map((trip) => (
              <li key={trip.key}>
                <a
                  href={`${contact}?trip=${trip.key}#booking`}
                  className="bg-bg text-fg flex h-full flex-col gap-1 rounded-lg p-3 transition active:scale-[0.98]"
                >
                  <span className="font-semibold">{t(locale, trip.label)}</span>
                  <span className="text-muted text-xs">{t(locale, trip.note)}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Ambulance — the one red-outlined row, a direct call. It sits on
              its own white ground: the pin red is only 4.96:1 on white, and
              would fail on the green panel. */}
          <a
            href={`tel:${SITE.phone}`}
            className="border-pin bg-bg text-pin mt-3 flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 font-semibold"
          >
            <span className="flex items-center gap-2">
              <AmbulanceIcon className="size-5" />
              {t(locale, COPY.ambulance)}
            </span>
            <span className="text-xs font-semibold">{t(locale, COPY.ambulanceNote)}</span>
          </a>
        </div>
      </section>

      {/* -------------------------------------------------------- Route board */}
      <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-14">
        <p className="eyebrow">{t(locale, COPY.routesKicker)}</p>
        <h2 className="mt-1 text-3xl font-bold md:text-4xl">{t(locale, COPY.routesTitle)}</h2>

        <ul className="mt-6 border-t border-border">
          {ROUTE_BOARD.map((r) => (
            <li key={r.to.en} className="border-border border-b">
              <a
                href={`${contact}?destination=${encodeURIComponent(t(locale, r.to))}#booking`}
                className="flex min-h-12 items-center gap-3 py-2.5 transition active:bg-surface"
              >
                <span aria-hidden="true" className="bg-pin size-2.5 shrink-0 rounded-full" />
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{t(locale, r.to)}</span>
                  <span className="text-muted block text-sm">{t(locale, r.note)}</span>
                </span>
                <span className="tnum text-leaf shrink-0 text-right text-lg font-semibold">
                  {r.km === null ? (
                    <span className="text-muted text-sm font-normal">{t(locale, COPY.verify)}</span>
                  ) : (
                    <>
                      {localeDigits(locale, r.km)} {t(locale, COPY.km)}
                      {r.minutes ? (
                        <small className="text-muted block text-xs font-normal">
                          {t(locale, COPY.minutes)} {localeDigits(locale, r.minutes)}
                        </small>
                      ) : null}
                    </>
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="text-muted mt-3 text-sm">{t(locale, COPY.routesNote)}</p>
      </section>

      {/* -------------------------------------------------------------- Fleet */}
      <section className="bg-surface border-border border-y">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">{t(locale, COPY.fleetTitle)}</h2>
              <p className="text-muted mt-1">{t(locale, COPY.fleetLead)}</p>
            </div>
            <Link href={route(locale, "fleet")} className="text-leaf inline-flex min-h-11 items-center gap-1.5 font-semibold">
              {t(locale, COPY.seeAll)}
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>

          <ul
            tabIndex={0}
            aria-label={t(locale, COPY.fleetTitle)}
            className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0"
          >
            {FLEET.map((v) => (
              <li key={v.slug} className="w-[80%] shrink-0 snap-start sm:w-auto">
                <div className="tile overflow-hidden">
                  <Photo
                    name={v.photo.name}
                    width={v.photo.width}
                    height={v.photo.height}
                    alt={v.name}
                    sizes="(min-width: 640px) 340px, 80vw"
                    className="aspect-[16/10] w-full object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-lg font-bold">{v.name}</h3>
                      <p className="tnum text-leaf text-xl font-bold whitespace-nowrap">
                        ৳{formatTaka(locale, v.pricePerDay)}
                        <span className="text-muted text-sm font-normal">/{locale === "bn" ? "দিন" : "day"}</span>
                      </p>
                    </div>
                    <p className="text-muted mt-1 text-sm">
                      {formatTaka(locale, v.seats)} {t(locale, COPY.seats)} · {t(locale, v.transmission)}
                    </p>
                    <a
                      href={`${contact}?trip=city&destination=${encodeURIComponent(v.name)}#booking`}
                      className="btn-primary mt-4 w-full"
                    >
                      {t(locale, COPY.book)}
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* -------------------------------------------------- How booking works */}
      <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-14">
        <h2 className="text-3xl font-bold md:text-4xl">{t(locale, COPY.stepsTitle)}</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {COPY.steps.map((step, index) => (
            <li key={step.en} className="flex items-start gap-3">
              <span className="tnum bg-brand text-brand-fg flex size-8 shrink-0 items-center justify-center rounded-full font-bold">
                {localeDigits(locale, index + 1)}
              </span>
              <p className="pt-1 font-medium">{t(locale, step)}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------------- Closing strip */}
      <section className="bg-brand text-brand-fg">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-5 px-4 py-10 md:px-6 md:py-12">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">{t(locale, COPY.ctaTitle)}</h2>
            <p className="mt-2 max-w-xl opacity-90">{t(locale, COPY.ctaLead)}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${SITE.phone}`}
              className="bg-bg text-leaf inline-flex min-h-12 items-center gap-2 rounded-lg px-6 font-semibold transition active:scale-[0.98]"
            >
              <PhoneIcon className="size-5" />
              {t(locale, SITE.phoneDisplay)}
            </a>
            <a href={`https://wa.me/${SITE.whatsapp}?text=${waText}`} className="btn-whatsapp">
              <WhatsAppIcon className="size-5" />
              {t(locale, COPY.whatsapp)}
            </a>
          </div>
        </div>
      </section>

      {/* Blog: one link, not a card grid. */}
      {articles.length > 0 ? (
        <div className="mx-auto w-full max-w-6xl px-4 py-4 md:px-6">
          <Link
            href={route(locale, "blog")}
            className="text-leaf inline-flex min-h-11 items-center gap-1.5 font-semibold"
          >
            {t(locale, COPY.guides)}
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      ) : null}
    </PageShell>
  );
}
