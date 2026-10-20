import { BookingCta } from "@/components/booking-cta";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { FLEET } from "@/config/site";
import { formatTaka, type Locale, t } from "@/lib/locale";

/*
 * This page positions the EXISTING fleet for wedding hire. It deliberately
 * makes no claim about car decoration, packages or wedding-specific pricing,
 * none of which the owner has confirmed. Add those only once confirmed.
 */

const COPY = {
  title: { bn: "বিয়ের জন্য গাড়ি ভাড়া", en: "Wedding Car Hire" },
  lead: {
    bn: "বর-কনের জন্য প্রাইভেট কার আর অতিথিদের জন্য মাইক্রোবাস — একসাথে বুক করা যায়। বিয়ের মৌসুমে আগেভাগে বুকিং দেওয়াই ভালো।",
    en: "A sedan for the couple and a microbus for guests, bookable together. Book early during wedding season.",
  },
  suitedTitle: { bn: "কোন গাড়ি কীসের জন্য", en: "Which vehicle for what" },
  couple: { bn: "বর-কনের গাড়ি", en: "For the couple" },
  guests: { bn: "অতিথি পরিবহন", en: "Guest transport" },
  perDay: { bn: "প্রতিদিন", en: "per day" },
  notesTitle: { bn: "বুকিংয়ের আগে", en: "Before you book" },
} as const;

const NOTES = [
  { bn: "তারিখ ও সময় আগেই জানিয়ে রাখুন — বিয়ের মৌসুমে গাড়ি দ্রুত বুক হয়ে যায়।", en: "Share the date and time early — vehicles book out fast in season." },
  { bn: "কয়টি গাড়ি লাগবে ও কতজন অতিথি, তা জানালে সঠিক পরামর্শ দেওয়া যায়।", en: "Tell us how many vehicles and guests so we can advise properly." },
  { bn: "গায়ে হলুদ, বিয়ে ও বৌভাত — আলাদা দিনের জন্য আলাদা বুকিং নেওয়া যায়।", en: "Separate days can be booked separately for each ceremony." },
] as const;

export function WeddingCarPage({ locale }: { locale: Locale }) {
  const sedans = FLEET.filter((v) => v.seats <= 5);
  const vans = FLEET.filter((v) => v.seats > 5);
  const groups = [
    { heading: COPY.couple, vehicles: sedans },
    { heading: COPY.guests, vehicles: vans },
  ];

  return (
    <PageShell locale={locale}>
      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)} />

      <section className="mx-auto w-full max-w-4xl px-4 py-8 md:py-12">
        <h2 className="text-2xl font-bold md:text-3xl">{t(locale, COPY.suitedTitle)}</h2>

        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          {groups.map(({ heading, vehicles }) => (
            <div key={heading.en}>
              <h3 className="text-muted text-sm font-semibold">{t(locale, heading)}</h3>
              <ul className="border-border mt-3 border-t">
                {vehicles.map((v) => (
                  <li
                    key={v.slug}
                    className="border-border flex items-baseline justify-between gap-3 border-b py-3"
                  >
                    <span className="font-medium">{v.name}</span>
                    <span className="text-leaf tnum font-bold whitespace-nowrap">
                      ৳{formatTaka(locale, v.pricePerDay)}
                      <span className="text-muted text-sm font-normal"> {t(locale, COPY.perDay)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold md:text-3xl">{t(locale, COPY.notesTitle)}</h2>
        <ul className="border-border mt-5 border-t">
          {NOTES.map((n) => (
            <li key={n.en} className="border-border border-b py-3">
              {t(locale, n)}
            </li>
          ))}
        </ul>
      </section>

      <BookingCta locale={locale} />
    </PageShell>
  );
}
