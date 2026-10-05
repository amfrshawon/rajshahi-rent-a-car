import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { WhatsAppIcon } from "@/components/icons";
import { route } from "@/config/routes";
import { SITE } from "@/config/site";
import { type Locale, localeDigits, t } from "@/lib/locale";

const COPY = {
  closing: {
    bn: "দিন হোক বা গভীর রাত, ফোন ধরা হয়।",
    en: "Day or night, someone answers.",
  },
  callAria: { bn: "কল করুন", en: "Call" },
  whatsapp: { bn: "হোয়াটসঅ্যাপে লিখুন", en: "Message on WhatsApp" },
  pages: { bn: "সাইটের পাতা", en: "Site pages" },
  pickup: { bn: "এয়ারপোর্ট ও স্টেশন", en: "Airport & station" },
  fleet: { bn: "গাড়িবহর", en: "Fleet" },
  pricing: { bn: "ভাড়ার তালিকা", en: "Pricing" },
  tours: { bn: "ট্যুর প্যাকেজ", en: "Tour packages" },
  wedding: { bn: "বিয়ের গাড়ি", en: "Wedding cars" },
  ambulance: { bn: "অ্যাম্বুলেন্স", en: "Ambulance" },
  about: { bn: "আমাদের সম্পর্কে", en: "About us" },
  faq: { bn: "সাধারণ জিজ্ঞাসা", en: "FAQ" },
  blog: { bn: "রাজশাহী ভ্রমণ গাইড", en: "Rajshahi travel guides" },
  contact: { bn: "যোগাযোগ", en: "Contact" },
  rights: { bn: "রাজশাহী রেন্ট এ কার", en: "Rajshahi Rent A Car" },
} as const;

const LINKS = [
  "fleet",
  "pricing",
  "tours",
  "wedding",
  "pickup",
  "ambulance",
  "about",
  "faq",
  "blog",
  "contact",
] as const;

/**
 * The close of every page: the phone number set as large as the headline,
 * then the address and the links. One deep-green block, so every page ends
 * on the same voice and the number is never more than a scroll away.
 */
export function SiteFooter({ locale }: { locale: Locale }) {
  const waText = encodeURIComponent(
    t(locale, {
      bn: "আসসালামু আলাইকুম, আমি গাড়ি ভাড়া নিতে চাই।",
      en: "Hello, I would like to rent a car.",
    }),
  );
  const year = localeDigits(locale, new Date().getFullYear());

  return (
    <footer className="surface-deep">
      <div className="wrap section-y">
        <h2 className="text-section max-w-3xl">{t(locale, COPY.closing)}</h2>
        <a
          href={`tel:${SITE.phone}`}
          aria-label={`${t(locale, SITE.phoneDisplay)} — ${t(locale, COPY.callAria)}`}
          className={`figures mt-6 inline-flex min-h-11 items-center whitespace-nowrap hover:underline hover:decoration-2 hover:underline-offset-8 ${
            // The international form is five characters longer, so it is
            // set smaller to stay on one line at 320 px.
            locale === "bn"
              ? "text-[clamp(1.875rem,0.75rem+5.4vw,5rem)]"
              : "text-[clamp(1.375rem,0.2rem+5vw,4.25rem)]"
          }`}
        >
          {t(locale, SITE.phoneDisplay)}
        </a>
        <div className="mt-6 md:mt-8">
          <a href={`https://wa.me/${SITE.whatsapp}?text=${waText}`} className="btn btn-primary">
            <WhatsAppIcon className="size-5" />
            {t(locale, COPY.whatsapp)}
          </a>
        </div>
      </div>

      <div className="wrap border-line grid gap-8 border-t py-10 md:grid-cols-[1.4fr_2fr] md:gap-10 md:py-12">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark onDark className="h-8 w-auto" />
            <p className="type-display">{t(locale, SITE.name)}</p>
          </div>
          <address className="text-ink-soft mt-5 grid gap-1 not-italic">
            <span>{t(locale, SITE.address)}</span>
            <span>{t(locale, SITE.hours)}</span>
            <a href={`mailto:${SITE.email}`} className="hover:text-ink inline-flex min-h-11 items-center underline-offset-4 hover:underline">
              {SITE.email}
            </a>
          </address>
        </div>

        {/* One list: it wraps into a few rows on a phone and two columns on
            wide screens. Every link keeps a 44 px tap height. */}
        <nav aria-label={t(locale, COPY.pages)}>
          <ul className="flex flex-wrap gap-x-6 md:grid md:grid-cols-2 md:gap-x-10">
            {LINKS.map((key) => (
              <li key={key}>
                <Link
                  href={route(locale, key)}
                  className="hover:text-ink text-ink-soft flex min-h-11 min-w-11 items-center underline-offset-4 hover:underline"
                >
                  {t(locale, COPY[key])}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="wrap border-line text-ink-soft border-t py-6 text-sm">
        © {year} {t(locale, COPY.rights)}
      </div>
    </footer>
  );
}
