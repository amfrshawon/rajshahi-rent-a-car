import Link from "next/link";
import { ArrowRightIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
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
 * Closing band shared by the inner pages — the same deep-green call-to-action
 * treatment the home page ends on, so the site closes on one voice.
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
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-12 md:px-6 md:py-14">
        <div className="reveal">
          <h2 className="text-2xl font-semibold md:text-3xl">
            {t(locale, COPY.title)}
          </h2>
          <p className="mt-2 max-w-xl opacity-85">{t(locale, COPY.lead)}</p>
        </div>

        <div className="reveal flex flex-wrap gap-3">
          <a
            href={`tel:${SITE.phone}`}
            className="press inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-black transition hover:brightness-95"
          >
            <PhoneIcon className="size-5" />
            {t(locale, COPY.call)}
          </a>
          <a
            href={`https://wa.me/${SITE.whatsapp}?text=${waText}`}
            className="press inline-flex min-h-12 items-center gap-2 rounded-xl bg-white/10 px-6 font-semibold ring-1 ring-white/40 backdrop-blur transition hover:bg-white/20"
          >
            <WhatsAppIcon className="size-5" />
            {t(locale, COPY.whatsapp)}
          </a>
          <Link
            href={route(locale, "contact")}
            className="press inline-flex min-h-12 items-center gap-2 rounded-xl px-6 font-semibold underline-offset-4 transition hover:underline"
          >
            {t(locale, COPY.book)}
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
