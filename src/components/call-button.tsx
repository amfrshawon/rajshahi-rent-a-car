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
 * Most enquiries here start as a phone call, so the number is the single most
 * valuable link on the site. As plain text it read as a label rather than an
 * action — this gives it a live dot, a phone icon and a slow ring so it is
 * unmistakably tappable.
 */
export function CallButton({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  return (
    <a
      href={`tel:${SITE.phone}`}
      aria-label={`${t(locale, COPY.callAria)} ${t(locale, SITE.phoneDisplay)}`}
      className={`bg-brand-soft text-brand animate-call-ring group inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-semibold transition hover:brightness-95 active:scale-[0.97] ${className}`}
    >
      <span aria-hidden="true" className="relative flex size-2 shrink-0">
        <span className="bg-brand absolute inline-flex size-full animate-ping rounded-full opacity-75" />
        <span className="bg-brand relative inline-flex size-2 rounded-full" />
      </span>
      <PhoneIcon className="size-4 shrink-0" />
      <span className="whitespace-nowrap">{t(locale, SITE.phoneDisplay)}</span>
      <span className="sr-only">— {t(locale, COPY.available)}</span>
    </a>
  );
}
