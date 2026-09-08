import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { formatArticleDate, type Article } from "@/lib/content";
import { type Locale, localePath, t } from "@/lib/locale";

const COPY = {
  backToBlog: { bn: "← সব লেখা", en: "← All posts" },
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
  return (
    <PageShell locale={locale}>
      <article className="mx-auto w-full max-w-3xl px-4 py-10 md:py-14">
        {showBackToBlog ? (
          <Link
            href={localePath(locale, "/blog/")}
            className="text-muted hover:text-fg text-sm"
          >
            {t(locale, COPY.backToBlog)}
          </Link>
        ) : null}

        <h1 className="mt-4 text-3xl font-semibold md:text-4xl">{article.title}</h1>

        {showBackToBlog ? (
          <p className="text-muted mt-3 text-sm">
            <time dateTime={article.date}>
              {formatArticleDate(locale, article.date)}
            </time>
          </p>
        ) : null}

        {article.untranslated && locale === "bn" ? (
          <p className="border-accent bg-accent-soft text-fg mt-6 rounded-lg border-l-4 p-4 text-sm">
            {t(locale, COPY.untranslated)}
          </p>
        ) : null}

        {/*
          First-party HTML from the owner's own WordPress, inlined at build
          time — nothing here is fetched in the browser.
        */}
        <div
          className="prose mt-8"
          lang={article.untranslated && locale === "bn" ? "en" : undefined}
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      </article>
    </PageShell>
  );
}
