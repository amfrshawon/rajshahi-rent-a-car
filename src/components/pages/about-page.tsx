import { BookingCta } from "@/components/booking-cta";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

/*
 * Kept to facts published on the existing site: location, fleet, 24/7
 * operation, ambulance service, and that the business serves both local
 * customers and visitors. No founding year, staff count or customer
 * statistics — none are on record.
 */

const COPY = {
  title: { bn: "আমাদের সম্পর্কে", en: "About Us" },
  lead: {
    bn: "রাজশাহী শহরের কাদিরগঞ্জে আমাদের অফিস। স্থানীয় পরিবার থেকে শুরু করে দেশ-বিদেশের ভ্রমণকারী — সবার জন্য গাড়ি ভাড়ার সেবা।",
    en: "Our office is in Kadirgonj, Rajshahi. We rent to local families and to visitors from across the country and abroad.",
  },
  whatTitle: { bn: "আমরা যা করি", en: "What we do" },
  whereTitle: { bn: "কোথায় পাবেন", en: "Where to find us" },
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

      <section className="mx-auto w-full max-w-3xl px-4 py-12">
        <h2 className="text-2xl font-semibold">{t(locale, COPY.whatTitle)}</h2>
        <ul className="mt-4 space-y-3">
          {WHAT.map((item) => (
            <li key={item.en} className="border-border bg-surface-raised rounded-lg border p-4">
              {t(locale, item)}
            </li>
          ))}
        </ul>

        <h2 className="mt-12 text-2xl font-semibold">{t(locale, COPY.whereTitle)}</h2>
        <address className="text-muted mt-3 not-italic">
          {t(locale, SITE.address)}
          <br />
          <a href={`tel:${SITE.phone}`} className="hover:text-fg">
            {t(locale, SITE.phoneDisplay)}
          </a>
          <br />
          {t(locale, SITE.hours)}
        </address>
      </section>

      <BookingCta locale={locale} />
    </PageShell>
  );
}
