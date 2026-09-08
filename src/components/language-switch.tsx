import { href } from "@/config/deploy";
import { type Locale, localePath, t } from "@/lib/locale";

const COPY = {
  switchTo: { bn: "Switch to English", en: "বাংলায় দেখুন" },
} as const;

/**
 * Compact locale toggle.
 *
 * A text pill reading "English" cost 68px, which on a 360px Android screen was
 * enough to push the header past the viewport. This is a 36px square matching
 * the menu button, labelled with the target language's own short form so it is
 * recognisable without reading: বাং / EN.
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
      aria-label={t(locale, COPY.switchTo)}
      title={t(locale, COPY.switchTo)}
      className="border-border text-muted hover:text-fg hover:bg-surface flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition active:scale-95"
    >
      <span aria-hidden="true">{other === "bn" ? "বাং" : "EN"}</span>
    </a>
  );
}
