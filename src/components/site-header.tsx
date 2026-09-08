import Link from "next/link";
import { NAV } from "@/config/navigation";
import { asset, href } from "@/config/deploy";
import { route } from "@/config/routes";
import { SITE } from "@/config/site";
import { type Locale, localePath, t } from "@/lib/locale";

const COPY = {
  menu: { bn: "মেনু", en: "Menu" },
  primaryNav: { bn: "প্রধান মেনু", en: "Primary" },
} as const;

export function SiteHeader({ locale }: { locale: Locale }) {
  const other: Locale = locale === "bn" ? "en" : "bn";

  return (
    <header className="border-border bg-bg/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <Link href={localePath(locale, "/")} className="flex items-center gap-2.5">
          {/* Decorative: the brand name is right beside it as real text. */}
          <img
            src={asset("/media/brand/logo-mark.png")}
            alt=""
            width={40}
            height={40}
            className="size-9 shrink-0 rounded-md"
          />
          <span className="text-brand text-base leading-tight font-semibold sm:text-lg">
            {t(locale, SITE.name)}
          </span>
        </Link>

        <nav
          aria-label={t(locale, COPY.primaryNav)}
          className="hidden items-center gap-5 lg:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={route(locale, item.key)}
              className="text-muted hover:text-fg text-sm font-medium"
            >
              {t(locale, item.label)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
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
            href={href(localePath(other, "/"))}
            hrefLang={other}
            className="border-border text-muted hover:text-fg inline-flex min-h-9 items-center rounded-full border px-3 text-sm"
          >
            {other === "bn" ? "বাংলা" : "English"}
          </a>

          {/*
            The menu lives inside the header row as a dropdown rather than in a
            second bar below it — that second bar was costing ~40px of a phone
            screen on every page. <details> keeps it at zero client JavaScript.
          */}
          <details className="relative lg:hidden">
            <summary
              aria-label={t(locale, COPY.menu)}
              className="border-border text-fg marker:content-none flex size-9 cursor-pointer list-none items-center justify-center rounded-full border [&::-webkit-details-marker]:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
                className="size-5"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>

            <nav
              aria-label={t(locale, COPY.primaryNav)}
              className="border-border bg-surface-raised shadow-card absolute end-0 top-full z-50 mt-2 w-56 rounded-xl border p-1.5"
            >
              <ul>
                {NAV.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={route(locale, item.key)}
                      className="text-fg hover:bg-surface active:bg-surface flex min-h-11 items-center rounded-lg px-3 text-sm"
                    >
                      {t(locale, item.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
