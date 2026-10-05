import Link from "next/link";
import { PhoneIcon } from "@/components/icons";
import { route } from "@/config/routes";
import { SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

const COPY = {
  call: { bn: "কল", en: "Call" },
  callAria: { bn: "কল করুন", en: "Call" },
  book: { bn: "বুক করুন", en: "Book a car" },
  label: { bn: "দ্রুত যোগাযোগ", en: "Quick contact" },
} as const;

/**
 * Sticky bottom bar, phones only: call, then book. Most bookings here start
 * with a call, so it stays under the thumb; booking takes the wider part
 * because it is the action the site exists for.
 */
export function MobileActionBar({ locale }: { locale: Locale }) {
  return (
    <nav
      aria-label={t(locale, COPY.label)}
      className="border-line bg-ground fixed inset-x-0 bottom-0 z-50 border-t md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex gap-2 p-2">
        {/* The spoken label starts with the visible word. */}
        <a
          href={`tel:${SITE.phone}`}
          aria-label={`${t(locale, COPY.callAria)} ${t(locale, SITE.phoneDisplay)}`}
          className="btn btn-quiet press min-w-24 gap-2 px-4"
        >
          <PhoneIcon className="size-5" />
          {t(locale, COPY.call)}
        </a>
        <Link
          href={`${route(locale, "contact")}#booking`}
          className="btn btn-primary press flex-1"
        >
          {t(locale, COPY.book)}
        </Link>
      </div>
    </nav>
  );
}
