import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { MenuIcon, PhoneIcon } from "@/components/icons";
import { LanguageSwitch } from "@/components/language-switch";
import { FOOTER_NAV, NAV } from "@/config/navigation";
import { type RouteKey, route } from "@/config/routes";
import { SITE } from "@/config/site";
import { type Locale, localePath, t } from "@/lib/locale";

const COPY = {
  lockup1: { bn: "রাজশাহী", en: "Rajshahi" },
  lockup2: { bn: "রেন্ট এ কার", en: "Rent A Car" },
  menu: { bn: "মেনু", en: "Menu" },
  primaryNav: { bn: "প্রধান মেনু", en: "Primary" },
  call: { bn: "কল করুন", en: "Call" },
  book: { bn: "বুক করুন", en: "Book" },
  pickup: { bn: "এয়ারপোর্ট ও স্টেশন", en: "Airport & station" },
} as const;

/** Wide screens show the services; the rest live in the menu and footer. */
const WIDE_NAV: readonly RouteKey[] = ["fleet", "pricing", "tours", "wedding", "ambulance"];

export function SiteHeader({ locale }: { locale: Locale }) {
  const wide = NAV.filter((item) => WIDE_NAV.includes(item.key));
  const contact = NAV.filter((item) => item.key === "contact");
  const menu = [
    ...NAV.filter((item) => item.key !== "contact"),
    { key: "pickup" as const, label: COPY.pickup },
    ...FOOTER_NAV,
    ...contact,
  ];

  return (
    <header className="border-line bg-ground sticky top-0 z-40 border-b">
      <div className="wrap flex h-16 items-center gap-2 lg:h-[4.5rem]">
        {/*
          The name is two short lines beside the mark, so the header fits a
          320 px screen with the three round controls and never truncates.
        */}
        <Link
          href={localePath(locale, "/")}
          className="flex min-w-0 shrink-0 items-center gap-2.5"
        >
          <BrandMark className="h-7 w-auto shrink-0 sm:h-8" />
          <span className="type-display text-ink flex flex-col text-[0.8125rem] leading-[1.15] sm:text-[0.9375rem]">
            <span>{t(locale, COPY.lockup1)}</span>
            <span>{t(locale, COPY.lockup2)}</span>
          </span>
        </Link>

        <nav aria-label={t(locale, COPY.primaryNav)} className="ms-auto hidden lg:block">
          <ul className="flex items-center">
            {wide.map((item) => (
              <li key={item.key}>
                <Link
                  href={route(locale, item.key)}
                  className={`flex min-h-11 items-center px-3 whitespace-nowrap transition-colors xl:px-4 ${
                    item.key === "ambulance" ? "text-pin-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {t(locale, item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-1.5 lg:ms-3 lg:gap-2">
          <LanguageSwitch locale={locale} />

          <a
            href={`tel:${SITE.phone}`}
            aria-label={`${t(locale, COPY.call)} ${t(locale, SITE.phoneDisplay)}`}
            className="btn-primary press grid size-11 place-items-center rounded-full"
          >
            <PhoneIcon className="size-5" />
          </a>

          <Link
            href={`${route(locale, "contact")}#booking`}
            className="btn btn-primary hidden lg:inline-flex"
          >
            {t(locale, COPY.book)}
          </Link>

          {/*
            <details> keeps the menu at zero JavaScript. The panel is
            positioned against the sticky header, so it spans the full width
            under it. PageShell renders per page, so it closes on navigation.
          */}
          <details className="group lg:hidden">
            <summary
              aria-label={t(locale, COPY.menu)}
              className="border-field text-ink group-open:bg-mist grid size-11 cursor-pointer list-none place-items-center rounded-full border marker:content-none [&::-webkit-details-marker]:hidden"
            >
              <MenuIcon className="size-5" />
            </summary>

            <nav
              aria-label={t(locale, COPY.primaryNav)}
              className="border-line bg-ground absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b"
            >
              <ul className="wrap grid py-2 sm:grid-cols-2 sm:gap-x-8">
                {menu.map((item) => (
                  <li key={item.key} className="border-line border-b">
                    <Link
                      href={route(locale, item.key)}
                      className={`flex min-h-13 items-center text-lg ${
                        item.key === "ambulance" ? "text-pin-ink" : "text-ink"
                      }`}
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
