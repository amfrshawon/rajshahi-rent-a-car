"use client";

import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { FLEET, SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

/**
 * Same-origin in production: the Node app runs under cPanel's Node.js
 * Selector mounted at /api on the same host as the static site.
 */
const BOOKING_API = process.env.NEXT_PUBLIC_BOOKING_API ?? "/api/booking";

/*
 * The booking API is not deployed yet: /api/booking returns 404 on dev, and
 * every submission used to end on "ইন্টারনেটে সমস্যা হয়েছে" — telling a customer
 * with perfect signal that their internet was the problem.
 *
 * Until the API answers /api/health with 200 on the target environment, the
 * form's primary action is WhatsApp. Set NEXT_PUBLIC_BOOKING_API_LIVE=true in
 * the build environment once it does.
 */
const API_LIVE = process.env.NEXT_PUBLIC_BOOKING_API_LIVE === "true";

/** Same rule as api/src/validation.js, after removing spaces and dashes. */
const BD_MOBILE = /^(?:\+?880|0)1[3-9]\d{8}$/;

const COPY = {
  name: { bn: "আপনার নাম", en: "Your name" },
  phone: { bn: "মোবাইল নম্বর", en: "Mobile number" },
  vehicle: { bn: "গাড়ি", en: "Vehicle" },
  anyVehicle: { bn: "যেকোনো গাড়ি", en: "Any vehicle" },
  date: { bn: "তারিখ", en: "Date" },
  destination: { bn: "কোথায় যাবেন", en: "Destination" },
  destinationHint: { bn: "যেমন: পুঠিয়া, নাটোর, ঢাকা", en: "e.g. Puthia, Natore, Dhaka" },
  notes: { bn: "অতিরিক্ত তথ্য", en: "Anything else" },
  submitWhatsapp: { bn: "হোয়াটসঅ্যাপে বুকিং পাঠান", en: "Send booking on WhatsApp" },
  submitApi: { bn: "বুকিং পাঠান", en: "Send booking" },
  sending: { bn: "পাঠানো হচ্ছে…", en: "Sending…" },
  required: { bn: "আবশ্যক", en: "required" },
  errName: { bn: "নাম লিখুন", en: "Enter your name" },
  errPhone: {
    bn: "সঠিক মোবাইল নম্বর দিন — যেমন ০১৭১২৩৪৫৬৭৮",
    en: "Enter a valid mobile number, for example 01712345678",
  },
  whatsappNote: {
    bn: "বোতাম চাপলে হোয়াটসঅ্যাপ খুলবে, আপনার তথ্য লেখা থাকবে। পাঠানোর আগে দেখে নিতে পারবেন।",
    en: "WhatsApp opens with your details filled in. You can check the message before sending.",
  },
  openedTitle: { bn: "হোয়াটসঅ্যাপ খোলা হয়েছে", en: "WhatsApp is open" },
  openedBody: {
    bn: "মেসেজটি পাঠালেই বুকিং আমাদের কাছে পৌঁছাবে। হোয়াটসঅ্যাপ না খুললে নিচের বোতাম চাপুন বা সরাসরি কল করুন।",
    en: "Send the message and your booking reaches us. If WhatsApp did not open, use the button below or call us.",
  },
  successTitle: { bn: "বুকিং পাওয়া গেছে", en: "Booking received" },
  successBody: {
    bn: "ধন্যবাদ! আমরা শীঘ্রই আপনাকে ফোন করে বুকিং নিশ্চিত করব।",
    en: "Thank you. We will call you shortly to confirm.",
  },
  reference: { bn: "রেফারেন্স নম্বর", en: "Reference" },
  alsoWhatsapp: { bn: "হোয়াটসঅ্যাপেও পাঠান", en: "Also send on WhatsApp" },
  failedTitle: { bn: "বুকিং আমাদের সার্ভারে পৌঁছায়নি", en: "Your booking did not reach us" },
  failedBody: {
    bn: "সমস্যাটি আমাদের দিকে। একই তথ্য হোয়াটসঅ্যাপে পাঠান, অথবা সরাসরি কল করুন।",
    en: "The problem is on our side. Send the same details on WhatsApp, or call us.",
  },
  sendOnWhatsapp: { bn: "হোয়াটসঅ্যাপে পাঠান", en: "Send on WhatsApp" },
  callInstead: { bn: "কল করুন", en: "Call us" },
} as const;

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "opened" }
  | { kind: "sent"; id: number | null }
  | { kind: "failed" };

type Fields = Record<string, string>;
type Errors = Partial<Record<"name" | "phone", string>>;

function validate(locale: Locale, values: Fields): Errors {
  const errors: Errors = {};
  if ((values.name ?? "").trim().length < 2) errors.name = t(locale, COPY.errName);
  const phone = (values.phone ?? "").replace(/[\s-]/g, "");
  if (!BD_MOBILE.test(phone)) errors.phone = t(locale, COPY.errPhone);
  return errors;
}

/**
 * Quick variant: the hero's inline widget (name / phone / vehicle / date in one
 * row). Shares the exact submit path, validation and WhatsApp handling as the
 * full form — one behaviour, two densities.
 *
 * Both read ?to=, ?vehicle= and ?trip= from the address on load, so a route,
 * a car or a trip type tapped elsewhere arrives already filled in.
 */
