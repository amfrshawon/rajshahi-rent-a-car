import Link from "next/link";
import { ArrowRightIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { Photo } from "@/components/photo";
import { route, type RouteKey } from "@/config/routes";
import { SITE } from "@/config/site";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/locale";
import { breadcrumbSchema } from "@/lib/schema";

export type Bilingual = { bn: string; en: string };

export type LandingContent = {
  /** Breadcrumb + <h1>. */
  title: Bilingual;
  eyebrow: Bilingual;
  lead: Bilingual;
  photo?: { name: string; width: number; height: number; alt: Bilingual };
  sections: readonly { heading: Bilingual; body: Bilingual }[];
  inclusions?: readonly Bilingual[];
  links?: readonly { label: Bilingual; route: RouteKey }[];
  faqs: readonly { q: Bilingual; a: Bilingual }[];
  /** Path this page is served at, per locale — used for metadata and schema. */
  paths: { bn: string; en: string };
};

/**
 * Shared frame for the long-tail landing pages. The copy differs per page; the
 * structure, the phone-first actions and the FAQ schema do not, so a new
 * landing page cannot accidentally ship without them.
 */
export function LandingPage({ locale, content }: { locale: Locale; content: LandingContent }) {
  const contact = route(locale, "contact");
  const home = route(locale, "home");
  const path = content.paths[locale];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((item) => ({
      "@type": "Question",
      name: t(locale, item.q),
      acceptedAnswer: { "@type": "Answer", text: t(locale, item.a) },
    })),
  };

  const waText = encodeURIComponent(
    t(locale, { bn: "আসসালামু আলাইকুম, আমি গাড়ি ভাড়া নিতে চাই।", en: "Hello, I would like to rent a car." }),
  );

  return (
    <PageShell locale={locale}>
      <JsonLd data={faqSchema} />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: t(locale, { bn: "হোম", en: "Home" }), path: home },
          { name: t(locale, content.title), path },
        ])}
      />

      <section className="bg-brand text-brand-fg">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-6 px-4 py-8 md:grid-cols-2 md:gap-10 md:px-6 md:py-12">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold opacity-90">
              <span aria-hidden="true" className="bg-pin size-2 rounded-full" />
              {t(locale, content.eyebrow)}
            </p>
            <h1 className="mt-3 text-3xl leading-tight font-bold md:text-5xl">
              {t(locale, content.title)}
            </h1>
            <p className="mt-3 max-w-lg text-base opacity-90 md:text-lg">
              {t(locale, content.lead)}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`tel:${SITE.phone}`}
                className="bg-bg text-leaf inline-flex min-h-12 items-center gap-2 rounded-lg px-6 font-semibold transition active:scale-[0.98]"
              >
                <PhoneIcon className="size-5" />
                {t(locale, SITE.phoneDisplay)}
              </a>
              <a href={`https://wa.me/${SITE.whatsapp}?text=${waText}`} className="btn-whatsapp">
                <WhatsAppIcon className="size-5" />
                {t(locale, { bn: "হোয়াটসঅ্যাপ", en: "WhatsApp" })}
              </a>
            </div>
          </div>
          {content.photo ? (
            <div className="overflow-hidden rounded-lg">
              <Photo
                name={content.photo.name}
                width={content.photo.width}
                height={content.photo.height}
                alt={t(locale, content.photo.alt)}
                sizes="(min-width: 768px) 560px, 92vw"
                priority
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6 md:py-12">
        {content.sections.map((section) => (
          <div key={section.heading.en} className="mt-6 first:mt-0">
            <h2 className="text-2xl font-bold md:text-3xl">{t(locale, section.heading)}</h2>
            <p className="text-muted mt-2 leading-relaxed">{t(locale, section.body)}</p>
          </div>
        ))}

        {content.inclusions ? (
          <>
            <h2 className="mt-8 text-2xl font-bold">
              {t(locale, { bn: "ভাড়ার সাথে যা থাকে", en: "What the fare includes" })}
            </h2>
            <ul className="mt-3 space-y-2">
              {content.inclusions.map((item) => (
                <li key={item.en} className="flex items-start gap-2">
                  <span aria-hidden="true" className="bg-leaf mt-2 size-1.5 shrink-0 rounded-full" />
                  <span>{t(locale, item)}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {content.links ? (
          <ul className="divide-border border-border mt-8 divide-y border-y">
            {content.links.map((link) => (
              <li key={link.route}>
                <Link
                  href={route(locale, link.route)}
                  className="flex min-h-12 items-center justify-between gap-3 py-1.5 font-medium"
                >
                  {t(locale, link.label)}
                  <ArrowRightIcon className="text-leaf size-4 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="bg-surface border-border border-y">
        <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6 md:py-12">
          <h2 className="text-2xl font-bold md:text-3xl">
            {t(locale, { bn: "সাধারণ প্রশ্ন", en: "Common questions" })}
          </h2>
          <ul className="divide-border border-border mt-3 divide-y border-y">
            {content.faqs.map((item) => (
              <li key={item.q.en} className="py-3">
                <details className="group">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-semibold">
                    {t(locale, item.q)}
                    <span aria-hidden="true" className="text-leaf text-xl leading-none group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="text-muted mt-1">{t(locale, item.a)}</p>
                </details>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`tel:${SITE.phone}`} className="btn-primary">
              <PhoneIcon className="size-5" />
              {t(locale, { bn: "কল করুন", en: "Call now" })}
            </a>
            <Link
              href={contact}
              className="border-border inline-flex min-h-12 items-center rounded-lg border px-5 font-semibold"
            >
              {t(locale, { bn: "বুকিং ফর্ম", en: "Booking form" })}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
