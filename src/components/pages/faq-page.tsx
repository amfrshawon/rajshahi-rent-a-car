import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { FLEET, SITE } from "@/config/site";
import { formatTaka, type Locale, t } from "@/lib/locale";

/*
 * Every answer here is supportable from the existing site. Anything not
 * published there — fuel policy, deposits, cancellation terms — is absent by
 * design; add it once the owner confirms.
 */

const COPY = {
  title: { bn: "সাধারণ জিজ্ঞাসা", en: "Frequently Asked Questions" },
  lead: {
    bn: "যেসব প্রশ্ন সবচেয়ে বেশি করা হয়। উত্তর না পেলে সরাসরি কল করুন।",
    en: "The questions we are asked most. If yours is not here, just call.",
  },
} as const;

function buildFaqs(locale: Locale) {
  const rates = FLEET.map(
    (v) => `${v.name} ৳${formatTaka(locale, v.pricePerDay)}`,
  ).join(", ");

  return [
    {
      q: { bn: "কীভাবে গাড়ি বুক করবো?", en: "How do I book a car?" },
      a: {
        bn: `সরাসরি ${SITE.phoneDisplay.bn} নম্বরে কল করুন, হোয়াটসঅ্যাপে মেসেজ দিন, অথবা ওয়েবসাইটের বুকিং ফর্ম পূরণ করুন। দিনরাত ২৪ ঘণ্টা যোগাযোগ করা যায়।`,
        en: `Call ${SITE.phoneDisplay.en}, message us on WhatsApp, or fill in the booking form on this site. We answer 24 hours a day.`,
      },
    },
    {
      q: { bn: "কী কী গাড়ি পাওয়া যায়?", en: "Which vehicles are available?" },
      a: {
        bn: "টয়োটা প্রিমিও ও এক্সিও (প্রাইভেট কার, ৪ আসন) এবং টয়োটা হাইএস (মাইক্রোবাস, ১৫ আসন)। সবগুলোই এসি।",
        en: "Toyota Premio and Axio sedans (4 seats) and a Toyota Hiace microbus (15 seats). All are air-conditioned.",
      },
    },
    {
      q: { bn: "ভাড়া কত?", en: "What are the rates?" },
      a: {
        bn: `শহরের ভেতরে দৈনিক ভাড়া — ${rates}। শহরের বাইরের ট্রিপের ভাড়া দূরত্ব অনুযায়ী নির্ধারিত হয়।`,
        en: `Day rates within the city are ${rates}. Outstation trips are quoted by distance.`,
      },
    },
    {
      q: { bn: "ড্রাইভার কি সাথে থাকে?", en: "Does the car come with a driver?" },
      a: {
        bn: "হ্যাঁ, সব গাড়ি অভিজ্ঞ ড্রাইভারসহ ভাড়া দেওয়া হয়।",
        en: "Yes. Every vehicle is rented with an experienced driver.",
      },
    },
    {
      q: { bn: "রাজশাহীর বাইরে যাওয়া যাবে?", en: "Can I travel outside Rajshahi?" },
      a: {
        bn: "যাবে। নাটোর, চাঁপাইনবাবগঞ্জসহ আশেপাশের জেলা এবং ঢাকার মতো দূরের গন্তব্যেও যাওয়া যায়।",
        en: "Yes — to the neighbouring districts and to farther destinations such as Dhaka.",
      },
    },
    {
      q: { bn: "অ্যাম্বুলেন্স সার্ভিস আছে?", en: "Do you offer an ambulance service?" },
      a: {
        bn: "হ্যাঁ, ২৪ ঘণ্টা অ্যাম্বুলেন্স সার্ভিস রয়েছে। জরুরি প্রয়োজনে সরাসরি কল করুন।",
        en: "Yes, 24 hours a day. Call us directly in an emergency.",
      },
    },
  ] as const;
}

export function FaqPage({ locale }: { locale: Locale }) {
  const faqs = buildFaqs(locale);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: t(locale, f.q),
      acceptedAnswer: { "@type": "Answer", text: t(locale, f.a) },
    })),
  };

  return (
    <PageShell locale={locale}>
      <PageHeader title={t(locale, COPY.title)} lead={t(locale, COPY.lead)} />

      <section className="mx-auto w-full max-w-3xl px-4 py-12">
        <dl className="space-y-4">
          {faqs.map((f) => (
            <div
              key={f.q.en}
              className="border-border bg-surface-raised rounded-xl border p-5"
            >
              <dt className="text-lg font-semibold">{t(locale, f.q)}</dt>
              <dd className="text-muted mt-2">{t(locale, f.a)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </PageShell>
  );
}
