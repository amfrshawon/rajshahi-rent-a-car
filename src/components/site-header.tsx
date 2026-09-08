import Link from "next/link";
import { NAV } from "@/config/navigation";
import { SITE } from "@/config/site";
import { type Locale, localePath, t } from "@/lib/locale";

const COPY = {
  menu: { bn: "মেনু", en: "Menu" },
  primaryNav: { bn: "প্রধান মেনু", en: "Primary" },
} as const;

export function SiteHeader({ locale }: { locale: Locale }) {
  const other: Locale = locale === "bn" ? "en" : "bn";

  return (
    <header className="border-border bg-bg/90 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href={localePath(locale, "/")} className="text-brand text-lg font-semibold">
          {t(locale, SITE.name)}
        </Link>

        <nav
          aria-label={t(locale, COPY.primaryNav)}
          className="hidden items-center gap-5 lg:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.path}
              href={localePath(locale, item.path)}
              className="text-muted hover:text-fg text-sm font-medium"
            >
              {t(locale, item.label)}
            </Link>
          ))}
        </nav>

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

      {/*
        Disclosure menu for narrow screens. <details> gives us the toggle with
        no client JavaScript at all, which keeps the mobile bundle at zero for
        the most common interaction on the site.
      */}
      <details className="border-border group border-t lg:hidden">
        <summary className="text-muted marker:content-none flex cursor-pointer list-none items-center justify-between px-4 py-2 text-sm font-medium">
          {t(locale, COPY.menu)}
          <span aria-hidden="true" className="transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <nav aria-label={t(locale, COPY.primaryNav)} className="px-4 pb-3">
          <ul className="grid grid-cols-2 gap-x-4">
            {NAV.map((item) => (
              <li key={item.path}>
                <Link
                  href={localePath(locale, item.path)}
                  className="text-fg block py-2 text-sm"
                >
                  {t(locale, item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </details>
    </header>
  );
}
