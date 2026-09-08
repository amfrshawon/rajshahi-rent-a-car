import { BookingCta } from "@/components/booking-cta";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { FLEET } from "@/config/site";
import { formatTaka, type Locale, t } from "@/lib/locale";

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
    bn: "রাজশাহী শহরের ভেতরে দিনভিত্তিক ভাড়া। শহরের বাইরে বা লম্বা ট্রিপের ভাড়া দূরত্ব অনুযায়ী নির্ধারিত হয়।",
    en: "Day rates within Rajshahi city. Outstation and long trips are quoted by distance.",
  },
  vehicle: { bn: "গাড়ি", en: "Vehicle" },
  type: { bn: "ধরন", en: "Type" },
  seats: { bn: "আসন", en: "Seats" },
  perDay: { bn: "দৈনিক ভাড়া", en: "Day rate" },
  askTitle: { bn: "যা কলে জেনে নেবেন", en: "Confirmed when you call" },
  askLead: {
    bn: "ট্রিপ অনুযায়ী নিচের বিষয়গুলো আগেই পরিষ্কার করে জানিয়ে দেওয়া হয় — কোনো লুকানো খরচ নেই।",
    en: "These are agreed up front for your specific trip — there are no hidden costs.",
  },
} as const;

const ASK = [
  { bn: "জ্বালানি খরচ কার — ভাড়ার সাথে না আলাদা", en: "Whether fuel is included or billed separately" },
  { bn: "শহরের বাইরে গেলে ভাড়া কীভাবে হিসাব হবে", en: "How outstation trips are calculated" },
  { bn: "ড্রাইভারের খাওয়া ও থাকার খরচ", en: "Driver meals and overnight allowance" },
  { bn: "নির্ধারিত সময়ের বেশি হলে অতিরিক্ত চার্জ", en: "Overtime beyond the agreed hours" },
] as const;

export function PricingPage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale}>
      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)} />

      <section className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="border-border overflow-x-auto rounded-xl border">
          <table className="w-full border-collapse text-left">
            <thead className="bg-surface">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">{t(locale, COPY.vehicle)}</th>
                <th scope="col" className="px-4 py-3 font-semibold">{t(locale, COPY.type)}</th>
                <th scope="col" className="px-4 py-3 font-semibold">{t(locale, COPY.seats)}</th>
                <th scope="col" className="px-4 py-3 font-semibold">{t(locale, COPY.perDay)}</th>
              </tr>
            </thead>
            <tbody>
              {FLEET.map((v) => (
                <tr key={v.slug} className="border-border border-t">
                  <th scope="row" className="px-4 py-3 font-medium">{v.name}</th>
                  <td className="text-muted px-4 py-3">{t(locale, v.type)}</td>
                  <td className="text-muted px-4 py-3">{formatTaka(locale, v.seats)}</td>
                  <td className="text-brand px-4 py-3 font-semibold whitespace-nowrap">
                    ৳{formatTaka(locale, v.pricePerDay)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 text-2xl font-semibold">{t(locale, COPY.askTitle)}</h2>
        <p className="text-muted mt-2">{t(locale, COPY.askLead)}</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {ASK.map((item) => (
            <li key={item.en} className="border-border bg-surface-raised rounded-lg border p-4">
              {t(locale, item)}
            </li>
          ))}
        </ul>
      </section>

      <BookingCta locale={locale} />
    </PageShell>
  );
}
