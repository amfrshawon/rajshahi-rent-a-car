import type { ReactNode } from "react";
import { IS_PREVIEW } from "@/config/deploy";
import type { Locale } from "@/lib/locale";

/**
 * Shared <html>/<body> shell.
 *
 * Bangla and English each have their own root layout (via route groups), which
 * is the only way to vary the `lang` attribute in the App Router — and `lang`
 * is what drives the per-script typography in globals.css.
 *
 * Fonts are passed in by each layout rather than imported here: next/font
 * preloads a font on every route under the file that loads it, so importing
 * both locales' fonts in this shared file would preload all of them on
 * every page.
 */
export function RootHtml({
  locale,
  fontVariables,
  children,
}: {
  locale: Locale;
  fontVariables: string;
  children: ReactNode;
}) {
  return (
    <html
      lang={locale}
      className={`${fontVariables} h-full`}
    >
      <body className="bg-ground text-ink flex min-h-full flex-col pb-action-bar md:pb-0">
        {/* Non-production copies (dev site, Pages preview) carry a noindex
            meta.robots in addition to the disallow-all robots.txt — the meta
            keeps working even where .htaccess headers are unavailable. */}
        {IS_PREVIEW ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : null}
        {children}
      </body>
    </html>
  );
}
