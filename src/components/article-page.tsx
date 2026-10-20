import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { Photo } from "@/components/photo";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { formatArticleDate, relatedArticles, type Article } from "@/lib/content";
import { route } from "@/config/routes";
import { FLEET, SITE } from "@/config/site";
import { type Locale, localePath, t } from "@/lib/locale";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

/** Stable anchors are generated with the static article; no client JS needed. */
function prepareArticle(html: string) {
  const headings: { id: string; title: string; level: string }[] = [];
  const content = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g, (_, level, attrs: string, title: string) => {
    const id = `article-section-${headings.length + 1}`;
    headings.push({ id, title: title.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&"), level });
    return `<h${level}${attrs.replace(/\s+id="[^"]*"/g, "")} id="${id}">${title}</h${level}>`;
  });
  return { content, headings };
}

export async function ArticlePage({ locale, article, showBackToBlog = true }: {
  locale: Locale;
  article: Article;
  showBackToBlog?: boolean;
}) {
  const bn = locale === "bn";
  const copy = (bangla: string, english: string) => bn ? bangla : english;
  const { content, headings } = prepareArticle(article.contentHtml);
  const related = showBackToBlog ? await relatedArticles(locale, article.slug) : [];
  const minutes = Math.max(1, Math.ceil(article.contentHtml.replace(/<[^>]*>/g, " ").split(/\s+/).length / 180));
  const number = (value: number) => new Intl.NumberFormat(bn ? "bn-BD" : "en-US").format(value);
  const booking = route(locale, "contact");
  const whatsapp = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(copy("এই লেখাটি দেখে গাড়ি ভাড়ার তথ্য জানতে চাই: ", "I'd like to plan a car rental after reading: ") + article.title)}`;
  const crumbs = [
    { name: copy("হোম", "Home"), path: "/" },
    ...(showBackToBlog ? [{ name: copy("ব্লগ", "Blog"), path: "/blog/" }] : []),
    { name: article.title, path: `/${article.slug}/` },
  ];

  return (
    <PageShell locale={locale}>
      {showBackToBlog && <JsonLd data={articleSchema(locale, article)} />}
      <JsonLd data={breadcrumbSchema(locale, crumbs)} />
      <div className="article-layout mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <nav aria-label={copy("পথ নির্দেশনা", "Breadcrumb")} className="text-muted mb-6 flex items-center gap-3 text-sm">
          <Link className="-mx-2 inline-flex min-h-11 min-w-11 items-center justify-center px-2 hover:underline" href={route(locale, "home")}>{copy("হোম", "Home")}</Link>
          <span aria-hidden="true">/</span>
          <Link className="-mx-2 inline-flex min-h-11 min-w-11 items-center justify-center px-2 hover:underline" href={route(locale, "blog")}>{copy("ভ্রমণ ও গাড়ি ভাড়ার গাইড", "Travel & rental guides")}</Link>
        </nav>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
          <article className="min-w-0">
            <header className="border-border border-b pb-7">
              <p className="text-leaf mb-3 text-sm font-semibold">{copy("রাজশাহী রেন্ট এ কার · ভ্রমণ সহায়িকা", "Rajshahi Rent A Car · Travel journal")}</p>
              <h1 className="text-3xl font-semibold md:text-4xl xl:text-5xl">{article.title}</h1>
              <p className="text-muted mt-5 text-lg leading-relaxed">{article.excerpt}</p>
              <div className="text-muted mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <time dateTime={article.modified || article.date}>{copy("হালনাগাদ: ", "Updated: ")}{formatArticleDate(locale, article.modified || article.date)}</time>
                <span>{copy(`পড়তে প্রায় ${number(minutes)} মিনিট`, `About ${minutes} min read`)}</span>
              </div>
            </header>
            {headings.length > 0 && <details className="article-contents border-border bg-surface my-7 rounded-lg border px-5">
              <summary className="cursor-pointer py-4 font-semibold">{copy("এই লেখায় যা থাকছে", "On this page")} <span className="text-muted ml-2 text-sm font-normal">{copy("বিষয় বেছে পড়ুন", "Jump to a section")}</span></summary>
              <nav aria-label={copy("লেখার সূচিপত্র", "Article contents")} className="border-border grid border-t py-3">
                {headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} className={`text-muted hover:text-leaf flex min-h-11 items-center py-2 text-sm ${heading.level === "3" ? "pl-4" : "font-semibold"}`}>{heading.title}</a>)}
              </nav>
            </details>}
            {article.untranslated && bn && <p className="bg-surface rounded-lg p-4">এই লেখাটির বাংলা অনুবাদ তৈরি হচ্ছে। নিচে ইংরেজি লেখাটি দেওয়া হলো।</p>}
            <div className="prose article-prose mt-8" lang={article.untranslated && bn ? "en" : undefined} dangerouslySetInnerHTML={{ __html: content }} />
            <div className="border-border mt-10 border-t pt-6">
              <p className="font-semibold">{copy("যাত্রার আগে তথ্য মিলিয়ে নিন", "Check before you travel")}</p>
              <p className="text-muted mt-2 text-sm leading-relaxed">{copy("দর্শনীয় স্থানের সময়সূচি, প্রবেশমূল্য ও নিয়ম বদলাতে পারে। যাওয়ার আগে কর্তৃপক্ষের সঙ্গে মিলিয়ে নিন। গাড়ির প্রাপ্যতা, ভাড়া ও কী কী অন্তর্ভুক্ত থাকবে, বুকিংয়ের সময় আমাদের সঙ্গে নিশ্চিত করুন।", "Opening hours, entry fees and visitor rules can change. Check with the attraction before visiting, and confirm vehicle availability, the fare and inclusions with us when booking.")}</p>
              {article.slug === "varendra-research-museum-rajshahi-day-trip" && <a className="text-leaf mt-2 inline-flex min-h-11 items-center text-sm underline" href="https://www.ru.ac.bd/facilities/varendra-research-museum/">{copy("জাদুঘরের তথ্য · রাজশাহী বিশ্ববিদ্যালয় ↗", "Museum information · University of Rajshahi ↗")}</a>}
            </div>
          </article>
          <aside aria-label={copy("ভ্রমণ ও বুকিং সহায়তা", "Trip planning and booking")} className="grid gap-6 lg:sticky lg:top-24">
            <section className="bg-brand text-brand-fg rounded-xl p-6">
              <p className="text-sm opacity-80">{copy("আপনার যাত্রা, আপনার পরিকল্পনা", "Your trip, your plans")}</p>
              <h2 className="mt-3 text-2xl font-semibold">{copy("রাজশাহী ঘুরুন নিজের মতো", "Explore Rajshahi your way")}</h2>
              <p className="mt-3 text-sm leading-relaxed opacity-90">{copy("কোথা থেকে উঠবেন, কোথায় যাবেন আর কতজন যাবেন—জানান। গাড়ি ও ভাড়া নিয়ে কথা বলুন আমাদের সঙ্গে।", "Tell us your pickup point, destination and group size. We’ll help you discuss a suitable car and fare.")}</p>
              <a href={whatsapp} className="btn-whatsapp mt-5 w-full"><WhatsAppIcon className="size-5" />{copy("হোয়াটসঅ্যাপে কথা বলুন", "Plan on WhatsApp")}</a>
              <a href={`tel:${SITE.phone}`} className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-lg border border-current px-3 font-semibold"><PhoneIcon className="size-4" />{t(locale, SITE.phoneDisplay)}</a>
              <Link href={booking} className="mt-2 flex min-h-11 items-center justify-center text-sm underline underline-offset-4">{copy("বুকিং ফর্ম পূরণ করুন →", "Open booking form →")}</Link>
            </section>
            <section className="border-border border-l-2 pl-5">
              <h2 className="text-lg font-semibold">{copy("বুকিংয়ের আগে জানান", "Have these details ready")}</h2>
              <ul className="text-muted mt-3 grid gap-3 text-sm leading-relaxed">
                <li>{copy("০১ · যাত্রার তারিখ ও পিকআপের সময়", "01 · Travel date and pickup time")}</li>
                <li>{copy("০২ · পিকআপের ঠিকানা ও গন্তব্য", "02 · Pickup address and destination")}</li>
                <li>{copy("০৩ · যাত্রীসংখ্যা ও লাগেজের পরিমাণ", "03 · Passenger count and luggage")}</li>
              </ul>
              <Link className="text-leaf mt-3 inline-flex min-h-11 items-center text-sm font-semibold" href={route(locale, "pickup")}>{copy("এয়ারপোর্ট / স্টেশন পিকআপ →", "Airport / station pickup →")}</Link>
            </section>
          </aside>
        </div>
        <section className="border-border mt-14 border-t pt-10" aria-labelledby="article-fleet-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-leaf text-sm font-semibold">{copy("ভ্রমণের সঙ্গী", "Make the journey yours")}</p><h2 id="article-fleet-title" className="mt-2 text-2xl md:text-3xl">{copy("আপনার দলের জন্য গাড়ি", "A car for your group")}</h2></div>
            <Link className="text-leaf inline-flex min-h-11 items-center text-sm font-semibold" href={route(locale, "pricing")}>{copy("ভাড়ার বিস্তারিত →", "View rental details →")}</Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {FLEET.map((vehicle) => <div key={vehicle.slug} className="border-border overflow-hidden rounded-lg border">
              <Photo {...vehicle.photo} alt={vehicle.name} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[16/9] w-full object-cover" />
              <div className="p-5"><p className="text-muted text-sm">{copy(`${number(vehicle.seats)} আসন`, `${vehicle.seats} seats`)} · {t(locale, vehicle.type)}</p><h3 className="mt-1 text-xl">{vehicle.name}</h3><p className="mt-3 text-xl font-semibold">৳{number(vehicle.pricePerDay)} <span className="text-muted text-sm font-normal">{copy("/ দিন", "/ day")}</span></p><Link className="text-leaf mt-3 inline-flex min-h-11 items-center font-semibold" href={`${route(locale, "contact")}?${new URLSearchParams({ vehicle: vehicle.name })}`}>{copy("এই গাড়ি নিয়ে কথা বলুন →", "Enquire about this car →")}</Link></div>
            </div>)}
          </div>
          <p className="text-muted mt-4 text-sm">{copy("দৈনিক ভাড়া দেখানো হয়েছে। আপনার রুট, সময় ও প্রয়োজন অনুযায়ী চূড়ান্ত ভাড়া ও অন্তর্ভুক্ত খরচ নিশ্চিত করুন।", "Daily rates shown. Confirm the final quote and included costs for your route, timing and requirements.")}</p>
        </section>
        {related.length > 0 && <section className="border-border mt-12 border-t pt-8 pb-6" aria-labelledby="related-title">
          <h2 id="related-title" className="text-2xl">{copy("আরও পড়ুন, ভ্রমণ সাজান", "More ideas for your trip")}</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-3">{related.map((item, index) => <Link key={item.slug} href={localePath(locale, `/${item.slug}/`)} className="group border-border border-t pt-4"><span className="text-leaf text-sm">{number(index + 1).padStart(2, bn ? "০" : "0")}</span><h3 className="mt-2 text-lg group-hover:underline">{item.title}</h3><p className="text-muted mt-2 text-sm leading-relaxed">{item.excerpt}</p><span className="text-leaf mt-3 inline-flex min-h-11 items-center text-sm">{copy("পড়ুন →", "Read story →")}</span></Link>)}</div>
        </section>}
      </div>
    </PageShell>
  );
}
