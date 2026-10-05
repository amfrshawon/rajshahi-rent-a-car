"use client";

import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { FLEET, SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

/**
 * Same-origin in production: the Node app runs under cPanel's Node.js
 * Selector mounted at /api on the same host as the static site.
 *
 * Until that service is deployed (an owner task — docs/DEPLOY.md §5b) there is
 * no endpoint to post to. The form therefore leads with WhatsApp, which always
 * works, and posts to the API in the background when it is there.
 */
const BOOKING_API = process.env.NEXT_PUBLIC_BOOKING_API ?? "/api/booking";

/** Bangladeshi mobile numbers, matching api/src/validation.js exactly. */
const PHONE_RE = /^(?:\+?880|0)1[3-9]\d{8}$/;

const COPY = {
  name: { bn: "আপনার নাম", en: "Your name" },
  phone: { bn: "মোবাইল নম্বর", en: "Mobile number" },
  vehicle: { bn: "গাড়ি", en: "Vehicle" },
  anyVehicle: { bn: "যেকোনো গাড়ি", en: "Any vehicle" },
  date: { bn: "তারিখ", en: "Date" },
  destination: { bn: "কোথায় যাবেন", en: "Destination" },
  destinationHint: { bn: "যেমন: পুঠিয়া, নাটোর, ঢাকা", en: "e.g. Puthia, Natore, Dhaka" },
  notes: { bn: "অতিরিক্ত তথ্য", en: "Anything else" },
  required: { bn: "আবশ্যক", en: "required" },
  submit: { bn: "হোয়াটসঅ্যাপে বুকিং পাঠান", en: "Send booking on WhatsApp" },
  submitHint: {
    bn: "হোয়াটসঅ্যাপ খুলবে, তথ্য আগেই বসানো থাকবে। অ্যাপ না থাকলে সরাসরি কল করুন।",
    en: "Opens WhatsApp with your details filled in. No WhatsApp? Just call us.",
  },
  nameError: { bn: "নাম লিখুন", en: "Enter your name" },
  phoneError: { bn: "সঠিক মোবাইল নম্বর দিন", en: "Enter a valid mobile number" },
} as const;

type Fields = Record<string, string>;

export function BookingForm({
  locale,
  variant = "full",
}: {
  locale: Locale;
  variant?: "full" | "quick";
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const destinationRef = useRef<HTMLInputElement>(null);

  /*
   * Route rows and trip tiles link here with ?destination=… so the customer
   * does not retype where they are going. Written straight to the field rather
   * than held in state: a fresh full page load guarantees the input is already
   * mounted, and it keeps the value out of a state-in-effect render cascade.
   */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("destination");
    if (q && destinationRef.current) destinationRef.current.value = q;
  }, []);

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

  function validate(values: Fields) {
    const next: Record<string, string> = {};
    if ((values.name ?? "").trim().length < 2) {
      next.name = t(locale, COPY.nameError);
    }
    const digits = (values.phone ?? "").replace(/[\s-]/g, "");
    if (!PHONE_RE.test(digits)) {
      next.phone = t(locale, COPY.phoneError);
    }
    return next;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      [...data.entries()].map(([k, v]) => [k, String(v).trim()]),
    ) as Fields;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    /*
     * Best-effort record for when the API exists. keepalive lets the request
     * outlive the navigation to WhatsApp; a failure here is never the
     * customer's problem and is never shown to them.
     */
    try {
      void fetch(BOOKING_API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* ignore — WhatsApp is the source of truth */
    }

    window.location.href = whatsappHref(values);
  }

  const field =
    "border-border bg-surface-raised text-fg w-full rounded-lg border px-3 py-2.5 text-base";
  const quickField =
    "border-border bg-surface text-fg w-full rounded-lg border px-3 py-2.5 text-base";
  const button =
    "press bg-whatsapp inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 font-semibold text-black transition hover:brightness-95";

  const honeypot = (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute -left-[9999px] size-0 opacity-0"
    />
  );

  if (variant === "quick") {
    return (
      <form onSubmit={handleSubmit} noValidate className="grid gap-3 md:grid-cols-4">
        <Field label={t(locale, COPY.name)} name="name" error={errors.name}>
          <input name="name" autoComplete="name" className={quickField} />
        </Field>
        <Field label={t(locale, COPY.phone)} name="phone" error={errors.phone}>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="01XXXXXXXXX"
            className={quickField}
          />
        </Field>
        <Field label={t(locale, COPY.vehicle)} name="vehicle">
          <select name="vehicle" defaultValue="" className={quickField}>
            <option value="">{t(locale, COPY.anyVehicle)}</option>
            {FLEET.map((v) => (
              <option key={v.slug} value={v.name}>
                {v.name} — {t(locale, v.type)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t(locale, COPY.date)} name="date">
          <input name="date" type="date" className={quickField} />
        </Field>

        {honeypot}

        <div className="md:col-span-4">
          <button type="submit" className={`${button} w-full`}>
            <WhatsAppIcon className="size-5" />
            {t(locale, COPY.submit)}
          </button>
          <p className="text-muted mt-2 text-sm">{t(locale, COPY.submitHint)}</p>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field
        label={`${t(locale, COPY.name)} (${t(locale, COPY.required)})`}
        name="name"
        error={errors.name}
      >
        <input name="name" autoComplete="name" className={field} />
      </Field>

      <Field
        label={`${t(locale, COPY.phone)} (${t(locale, COPY.required)})`}
        name="phone"
        error={errors.phone}
      >
        <input
          name="phone"
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
            ref={destinationRef}
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

      {honeypot}

      <div className="sm:col-span-2">
        <button type="submit" className={`${button} w-full sm:w-auto`}>
          <WhatsAppIcon className="size-5" />
          {t(locale, COPY.submit)}
        </button>
        <p className="text-muted mt-2 text-sm">{t(locale, COPY.submitHint)}</p>
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
