import Link from "next/link";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { route } from "@/config/routes";
import { SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

const COPY = {
  title: { bn: "যাত্রার প্ল্যান ঠিক হয়ে গেছে?", en: "Trip planned?" },
  lead: {
    bn: "দিনরাত ২৪ ঘণ্টা কল করতে পারেন, অথবা হোয়াটসঅ্যাপে মেসেজ দিন।",
    en: "Call any time, day or night, or send a message on WhatsApp.",
  },
  call: { bn: "কল করুন", en: "Call now" },
  whatsapp: { bn: "হোয়াটসঅ্যাপ", en: "WhatsApp" },
  book: { bn: "বুকিং ফর্ম", en: "Booking form" },
} as const;

/**
 * Closing band shared by the inner pages. White button on the green panel for
 * the call (the panel is already green, so a green button would vanish), then
 * the WhatsApp action, then the form.
 */
export function BookingCta({ locale }: { locale: Locale }) {
  const waText = encodeURIComponent(
    t(locale, {
      bn: "আসসালামু আলাইকুম, আমি গাড়ি ভাড়া নিতে চাই।",
      en: "Hello, I would like to rent a car.",
    }),
  );

  return (
    <section className="bg-brand text-brand-fg">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-5 px-4 py-10 md:px-6 md:py-12">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">{t(locale, COPY.title)}</h2>
          <p className="mt-2 max-w-xl opacity-90">{t(locale, COPY.lead)}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={`tel:${SITE.phone}`}
            className="bg-bg text-brand inline-flex min-h-12 items-center gap-2 rounded-lg px-6 font-semibold transition active:scale-[0.98]"
          >
            <PhoneIcon className="size-5" />
            {t(locale, COPY.call)}
          </a>
          <a href={`https://wa.me/${SITE.whatsapp}?text=${waText}`} className="btn-whatsapp">
            <WhatsAppIcon className="size-5" />
            {t(locale, COPY.whatsapp)}
          </a>
          <Link
            href={route(locale, "contact")}
            className="inline-flex min-h-12 items-center gap-2 px-2 font-semibold underline underline-offset-4"
          >
            {t(locale, COPY.book)}
          </Link>
        </div>
      </div>
    </section>
  );
}
