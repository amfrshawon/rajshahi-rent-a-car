import Link from "next/link";
import { CallButton } from "@/components/call-button";
import { LanguageSwitch } from "@/components/language-switch";
import { NAV } from "@/config/navigation";
import { asset } from "@/config/deploy";
import { route } from "@/config/routes";
import { SITE } from "@/config/site";
import { type Locale, localePath, t } from "@/lib/locale";

const COPY = {
  menu: { bn: "মেনু", en: "Menu" },
  primaryNav: { bn: "প্রধান মেনু", en: "Primary" },
} as const;

export function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="border-border bg-bg/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-3 md:gap-6 md:px-6 md:py-4">
        {/*
          min-w-0 plus a truncating name is what keeps the header inside the
          viewport. Without it the Bangla name refused to shrink and pushed the
          whole bar 63px past the edge of a 360px Android screen.
        */}
        <Link
          href={localePath(locale, "/")}
          className="flex min-w-0 items-center gap-2 sm:gap-2.5"
        >
          {/* The device only; the brand name sits beside it as real text. */}
          <img
            src={asset("/media/generated/logo-device.png")}
            alt=""
            width={236}
            height={64}
            className="h-6 w-auto shrink-0 sm:h-7"
          />
          <span className="text-brand truncate text-sm leading-tight font-semibold sm:text-base md:text-lg">
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
              className="text-muted hover:text-fg text-sm font-medium whitespace-nowrap"
            >
              {t(locale, item.label)}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Shown from md up; below that the sticky bottom bar carries Call. */}
          <CallButton locale={locale} className="hidden text-sm md:inline-flex" />

          <LanguageSwitch locale={locale} />

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
              className="border-border bg-surface-raised shadow-card absolute end-0 top-full z-50 mt-2 w-56 max-w-[calc(100vw-2rem)] rounded-xl border p-1.5"
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
