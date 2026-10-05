import { PhoneIcon, StarIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { SITE } from "@/config/site";
import { type Locale, localeDigits, t } from "@/lib/locale";

/*
 * Facts here come from the owner's Google Business Profile ("Rajshahi
 * Ambulance Service", Rajshahi 6200, open 24 hours, 5.0 from 2 reviews, based
 * at Rajshahi Medical) and from the claims already published on the existing
 * page: advanced life support equipment, trained medical professionals,
 * nationwide coverage, a response-time commitment, licensed and insured.
 *
 * The response-time figure is the owner's own published commitment, carried
 * over verbatim. Nothing medical is asserted beyond what they already state.
 *
 * The 5.0 rating is shown visually and credited to Google, but deliberately
 * NOT emitted as aggregateRating markup: self-serving review markup about your
 * own business breaks Google's structured-data guidelines.
 */

const COPY = {
  eyebrow: { bn: "২৪ ঘণ্টা জরুরি সেবা", en: "24-hour emergency service" },
  title: { bn: "রাজশাহী অ্যাম্বুলেন্স সার্ভিস", en: "Rajshahi Ambulance Service" },
  lead: {
    bn: "জরুরি মুহূর্তে দ্রুত ও নির্ভরযোগ্য অ্যাম্বুলেন্স। রাজশাহী মেডিকেল এলাকায় অবস্থান, রাজশাহী শহর থেকে সারা দেশে রোগী পরিবহন।",
    en: "Fast, dependable emergency transport. Based at Rajshahi Medical, serving Rajshahi city and the whole country.",
  },
  callAria: {
    bn: "জরুরি অ্যাম্বুলেন্সের জন্য কল করুন",
    en: "Call for an emergency ambulance",
  },
  tapToCall: { bn: "চাপ দিলেই কল হবে", en: "Tap to call" },
  whatsapp: { bn: "হোয়াটসঅ্যাপে লিখুন", en: "Message on WhatsApp" },
  factsLabel: { bn: "এক নজরে", en: "At a glance" },
  alwaysOpen: { bn: "সবসময় খোলা", en: "Always open" },
  responseTime: { bn: "১৫ মিনিট", en: "15 min" },
  responseLabel: { bn: "এর মধ্যে সাড়া", en: "or less to respond" },
  nationwide: { bn: "সারা দেশে", en: "Nationwide" },
  nationwideLabel: { bn: "রোগী পরিবহন", en: "patient transport" },
  provideTitle: { bn: "আমরা যা দিই", en: "What we provide" },
  callReadyTitle: { bn: "কল করার সময় যা বলবেন", en: "What to tell us when you call" },
  callReadyLead: {
    bn: "এই তথ্যগুলো হাতে থাকলে অ্যাম্বুলেন্স পাঠাতে সবচেয়ে কম সময় লাগে।",
    en: "Having these ready gets an ambulance moving in the shortest time.",
  },
  coverageTitle: { bn: "কোথায় কোথায় সেবা", en: "Where we serve" },
  rating: { bn: "গুগলে ৫.০ · ২টি রিভিউ", en: "5.0 on Google · 2 reviews" },
  viewOnGoogle: { bn: "গুগলে রিভিউ দেখুন", en: "See the reviews on Google" },
  licensed: {
    bn: "লাইসেন্সপ্রাপ্ত ও ইনস্যুরেন্স করা।",
    en: "Licensed and insured.",
  },
} as const;

const PROVIDE = [
  {
    title: { bn: "অ্যাডভান্সড লাইফ সাপোর্ট", en: "Advanced life support" },
    body: {
      bn: "জরুরি চিকিৎসার সরঞ্জামসহ সজ্জিত অ্যাম্বুলেন্স।",
      en: "Ambulances equipped with advanced life support equipment.",
    },
  },
  {
    title: { bn: "প্রশিক্ষিত মেডিকেল স্টাফ", en: "Trained medical staff" },
    body: {
      bn: "রোগী পরিবহনে অভিজ্ঞ ও প্রশিক্ষিত কর্মী সঙ্গে থাকেন।",
      en: "Trained professionals accompany the patient in transit.",
    },
  },
  {
    title: { bn: "দ্রুত সাড়া", en: "Quick response" },
    body: {
      bn: "কল পাওয়ার পর দ্রুততম সময়ে অ্যাম্বুলেন্স রওনা দেয়।",
      en: "An ambulance is dispatched as soon as the call comes in.",
    },
  },
  {
    title: { bn: "রাজশাহী ও সারা দেশ", en: "Rajshahi and nationwide" },
    body: {
      bn: "শহরের ভেতরে, বিভাগজুড়ে এবং ঢাকাসহ যেকোনো জেলায়।",
      en: "Within the city, across the division, and to any district including Dhaka.",
    },
  },
] as const;

const CALL_READY = [
  {
    bn: "রোগী এখন কোথায় আছেন: বাসা, হাসপাতাল বা কাছের পরিচিত জায়গার নাম",
    en: "Where the patient is now: home, hospital, or a nearby landmark",
  },
  {
    bn: "রোগীর অবস্থা সংক্ষেপে: কী হয়েছে, বয়স, হাঁটতে পারছেন কি না",
    en: "The patient's condition in brief: what happened, age, whether they can walk",
  },
  {
    bn: "কোথায় নিয়ে যেতে হবে: হাসপাতালের নাম বা ঠিকানা",
    en: "Where they need to go: hospital name or address",
  },
  {
    bn: "আপনার যোগাযোগের নম্বর, যাতে ড্রাইভার সরাসরি কথা বলতে পারেন",
    en: "Your contact number, so the driver can reach you directly",
  },
] as const;

const COVERAGE = [
  { bn: "রাজশাহী শহর ও রাজশাহী মেডিকেল এলাকা", en: "Rajshahi city and the Rajshahi Medical area" },
  { bn: "রাজশাহী বিভাগের জেলাগুলো: নাটোর, চাঁপাইনবাবগঞ্জ, নওগাঁ", en: "Districts across Rajshahi division: Natore, Chapainawabganj, Naogaon" },
  { bn: "ঢাকাসহ দেশের যেকোনো জেলায় দূরপাল্লার পরিবহন", en: "Long-distance transfers to Dhaka and any district in the country" },
] as const;

const GBP_URL = "https://share.google/52MSxbL6RCxlZ1huf";

export function AmbulancePage({ locale }: { locale: Locale }) {
  const waText = encodeURIComponent(
    t(locale, {
      bn: "জরুরি অ্যাম্বুলেন্স দরকার।",
      en: "I need an emergency ambulance.",
    }),
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "EmergencyService",
    name: t(locale, COPY.title),
    url: new URL(locale === "bn" ? "/ambulance-service/" : "/en/ambulance-service/", SITE.url).toString(),
    telephone: SITE.phone,
    inLanguage: locale,
    address: {
      "@type": "PostalAddress",
      addressLocality: locale === "bn" ? "রাজশাহী" : "Rajshahi",
      postalCode: "6200",
      addressCountry: "BD",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: locale === "bn" ? "রাজশাহী ও বাংলাদেশ" : "Rajshahi and Bangladesh",
    },
    sameAs: [GBP_URL],
  };

  return (
    <PageShell locale={locale} emergency>
      <JsonLd data={schema} />

      {/* ----------------------------------------------------- Emergency
          On this page the phone number is the page: the first thing under
          the header and the largest type on it, hit without aiming. */}
      <section className="surface-pin">
        <div className="wrap pt-8 pb-10 md:pt-14 md:pb-16">
          <p className="flex items-center gap-2 text-sm md:text-base">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-current" />
            {t(locale, COPY.eyebrow)}
          </p>
          <a
            href={`tel:${SITE.phone}`}
            aria-label={`${t(locale, SITE.phoneDisplay)} — ${t(locale, COPY.callAria)}`}
            className="btn-primary press mt-5 flex min-h-20 w-full items-center justify-center gap-3 rounded-lg px-4 md:inline-flex md:w-auto md:gap-5 md:px-8"
          >
            <PhoneIcon className="size-7 shrink-0 md:size-10" />
            <span
              className={`figures whitespace-nowrap ${
                locale === "bn"
                  ? "text-[clamp(1.75rem,0.6rem+6vw,5rem)]"
                  : "text-[clamp(1.3rem,0.3rem+5.2vw,4.25rem)]"
              }`}
            >
              {t(locale, SITE.phoneDisplay)}
            </span>
          </a>
          <p className="mt-2 text-sm md:text-base">{t(locale, COPY.tapToCall)}</p>
          <h1 className="mt-8 text-3xl md:mt-12 md:text-5xl">{t(locale, COPY.title)}</h1>
          <p className="mt-3 max-w-2xl md:text-lg">{t(locale, COPY.lead)}</p>
          <a href={`https://wa.me/${SITE.whatsapp}?text=${waText}`} className="btn btn-quiet mt-6">
            <WhatsAppIcon className="size-5" />
            {t(locale, COPY.whatsapp)}
          </a>
        </div>
      </section>

      {/* ------------------------------------------------------- Facts */}
      <section aria-label={t(locale, COPY.factsLabel)} className="border-line border-b">
        {/* Rows on a phone (a third of 320 px is too narrow for "Nationwide"),
            three columns from 640 px. */}
        <dl className="wrap grid sm:grid-cols-3">
          {[
            { value: locale === "bn" ? "২৪/৭" : "24/7", label: COPY.alwaysOpen },
            { value: t(locale, COPY.responseTime), label: COPY.responseLabel },
            { value: t(locale, COPY.nationwide), label: COPY.nationwideLabel },
          ].map(({ value, label }, i) => (
            <div
              key={label.en}
              className={`border-line flex flex-row-reverse items-baseline justify-end gap-4 py-4 sm:flex-col-reverse sm:items-start sm:gap-2 sm:py-10 ${
                i > 0 ? "border-t sm:border-t-0 sm:border-s sm:ps-8" : "sm:pe-8"
              }`}
            >
              {/* The figure leads visually; the label stays first for a list reader. */}
              <dt className="text-ink-soft text-sm md:text-base">{t(locale, label)}</dt>
              <dd className="figures text-pin-ink text-2xl lg:text-4xl xl:text-5xl">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="wrap grid gap-16 py-16 md:py-24 lg:grid-cols-2 lg:gap-20">
        <section aria-labelledby="provide">
          <h2 id="provide" className="text-section">{t(locale, COPY.provideTitle)}</h2>
          <ul className="mt-6">
            {PROVIDE.map(({ title, body }) => (
              <li key={title.en} className="border-line border-b py-5">
                <h3 className="text-lg md:text-xl">{t(locale, title)}</h3>
                <p className="text-ink-soft mt-1">{t(locale, body)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="call-ready">
          <h2 id="call-ready" className="text-section">{t(locale, COPY.callReadyTitle)}</h2>
          <p className="text-ink-soft mt-3">{t(locale, COPY.callReadyLead)}</p>
          <ol className="mt-6">
            {CALL_READY.map((item, i) => (
              <li key={item.en} className="border-line flex gap-4 border-b py-4">
                <span aria-hidden="true" className="figures text-pin-ink w-6 shrink-0 text-xl">
                  {localeDigits(locale, i + 1)}
                </span>
                {t(locale, item)}
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="coverage">
          <h2 id="coverage" className="text-section">{t(locale, COPY.coverageTitle)}</h2>
          <ul className="mt-6">
            {COVERAGE.map((c) => (
              <li key={c.en} className="border-line flex gap-3 border-b py-4">
                <span aria-hidden="true" className="bg-pin mt-2.5 size-2 shrink-0 rounded-full" />
                {t(locale, c)}
              </li>
            ))}
          </ul>
          <p className="text-ink-soft mt-4">{t(locale, COPY.licensed)}</p>
        </section>

        <section aria-label={t(locale, COPY.rating)} className="lg:self-end">
          <p className="flex items-center gap-3">
            <span className="text-ink flex" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <StarIcon key={i} className="size-5" />
              ))}
            </span>
            <span className="type-display text-lg">{t(locale, COPY.rating)}</span>
          </p>
          <a
            href={GBP_URL}
            rel="noopener"
            className="text-leaf mt-2 inline-flex min-h-11 items-center underline-offset-4 hover:underline"
          >
            {t(locale, COPY.viewOnGoogle)}
          </a>
        </section>
      </div>
    </PageShell>
  );
}