export function BookingForm({
  locale,
  variant = "full",
}: {
  locale: Locale;
  variant?: "full" | "quick";
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Errors>({});
  const [lastValues, setLastValues] = useState<Fields>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Prefill from the query string. Static export: read it on the client.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const params = new URLSearchParams(window.location.search);
    const set = (name: string, value: string | null) => {
      const el = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
      if (el && value) el.value = value;
    };
    const trip = params.get("trip");
    set("destination", params.get("to") ?? trip);
    set("vehicle", params.get("vehicle"));
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      [...data.entries()].map(([k, v]) => [k, String(v).trim()]),
    ) as Fields;

    // Check on the phone first: nothing is sent until name and number are valid.
    const found = validate(locale, values);
    setErrors(found);
    if (found.name || found.phone) {
      const first = event.currentTarget.elements.namedItem(found.name ? "name" : "phone");
      (first as HTMLElement | null)?.focus();
      return;
    }

    setLastValues(values);

    if (!API_LIVE) {
      setStatus({ kind: "opened" });
      window.location.href = whatsappHref(values);
      return;
    }

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
      // Never lose the booking, and never blame the customer's connection.
      setStatus({ kind: "failed" });
    }
  }

  if (status.kind === "opened" || status.kind === "sent" || status.kind === "failed") {
    const title =
      status.kind === "opened" ? COPY.openedTitle : status.kind === "sent" ? COPY.successTitle : COPY.failedTitle;
    const body =
      status.kind === "opened" ? COPY.openedBody : status.kind === "sent" ? COPY.successBody : COPY.failedBody;
    return (
      <div role="status" className="border-border bg-surface-raised rounded-lg border p-5">
        <h3 className="text-lg font-semibold">{t(locale, title)}</h3>
        <p className="text-muted mt-2">{t(locale, body)}</p>
        {status.kind === "sent" && status.id ? (
          <p className="text-muted mt-2 text-sm">
            {t(locale, COPY.reference)}: #{status.id}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={whatsappHref(lastValues)}
            className="bg-whatsapp inline-flex min-h-12 items-center gap-2 rounded-lg px-5 font-semibold text-black transition active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-5" />
            {t(locale, status.kind === "sent" ? COPY.alsoWhatsapp : COPY.sendOnWhatsapp)}
          </a>
          <a
            href={`tel:${SITE.phone}`}
            className="border-border inline-flex min-h-12 items-center rounded-lg border px-5 font-semibold"
          >
            {t(locale, COPY.callInstead)}
          </a>
        </div>
      </div>
    );
  }

  const field =
    "border-border bg-surface-raised text-fg w-full rounded-lg border px-3 py-2.5 text-base aria-[invalid=true]:border-emergency";
  const sending = status.kind === "sending";
  const submitLabel = sending
    ? t(locale, COPY.sending)
    : t(locale, API_LIVE ? COPY.submitApi : COPY.submitWhatsapp);
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

  const nameField = (
    <Field label={`${t(locale, COPY.name)} (${t(locale, COPY.required)})`} name="name" error={errors.name}>
      <input
        id="booking-name"
        name="name"
        autoComplete="name"
        aria-invalid={errors.name ? true : undefined}
        aria-describedby={errors.name ? "name-error" : undefined}
        className={field}
      />
    </Field>
  );
  const phoneField = (
    <Field label={`${t(locale, COPY.phone)} (${t(locale, COPY.required)})`} name="phone" error={errors.phone}>
      <input
        id="booking-phone"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="01XXXXXXXXX"
        aria-invalid={errors.phone ? true : undefined}
        aria-describedby={errors.phone ? "phone-error" : undefined}
        className={field}
      />
    </Field>
  );
  const vehicleField = (
    <Field label={t(locale, COPY.vehicle)} name="vehicle">
      <select id="booking-vehicle" name="vehicle" defaultValue="" className={field}>
        <option value="">{t(locale, COPY.anyVehicle)}</option>
        {FLEET.map((v) => (
          <option key={v.slug} value={v.name}>
            {v.name} — {t(locale, v.type)}
          </option>
        ))}
      </select>
    </Field>
  );
  const dateField = (
    <Field label={t(locale, COPY.date)} name="date">
      <input id="booking-date" name="date" type="date" className={field} />
    </Field>
  );
  const submit = (
    <button
      type="submit"
      disabled={sending}
      className="bg-brand text-brand-fg inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-6 font-semibold transition active:scale-[0.98] disabled:opacity-70"
    >
      {API_LIVE ? null : <WhatsAppIcon className="size-5" />}
      {submitLabel}
    </button>
  );

  if (variant === "quick") {
    return (
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-3 md:grid-cols-4">
        {nameField}
        {phoneField}
        {vehicleField}
        {dateField}
        <input type="hidden" name="destination" />
        {honeypot}
        <div className="md:col-span-4">{submit}</div>
      </form>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      {nameField}
      {phoneField}
      {vehicleField}
      {dateField}
      <div className="sm:col-span-2">
        <Field label={t(locale, COPY.destination)} name="destination">
          <input
            id="booking-destination"
            name="destination"
            placeholder={t(locale, COPY.destinationHint)}
            className={field}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label={t(locale, COPY.notes)} name="notes">
          <textarea id="booking-notes" name="notes" rows={3} className={field} />
        </Field>
      </div>
      {honeypot}
      <div className="grid gap-2 sm:col-span-2">
        {submit}
        {API_LIVE ? null : <p className="text-muted text-sm">{t(locale, COPY.whatsappNote)}</p>}
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
        <span id={`${name}-error`} role="alert" className="text-emergency-ink text-sm font-medium">
          {error}
        </span>
      ) : null}
    </label>
  );
}
