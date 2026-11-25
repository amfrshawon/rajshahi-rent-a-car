import Image from "next/image";
import { ClockIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { asset } from "@/config/deploy";
import { SITE } from "@/config/site";
import { type Locale, localeDigits, t } from "@/lib/locale";

const GBP_URL = "https://share.google/52MSxbL6RCxlZ1huf";

const SERVICES = [
  {
    title: { bn: "এসি অ্যাম্বুলেন্স", en: "AC ambulance" },
    body: { bn: "শীতাতপ নিয়ন্ত্রিত গাড়িতে রোগী পরিবহন। বুকিংয়ের সময় এসি গাড়ির প্রাপ্যতা জেনে নিন।", en: "Patient transport in an air-conditioned vehicle. Ask dispatch to confirm availability for your trip." },
  },
  {
    title: { bn: "নন-এসি অ্যাম্বুলেন্স", en: "Non-AC ambulance" },
    body: { bn: "এসি ছাড়া রোগী পরিবহনের ব্যবস্থা। গন্তব্য জানিয়ে গাড়ির প্রাপ্যতা ও ভাড়া জেনে নিন।", en: "Patient transport in a vehicle without air conditioning. Share your destination to confirm availability and fare." },
  },
  {
    title: { bn: "অক্সিজেনসহ অ্যাম্বুলেন্স", en: "Ambulance with oxygen support" },
    body: { bn: "যাত্রার জন্য অক্সিজেন দরকার হলে বুকিংয়ের সময় জানিয়ে অক্সিজেনসহ গাড়ির প্রাপ্যতা নিশ্চিত করুন।", en: "If oxygen is needed during the trip, tell dispatch when booking so they can confirm an equipped vehicle." },
  },
];

const BOOKING_STEPS = [
  { bn: "রোগীকে কোথা থেকে নিতে হবে, সেই ঠিকানা ও কাছের পরিচিত স্থান জানান।", en: "Give the pickup address and a nearby landmark." },
  { bn: "গন্তব্যের ঠিকানা বা হাসপাতালের নাম এবং এসি, নন-এসি বা অক্সিজেনের প্রয়োজন জানান।", en: "Give the destination or receiving hospital and say if you need AC, non-AC, or oxygen support." },
  { bn: "গাড়ির প্রাপ্যতা, পৌঁছানোর আনুমানিক সময় এবং মোট ভাড়া ফোনে নিশ্চিত করুন।", en: "Confirm the available vehicle, estimated pickup time, and total fare by phone." },
];

const FARE_DETAILS = [
  { bn: "পিকআপের ঠিকানা ও গন্তব্য", en: "Pickup address and destination" },
  { bn: "এসি বা নন-এসি গাড়ির প্রয়োজন", en: "AC or non-AC vehicle preference" },
  { bn: "অক্সিজেন বা বিশেষ কোনো ব্যবস্থার প্রয়োজন", en: "Oxygen or other arrangements to confirm" },
];

const QUESTIONS = [
  {
    question: { bn: "রাজশাহী অ্যাম্বুলেন্স সার্ভিসের ফোন নম্বর কত?", en: "What is the Rajshahi Ambulance Service phone number?" },
    answer: { bn: "বুকিং ও গাড়ির প্রাপ্যতা জানতে ০১৭১৪-৪২৪২৪১ নম্বরে ফোন করুন। ডিসপ্যাচ ২৪ ঘণ্টা চালু।", en: "Call 01714-424241 for booking and vehicle availability. Dispatch is available 24 hours a day." },
  },
  {
    question: { bn: "রাজশাহী মেডিকেল এলাকা থেকে রোগী নেওয়া যাবে?", en: "Can you pick up a patient near Rajshahi Medical?" },
    answer: { bn: "হ্যাঁ। রাজশাহী মেডিকেল এলাকাসহ শহরের বিভিন্ন ঠিকানা থেকে রোগী নেওয়ার ব্যবস্থা আছে। ফোনে হাসপাতালের নাম বা নির্দিষ্ট পিকআপ ঠিকানা জানান।", en: "Yes. We arrange pickup in the Rajshahi Medical area and elsewhere in the city. Give dispatch the hospital name or exact pickup address." },
  },
  {
    question: { bn: "রাজশাহী থেকে ঢাকা অ্যাম্বুলেন্সের ভাড়া কীভাবে জানব?", en: "How do I get a fare for a Rajshahi to Dhaka ambulance?" },
    answer: { bn: "পিকআপের ঠিকানা, ঢাকার গন্তব্য এবং কী ধরনের অ্যাম্বুলেন্স বা সরঞ্জাম দরকার, তা ফোনে জানান। বুকিংয়ের আগে মোট ভাড়া নিশ্চিত করুন।", en: "Call with your Rajshahi pickup point, Dhaka destination, and vehicle or equipment requirements. Confirm the total fare before booking." },
  },
  {
    question: { bn: "রাজশাহী থেকে ঢাকার বাইরে রোগী পরিবহন করা হয়?", en: "Can I arrange a transfer from Rajshahi to a district other than Dhaka?" },
    answer: { bn: "হ্যাঁ। রাজশাহী থেকে বাংলাদেশের যেকোনো জেলায় রোগী পরিবহনের ব্যবস্থা আছে। আপনার রুট ও গাড়ির প্রাপ্যতা ফোনে নিশ্চিত করুন।", en: "Yes. We arrange patient transfers from Rajshahi to destinations across Bangladesh. Call to confirm your route and vehicle availability." },
  },
  {
    question: { bn: "অক্সিজেনসহ অ্যাম্বুলেন্স কীভাবে বুক করব?", en: "How do I book an ambulance with oxygen support?" },
    answer: { bn: "বুকিংয়ের সময় অক্সিজেনের প্রয়োজন জানিয়ে দিন। আপনার যাত্রার জন্য অক্সিজেনসহ গাড়ি পাওয়া যাবে কি না, ডিসপ্যাচ থেকে নিশ্চিত করুন।", en: "Tell dispatch that you need oxygen support when you call. Ask them to confirm an equipped vehicle is available for your trip." },
  },
  {
    question: { bn: "রাতে বা আগে থেকে অ্যাম্বুলেন্স বুক করা যাবে?", en: "Can I book at night or arrange a pickup in advance?" },
    answer: { bn: "ডিসপ্যাচ ২৪ ঘণ্টা চালু। নির্দিষ্ট সময়ে গাড়ি দরকার হলে তারিখ, সময় ও পিকআপের ঠিকানা জানিয়ে আগে ফোন করুন।", en: "Dispatch is available 24/7. If you need a pickup at a specific time, call ahead with the date, time, and pickup address." },
  },
];

const PAGE_LINKS = [
  { id: "ambulance-options", label: { bn: "গাড়ির ধরন", en: "Vehicle options" } },
  { id: "booking-details", label: { bn: "বুকিং", en: "How to book" } },
  { id: "transfer-routes", label: { bn: "সেবার এলাকা", en: "Transfer routes" } },
  { id: "fare-quote", label: { bn: "ভাড়া", en: "Fare quote" } },
  { id: "booking-questions", label: { bn: "সাধারণ প্রশ্ন", en: "FAQ" } },
];

export function AmbulancePage({ locale }: { locale: Locale }) {
  const bn = locale === "bn";
  const name = "Rajshahi Ambulance Service";
  const phone = t(locale, SITE.phoneDisplay);
  const tel = `tel:${SITE.phone}`;
  const url = new URL(bn ? "/ambulance-service/" : "/en/ambulance-service/", SITE.url).href;
  const schema = {
    "@context": "https://schema.org",
    "@type": "EmergencyService",
    "@id": new URL("/ambulance-service/#business", SITE.url).href,
    name,
    alternateName: "রাজশাহী অ্যাম্বুলেন্স সার্ভিস",
    url: new URL("/ambulance-service/", SITE.url).href,
    mainEntityOfPage: url,
    telephone: SITE.phone,
    image: new URL("/images/ambulance/exterior.webp", SITE.url).href,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rajshahi Medical",
      addressLocality: "Rajshahi",
      postalCode: "6200",
      addressCountry: "BD",
    },
    openingHours: "Mo-Su 00:00-23:59",
    areaServed: { "@type": "Country", name: "Bangladesh" },
    sameAs: [GBP_URL],
  };

  return (
    <PageShell locale={locale} mobileAction="ambulance">
      <JsonLd data={schema} />
      <section className="bg-emergency text-emergency-fg">
        <div className="mx-auto grid max-w-6xl items-center gap-7 px-4 py-8 md:grid-cols-[1fr_0.8fr] md:gap-12 md:px-6 md:py-14">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <ClockIcon className="size-5" />
              {bn ? "২৪ ঘণ্টা বুকিং ও ডিসপ্যাচ" : "24-hour booking and dispatch"}
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-5xl">{bn ? "রাজশাহী অ্যাম্বুলেন্স সার্ভিস" : "Ambulance Service in Rajshahi"}</h1>
            <p className="mt-3 max-w-xl text-white md:text-lg">
              {bn ? "রাজশাহী মেডিকেল এলাকা থেকে এসি, নন-এসি ও অক্সিজেনসহ অ্যাম্বুলেন্স বুক করুন। রাজশাহী শহরে এবং ঢাকাসহ সারা দেশে রোগী পরিবহন।" : "Book an AC, non-AC, or oxygen-equipped ambulance from the Rajshahi Medical area for local trips and patient transfers across Bangladesh, including Dhaka."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={tel} className="text-emergency-ink inline-flex min-h-14 items-center gap-3 rounded-lg bg-white px-5 text-xl font-bold">
                <PhoneIcon className="size-6 shrink-0" />
                <span className="sr-only">{bn ? "বুকিংয়ের জন্য কল করুন " : "Call to book "}</span>
                <span dir="ltr">{phone}</span>
              </a>
              <a href={`https://wa.me/${SITE.whatsapp}`} className="inline-flex min-h-14 items-center gap-2 rounded-lg border border-white/70 px-4 font-semibold">
                <WhatsAppIcon className="size-5" />
                {bn ? "হোয়াটসঅ্যাপ" : "WhatsApp"}
              </a>
            </div>
          </div>
          <Image
            src={asset("/images/ambulance/exterior.webp")}
            alt={bn ? "রাজশাহী অ্যাম্বুলেন্স সার্ভিসের গাড়ির সামনের অংশ" : "Front view of a Rajshahi Ambulance Service vehicle"}
            width={960}
            height={1280}
            preload
            unoptimized
            className="aspect-[16/9] w-full rounded-xl object-cover object-[center_66%] md:aspect-[5/4]"
          />
        </div>
      </section>

      <nav aria-label={bn ? "এই পৃষ্ঠার বিভাগসমূহ" : "On this page"} className="border-border bg-surface border-b">
        <ul className="mx-auto flex max-w-6xl flex-wrap gap-x-5 px-4 py-1 md:px-6">
          {PAGE_LINKS.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} className="hover:text-emergency-ink inline-flex min-h-11 items-center text-sm font-semibold underline-offset-4 hover:underline">
                {t(locale, label)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="ambulance-options" className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <h2 className="text-2xl font-bold md:text-3xl">{bn ? "যে ধরনের অ্যাম্বুলেন্স বুক করতে পারবেন" : "Ambulance options"}</h2>
        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {SERVICES.map(({ title, body }) => (
            <li key={title.en} className="border-border bg-surface rounded-xl border p-5">
              <h3 className="text-lg font-bold">{t(locale, title)}</h3>
              <p className="text-muted mt-2">{t(locale, body)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="booking-details" className="border-border bg-surface border-y">
        <div className="mx-auto grid max-w-6xl gap-7 px-4 py-10 md:grid-cols-2 md:items-center md:gap-12 md:px-6 md:py-14">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">{bn ? "অ্যাম্বুলেন্স বুক করতে যা জানাবেন" : "What to tell dispatch"}</h2>
            <ol className="mt-5 space-y-4">
              {BOOKING_STEPS.map((step, index) => (
                <li key={step.en} className="flex items-start gap-3">
                  <span aria-hidden="true" className="bg-emergency text-emergency-fg grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold">{localeDigits(locale, index + 1)}</span>
                  <span>{t(locale, step)}</span>
                </li>
              ))}
            </ol>
          </div>
          <figure>
            <Image
              src={asset("/images/ambulance/interior.webp")}
              alt={bn ? "অ্যাম্বুলেন্সের ভেতরে স্ট্রেচার ও পাশের আসন" : "Ambulance interior showing a stretcher and bench seating"}
              width={960}
              height={1280}
              unoptimized
              className="aspect-[4/3] w-full rounded-xl object-cover object-[center_64%]"
            />
            <figcaption className="text-muted mt-2 text-sm">{bn ? "আমাদের একটি অ্যাম্বুলেন্সের ভেতরের দৃশ্য" : "Inside one of our ambulances"}</figcaption>
          </figure>
        </div>
      </section>

      <section id="transfer-routes" className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <h2 className="text-2xl font-bold md:text-3xl">{bn ? "হাসপাতাল ও দূরপাল্লায় রোগী পরিবহন" : "Hospital transfers and long-distance trips"}</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-bold">{bn ? "রাজশাহীতে স্থানীয় ও হাসপাতাল ট্রান্সফার" : "Local and hospital-to-hospital transfers"}</h3>
            <p className="text-muted mt-2">{bn ? "রাজশাহী মেডিকেল এলাকা ও শহরের অন্য ঠিকানা থেকে রোগী নেওয়া হয়। এক হাসপাতাল থেকে অন্য হাসপাতালে নিতে হলে দুটি হাসপাতালের নাম ফোনে জানান।" : "Arrange pickup near Rajshahi Medical or elsewhere in the city. For hospital-to-hospital transfers, tell dispatch the names of both hospitals."}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">{bn ? "রাজশাহী থেকে ঢাকা ও সারা বাংলাদেশ" : "Rajshahi to Dhaka and across Bangladesh"}</h3>
            <p className="text-muted mt-2">{bn ? "রাজশাহী থেকে ঢাকাসহ বাংলাদেশের যেকোনো জেলায় রোগী পরিবহনের ব্যবস্থা আছে। যাত্রার আগে গাড়ি, প্রয়োজনীয় সরঞ্জাম ও মোট ভাড়া নিশ্চিত করুন।" : "We arrange patient transfers from Rajshahi to Dhaka and other destinations across Bangladesh. Confirm the vehicle, required equipment, and total fare before departure."}</p>
          </div>
        </div>
        <a href={GBP_URL} className="text-emergency-ink mt-5 inline-flex min-h-11 items-center gap-2 font-semibold underline">
          <MapPinIcon className="size-5 shrink-0" />
          {bn ? "গুগল ম্যাপে রাজশাহী অ্যাম্বুলেন্স সার্ভিস দেখুন" : "Find Rajshahi Ambulance Service on Google Maps"}
        </a>
      </section>

      <section id="fare-quote" className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-6 md:pb-14">
        <div className="border-border bg-surface grid gap-6 rounded-xl border p-5 md:grid-cols-2 md:gap-10 md:p-8">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">{bn ? "অ্যাম্বুলেন্সের ভাড়া জেনে নিন" : "Get an ambulance fare quote"}</h2>
            <p className="text-muted mt-3">
              {bn ? "রাজশাহী শহরের ভেতরে বা ঢাকাসহ দূরপাল্লার যাত্রার জন্য ফোনে মোট ভাড়া জেনে নিন। বুকিংয়ের আগে কী কী ভাড়ার মধ্যে অন্তর্ভুক্ত, তা নিশ্চিত করুন।" : "Call for a total quote for local trips or longer transfers, including Rajshahi to Dhaka. Before booking, ask what is included in the quoted fare."}
            </p>
          </div>
          <div>
            <h3 className="font-bold">{bn ? "ভাড়া জানতে যা বলবেন" : "Have these details ready"}</h3>
            <ul className="text-muted mt-2 list-disc space-y-2 pl-5">
              {FARE_DETAILS.map((detail) => <li key={detail.en}>{t(locale, detail)}</li>)}
            </ul>
            <a href={tel} className="text-emergency-ink mt-3 inline-flex min-h-11 items-center gap-2 font-semibold underline">
              <PhoneIcon className="size-5 shrink-0" />
              {bn ? "ভাড়া জানতে কল করুন" : "Call for a quote"}
            </a>
          </div>
        </div>
      </section>

      <section id="booking-questions" className="border-border bg-surface border-y">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <h2 className="text-2xl font-bold md:text-3xl">{bn ? "অ্যাম্বুলেন্স বুকিংয়ের সাধারণ প্রশ্ন" : "Ambulance booking questions"}</h2>
          <dl className="mt-5 grid gap-5 md:grid-cols-2">
            {QUESTIONS.map(({ question, answer }) => (
              <div key={question.en} className="border-border border-t pt-4">
                <dt className="font-bold">{t(locale, question)}</dt>
                <dd className="text-muted mt-2">{t(locale, answer)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-emergency text-emergency-fg px-4 py-9 text-center">
        <h2 className="text-2xl font-bold">{bn ? "গাড়ির প্রাপ্যতা ও ভাড়া জানতে কল করুন" : "Call to confirm availability and fare"}</h2>
        <a href={tel} className="text-emergency-ink mt-4 inline-flex min-h-14 items-center gap-3 rounded-lg bg-white px-6 text-xl font-bold">
          <PhoneIcon className="size-6" />
          <span dir="ltr">{phone}</span>
        </a>
      </section>
    </PageShell>
  );
}
