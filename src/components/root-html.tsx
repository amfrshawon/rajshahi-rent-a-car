import type { ReactNode } from "react";
import { bangla, latin } from "@/lib/fonts";
import type { Locale } from "@/lib/locale";

/**
 * Shared <html>/<body> shell.
 *
 * Bangla and English each have their own root layout (via route groups), which
 * is the only way to vary the `lang` attribute in the App Router — and `lang`
 * is what drives the per-script typography in globals.css.
 *
 * No animation library is mounted: the motion system is CSS (scroll-driven
 * reveals, view transitions, press/lift) and costs no JavaScript. If React
 * `motion` is ever needed, add a LazyMotion provider here with a code-split
 * feature bundle so it loads only for components that use it.
 */
export function RootHtml({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html
      lang={locale}
      className={`${bangla.variable} ${latin.variable} h-full antialiased`}
    >
      <body className="bg-bg text-fg flex min-h-full flex-col pb-action-bar md:pb-0">
        {children}
      </body>
    </html>
  );
}
