import { SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="border-border border-t">
      <div className="text-muted mx-auto w-full max-w-6xl px-4 py-8 text-sm">
        <p className="text-fg font-semibold">{t(locale, SITE.name)}</p>
        <p className="mt-1">{t(locale, SITE.address)}</p>
        <p className="mt-1">
          {t(locale, SITE.phoneDisplay)} · {SITE.email} · {t(locale, SITE.hours)}
        </p>
      </div>
    </footer>
  );
}
