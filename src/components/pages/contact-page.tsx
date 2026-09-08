import { BookingForm } from "@/components/booking-form";
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
  phone: { bn: "ফোন", en: "Phone" },
  email: { bn: "ইমেইল", en: "Email" },
  office: { bn: "অফিস", en: "Office" },
  hours: { bn: "সময়", en: "Hours" },
} as const;

export function ContactPage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale}>
      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)} />

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <dl className="grid gap-5">
            <div>
              <dt className="text-muted text-sm">{t(locale, COPY.phone)}</dt>
              <dd className="mt-1 text-lg font-semibold">
                <a href={`tel:${SITE.phone}`} className="hover:text-brand">
                  {t(locale, SITE.phoneDisplay)}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-muted text-sm">{t(locale, COPY.email)}</dt>
              <dd className="mt-1">
                <a href={`mailto:${SITE.email}`} className="hover:text-brand">
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-muted text-sm">{t(locale, COPY.office)}</dt>
              <dd className="mt-1">{t(locale, SITE.address)}</dd>
            </div>
            <div>
              <dt className="text-muted text-sm">{t(locale, COPY.hours)}</dt>
              <dd className="mt-1">{t(locale, SITE.hours)}</dd>
            </div>
          </dl>
        </div>

        <div id="booking" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold">{t(locale, COPY.formTitle)}</h2>
          <div className="mt-5">
            <BookingForm locale={locale} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
