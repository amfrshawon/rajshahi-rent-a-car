import { BookingForm } from "@/components/booking-form";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
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
          <div className="grid gap-4">
            <div className="border-border bg-surface-raised shadow-card flex items-start gap-4 rounded-2xl border p-5">
              <span className="bg-brand-soft text-leaf mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl">
                <PhoneIcon className="size-5" />
              </span>
              <div>
                <p className="text-muted text-sm">{t(locale, COPY.phone)}</p>
                <p className="mt-0.5 text-lg font-semibold">
                  <a href={`tel:${SITE.phone}`} className="hover:text-leaf">
                    {t(locale, SITE.phoneDisplay)}
                  </a>
                </p>
              </div>
            </div>
            <div className="border-border bg-surface-raised shadow-card flex items-start gap-4 rounded-2xl border p-5">
              <span className="bg-brand-soft text-leaf mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl">
                <MapPinIcon className="size-5" />
              </span>
              <div>
                <p className="text-muted text-sm">{t(locale, COPY.office)}</p>
                <p className="mt-0.5">{t(locale, SITE.address)}</p>
              </div>
            </div>
            <div className="border-border bg-surface-raised shadow-card flex items-start gap-4 rounded-2xl border p-5">
              <span className="bg-brand-soft text-leaf mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl">
                <ClockIcon className="size-5" />
              </span>
              <div>
                <p className="text-muted text-sm">{t(locale, COPY.hours)}</p>
                <p className="mt-0.5">{t(locale, SITE.hours)}</p>
              </div>
            </div>
            <div className="border-border bg-surface-raised shadow-card flex items-start gap-4 rounded-2xl border p-5">
              <span className="bg-brand-soft text-leaf mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl">
                <MailIcon className="size-5" />
              </span>
              <div>
                <p className="text-muted text-sm">{t(locale, COPY.email)}</p>
                <p className="mt-0.5">
                  <a href={`mailto:${SITE.email}`} className="hover:text-leaf">
                    {SITE.email}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${SITE.whatsapp}?text=${waText}`}
            className="press bg-whatsapp mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 font-semibold text-black transition hover:brightness-95"
          >
            <WhatsAppIcon className="size-5" />
            {t(locale, COPY.whatsapp)}
          </a>

          {/*
            Bangla QR is the Bangladesh Bank unified QR standard — one merchant
            QR payable from every MFS app and banking app. Channels are named
            as chips so a customer recognises their own without reading.
          */}
          <div className="border-border bg-surface-raised shadow-card mt-4 rounded-2xl border p-5">
            <h2 className="font-semibold">{t(locale, COPY.payTitle)}</h2>
            <p className="text-muted mt-1 text-sm">{t(locale, COPY.payLead)}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {PAYMENTS.map((p) => (
                <li
                  key={p.en}
                  className="border-border bg-surface text-muted rounded-full border px-3 py-1 text-sm"
                >
                  {t(locale, p)}
                </li>
              ))}
            </ul>
          </div>
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
