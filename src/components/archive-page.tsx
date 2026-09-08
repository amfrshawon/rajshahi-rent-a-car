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
      <div className="mx-auto w-full max-w-3xl px-4 py-10 md:py-14">
        <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
        {description ? <p className="text-muted mt-3">{description}</p> : null}

        {articles.length === 0 ? (
          <p className="text-muted mt-8">{t(locale, COPY.empty)}</p>
        ) : (
          <ul className="mt-8 space-y-6">
            {articles.map((a) => (
              <li
                key={a.slug}
                className="content-auto border-border border-b pb-6 last:border-0"
              >
                <h2 className="text-xl font-semibold">
                  <Link
                    href={localePath(locale, `/${a.slug}/`)}
                    className="hover:text-brand"
                  >
                    {a.title}
                  </Link>
                </h2>
                <p className="text-muted mt-1 text-sm">
                  <time dateTime={a.date}>{formatArticleDate(locale, a.date)}</time>
                </p>
                <p className="text-muted mt-2">{a.excerpt}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}
