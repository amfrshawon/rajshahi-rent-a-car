import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { PhotoSlot } from "@/components/placeholder";
import { SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

/*
 * Kept to facts published on the existing site: location, fleet, 24/7
 * operation, ambulance service, and that the business serves both local
 * customers and visitors. No founding year, staff count or customer
 * statistics — none are on record.
 */

const COPY = {
  title: { bn: "আমাদের সম্পর্কে", en: "About us" },
  lead: {
    bn: "রাজশাহী শহরের কাদিরগঞ্জে আমাদের অফিস। স্থানীয় পরিবার থেকে দেশ-বিদেশের ভ্রমণকারী, সবার জন্য ড্রাইভারসহ গাড়ি ভাড়া।",
    en: "Our office is in Kadirgonj, Rajshahi. We rent cars with drivers to local families and to visitors from across the country and abroad.",
  },
  whatTitle: { bn: "আমরা যা করি", en: "What we do" },
  whereTitle: { bn: "কোথায় পাবেন", en: "Where to find us" },
  address: { bn: "ঠিকানা", en: "Address" },
  phone: { bn: "ফোন", en: "Phone" },
  hours: { bn: "সময়", en: "Hours" },
  callAria: { bn: "কল করুন", en: "Call" },
  shot: {
    bn: "আমাদের একজন ড্রাইভার যাত্রীর জন্য পেছনের দরজা খুলে দিচ্ছেন",
    en: "One of our drivers opening the rear door for a passenger",
  },
} as const;

const WHAT = [
  {
    bn: "শহরের ভেতরে ও বাইরে দিনভিত্তিক গাড়ি ভাড়া, ড্রাইভারসহ।",
    en: "Day-rate car rental with a driver, in the city and beyond.",
  },
  {
    bn: "পুঠিয়া, বাঘা, নাটোরসহ আশেপাশের এলাকায় একদিনের ভ্রমণ।",
    en: "Day trips to Puthia, Bagha, Natore and the surrounding area.",
  },
  {
    bn: "ঢাকাসহ দূরের গন্তব্যে লম্বা ট্রিপ।",
    en: "Long-distance trips, including to Dhaka.",
  },
  {
    bn: "২৪ ঘণ্টা অ্যাম্বুলেন্স সার্ভিস।",
    en: "Round-the-clock ambulance service.",
  },
] as const;

export function AboutPage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale}>
      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)} />

      <div className="wrap grid gap-12 pb-20 md:pb-28 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div>
          <section aria-labelledby="what">
            <h2 id="what" className="text-section">{t(locale, COPY.whatTitle)}</h2>
            <ul className="mt-6">
              {WHAT.map((item) => (
                <li key={item.en} className="border-line flex gap-3 border-b py-4 md:text-lg">
                  <span aria-hidden="true" className="bg-leaf mt-3 size-1.5 shrink-0 rounded-full" />
                  {t(locale, item)}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="where" className="mt-16">
            <h2 id="where" className="text-section">{t(locale, COPY.whereTitle)}</h2>
            <dl className="mt-6 grid gap-x-8 sm:grid-cols-3">
              <div className="border-line border-b py-4">
                <dt className="text-ink-soft text-sm">{t(locale, COPY.address)}</dt>
                <dd className="mt-1">{t(locale, SITE.address)}</dd>
              </div>
              <div className="border-line border-b py-4">
                <dt className="text-ink-soft text-sm">{t(locale, COPY.phone)}</dt>
                <dd>
                  <a
                    href={`tel:${SITE.phone}`}
                    aria-label={`${t(locale, SITE.phoneDisplay)} — ${t(locale, COPY.callAria)}`}
                    className="type-display inline-flex min-h-11 items-center hover:underline"
                  >
                    {t(locale, SITE.phoneDisplay)}
                  </a>
                </dd>
              </div>
              <div className="border-line border-b py-4">
                <dt className="text-ink-soft text-sm">{t(locale, COPY.hours)}</dt>
                <dd className="mt-1">{t(locale, SITE.hours)}</dd>
              </div>
            </dl>
          </section>
        </div>
        <PhotoSlot shot={t(locale, COPY.shot)} className="lg:sticky lg:top-28 lg:self-start" />
      </div>
    </PageShell>
  );
}
