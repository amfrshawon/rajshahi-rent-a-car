import { BookingForm } from "@/components/booking-form";
import { WhatsAppIcon } from "@/components/icons";
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
  payTitle: { bn: "পেমেন্ট মাধ্যম", en: "Payment" },
  payLead: {
    bn: "বাংলা কিউআর — সব মোবাইল ফাইন্যান্সিয়াল সার্ভিস ও ব্যাংক ট্রান্সফার।",
    en: "Bangla QR — every mobile financial service and bank transfer.",
  },
} as const;

/** Accepted channels; one Bangla QR scan covers all of them. */
const PAYMENTS = [
  { bn: "বিকাশ", en: "bKash" },
  { bn: "নগদ", en: "Nagad" },
  { bn: "রকেট", en: "Rocket" },
  { bn: "উপায়", en: "Upay" },
  { bn: "ব্যাংক ট্রান্সফার", en: "Bank transfer" },
] as const;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-border grid gap-1 border-b py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
      <dt className="text-muted text-sm">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

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

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-8 md:px-6 md:py-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          {/* Real contact methods as a plain list — no icon cards. */}
          <dl className="border-border border-t">
            <Row label={t(locale, COPY.phone)}>
              <a
                href={`tel:${SITE.phone}`}
                className="text-leaf inline-flex min-h-11 items-center font-semibold"
              >
                {t(locale, SITE.phoneDisplay)}
              </a>
            </Row>
            <Row label={t(locale, COPY.email)}>
              <a
                href={`mailto:${SITE.email}`}
                className="text-leaf inline-flex min-h-11 items-center"
              >
                {SITE.email}
              </a>
            </Row>
            <Row label={t(locale, COPY.office)}>{t(locale, SITE.address)}</Row>
            <Row label={t(locale, COPY.hours)}>{t(locale, SITE.hours)}</Row>
          </dl>

          <a
            href={`https://wa.me/${SITE.whatsapp}?text=${waText}`}
            className="btn-whatsapp mt-4 w-full"
          >
            <WhatsAppIcon className="size-5" />
            {t(locale, COPY.whatsapp)}
          </a>

          {/*
            Bangla QR is the Bangladesh Bank unified QR standard — one merchant
            QR payable from every MFS app and banking app.
          */}
          <div className="border-border mt-6 border-t pt-4">
            <h2 className="font-bold">{t(locale, COPY.payTitle)}</h2>
            <p className="text-muted mt-1 text-sm">{t(locale, COPY.payLead)}</p>
            <ul className="text-muted mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
              {PAYMENTS.map((p) => (
                <li key={p.en}>{t(locale, p)}</li>
              ))}
            </ul>
          </div>
        </div>

        <div id="booking" className="scroll-mt-24">
          <h2 className="text-2xl font-bold">{t(locale, COPY.formTitle)}</h2>
          <p className="text-muted mt-1">{t(locale, COPY.formLead)}</p>
          <div className="mt-5">
            <BookingForm locale={locale} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
