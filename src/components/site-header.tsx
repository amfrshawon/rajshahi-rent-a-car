import Link from "next/link";
import { SITE } from "@/config/site";
import { type Locale, localePath, t } from "@/lib/locale";

export function SiteHeader({ locale }: { locale: Locale }) {
  const other: Locale = locale === "bn" ? "en" : "bn";

  return (
    <header className="border-border bg-bg/90 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href={localePath(locale, "/")} className="text-brand text-lg font-bold">
          {t(locale, SITE.name)}
        </Link>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${SITE.phone}`}
            className="text-fg hidden text-sm font-semibold sm:inline"
          >
            {t(locale, SITE.phoneDisplay)}
          </a>
          {/*
            A full page load is correct here: the two locales are separate root
            layouts, so this is a document-level switch, not a client nav.
          */}
          <a
            href={localePath(other, "/")}
            hrefLang={other}
            className="border-border text-muted hover:text-fg rounded-full border px-3 py-1 text-sm"
          >
            {other === "bn" ? "বাংলা" : "English"}
          </a>
        </div>
      </div>
    </header>
  );
}
