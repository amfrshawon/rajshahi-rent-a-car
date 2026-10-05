import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { formatArticleDate, type Article } from "@/lib/content";
import { route } from "@/config/routes";
import { type Locale, t } from "@/lib/locale";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

const COPY = {
  backToBlog: { bn: "← সব লেখা", en: "← All posts" },
  home: { bn: "হোম", en: "Home" },
  blog: { bn: "ব্লগ", en: "Blog" },
  untranslated: {
    bn: "এই লেখাটির বাংলা অনুবাদ এখনো তৈরি হচ্ছে। নিচের লেখাটি ইংরেজিতে দেওয়া হলো।",
    en: "",
  },
} as const;

export function ArticlePage({
  locale,
  article,
  showBackToBlog = true,
}: {
  locale: Locale;
  article: Article;
  /** Standalone pages (e.g. the ambulance service page) are not blog posts. */
  showBackToBlog?: boolean;
}) {
  const crumbs = showBackToBlog
    ? [
        { name: t(locale, COPY.home), path: "/" },
        { name: t(locale, COPY.blog), path: "/blog/" },
        { name: article.title, path: `/${article.slug}/` },
      ]
    : [
        { name: t(locale, COPY.home), path: "/" },
        { name: article.title, path: `/${article.slug}/` },
      ];

  return (
    <PageShell locale={locale}>
      {showBackToBlog ? <JsonLd data={articleSchema(locale, article)} /> : null}
      <JsonLd data={breadcrumbSchema(locale, crumbs)} />
      <article className="wrap pt-8 pb-20 md:pt-16 md:pb-28">
        {showBackToBlog ? (
          <Link
            href={route(locale, "blog")}
            className="text-leaf inline-flex min-h-11 items-center underline-offset-4 hover:underline"
          >
            {t(locale, COPY.backToBlog)}
          </Link>
        ) : null}

        <h1 className="text-title mt-4 max-w-4xl">{article.title}</h1>

        {showBackToBlog ? (
          <p className="text-ink-soft mt-4">
            <time dateTime={article.date}>
              {formatArticleDate(locale, article.date)}
            </time>
          </p>
        ) : null}

        {article.untranslated && locale === "bn" ? (
          <p className="border-leaf bg-mist mt-6 max-w-[40rem] border-s-2 p-4 text-sm">
            {t(locale, COPY.untranslated)}
          </p>
        ) : null}

        {/*
          Repo-authored Markdown rendered at build time — nothing here is
          fetched or executed in the browser.
        */}
        <div
          className="prose border-line mt-8 border-t pt-8 md:mt-12 md:pt-12"
          lang={article.untranslated && locale === "bn" ? "en" : undefined}
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      </article>
    </PageShell>
  );
}
