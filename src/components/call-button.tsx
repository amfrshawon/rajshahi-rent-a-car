import { PhoneIcon } from "@/components/icons";
import { SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

const COPY = {
  callAria: { bn: "গাড়ি ভাড়ার জন্য কল করুন", en: "Call for car rental" },
  available: { bn: "২৪/৭ খোলা", en: "Open 24/7" },
} as const;

/**
 * The header call button.
 *
 * Most enquiries here start as a phone call, so the number is the most
 * valuable link on the site. In the header it is a round icon button — the
 * number itself lives in the footer and the closing strips, where there is
 * room for it. The slow pulsing ring is gone; it blinked in the corner of the
 * eye on every page.
 */
export function CallButton({ locale, className = "", ambulance = false }: { locale: Locale; className?: string; ambulance?: boolean }) {
  const contact = ambulance ? SITE.ambulance : SITE;
  return (
    <a
      href={`tel:${contact.phone}`}
      aria-label={`${t(locale, ambulance ? { bn: "অ্যাম্বুলেন্স কল করুন", en: "Call ambulance" } : COPY.callAria)} ${t(locale, contact.phoneDisplay)} — ${t(locale, COPY.available)}`}
      className={`bg-brand text-brand-fg flex size-11 items-center justify-center rounded-full transition active:scale-95 ${className}`}
    >
      <PhoneIcon className="size-5" />
    </a>
  );
}
