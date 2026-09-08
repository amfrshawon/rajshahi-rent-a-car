import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

const COPY = {
  call: { bn: "কল করুন", en: "Call" },
  whatsapp: { bn: "হোয়াটসঅ্যাপ", en: "WhatsApp" },
  book: { bn: "বুক করুন", en: "Book now" },
  label: { bn: "দ্রুত যোগাযোগ", en: "Quick contact" },
} as const;

/**
 * Sticky bottom bar, phones only.
 *
 * Most bookings in Bangladesh start with a call or a WhatsApp message rather
 * than a form, so the two cheapest actions stay permanently within thumb reach.
 */
export function MobileActionBar({ locale }: { locale: Locale }) {
  const waText = encodeURIComponent(
    t(locale, {
      bn: "আসসালামু আলাইকুম, আমি গাড়ি ভাড়া নিতে চাই।",
      en: "Hello, I would like to rent a car.",
    }),
  );

  return (
    <nav
      aria-label={t(locale, COPY.label)}
      className="border-border bg-surface-raised/95 fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 gap-px border-t backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={`tel:${SITE.phone}`}
        className="text-fg flex min-h-14 flex-col items-center justify-center gap-0.5 text-sm font-medium"
      >
        <PhoneIcon className="size-5" />
        {t(locale, COPY.call)}
      </a>
      <a
        href={`https://wa.me/${SITE.whatsapp}?text=${waText}`}
        className="text-whatsapp flex min-h-14 flex-col items-center justify-center gap-0.5 text-sm font-medium"
      >
        <WhatsAppIcon className="size-5" />
        {t(locale, COPY.whatsapp)}
      </a>
      <a
        href="#booking"
        className="bg-accent text-accent-fg flex min-h-14 flex-col items-center justify-center gap-0.5 text-sm font-semibold"
      >
        {t(locale, COPY.book)}
      </a>
    </nav>
  );
}
