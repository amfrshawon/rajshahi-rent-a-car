import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
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
      <PageHeader title={title} lead={description} />
      <div className="wrap pb-20 md:pb-28">
        {articles.length === 0 ? (
          <p className="text-ink-soft">{t(locale, COPY.empty)}</p>
        ) : (
          <ul className="border-line max-w-4xl border-t">
            {articles.map((a) => (
              <li key={a.slug} className="border-line border-b">
                <Link href={localePath(locale, `/${a.slug}/`)} className="group block py-6 md:py-8">
                  <p className="text-ink-soft text-sm">
                    <time dateTime={a.date}>{formatArticleDate(locale, a.date)}</time>
                  </p>
                  <h2 className="group-hover:text-leaf mt-2 text-xl transition-colors md:text-2xl">{a.title}</h2>
                  <p className="text-ink-soft mt-2 max-w-3xl">{a.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}
