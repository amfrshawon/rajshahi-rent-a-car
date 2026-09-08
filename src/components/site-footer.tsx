import Link from "next/link";
import { FOOTER_NAV, NAV } from "@/config/navigation";
import { route } from "@/config/routes";
import { SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

export function SiteFooter({ locale }: { locale: Locale }) {
  const links = [...NAV, ...FOOTER_NAV];

  return (
    <footer className="border-border border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-fg font-semibold">{t(locale, SITE.name)}</p>
            <address className="text-muted mt-2 text-sm not-italic">
              {t(locale, SITE.address)}
              <br />
              <a href={`tel:${SITE.phone}`} className="hover:text-fg">
                {t(locale, SITE.phoneDisplay)}
              </a>
              <br />
              <a href={`mailto:${SITE.email}`} className="hover:text-fg">
                {SITE.email}
              </a>
              <br />
              {t(locale, SITE.hours)}
            </address>
          </div>

          <nav>
            <ul className="text-muted grid grid-cols-2 gap-x-4 text-sm">
              {links.map((item) => (
                <li key={item.key}>
                  <Link
                    href={route(locale, item.key)}
                    className="hover:text-fg block py-1"
                  >
                    {t(locale, item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
