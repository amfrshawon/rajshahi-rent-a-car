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
      /*
       * No display utility here on purpose. Baking `inline-flex` in fought the
       * `hidden` the caller passes for small screens — same specificity, so
       * source order decided, and the button stayed visible on a 360px screen
       * and squeezed the brand name out of the header. The caller owns display.
       */
      className={`bg-brand-soft text-brand animate-call-ring group min-h-11 items-center gap-2 rounded-full px-4 font-semibold transition hover:brightness-95 active:scale-[0.97] ${className}`}
    >
      {/*
        A static dot, not a pulsing one. The ping animation ran on a 1s cycle
        in a sticky header, so it blinked in the corner of the eye on every
        page including long articles. The slow ring below is enough of a cue.
      */}
      <span aria-hidden="true" className="bg-brand size-2 shrink-0 rounded-full" />
      <PhoneIcon className="size-4 shrink-0" />
      <span className="whitespace-nowrap">{t(locale, SITE.phoneDisplay)}</span>
      <span className="sr-only">— {t(locale, COPY.available)}</span>
    </a>
  );
}
