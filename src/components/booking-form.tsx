"use client";

import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { SITE } from "@/config/site";
import { TRIP_TYPES } from "@/config/trips";
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
  tripType: { bn: "ভাড়ার ধরন", en: "Trip type" },
  anyTrip: { bn: "যেকোনো", en: "Any" },
  date: { bn: "তারিখ", en: "Date" },
  time: { bn: "সময়", en: "Time" },
  pickup: { bn: "কোথা থেকে নেব", en: "Pick up from" },
  pickupHint: { bn: "যেমন: কাদিরগঞ্জ, উপশহর", en: "e.g. Kadirgonj, Uposhohor" },
  destination: { bn: "কোথায় যাবেন", en: "Destination" },
  destinationHint: { bn: "যেমন: পুঠিয়া, নাটোর, ঢাকা", en: "e.g. Puthia, Natore, Dhaka" },
  name: { bn: "আপনার নাম", en: "Your name" },
  phone: { bn: "মোবাইল নম্বর", en: "Mobile number" },
  notes: { bn: "অতিরিক্ত তথ্য", en: "Anything else" },
  submit: { bn: "হোয়াটসঅ্যাপে বুকিং পাঠান", en: "Send booking on WhatsApp" },
  submitHint: {
    bn: "হোয়াটসঅ্যাপ খুলবে, তথ্য আগেই বসানো থাকবে। অ্যাপ না থাকলে সরাসরি কল করুন।",
    en: "Opens WhatsApp with your details filled in. No WhatsApp? Just call us.",
  },
  callInstead: { bn: "☎ সরাসরি কল করুন", en: "☎ Call instead" },
  nameError: { bn: "নাম লিখুন", en: "Enter your name" },
  phoneError: { bn: "সঠিক মোবাইল নম্বর দিন", en: "Enter a valid mobile number" },
  newBooking: { bn: "নতুন বুকিং", en: "New booking" },
} as const;

type Fields = Record<string, string>;

export function BookingForm({ locale }: { locale: Locale }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const tripRef = useRef<HTMLSelectElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  /*
   * Trip tiles and route rows link here with ?trip=…&destination=…, so the
   * customer does not re-pick or retype. Written straight to the fields rather
   * than held in state — a full page load guarantees they are mounted, and it
   * keeps the value out of a state-in-effect render cascade.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trip = params.get("trip");
    const destination = params.get("destination");
    if (trip && tripRef.current) tripRef.current.value = trip;
    if (destination && destinationRef.current) destinationRef.current.value = destination;
  }, []);

  function whatsappHref(values: Fields) {
    const trip = TRIP_TYPES.find((tp) => tp.key === values.tripType);
    const lines: string[] = [t(locale, COPY.newBooking)];
    if (trip) lines.push(`${t(locale, COPY.tripType)}: ${t(locale, trip.label)}`);
    if (values.date) lines.push(`${t(locale, COPY.date)}: ${values.date}`);
    if (values.time) lines.push(`${t(locale, COPY.time)}: ${values.time}`);
    if (values.pickup) lines.push(`${t(locale, COPY.pickup)}: ${values.pickup}`);
    if (values.destination) lines.push(`${t(locale, COPY.destination)}: ${values.destination}`);
    lines.push(`${t(locale, COPY.name)}: ${values.name ?? ""}`);
    lines.push(`${t(locale, COPY.phone)}: ${values.phone ?? ""}`);
    if (values.notes) lines.push(`${t(locale, COPY.notes)}: ${values.notes}`);
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  function validate(values: Fields) {
    const next: Record<string, string> = {};
    if ((values.name ?? "").trim().length < 2) next.name = t(locale, COPY.nameError);
    const digits = (values.phone ?? "").replace(/[\s-]/g, "");
    if (!PHONE_RE.test(digits)) next.phone = t(locale, COPY.phoneError);
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

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field label={t(locale, COPY.tripType)} name="tripType">
        <select name="tripType" ref={tripRef} defaultValue="" className={field}>
          <option value="">{t(locale, COPY.anyTrip)}</option>
          {TRIP_TYPES.map((tp) => (
            <option key={tp.key} value={tp.key}>
              {t(locale, tp.label)}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label={t(locale, COPY.date)} name="date">
          <input name="date" type="date" className={field} />
        </Field>
        <Field label={t(locale, COPY.time)} name="time">
          <input name="time" type="time" className={field} />
        </Field>
      </div>

      <Field label={t(locale, COPY.pickup)} name="pickup">
        <input name="pickup" placeholder={t(locale, COPY.pickupHint)} className={field} />
      </Field>

      <Field label={t(locale, COPY.destination)} name="destination">
        <input
          name="destination"
          ref={destinationRef}
          placeholder={t(locale, COPY.destinationHint)}
          className={field}
        />
      </Field>

      <Field label={t(locale, COPY.name)} name="name" error={errors.name}>
        <input name="name" autoComplete="name" className={field} />
      </Field>

      <Field label={t(locale, COPY.phone)} name="phone" error={errors.phone}>
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          className={field}
        />
      </Field>

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
        <button type="submit" className="btn-whatsapp w-full sm:w-auto">
          <WhatsAppIcon className="size-5" />
          {t(locale, COPY.submit)}
        </button>
        <p className="text-muted mt-2 text-sm">{t(locale, COPY.submitHint)}</p>
        <a href={`tel:${SITE.phone}`} className="text-leaf mt-1 inline-block text-sm font-semibold">
          {t(locale, COPY.callInstead)}
        </a>
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
