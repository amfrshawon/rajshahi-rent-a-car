"use client";

import { useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { FLEET, SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

/**
 * Same-origin in production: the Node app runs under cPanel's Node.js
 * Selector mounted at /api on the same host as the static site.
 */
const BOOKING_API = process.env.NEXT_PUBLIC_BOOKING_API ?? "/api/booking";

const COPY = {
  name: { bn: "আপনার নাম", en: "Your name" },
  phone: { bn: "মোবাইল নম্বর", en: "Mobile number" },
  vehicle: { bn: "গাড়ি", en: "Vehicle" },
  anyVehicle: { bn: "যেকোনো গাড়ি", en: "Any vehicle" },
  date: { bn: "তারিখ", en: "Date" },
  destination: { bn: "কোথায় যাবেন", en: "Destination" },
  destinationHint: { bn: "যেমন: পুঠিয়া, নাটোর, ঢাকা", en: "e.g. Puthia, Natore, Dhaka" },
  notes: { bn: "অতিরিক্ত তথ্য", en: "Anything else" },
  submit: { bn: "বুকিং পাঠান", en: "Send booking" },
  sending: { bn: "পাঠানো হচ্ছে…", en: "Sending…" },
  required: { bn: "আবশ্যক", en: "required" },
  successTitle: { bn: "বুকিং পাওয়া গেছে", en: "Booking received" },
  successBody: {
    bn: "ধন্যবাদ! আমরা শীঘ্রই আপনাকে ফোন করে বুকিং নিশ্চিত করব।",
    en: "Thank you. We will call you shortly to confirm.",
  },
  reference: { bn: "রেফারেন্স নম্বর", en: "Reference" },
  alsoWhatsapp: { bn: "হোয়াটসঅ্যাপেও পাঠান", en: "Also send on WhatsApp" },
  failedTitle: { bn: "পাঠানো যায়নি", en: "Could not send" },
  failedBody: {
    bn: "ইন্টারনেটে সমস্যা হয়েছে। নিচের বোতামে চাপ দিয়ে হোয়াটসঅ্যাপে পাঠান, অথবা সরাসরি কল করুন।",
    en: "Something went wrong. Send it on WhatsApp instead, or just call us.",
  },
  sendOnWhatsapp: { bn: "হোয়াটসঅ্যাপে পাঠান", en: "Send on WhatsApp" },
  callInstead: { bn: "কল করুন", en: "Call us" },
} as const;

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; id: number | null }
  | { kind: "failed" };

type Fields = Record<string, string>;

export function BookingForm({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastValues, setLastValues] = useState<Fields>({});

  function whatsappHref(values: Fields) {
    const lines = [
      t(locale, { bn: "নতুন বুকিং", en: "New booking" }),
      `${t(locale, COPY.name)}: ${values.name ?? ""}`,
      `${t(locale, COPY.phone)}: ${values.phone ?? ""}`,
    ];
    if (values.vehicle) lines.push(`${t(locale, COPY.vehicle)}: ${values.vehicle}`);
    if (values.date) lines.push(`${t(locale, COPY.date)}: ${values.date}`);
    if (values.destination) lines.push(`${t(locale, COPY.destination)}: ${values.destination}`);
    if (values.notes) lines.push(`${t(locale, COPY.notes)}: ${values.notes}`);
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      [...data.entries()].map(([k, v]) => [k, String(v).trim()]),
    ) as Fields;

    setLastValues(values);
    setErrors({});
    setStatus({ kind: "sending" });

    try {
      const response = await fetch(BOOKING_API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });
      const result = await response.json();

      if (response.status === 422 && Array.isArray(result.issues)) {
        setErrors(
          Object.fromEntries(
            result.issues.map((i: { path: string; message: string }) => [i.path, i.message]),
          ),
        );
        setStatus({ kind: "idle" });
        return;
      }

      if (!response.ok || !result.ok) throw new Error(result.error ?? "failed");
      setStatus({ kind: "sent", id: result.id ?? null });
    } catch {
      // Never lose the booking: hand the customer straight to WhatsApp.
      setStatus({ kind: "failed" });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className="border-brand bg-brand-soft rounded-xl border p-6">
        <h3 className="text-brand text-lg font-semibold">{t(locale, COPY.successTitle)}</h3>
        <p className="mt-2">{t(locale, COPY.successBody)}</p>
        {status.id ? (
          <p className="text-muted mt-2 text-sm">
            {t(locale, COPY.reference)}: #{status.id}
          </p>
        ) : null}
        <a
          href={whatsappHref(lastValues)}
          className="bg-whatsapp mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl px-5 font-semibold text-black transition active:scale-[0.98]"
        >
          <WhatsAppIcon className="size-5" />
          {t(locale, COPY.alsoWhatsapp)}
        </a>
      </div>
    );
  }

  if (status.kind === "failed") {
    return (
      <div className="border-accent bg-accent-soft rounded-xl border p-6">
        <h3 className="text-lg font-semibold">{t(locale, COPY.failedTitle)}</h3>
        <p className="mt-2">{t(locale, COPY.failedBody)}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={whatsappHref(lastValues)}
            className="bg-whatsapp inline-flex min-h-12 items-center gap-2 rounded-xl px-5 font-semibold text-black transition active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-5" />
            {t(locale, COPY.sendOnWhatsapp)}
          </a>
          <a
            href={`tel:${SITE.phone}`}
            className="border-border inline-flex min-h-12 items-center rounded-xl border px-5 font-semibold"
          >
            {t(locale, COPY.callInstead)}
          </a>
        </div>
      </div>
    );
  }

  const field =
    "border-border bg-surface-raised text-fg w-full rounded-lg border px-3 py-2.5 text-base";
  const sending = status.kind === "sending";

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field
        label={`${t(locale, COPY.name)} (${t(locale, COPY.required)})`}
        name="name"
        error={errors.name}
      >
        <input name="name" required autoComplete="name" className={field} />
      </Field>

      <Field
        label={`${t(locale, COPY.phone)} (${t(locale, COPY.required)})`}
        name="phone"
        error={errors.phone}
      >
        <input
          name="phone"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          className={field}
        />
      </Field>

      <Field label={t(locale, COPY.vehicle)} name="vehicle">
        <select name="vehicle" defaultValue="" className={field}>
          <option value="">{t(locale, COPY.anyVehicle)}</option>
          {FLEET.map((v) => (
            <option key={v.slug} value={v.name}>
              {v.name} — {t(locale, v.type)}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t(locale, COPY.date)} name="date">
        <input name="date" type="date" className={field} />
      </Field>

      <div className="sm:col-span-2">
        <Field label={t(locale, COPY.destination)} name="destination">
          <input
            name="destination"
            placeholder={t(locale, COPY.destinationHint)}
            className={field}
          />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <Field label={t(locale, COPY.notes)} name="notes">
          <textarea name="notes" rows={3} className={field} />
        </Field>
      </div>

      {/* Honeypot. Hidden from people, tempting to bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] size-0 opacity-0"
      />

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={sending}
          className="bg-accent text-accent-fg inline-flex min-h-12 w-full items-center justify-center rounded-xl px-6 font-semibold transition active:scale-[0.98] disabled:opacity-70 sm:w-auto"
        >
          {sending ? t(locale, COPY.sending) : t(locale, COPY.submit)}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error ? (
        <span role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </span>
      ) : (
        <span className="sr-only" id={`${name}-no-error`} />
      )}
    </label>
  );
}
