import type { ReactNode } from "react";
import { ViewTransition } from "react";
import { JsonLd } from "@/components/json-ld";
import { MobileActionBar, type MobileActionVariant } from "@/components/mobile-action-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Locale } from "@/lib/locale";
import { businessSchema } from "@/lib/schema";

export function PageShell({
  locale,
  children,
  mobileAction = "booking",
}: {
  locale: Locale;
  children: ReactNode;
  mobileAction?: MobileActionVariant;
}) {
  return (
    <>
      {/* Keyboard users land here first; the header nav is long on desktop. */}
      <a
        href="#main"
        className="bg-brand text-brand-fg sr-only min-h-11 min-w-11 rounded-md px-4 py-2 font-semibold focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
      >
        {locale === "bn" ? "মূল অংশে যান" : "Skip to content"}
      </a>
      <SiteHeader locale={locale} />
      {/*
        Route crossfade. PageShell renders inside each page (not a layout),
        so on navigation this region is part of the swapping subtree and the
        enter/exit pair forms — wrapping a layout would never animate. Timing
        lives in globals.css; unsupported browsers navigate instantly.
      */}
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <ViewTransition>{children}</ViewTransition>
      </main>
      <SiteFooter locale={locale} />
      <MobileActionBar locale={locale} variant={mobileAction} />
      {/* Every page carries the business node; @id keeps it a single entity. */}
      <JsonLd data={businessSchema(locale)} />
    </>
  );
}
