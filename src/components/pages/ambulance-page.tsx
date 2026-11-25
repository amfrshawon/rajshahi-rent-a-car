import styles from "./ambulance-page.module.css";
import Image from "next/image";
import { ClockIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { asset, href } from "@/config/deploy";
import { route } from "@/config/routes";
import { SITE } from "@/config/site";
import { type Locale, localeDigits, t } from "@/lib/locale";

const GBP_URL = SITE.ambulance.maps;

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

const FARE_ROUTES = [
  {
    title: { bn: "রাজশাহী শহরের ভেতরে", en: "Within Rajshahi city" },
    details: { bn: "পিকআপের ঠিকানা ও গন্তব্য বলুন। এসি বা নন-এসি গাড়ির ভাড়া এবং অপেক্ষার জন্য কোনো অতিরিক্ত চার্জ আছে কি না, জেনে নিন।", en: "Share both addresses. Ask for the AC or non-AC fare and whether waiting would cost extra." },
  },
  {
    title: { bn: "হাসপাতাল থেকে হাসপাতালে", en: "Hospital-to-hospital" },
    details: { bn: "দুই হাসপাতালের নাম, পিকআপের ওয়ার্ড বা গেট এবং অক্সিজেনের প্রয়োজন জানান। মোট ভাড়ায় কী অন্তর্ভুক্ত, তা জেনে নিন।", en: "Give both hospital names, the pickup ward or gate, and any oxygen requirement. Ask what the total includes." },
  },
  {
    title: { bn: "রাজশাহী থেকে ঢাকা", en: "Rajshahi to Dhaka" },
    details: { bn: "ঢাকার হাসপাতাল বা ঠিকানা জানান। শুধু যাওয়া নাকি ফেরার ব্যবস্থাও দরকার, তা বলুন। টোল, অপেক্ষা ও অক্সিজেনের খরচ মোট ভাড়ায় আছে কি না, নিশ্চিত করুন।", en: "Give the Dhaka hospital or address and say whether you need a one-way or return trip. Confirm whether tolls, waiting, and oxygen are included." },
  },
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
  const phone = t(locale, SITE.ambulance.phoneDisplay);
  const tel = `tel:${SITE.ambulance.phone}`;
  const url = new URL(bn ? "/ambulance-service/" : "/en/ambulance-service/", SITE.url).href;
  const schema = {
    "@context": "https://schema.org",
    "@type": "EmergencyService",
    "@id": new URL("/ambulance-service/#business", SITE.url).href,
    name,
    alternateName: "রাজশাহী অ্যাম্বুলেন্স সার্ভিস",
    url: new URL("/ambulance-service/", SITE.url).href,
    mainEntityOfPage: url,
    telephone: SITE.ambulance.phone,
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
      <section className={styles.hero}>
        <div className="mx-auto grid max-w-6xl items-center gap-7 px-4 py-8 md:grid-cols-[1fr_0.85fr] md:gap-12 md:px-6 md:py-14">
          <div className={styles.intro}>
            <p className={styles.hours}>
              <ClockIcon className="size-5" />
              {bn ? "২৪ ঘণ্টা বুকিং ও ডিসপ্যাচ" : "24-hour booking and dispatch"}
            </p>
            <h1 className={styles.title}>{bn ? "রাজশাহী অ্যাম্বুলেন্স সার্ভিস" : "Ambulance Service in Rajshahi"}</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200 md:text-lg">
              {bn ? "রাজশাহী মেডিকেল এলাকা থেকে এসি, নন-এসি ও অক্সিজেনসহ অ্যাম্বুলেন্স বুক করুন। রাজশাহী শহরে এবং ঢাকাসহ সারা দেশে রোগী পরিবহন।" : "Book an AC, non-AC, or oxygen-equipped ambulance from the Rajshahi Medical area for local trips and patient transfers across Bangladesh, including Dhaka."}
            </p>
            <div className={styles.actions}>
              <a href={tel} className={styles.call}>
                <PhoneIcon className="size-6 shrink-0" />
                <span className="sr-only">{bn ? "বুকিংয়ের জন্য কল করুন " : "Call to book "}</span>
                <span dir="ltr">{phone}</span>
              </a>
              <a href={`https://wa.me/${SITE.ambulance.whatsapp}`} className={styles.message}>
                <WhatsAppIcon className="size-5" />
                {bn ? "হোয়াটসঅ্যাপ" : "WhatsApp"}
              </a>
            </div>
          </div>
          <figure className={styles.vehicle}>
            <Image
              src={asset("/images/ambulance/exterior.webp")}
              alt={bn ? "রাজশাহী অ্যাম্বুলেন্স সার্ভিসের গাড়ির সামনের অংশ" : "Front view of a Rajshahi Ambulance Service vehicle"}
              width={960}
              height={1280}
              preload
              unoptimized
              className={styles.exterior}
            />
            <figcaption className={styles.caption}><MapPinIcon className="size-4" />{bn ? "রাজশাহী মেডিকেল এলাকা" : "Rajshahi Medical area"}</figcaption>
          </figure>
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

      <section aria-labelledby="dispatch-summary" className="mx-auto w-full max-w-6xl px-4 pt-8 md:px-6 md:pt-10">
        <div className={styles.summary}>
          <h2 id="dispatch-summary" className="text-xl font-bold md:text-2xl">
            {bn ? "রাজশাহী অ্যাম্বুলেন্স সার্ভিসের ফোন নম্বর" : "Rajshahi Ambulance Service phone number"}
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-muted text-sm">{bn ? "২৪ ঘণ্টার বুকিং নম্বর" : "24-hour booking line"}</dt>
              <dd><a href={tel} className="text-emergency-ink inline-flex min-h-11 items-center font-bold underline">{bn ? "০১৭১৪-৪২৪২৪১" : "01714-424241"}</a></dd>
            </div>
            <div>
              <dt className="text-muted text-sm">{bn ? "পিকআপ এলাকা" : "Pickup area"}</dt>
              <dd className="mt-1 font-semibold">{bn ? "রাজশাহী মেডিকেল এলাকা ও রাজশাহী শহর" : "Rajshahi Medical area and Rajshahi city"}</dd>
            </div>
            <div>
              <dt className="text-muted text-sm">{bn ? "গাড়ির বিকল্প" : "Vehicle options"}</dt>
              <dd className="mt-1 font-semibold">{bn ? "এসি, নন-এসি ও অক্সিজেনসহ" : "AC, non-AC, and oxygen support"}</dd>
            </div>
            <div>
              <dt className="text-muted text-sm">{bn ? "রোগী পরিবহনের গন্তব্য" : "Transfer destinations"}</dt>
              <dd className="mt-1 font-semibold">{bn ? "রাজশাহী থেকে ঢাকাসহ সারা বাংলাদেশ" : "From Rajshahi to Dhaka and across Bangladesh"}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="ambulance-options" className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <h2 className="text-2xl font-bold md:text-3xl">{bn ? "যে ধরনের অ্যাম্বুলেন্স বুক করতে পারবেন" : "Ambulance options"}</h2>
        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {SERVICES.map(({ title, body }) => (
            <li key={title.en} className={styles.service}>
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
        <a href={href(route(locale, "ambulanceRmch"))} className="text-emergency-ink mt-4 flex w-fit min-h-11 items-center font-semibold underline">
          {bn ? "রাজশাহী মেডিকেল থেকে পিকআপের নির্দেশনা" : "Pickup guide for Rajshahi Medical"}
        </a>
        <a href={GBP_URL} className="text-emergency-ink mt-5 inline-flex min-h-11 items-center gap-2 font-semibold underline">
          <MapPinIcon className="size-5 shrink-0" />
          {bn ? "গুগল ম্যাপে রাজশাহী অ্যাম্বুলেন্স সার্ভিস দেখুন" : "Find Rajshahi Ambulance Service on Google Maps"}
        </a>
      </section>

      <section id="fare-quote" className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-6 md:pb-14">
        <div className="border-border bg-surface rounded-xl border p-5 md:p-8">
          <h2 className="text-2xl font-bold md:text-3xl">{bn ? "রাজশাহী অ্যাম্বুলেন্স ভাড়া কীভাবে জানবেন" : "How to get an ambulance fare in Rajshahi"}</h2>
          <p className="text-muted mt-3">{bn ? "বুকিংয়ের আগে আপনার রুট, গাড়ির ধরন ও প্রয়োজনীয় ব্যবস্থা জানিয়ে মোট ভাড়া নিশ্চিত করুন।" : "Before booking, share your route, vehicle preference, and requirements to confirm the total fare."}</p>
          <ul className="mt-5 grid gap-3 md:grid-cols-3">
            {FARE_ROUTES.map(({ title, details }) => (
              <li key={title.en} className="border-border bg-bg rounded-lg border p-4">
                <h3 className="font-bold">{t(locale, title)}</h3>
                <p className="text-muted mt-2 text-sm">{t(locale, details)}</p>
              </li>
            ))}
          </ul>
          <a href={tel} className="text-emergency-ink mt-3 inline-flex min-h-11 items-center gap-2 font-semibold underline">
            <PhoneIcon className="size-5 shrink-0" />
            {bn ? "ভাড়া জানতে কল করুন" : "Call for a quote"}
          </a>
        </div>
      </section>

      <section id="booking-questions" className="border-border bg-surface border-y">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <h2 className="text-2xl font-bold md:text-3xl">{bn ? "অ্যাম্বুলেন্স বুকিংয়ের সাধারণ প্রশ্ন" : "Ambulance booking questions"}</h2>
          <div className={styles.questions}>
            {QUESTIONS.map(({ question, answer }) => (
              <details key={question.en}>
                <summary>{t(locale, question)}</summary>
                <p>{t(locale, answer)}</p>
              </details>
            ))}
          </div>
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
