import { PhoneIcon } from "@/components/icons";
import { SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

const COPY = {
  callAria: { bn: "কল করুন", en: "Call" },
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
export function CallButton({ locale, className = "" }: { locale: Locale; className?: string }) {
  return (
    <a
      href={`tel:${SITE.phone}`}
      aria-label={`${t(locale, COPY.callAria)} ${t(locale, SITE.phoneDisplay)} — ${t(locale, COPY.available)}`}
      className={`bg-brand text-brand-fg flex size-10 items-center justify-center rounded-full transition active:scale-95 ${className}`}
    >
      <PhoneIcon className="size-5" />
    </a>
  );
}
