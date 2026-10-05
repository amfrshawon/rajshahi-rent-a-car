import { BookingForm } from "@/components/booking-form";
import { WhatsAppIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

const COPY = {
  title: { bn: "বুকিং ও যোগাযোগ", en: "Booking & contact" },
  lead: {
    bn: "দিনরাত ২৪ ঘণ্টা খোলা। নিচের ফর্মটি এক মিনিটের, অথবা সরাসরি কল বা হোয়াটসঅ্যাপ করুন।",
    en: "Open 24 hours. The form below takes a minute, or call or message us directly.",
  },
  formTitle: { bn: "গাড়ি বুক করুন", en: "Book a car" },
  formLead: {
    bn: "শুধু নাম আর নম্বর বাধ্যতামূলক। বাকিটা জানা থাকলে লিখুন, না থাকলে আমরা ফোনে জেনে নেব।",
    en: "Only your name and number are required. Fill in what you know; we will ask about the rest on the phone.",
  },
  direct: { bn: "সরাসরি", en: "Directly" },
  phone: { bn: "ফোন, ২৪ ঘণ্টা", en: "Phone, 24 hours" },
  callAria: { bn: "কল করুন", en: "Call" },
  whatsapp: { bn: "হোয়াটসঅ্যাপ", en: "WhatsApp" },
  whatsappLink: { bn: "হোয়াটসঅ্যাপে লিখুন", en: "Message on WhatsApp" },
  email: { bn: "ইমেইল", en: "Email" },
  office: { bn: "অফিস", en: "Office" },
  payTitle: { bn: "পেমেন্ট", en: "Payment" },
  pay: {
    bn: "বাংলা কিউআর: বিকাশ, নগদ, রকেট, উপায়, অথবা ব্যাংক ট্রান্সফার। কার্ড নেওয়া হয় না।",
    en: "Bangla QR: bKash, Nagad, Rocket, Upay, or bank transfer. Cards are not accepted.",
  },
} as const;

export function ContactPage({ locale }: { locale: Locale }) {
  const waText = encodeURIComponent(
    t(locale, {
      bn: "আসসালামু আলাইকুম, আমি গাড়ি ভাড়া নিতে চাই।",
      en: "Hello, I would like to rent a car.",
    }),
  );

  return (
    <PageShell locale={locale}>
      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)} />

      <div className="wrap grid gap-14 pb-20 lg:grid-cols-[1.5fr_1fr] lg:gap-20 lg:pb-28">
        <section id="booking" aria-labelledby="booking-title" className="border-line border-t pt-8 md:pt-10">
          <h2 id="booking-title" className="text-section">
            {t(locale, COPY.formTitle)}
          </h2>
          <p className="text-ink-soft mt-3 max-w-xl">{t(locale, COPY.formLead)}</p>
          <div className="mt-8 md:mt-10">
            <BookingForm locale={locale} />
          </div>
        </section>

        {/* Real methods, as a plain list: no icon cards. */}
        <aside aria-labelledby="direct-title" className="border-line border-t pt-8 md:pt-10 lg:sticky lg:top-24 lg:self-start">
          <h2 id="direct-title" className="text-section">
            {t(locale, COPY.direct)}
          </h2>
          <dl className="mt-6 grid">
            <div className="border-line border-b pb-5">
              <dt className="text-ink-soft text-sm">{t(locale, COPY.phone)}</dt>
              <dd>
                <a
                  href={`tel:${SITE.phone}`}
                  aria-label={`${t(locale, SITE.phoneDisplay)} — ${t(locale, COPY.callAria)}`}
                  className="figures inline-flex min-h-12 items-center text-3xl hover:underline md:text-4xl"
                >
                  {t(locale, SITE.phoneDisplay)}
                </a>
              </dd>
            </div>
            <div className="border-line border-b py-5">
              <dt className="text-ink-soft text-sm">{t(locale, COPY.whatsapp)}</dt>
              <dd className="mt-2">
                <a href={`https://wa.me/${SITE.whatsapp}?text=${waText}`} className="btn btn-quiet">
                  <WhatsAppIcon className="text-whatsapp-ink size-5" />
                  {t(locale, COPY.whatsappLink)}
                </a>
              </dd>
            </div>
            <div className="border-line border-b py-5">
              <dt className="text-ink-soft text-sm">{t(locale, COPY.email)}</dt>
              <dd>
                <a href={`mailto:${SITE.email}`} className="text-leaf inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div className="border-line border-b py-5">
              <dt className="text-ink-soft text-sm">{t(locale, COPY.office)}</dt>
              <dd className="mt-1">{t(locale, SITE.address)}</dd>
            </div>
            <div className="py-5">
              <dt className="text-ink-soft text-sm">{t(locale, COPY.payTitle)}</dt>
              <dd className="mt-1">{t(locale, COPY.pay)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </PageShell>
  );
}
