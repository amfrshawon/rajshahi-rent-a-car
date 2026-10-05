import { href } from "@/config/deploy";
import { type Locale, localePath, t } from "@/lib/locale";

const COPY = {
  switchTo: { bn: "Switch to English", en: "বাংলায় দেখুন" },
} as const;

/**
 * Compact locale toggle: a 44 px round control labelled with the other
 * language's own short form (EN / বাং), so it is recognisable unread.
 *
 * A full page load is correct here — the two locales are separate root
 * layouts, so this is a document switch, not a client navigation.
 */
export function LanguageSwitch({ locale }: { locale: Locale }) {
  const other: Locale = locale === "bn" ? "en" : "bn";

  return (
    <a
      href={href(localePath(other, "/"))}
      hrefLang={other}
      lang={other}
      aria-label={t(locale, COPY.switchTo)}
      title={t(locale, COPY.switchTo)}
      className="border-field text-ink hover:bg-mist press grid size-11 shrink-0 place-items-center rounded-full border text-sm"
    >
      <span aria-hidden="true">{other === "bn" ? "বাং" : "EN"}</span>
    </a>
  );
}
