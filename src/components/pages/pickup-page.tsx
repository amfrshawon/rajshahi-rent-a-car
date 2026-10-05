import Link from "next/link";
import { ArrowRightIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { PhotoSlot } from "@/components/placeholder";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { bookingHref } from "@/config/trips";
import { type Locale, localeDigits, t } from "@/lib/locale";
import { breadcrumbSchema } from "@/lib/schema";

/*
 * Facts kept to what the business actually runs: pickup and drop at Rajshahi's
 * two transport hubs, arranged by phone around the customer's arrival time.
 * Fares are deliberately NOT listed — they are quoted per route and time, the
 * same policy as the outstation section (owner decision, 2026-10).
 */

const COPY = {
  title: { bn: "এয়ারপোর্ট ও স্টেশন পিকআপ-ড্রপ", en: "Airport & station pickup" },
  lead: {
    bn: "ফ্লাইট বা ট্রেনের সময় আগেই জানিয়ে দিন, ঠিক সময়ে ড্রাইভার গেটে থাকবেন। দিন হোক বা রাত, সার্ভিস ২৪ ঘণ্টা।",
    en: "Tell us your flight or train time and a driver is at the gate at that hour. Day or night, the service runs 24 hours.",
  },
  book: { bn: "পিকআপ বুক করুন", en: "Book a pickup" },
  airportTitle: { bn: "শাহ মখদুম বিমানবন্দর", en: "Shah Makhdum Airport" },
  airportBody: {
    bn: "ফ্লাইটের নাম ও নামার সময় জানিয়ে রাখুন, ড্রাইভার সেই অনুযায়ী অপেক্ষায় থাকেন। লাগেজ তোলা থেকে গন্তব্যে পৌঁছানো, সব একই ভাড়ায়। শহরে আসা বা বিমানবন্দরে যাওয়া, দুটোই হয়।",
    en: "Tell us the flight and its landing time and the driver waits for it. From the luggage to your door is one fare. Into the city or out to the terminal, both ways.",
  },
  stationTitle: { bn: "রাজশাহী রেলস্টেশন", en: "Rajshahi railway station" },
  stationBody: {
    bn: "ট্রেনের সময় অনুযায়ী ড্রাইভার প্ল্যাটফর্মের সামনে থাকেন। সকালের প্রথম ট্রেন হোক বা রাতের শেষ ট্রেন, সময় বললেই গাড়ি ঠিক থাকে।",
    en: "A driver meets you outside the platform at your train's time. The first train of the morning or the last one at night: give the time and the car is set.",
  },
  stepsTitle: { bn: "যেভাবে হয়", en: "How it works" },
  steps: [
    {
      bn: "কল বা হোয়াটসঅ্যাপে ফ্লাইট বা ট্রেনের সময় আর গন্তব্য জানান।",
      en: "Call or message with your flight or train time and where you are going.",
    },
    {
      bn: "ভাড়া ও গাড়ি কথা বলে ঠিক করুন। কোনো লুকানো খরচ নেই।",
      en: "Agree the fare and the car on the call. There are no hidden costs.",
    },
    {
      bn: "ঠিক সময়ে ড্রাইভার বিমানবন্দর বা স্টেশনে থাকবেন, লাগেজসহ গাড়িতে তুলে নেবেন।",
      en: "The driver is at the airport or station on time and helps with the luggage.",
    },
  ],
  fareTitle: { bn: "ভাড়া কত?", en: "What does it cost?" },
  fareBody: {
    bn: "পিকআপ-ড্রপের ভাড়া সময় ও গন্তব্য অনুযায়ী। কল করে জেনে নিন।",
    en: "Pickup fares depend on the time and the destination. Call and ask.",
  },
  callAria: { bn: "কল করুন", en: "Call" },
  whatsapp: { bn: "হোয়াটসঅ্যাপে লিখুন", en: "Message on WhatsApp" },
  shotAirport: { bn: "শাহ মখদুম বিমানবন্দরে যাত্রীকে নিতে আসা গাড়ি", en: "A car arriving at Shah Makhdum Airport" },
  shotStation: { bn: "রাজশাহী রেলস্টেশনে লাগেজসহ একটি পরিবার", en: "A family with luggage at Rajshahi railway station" },
  home: { bn: "হোম", en: "Home" },
} as const;

export function PickupPage({ locale }: { locale: Locale }) {
  const waText = encodeURIComponent(
    t(locale, {
      bn: "আসসালামু আলাইকুম, বিমানবন্দর/স্টেশন পিকআপ-ড্রপ দরকার।",
      en: "Hello, I need an airport/station pickup or drop.",
    }),
  );

  return (
    <PageShell locale={locale}>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: t(locale, COPY.home), path: "/" },
          {
            name: t(locale, COPY.title),
            path: locale === "bn" ? ROUTES.pickup.bn : ROUTES.pickup.en,
          },
        ])}
      />

      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)}>
        <Link href={bookingHref(locale, { trip: "pickup" })} className="btn btn-primary">
          {t(locale, COPY.book)}
          <ArrowRightIcon className="size-4" />
        </Link>
      </PageHeader>

      <div className="wrap pb-20 md:pb-28">
        <div className="grid gap-12 md:grid-cols-2 md:gap-10">
          {[
            { title: COPY.airportTitle, body: COPY.airportBody, shot: COPY.shotAirport },
            { title: COPY.stationTitle, body: COPY.stationBody, shot: COPY.shotStation },
          ].map(({ title, body, shot }) => (
            <section key={title.en} aria-label={t(locale, title)} className="border-line border-t pt-6">
              <h2 className="text-2xl md:text-3xl">{t(locale, title)}</h2>
              <p className="text-ink-soft mt-3">{t(locale, body)}</p>
              <PhotoSlot shot={t(locale, shot)} className="mt-6" />
            </section>
          ))}
        </div>

        <section aria-labelledby="pickup-steps" className="mt-16 max-w-3xl md:mt-24">
          <h2 id="pickup-steps" className="text-section">{t(locale, COPY.stepsTitle)}</h2>
          <ol className="mt-6">
            {COPY.steps.map((step, i) => (
              <li key={step.en} className="border-line flex gap-4 border-b py-4">
                <span aria-hidden="true" className="figures text-leaf w-6 shrink-0 text-xl">
                  {localeDigits(locale, i + 1)}
                </span>
                {t(locale, step)}
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="pickup-fare" className="mt-16 max-w-3xl md:mt-24">
          <h2 id="pickup-fare" className="text-section">{t(locale, COPY.fareTitle)}</h2>
          <p className="text-ink-soft mt-3">{t(locale, COPY.fareBody)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`tel:${SITE.phone}`}
              aria-label={`${t(locale, SITE.phoneDisplay)} — ${t(locale, COPY.callAria)}`}
              className="btn btn-primary"
            >
              <PhoneIcon className="size-5" />
              {t(locale, SITE.phoneDisplay)}
            </a>
            <a href={`https://wa.me/${SITE.whatsapp}?text=${waText}`} className="btn btn-quiet">
              <WhatsAppIcon className="text-whatsapp-ink size-5" />
              {t(locale, COPY.whatsapp)}
            </a>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
