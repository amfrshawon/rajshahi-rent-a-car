import {
  AmbulanceIcon,
  BoltIcon,
  ChecklistIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

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
    bn: "জরুরি মুহূর্তে দ্রুত ও নির্ভরযোগ্য অ্যাম্বুলেন্স। রাজশাহী মেডিকেল এলাকায় অবস্থান — রাজশাহী শহর থেকে সারা দেশে রোগী পরিবহন।",
    en: "Fast, dependable emergency transport. Based at Rajshahi Medical, serving Rajshahi city and the whole country.",
  },
  callNow: { bn: "এখনই কল করুন", en: "Call now" },
  callAria: {
    bn: "জরুরি অ্যাম্বুলেন্সের জন্য কল করুন",
    en: "Call for an emergency ambulance",
  },
  whatsapp: { bn: "হোয়াটসঅ্যাপ", en: "WhatsApp" },
  alwaysOpen: { bn: "সবসময় খোলা", en: "Always open" },
  responseTime: { bn: "১৫ মিনিটের মধ্যে", en: "Under 15 minutes" },
  responseLabel: { bn: "সাড়া দেওয়ার সময়", en: "Response time" },
  nationwide: { bn: "সারা দেশে", en: "Nationwide" },
  nationwideLabel: { bn: "রোগী পরিবহন", en: "Patient transport" },
  provideTitle: { bn: "আমরা যা দিই", en: "What we provide" },
  callReadyTitle: { bn: "কল করার সময় যা বলবেন", en: "What to tell us when you call" },
  callReadyLead: {
    bn: "এই তথ্যগুলো হাতে থাকলে অ্যাম্বুলেন্স পাঠাতে সবচেয়ে কম সময় লাগে।",
    en: "Having these ready gets an ambulance moving in the shortest time.",
  },
  coverageTitle: { bn: "কোথায় কোথায় সেবা", en: "Where we serve" },
  ratingTitle: { bn: "গ্রাহকদের রেটিং", en: "Customer rating" },
  ratingBody: {
    bn: "গুগল বিজনেস প্রোফাইলে ৫.০ রেটিং, ২টি রিভিউ।",
    en: "Rated 5.0 on our Google Business Profile, from 2 reviews.",
  },
  viewOnGoogle: { bn: "গুগলে দেখুন", en: "View on Google" },
  licensed: {
    bn: "লাইসেন্সপ্রাপ্ত ও ইনস্যুরেন্স করা — রাজশাহী ও তার বাইরে সেবা",
    en: "Licensed and insured — serving Rajshahi and beyond",
  },
  bottomTitle: { bn: "জরুরি প্রয়োজন?", en: "Need one now?" },
  bottomLead: {
    bn: "দিন হোক বা রাত, সরাসরি কল করুন। লাইন সবসময় খোলা।",
    en: "Day or night, call directly. The line is always open.",
  },
} as const;

const PROVIDE = [
  {
    Icon: AmbulanceIcon,
    title: { bn: "অ্যাডভান্সড লাইফ সাপোর্ট", en: "Advanced life support" },
    body: {
      bn: "জরুরি চিকিৎসার সরঞ্জামসহ সজ্জিত অ্যাম্বুলেন্স।",
      en: "Ambulances equipped with advanced life support equipment.",
    },
  },
  {
    Icon: ShieldIcon,
    title: { bn: "প্রশিক্ষিত মেডিকেল স্টাফ", en: "Trained medical staff" },
    body: {
      bn: "রোগী পরিবহনে অভিজ্ঞ ও প্রশিক্ষিত কর্মী সঙ্গে থাকেন।",
      en: "Trained professionals accompany the patient in transit.",
    },
  },
  {
    Icon: BoltIcon,
    title: { bn: "দ্রুত সাড়া", en: "Quick response" },
    body: {
      bn: "কল পাওয়ার পর দ্রুততম সময়ে অ্যাম্বুলেন্স রওনা দেয়।",
      en: "An ambulance is dispatched as soon as the call comes in.",
    },
  },
  {
    Icon: MapPinIcon,
    title: { bn: "রাজশাহী ও সারা দেশ", en: "Rajshahi and nationwide" },
    body: {
      bn: "শহরের ভেতরে, বিভাগজুড়ে এবং ঢাকাসহ যেকোনো জেলায়।",
      en: "Within the city, across the division, and to any district including Dhaka.",
    },
  },
] as const;

