import { BookingCta } from "@/components/booking-cta";
import { BoltIcon, PhoneIcon, SteeringIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";
import { breadcrumbSchema } from "@/lib/schema";

/*
 * Facts kept to what the business actually runs: pickup and drop at Rajshahi's
 * two transport hubs, arranged by phone around the customer's arrival time.
 * Fares are deliberately NOT listed — they are quoted per route and time, the
 * same policy as the outstation section (owner decision, 2026-10).
 */

const COPY = {
  title: { bn: "এয়ারপোর্ট ও স্টেশন পিকআপ-ড্রপ", en: "Airport & Station Pickup–Drop" },
  lead: {
    bn: "ফ্লাইট বা ট্রেনের সময় আগেই জানিয়ে দিন — নির্ধারিত সময়ে ড্রাইভার গেটে পৌঁছে থাকবে। দিন হোক বা রাত, সার্ভিস ২৪ ঘণ্টা।",
    en: "Share your flight or train time in advance — a driver is at the gate at the agreed hour. Day or night, the service runs 24 hours.",
  },
  airportTitle: { bn: "শাহ মখদুম বিমানবন্দর", en: "Shah Makhdum Airport" },
  airportBody: {
    bn: "ফ্লাইটের নাম ও অবতরণের সময় জানিয়ে রাখুন — ড্রাইভার সেই অনুযায়ী অপেক্ষায় থাকে। লাগেজ বুঝে নেওয়া থেকে গন্তব্যে পৌঁছানো — সব একই ভাড়ায়। শহরে ফেরা বা বিমানবন্দরে যাওয়া — দুটোই হয়।",
    en: "Tell us the flight and its landing time — the driver waits accordingly. From luggage to your destination, it is one fare. Airport runs into the city or out to the terminal, both ways.",
  },
  stationTitle: { bn: "রাজশাহী রেলওয়ে স্টেশন", en: "Rajshahi Railway Station" },
  stationBody: {
    bn: "ট্রেনের সময়সূচি অনুযায়ী ড্রাইভাভাড়া প্ল্যাটফর্মের সামনে হাজির। সকালের প্রথম ট্রেন হোক বা গভীর রাতের শেষ ট্রেন — সময় বললেই গাড়ি ঠিক থাকে।",
    en: "A driver meets you in front of the platform per the train schedule. The first morning train or the last one deep in the night — give the time and the car is set.",
  },
  stepsTitle: { bn: "কীভাবে কাজ করে", en: "How it works" },
  steps: [
    {
      bn: "কল বা হোয়াটসঅ্যাপে ফ্লাইট/ট্রেনের সময় ও গন্তব্য জানান।",
      en: "Call or message with your flight/train time and destination.",
    },
    {
      bn: "ভাড়া ও গাড়ি কথা বলে নিশ্চিত করুন — কোনো লুকানো খরচ নেই।",
      en: "Agree the fare and the car on the call — no hidden costs.",
    },
    {
      bn: "নির্ধারিত সময়ে ড্রাইভার বিমানবন্দর/স্টেশনে হাজির — লাগেজসহ যাত্রা।",
      en: "The driver is at the airport or station at the agreed time — luggage handled, journey done.",
    },
  ] as const,
  fareTitle: { bn: "ভাড়া কত?", en: "What does it cost?" },
  fareBody: {
    bn: "পিকআপ-ড্রপের ভাড়া সময় ও গন্তব্য অনুযায়ী নির্ধারিত হয় — কল করে আপনার কাস্টম ফেয়ার জেনে নিন।",
    en: "Pickup–drop fares depend on the time and destination — call to get your custom quote.",
  },
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

      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)} />

      {/* ------------------------------------------------------ The two hubs */}
      <section className="mx-auto w-full max-w-4xl px-4 py-12 md:py-16">
        <div className="reveal-stagger grid gap-5 sm:grid-cols-2">
          {[
            { Icon: BoltIcon, title: COPY.airportTitle, body: COPY.airportBody },
            { Icon: SteeringIcon, title: COPY.stationTitle, body: COPY.stationBody },
          ].map(({ Icon, title, body }) => (
            <div
              key={title.en}
              className="border-border bg-surface-raised lift shadow-card rounded-2xl border p-6 transition"
            >
              <span className="bg-brand-soft text-leaf flex size-11 items-center justify-center rounded-xl">
                <Icon className="size-6" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{t(locale, title)}</h2>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                {t(locale, body)}
              </p>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------- How it works */}
        <h2 className="reveal mt-14 text-2xl font-semibold md:text-3xl">
          {t(locale, COPY.stepsTitle)}
        </h2>
        <ol className="reveal-stagger mt-6 space-y-3">
          {COPY.steps.map((step, index) => (
            <li
              key={step.en}
              className="border-border bg-surface-raised shadow-card flex gap-3 rounded-xl border p-4"
            >
              <span className="bg-brand text-brand-fg flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                {locale === "bn" ? ["১", "২", "৩"][index] : index + 1}
              </span>
              {t(locale, step)}
            </li>
          ))}
        </ol>

        {/* -------------------------------------------------------- Fare + CTA */}
        <div className="reveal border-accent bg-accent-soft mt-8 rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">{t(locale, COPY.fareTitle)}</h2>
          <p className="text-muted mt-1.5">{t(locale, COPY.fareBody)}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`tel:${SITE.phone}`}
              className="press bg-accent text-accent-fg inline-flex min-h-12 items-center gap-2 rounded-xl px-6 font-semibold transition hover:brightness-110"
            >
              <PhoneIcon className="size-5" />
              {t(locale, SITE.phoneDisplay)}
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=${waText}`}
              className="press bg-whatsapp inline-flex min-h-12 items-center gap-2 rounded-xl px-6 font-semibold text-black transition hover:brightness-95"
            >
              <WhatsAppIcon className="size-5" />
              {t(locale, { bn: "হোয়াটসঅ্যাপ", en: "WhatsApp" })}
            </a>
          </div>
        </div>
      </section>

      <BookingCta locale={locale} />
    </PageShell>
  );
}
