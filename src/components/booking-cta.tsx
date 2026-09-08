import Link from "next/link";
import { route } from "@/config/routes";
import { SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

const COPY = {
  title: { bn: "বুক করতে চান?", en: "Ready to book?" },
  lead: {
    bn: "দিনরাত ২৪ ঘণ্টা কল করতে পারেন, অথবা হোয়াটসঅ্যাপে মেসেজ দিন।",
    en: "Call any time, day or night, or send a message on WhatsApp.",
  },
  call: { bn: "কল করুন", en: "Call now" },
  book: { bn: "বুকিং ফর্ম", en: "Booking form" },
} as const;

export function BookingCta({ locale }: { locale: Locale }) {
  return (
    <section className="content-auto bg-surface">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold">{t(locale, COPY.title)}</h2>
        <p className="text-muted mx-auto mt-2 max-w-lg">{t(locale, COPY.lead)}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={`tel:${SITE.phone}`}
            className="bg-accent text-accent-fg inline-flex min-h-12 items-center rounded-xl px-6 font-semibold transition hover:brightness-110 active:scale-[0.97]"
          >
            {t(locale, COPY.call)}
          </a>
          <Link
            href={route(locale, "contact")}
            className="border-border text-fg hover:bg-surface inline-flex min-h-12 items-center rounded-xl border px-6 font-semibold transition active:scale-[0.97]"
          >
            {t(locale, COPY.book)}
          </Link>
        </div>
      </div>
    </section>
  );
}
