import type { ReactNode } from "react";
import { JsonLd } from "@/components/json-ld";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Locale } from "@/lib/locale";
import { businessSchema } from "@/lib/schema";

export function PageShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader locale={locale} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} />
      <MobileActionBar locale={locale} />
      {/* Every page carries the business node; @id keeps it a single entity. */}
      <JsonLd data={businessSchema(locale)} />
    </>
  );
}
