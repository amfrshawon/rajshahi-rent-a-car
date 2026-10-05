import { PhoneIcon } from "@/components/icons";
import { href } from "@/config/deploy";
import { route } from "@/config/routes";
import { SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

const COPY = {
  call: { bn: "কল করুন", en: "Call" },
  book: { bn: "বুক করুন", en: "Book now" },
  label: { bn: "দ্রুত যোগাযোগ", en: "Quick contact" },
} as const;

/**
 * Sticky bottom bar, phones only.
 *
 * Two actions, not three: a call icon and one filled "বুক করুন" in Padma
 * green. Most bookings here start with a call, and the rest with the form —
 * WhatsApp already has its own buttons in the page body.
 */
export function MobileActionBar({ locale }: { locale: Locale }) {
  return (
    <nav
      aria-label={t(locale, COPY.label)}
      className="border-border bg-surface-raised/95 fixed inset-x-0 bottom-0 z-50 grid grid-cols-[3rem_1fr] gap-2 border-t p-2 backdrop-blur md:hidden"
      style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
    >
      <a
        href={`tel:${SITE.phone}`}
        aria-label={t(locale, COPY.call)}
        className="border-border text-brand flex items-center justify-center rounded-lg border transition active:bg-surface"
      >
        <PhoneIcon className="size-5" />
      </a>
      <a
        href={href(`${route(locale, "contact")}#booking`)}
        className="btn-primary"
      >
        {t(locale, COPY.book)}
      </a>
    </nav>
  );
}