const CALL_READY = [
  {
    bn: "রোগী এখন কোথায় আছেন — বাসা, হাসপাতাল বা নিকটবর্তী পরিচিত জায়গার নাম",
    en: "Where the patient is now — home, hospital, or a nearby landmark",
  },
  {
    bn: "রোগীর অবস্থা সংক্ষেপে — কী হয়েছে, বয়স, হাঁটতে পারছেন কি না",
    en: "The patient's condition in brief — what happened, age, whether they can walk",
  },
  {
    bn: "কোথায় নিয়ে যেতে হবে — হাসপাতালের নাম বা ঠিকানা",
    en: "Where they need to go — hospital name or address",
  },
  {
    bn: "আপনার যোগাযোগের নম্বর, যাতে ড্রাইভার সরাসরি কথা বলতে পারেন",
    en: "Your contact number, so the driver can reach you directly",
  },
] as const;

const COVERAGE = [
  { bn: "রাজশাহী শহর ও রাজশাহী মেডিকেল এলাকা", en: "Rajshahi city and the Rajshahi Medical area" },
  { bn: "রাজশাহী বিভাগের জেলাগুলো — নাটোর, চাঁপাইনবাবগঞ্জ, নওগাঁ", en: "Districts across Rajshahi division — Natore, Chapainawabganj, Naogaon" },
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
    <PageShell locale={locale}>
      <JsonLd data={schema} />

      {/* ------------------------------------------------- Emergency hero */}
      <section className="bg-emergency text-emergency-fg">
        <div className="mx-auto w-full max-w-4xl px-4 py-10 md:py-14">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/70" />
              <span className="relative inline-flex size-2 rounded-full bg-white" />
            </span>
            {t(locale, COPY.eyebrow)}
          </p>

          <h1 className="mt-4 text-3xl font-semibold md:text-5xl">{t(locale, COPY.title)}</h1>
          <p className="mt-3 max-w-2xl text-white/90 md:text-lg">{t(locale, COPY.lead)}</p>

          {/*
            On an emergency page the phone number is the page. It is the first
            interactive element, sized to be hit without aiming.
          */}
          <a
            href={`tel:${SITE.phone}`}
            aria-label={t(locale, COPY.callAria)}
            className="text-emergency-ink mt-7 flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 text-2xl font-bold shadow-lg transition active:scale-[0.98] md:text-3xl"
          >
            <PhoneIcon className="size-7 shrink-0" />
            {t(locale, SITE.phoneDisplay)}
          </a>

          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=${waText}`}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white/15 px-5 font-semibold ring-1 ring-white/30 transition active:scale-[0.98] sm:flex-none"
            >
              <WhatsAppIcon className="size-5" />
              {t(locale, COPY.whatsapp)}
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Stats strip */}
      <section className="border-border bg-surface border-b">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-3 divide-x divide-[color:var(--border)] px-4">
          {[
            { Icon: ClockIcon, value: "২৪/৭", valueEn: "24/7", label: COPY.alwaysOpen },
            { Icon: BoltIcon, value: COPY.responseTime.bn, valueEn: COPY.responseTime.en, label: COPY.responseLabel },
            { Icon: MapPinIcon, value: COPY.nationwide.bn, valueEn: COPY.nationwide.en, label: COPY.nationwideLabel },
          ].map(({ Icon, value, valueEn, label }) => (
            <div key={valueEn} className="flex flex-col items-center gap-1 px-2 py-5 text-center">
              <Icon className="text-emergency-ink size-5" />
              <span className="text-sm font-semibold sm:text-base">
                {locale === "bn" ? value : valueEn}
              </span>
              <span className="text-muted text-xs">{t(locale, label)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- Provide */}
      <section className="content-auto mx-auto w-full max-w-4xl px-4 py-12 md:py-16">
        <h2 className="text-2xl font-semibold md:text-3xl">{t(locale, COPY.provideTitle)}</h2>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2">
          {PROVIDE.map(({ Icon, title, body }) => (
            <li key={title.en} className="border-border bg-surface-raised rounded-xl border p-5">
              <span className="bg-emergency-soft text-emergency-ink flex size-10 items-center justify-center rounded-lg">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-3 font-semibold">{t(locale, title)}</h3>
              <p className="text-muted mt-1 text-sm">{t(locale, body)}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------ Call ready */}
      <section className="content-auto bg-surface border-border border-y">
        <div className="mx-auto w-full max-w-4xl px-4 py-12 md:py-16">
          <h2 className="flex items-center gap-3 text-2xl font-semibold md:text-3xl">
            <ChecklistIcon className="text-emergency-ink size-7 shrink-0" />
            {t(locale, COPY.callReadyTitle)}
          </h2>
          <p className="text-muted mt-2">{t(locale, COPY.callReadyLead)}</p>

          <ol className="mt-6 space-y-3">
            {CALL_READY.map((item, index) => (
              <li
                key={item.en}
                className="border-border bg-surface-raised flex gap-3 rounded-lg border p-4"
              >
                <span className="bg-emergency text-emergency-fg flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                  {locale === "bn" ? ["১", "২", "৩", "৪"][index] : index + 1}
                </span>
                <span>{t(locale, item)}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* -------------------------------------------------------- Coverage */}
      <section className="content-auto mx-auto w-full max-w-4xl px-4 py-12 md:py-16">
        <h2 className="text-2xl font-semibold md:text-3xl">{t(locale, COPY.coverageTitle)}</h2>
        <ul className="mt-6 space-y-3">
          {COVERAGE.map((c) => (
            <li key={c.en} className="flex items-start gap-3">
              <MapPinIcon className="text-emergency-ink mt-0.5 size-5 shrink-0" />
              <span>{t(locale, c)}</span>
            </li>
          ))}
        </ul>

        <div className="border-border bg-surface-raised mt-8 rounded-xl border p-5">
          <h3 className="font-semibold">{t(locale, COPY.ratingTitle)}</h3>
          <p className="mt-1 flex items-center gap-2">
            <span aria-hidden="true" className="text-accent">★★★★★</span>
            <span className="text-muted text-sm">{t(locale, COPY.ratingBody)}</span>
          </p>
          <a
            href={GBP_URL}
            rel="noopener"
            className="text-brand mt-3 inline-block font-semibold hover:underline"
          >
            {t(locale, COPY.viewOnGoogle)} →
          </a>
        </div>

        <p className="text-muted mt-6 flex items-center gap-2 text-sm">
          <ShieldIcon className="size-4 shrink-0" />
          {t(locale, COPY.licensed)}
        </p>
      </section>

      {/* -------------------------------------------------------- Last CTA */}
      <section className="bg-emergency text-emergency-fg">
        <div className="mx-auto w-full max-w-4xl px-4 py-12 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">{t(locale, COPY.bottomTitle)}</h2>
          <p className="mt-2 text-white/90">{t(locale, COPY.bottomLead)}</p>
          <a
            href={`tel:${SITE.phone}`}
            aria-label={t(locale, COPY.callAria)}
            className="text-emergency-ink mt-6 inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-white px-8 text-xl font-bold shadow-lg transition active:scale-[0.98]"
          >
            <PhoneIcon className="size-6" />
            {t(locale, SITE.phoneDisplay)}
          </a>
        </div>
      </section>
    </PageShell>
  );
}
