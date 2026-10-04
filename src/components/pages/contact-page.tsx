import { BookingForm } from "@/components/booking-form";
import { ClockIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

const COPY = {
  title: { bn: "যোগাযোগ ও বুকিং", en: "Contact & Booking" },
  lead: {
    bn: "দিনরাত ২৪ ঘণ্টা খোলা। ফোন, হোয়াটসঅ্যাপ বা নিচের ফর্ম — যেভাবে সুবিধা।",
    en: "Open 24 hours. Phone, WhatsApp or the form below — whichever suits you.",
  },
  formTitle: { bn: "বুকিং ফর্ম", en: "Booking form" },
  formLead: {
    bn: "ফর্ম পাঠানোর পর আমরা ফোন করে বুকিং নিশ্চিত করব।",
    en: "After you send the form, we call you back to confirm.",
  },
  phone: { bn: "ফোন", en: "Phone" },
  email: { bn: "ইমেইল", en: "Email" },
  office: { bn: "অফিস", en: "Office" },
  hours: { bn: "সময়", en: "Hours" },
  whatsapp: { bn: "হোয়াটসঅ্যাপে মেসেজ", en: "Message on WhatsApp" },
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

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 md:px-6 lg:grid-cols-[1fr_1.3fr] md:py-16">
        <div className="reveal">
          <dl className="grid gap-4">
            <div className="border-border bg-surface-raised shadow-card flex items-start gap-4 rounded-2xl border p-5">
              <span className="bg-brand-soft text-brand mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl">
                <PhoneIcon className="size-5" />
              </span>
              <div>
                <dt className="text-muted text-sm">{t(locale, COPY.phone)}</dt>
                <dd className="mt-0.5 text-lg font-semibold">
                  <a href={`tel:${SITE.phone}`} className="hover:text-brand">
                    {t(locale, SITE.phoneDisplay)}
                  </a>
                </dd>
              </div>
            </div>
            <div className="border-border bg-surface-raised shadow-card flex items-start gap-4 rounded-2xl border p-5">
              <span className="bg-brand-soft text-brand mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl">
                <MapPinIcon className="size-5" />
              </span>
              <div>
                <dt className="text-muted text-sm">{t(locale, COPY.office)}</dt>
                <dd className="mt-0.5">{t(locale, SITE.address)}</dd>
              </div>
            </div>
            <div className="border-border bg-surface-raised shadow-card flex items-start gap-4 rounded-2xl border p-5">
              <span className="bg-brand-soft text-brand mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl">
                <ClockIcon className="size-5" />
              </span>
              <div>
                <dt className="text-muted text-sm">{t(locale, COPY.hours)}</dt>
                <dd className="mt-0.5">{t(locale, SITE.hours)}</dd>
                <dd className="text-muted mt-1">
                  <a href={`mailto:${SITE.email}`} className="hover:text-brand">
                    {SITE.email}
                  </a>
                </dd>
              </div>
            </div>
          </dl>

          <a
            href={`https://wa.me/${SITE.whatsapp}?text=${waText}`}
            className="press bg-whatsapp mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 font-semibold text-black transition hover:brightness-95"
          >
            <WhatsAppIcon className="size-5" />
            {t(locale, COPY.whatsapp)}
          </a>
        </div>

        <div id="booking" className="reveal scroll-mt-24">
          <h2 className="text-2xl font-semibold">{t(locale, COPY.formTitle)}</h2>
          <p className="text-muted mt-1">{t(locale, COPY.formLead)}</p>
          <div className="mt-5">
            <BookingForm locale={locale} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
