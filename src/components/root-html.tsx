import type { ReactNode } from "react";
import { HashCleanup } from "@/components/hash-cleanup";
import { IS_PREVIEW } from "@/config/deploy";
import { bangla, latin } from "@/lib/fonts";
import type { Locale } from "@/lib/locale";

// Run while parsing the head, before the browser can find an anchor or restore
// a saved scroll position. Normal navigation and other deep links keep their behavior.
const resetScrollOnReload = `
(() => {
  const navigation = performance.getEntriesByType('navigation')[0];
  if (navigation?.type !== 'reload') return;
  if (location.hash && location.hash !== '#booking') return;

  if ('scrollRestoration' in history) {
    const previous = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    addEventListener('pageshow', () => {
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        history.scrollRestoration = previous;
      }, 0);
    }, { once: true });
  }

  if (location.hash === '#booking') {
    history.replaceState(history.state, '', location.pathname + location.search);
  }
})();
`;

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
      {/* The App Router shell needs this script to run during HTML parsing. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: resetScrollOnReload }} />
      </head>
      <body className="bg-bg text-fg flex min-h-full flex-col pb-action-bar md:pb-0">
        {/* Non-production copies (dev site, Pages preview) carry a noindex
            meta.robots in addition to the disallow-all robots.txt — the meta
            keeps working even where .htaccess headers are unavailable. */}
        {IS_PREVIEW ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : null}
        {children}
        <HashCleanup />
      </body>
    </html>
  );
}
