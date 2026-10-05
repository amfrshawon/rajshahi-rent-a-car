import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { PhotoSlot } from "@/components/placeholder";
import { FLEET } from "@/config/site";
import { bookingHref } from "@/config/trips";
import { type Locale, formatTaka, localeDigits, t } from "@/lib/locale";

/*
 * This page positions the EXISTING fleet for wedding hire. It deliberately
 * makes no claim about car decoration, packages or wedding-specific pricing,
 * none of which the owner has confirmed. Add those only once confirmed.
 */

const COPY = {
  title: { bn: "বিয়ের গাড়ি", en: "Wedding cars" },
  lead: {
    bn: "বর-কনের জন্য প্রাইভেট কার আর অতিথিদের জন্য মাইক্রোবাস, একসাথে বুক করা যায়। বিয়ের মৌসুমে আগেভাগে বুকিং দেওয়াই ভালো।",
    en: "A sedan for the couple and a microbus for the guests, bookable together. Book early in the wedding season.",
  },
  couple: { bn: "বর-কনের গাড়ি", en: "For the couple" },
  guests: { bn: "অতিথিদের জন্য", en: "For the guests" },
  seats: { bn: "আসন", en: "seats" },
  perDay: { bn: "/ দিন", en: "a day" },
  notesTitle: { bn: "বুকিংয়ের আগে", en: "Before you book" },
  book: { bn: "বিয়ের গাড়ি বুক করুন", en: "Book wedding cars" },
  shot: {
    bn: "বিয়ের দিনে বর-কনের গাড়ি (সাজানো গাড়ির ছবি কেবল সাজানোর সেবা থাকলে)",
    en: "The couple's car on the day (a decorated car only if decoration is offered)",
  },
} as const;

const NOTES = [
  { bn: "তারিখ ও সময় আগেই জানিয়ে রাখুন; বিয়ের মৌসুমে গাড়ি দ্রুত বুক হয়ে যায়।", en: "Share the date and time early; cars book out fast in the season." },
  { bn: "কয়টি গাড়ি লাগবে আর কতজন অতিথি, জানালে সঠিক পরামর্শ দেওয়া যায়।", en: "Tell us how many cars and guests, and we can advise properly." },
  { bn: "গায়ে হলুদ, বিয়ে ও বৌভাত: আলাদা দিনের জন্য আলাদা বুকিং নেওয়া যায়।", en: "Each ceremony's day can be booked separately." },
] as const;

export function WeddingCarPage({ locale }: { locale: Locale }) {
  const groups = [
    { heading: COPY.couple, vehicles: FLEET.filter((v) => v.seats <= 5) },
    { heading: COPY.guests, vehicles: FLEET.filter((v) => v.seats > 5) },
  ];

  return (
    <PageShell locale={locale}>
      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)}>
        <Link href={bookingHref(locale, { trip: "wedding" })} className="btn btn-primary">
          {t(locale, COPY.book)}
          <ArrowRightIcon className="size-4" />
        </Link>
      </PageHeader>

      <div className="wrap grid gap-12 pb-20 md:pb-28 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <div className="grid gap-10 sm:grid-cols-2">
            {groups.map(({ heading, vehicles }) => (
              <section key={heading.en} aria-label={t(locale, heading)}>
                <h2 className="text-2xl">{t(locale, heading)}</h2>
                <ul className="border-line mt-4 border-t">
                  {vehicles.map((v) => (
                    <li key={v.slug} className="border-line flex items-center justify-between gap-4 border-b py-4">
                      <span>
                        <span className="type-display block text-lg">{v.name}</span>
                        <span className="text-ink-soft text-sm">
                          {localeDigits(locale, v.seats)} {t(locale, COPY.seats)}
                        </span>
                      </span>
                      <span className="whitespace-nowrap">
                        <span className="figures text-2xl">৳{formatTaka(locale, v.pricePerDay)}</span>{" "}
                        <span className="text-ink-soft text-sm">{t(locale, COPY.perDay)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <h2 className="text-section mt-16">{t(locale, COPY.notesTitle)}</h2>
          <ol className="mt-6">
            {NOTES.map((n, i) => (
              <li key={n.en} className="border-line flex gap-4 border-b py-4">
                <span aria-hidden="true" className="figures text-leaf w-6 shrink-0 text-xl">
                  {localeDigits(locale, i + 1)}
                </span>
                {t(locale, n)}
              </li>
            ))}
          </ol>
        </div>
        <PhotoSlot shot={t(locale, COPY.shot)} className="lg:sticky lg:top-28 lg:self-start" />
      </div>
    </PageShell>
  );
}
