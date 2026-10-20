import { PhoneIcon } from "@/components/icons";
import { href } from "@/config/deploy";
import { route } from "@/config/routes";
import { SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

export type MobileActionVariant = "booking" | "ambulance";

const COPY = {
  call: { bn: "কল করুন", en: "Call" },
  book: { bn: "বুক করুন", en: "Book now" },
  label: { bn: "দ্রুত যোগাযোগ", en: "Quick contact" },
  emergencyLabel: { bn: "জরুরি অ্যাম্বুলেন্স", en: "Emergency ambulance" },
  callAmbulance: { bn: "অ্যাম্বুলেন্স কল করুন", en: "Call ambulance" },
} as const;

const SHELL =
  "border-border bg-surface-raised/95 fixed inset-x-0 bottom-0 z-50 border-t p-2 backdrop-blur md:hidden";
const SAFE_AREA = { paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" };

/**
 * Sticky bottom bar, phones only.
 *
 * Two actions, not three: a call icon and one filled "বুক করুন" in Padma
 * green. Most bookings here start with a call, and the rest with the form —
 * WhatsApp already has its own buttons in the page body.
 *
 * On the ambulance page the bar is a single red call button instead: in an
 * emergency nobody should be pointed at a booking form.
 */
export function MobileActionBar({
  locale,
  variant = "booking",
}: {
  locale: Locale;
  variant?: MobileActionVariant;
}) {
  if (variant === "ambulance") {
    return (
      <nav
        aria-label={t(locale, COPY.emergencyLabel)}
        className={`${SHELL} grid grid-cols-1`}
        style={SAFE_AREA}
      >
        <a
          href={`tel:${SITE.phone}`}
          className="bg-emergency text-emergency-fg flex min-h-12 items-center justify-center gap-2 rounded-lg font-semibold transition active:scale-[0.98]"
        >
          <PhoneIcon className="size-5" />
          {t(locale, COPY.callAmbulance)}
        </a>
      </nav>
    );
  }

  return (
    <nav
      aria-label={t(locale, COPY.label)}
      className={`${SHELL} grid grid-cols-[3rem_1fr] gap-2`}
      style={SAFE_AREA}
    >
      <a
        href={`tel:${SITE.phone}`}
        aria-label={t(locale, COPY.call)}
        className="border-border text-leaf flex items-center justify-center rounded-lg border transition active:bg-surface"
      >
        <PhoneIcon className="size-5" />
      </a>
      <a href={href(`${route(locale, "contact")}#booking`)} className="btn-primary">
        {t(locale, COPY.book)}
      </a>
    </nav>
  );
}
