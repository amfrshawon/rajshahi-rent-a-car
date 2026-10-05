import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { formatArticleDate, type ArticleSummary } from "@/lib/content";
import { type Locale, localePath, t } from "@/lib/locale";
import { breadcrumbSchema, type Crumb } from "@/lib/schema";

const COPY = {
  empty: { bn: "এই বিভাগে এখনো কোনো লেখা নেই।", en: "No posts here yet." },
  home: { bn: "হোম", en: "Home" },
} as const;

export function ArchivePage({
  locale,
  title,
  description,
  articles,
  crumbs,
}: {
  locale: Locale;
  title: string;
  description?: string;
  articles: readonly ArticleSummary[];
  /** Trail above this archive, excluding Home, which is prepended. */
  crumbs?: readonly Crumb[];
}) {
  return (
    <PageShell locale={locale}>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: t(locale, COPY.home), path: "/" },
          ...(crumbs ?? []),
        ])}
      />
      <div className="mx-auto w-full max-w-3xl px-4 py-10 md:py-16">
        <p aria-hidden="true" className="bg-brand-vivid mb-4 h-1 w-10 rounded-full" />
        <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
        {description ? <p className="text-muted mt-3">{description}</p> : null}

        {articles.length === 0 ? (
          <p className="text-muted mt-8">{t(locale, COPY.empty)}</p>
        ) : (
          <ul className="reveal-stagger mt-8 space-y-4">
            {articles.map((a) => (
              <li key={a.slug} className="content-auto">
                <Link
                  href={localePath(locale, `/${a.slug}/`)}
                  className="border-border bg-surface-raised lift shadow-card group block rounded-2xl border p-6 transition"
                >
                  <p className="text-muted text-sm">
                    <time dateTime={a.date}>{formatArticleDate(locale, a.date)}</time>
                  </p>
                  <h2 className="mt-2 text-xl font-semibold group-hover:text-leaf">
                    {a.title}
                  </h2>
                  <p className="text-muted mt-2">{a.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}
