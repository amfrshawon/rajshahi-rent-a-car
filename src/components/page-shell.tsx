import type { ReactNode } from "react";
import { ViewTransition } from "react";
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
      {/*
        Route crossfade. PageShell renders inside each page (not a layout),
        so on navigation this region is part of the swapping subtree and the
        enter/exit pair forms — wrapping a layout would never animate. Timing
        lives in globals.css; unsupported browsers navigate instantly.
      */}
      <main className="flex-1">
        <ViewTransition>{children}</ViewTransition>
      </main>
      <SiteFooter locale={locale} />
      <MobileActionBar locale={locale} />
      {/* Every page carries the business node; @id keeps it a single entity. */}
      <JsonLd data={businessSchema(locale)} />
    </>
  );
}
