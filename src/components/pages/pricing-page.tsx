import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { FLEET } from "@/config/site";
import { bookingHref } from "@/config/trips";
import { type Locale, formatTaka, localeDigits, t } from "@/lib/locale";

/*
 * Only the published daily rates appear here. Fuel policy, driver allowance,
 * overtime, outstation rates and hourly hire are NOT published anywhere on the
 * existing site, so they are deliberately absent rather than invented.
 * See docs/PLAN.md §12 — this page should be revisited once the owner
 * confirms a full rate card.
 */

const COPY = {
  title: { bn: "ভাড়ার তালিকা", en: "Pricing" },
  lead: {
    bn: "রাজশাহী শহরের ভেতরে দিনভিত্তিক ভাড়া। শহরের বাইরে বা লম্বা ট্রিপের ভাড়া দূরত্ব অনুযায়ী, ফোনে জানানো হয়।",
    en: "Day rates within Rajshahi city. Out-of-town and long trips are quoted by distance, on the phone.",
  },
  caption: { bn: "শহরের ভেতরে দিনপ্রতি ভাড়া, ড্রাইভারসহ", en: "Day rates within the city, with a driver" },
  vehicle: { bn: "গাড়ি", en: "Car" },
  type: { bn: "ধরন", en: "Type" },
  seats: { bn: "আসন", en: "Seats" },
  perDay: { bn: "দিনপ্রতি", en: "Per day" },
  book: { bn: "বুক করুন", en: "Book" },
  askTitle: { bn: "যা ফোনে ঠিক হয়", en: "Settled on the phone" },
  askLead: {
    bn: "এগুলো ট্রিপ অনুযায়ী আলাদা, তাই বুকিংয়ের আগেই পরিষ্কার করে বলে দেওয়া হয় — পরে কোনো লুকানো খরচ নেই।",
    en: "These vary by trip, so they are agreed before you book. There are no hidden costs afterwards.",
  },
} as const;

const ASK = [
  { bn: "জ্বালানি খরচ ভাড়ার সাথে, না আলাদা", en: "Whether fuel is included or billed separately" },
  { bn: "শহরের বাইরে গেলে ভাড়া কীভাবে হিসাব হবে", en: "How out-of-town trips are calculated" },
  { bn: "ড্রাইভারের খাওয়া ও থাকার খরচ", en: "Driver meals and overnight allowance" },
  { bn: "ঠিক করা সময়ের বেশি হলে অতিরিক্ত চার্জ", en: "Overtime beyond the agreed hours" },
] as const;

export function PricingPage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale}>
      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)} />

      <div className="wrap pb-20 md:pb-28">
        <table className="w-full max-w-4xl border-collapse text-start">
          <caption className="text-ink-soft mb-3 text-start text-sm">{t(locale, COPY.caption)}</caption>
          <thead>
            <tr className="border-ink border-b-2 text-sm">
              <th scope="col" className="py-3 pe-4 text-start">{t(locale, COPY.vehicle)}</th>
              <th scope="col" className="hidden py-3 pe-4 text-start sm:table-cell">{t(locale, COPY.type)}</th>
              <th scope="col" className="hidden py-3 pe-4 text-start sm:table-cell">{t(locale, COPY.seats)}</th>
              <th scope="col" className="py-3 text-end">{t(locale, COPY.perDay)}</th>
            </tr>
          </thead>
          <tbody>
            {FLEET.map((v) => (
              <tr key={v.slug} className="border-line border-b">
                <th scope="row" className="py-5 pe-4 text-start align-middle">
                  <span className="type-display block text-lg md:text-xl">{v.name}</span>
                  <span className="text-ink-soft type-text block text-sm sm:hidden">
                    {t(locale, v.type)} · {localeDigits(locale, v.seats)} {t(locale, COPY.seats)}
                  </span>
                  <Link
                    href={bookingHref(locale, { vehicle: v.slug })}
                    className="text-leaf type-text inline-flex min-h-11 min-w-11 items-center text-sm underline-offset-4 hover:underline"
                  >
                    {t(locale, COPY.book)}
                  </Link>
                </th>
                <td className="text-ink-soft hidden py-5 pe-4 align-middle sm:table-cell">{t(locale, v.type)}</td>
                <td className="text-ink-soft hidden py-5 pe-4 align-middle sm:table-cell">{localeDigits(locale, v.seats)}</td>
                <td className="figures py-5 text-end align-middle text-2xl whitespace-nowrap md:text-3xl">
                  ৳{formatTaka(locale, v.pricePerDay)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <section aria-labelledby="ask" className="mt-16 max-w-3xl md:mt-24">
          <h2 id="ask" className="text-section">{t(locale, COPY.askTitle)}</h2>
          <p className="text-ink-soft mt-3">{t(locale, COPY.askLead)}</p>
          <ul className="mt-6">
            {ASK.map((item) => (
              <li key={item.en} className="border-line flex gap-3 border-b py-4">
                <span aria-hidden="true" className="bg-leaf mt-3 size-1.5 shrink-0 rounded-full" />
                {t(locale, item)}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
