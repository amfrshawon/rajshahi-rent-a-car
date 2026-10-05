"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { FLEET, SITE } from "@/config/site";
import { TRIPS, isTripKey } from "@/config/trips";
import { type Locale, formatTaka, localeDigits, t } from "@/lib/locale";

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
  stepTrip: { bn: "কোন ধরনের যাত্রা", en: "What kind of trip" },
  stepWhen: { bn: "কবে, কখন", en: "When" },
  stepWhere: { bn: "কোথা থেকে, কোথায়", en: "From where, to where" },
  stepCar: { bn: "গাড়ি", en: "Car" },
  stepYou: { bn: "আপনার নাম ও নম্বর", en: "Your name and number" },

  date: { bn: "তারিখ", en: "Date" },
  time: { bn: "সময়", en: "Time" },
  pickup: { bn: "কোথা থেকে উঠবেন", en: "Pickup point" },
  pickupHint: { bn: "যেমন: সাহেব বাজার, রেলস্টেশন", en: "e.g. Shaheb Bazar, the railway station" },
  destination: { bn: "কোথায় যাবেন", en: "Destination" },
  destinationHint: { bn: "যেমন: পুঠিয়া, নাটোর, ঢাকা", en: "e.g. Puthia, Natore, Dhaka" },
  anyCar: { bn: "যেকোনো গাড়ি", en: "Any car" },
  anyCarNote: { bn: "যাত্রী আর রুট শুনে আমরা বলে দেব", en: "We will suggest one for your group and route" },
  seats: { bn: "আসন", en: "seats" },
  perDay: { bn: "/ দিন", en: "a day" },
  name: { bn: "নাম", en: "Name" },
  phone: { bn: "মোবাইল নম্বর", en: "Mobile number" },
  notes: { bn: "আর কিছু জানাতে চাইলে", en: "Anything else" },
  optional: { bn: "ঐচ্ছিক", en: "optional" },

  submitWhatsapp: { bn: "হোয়াটসঅ্যাপে বুকিং পাঠান", en: "Send booking on WhatsApp" },
  submitApi: { bn: "বুকিং পাঠান", en: "Send booking" },
  sending: { bn: "পাঠানো হচ্ছে…", en: "Sending…" },
  whatsappNote: {
    bn: "হোয়াটসঅ্যাপ খুলবে, আপনার তথ্য লেখা থাকবে। পাঠানোর আগে দেখে নিতে পারবেন।",
    en: "WhatsApp opens with your details written out. You can check the message before sending.",
  },

  errName: { bn: "নাম লিখুন", en: "Enter your name" },
  errPhone: {
    bn: "সঠিক মোবাইল নম্বর দিন — যেমন ০১৭১২৩৪৫৬৭৮",
    en: "Enter a valid mobile number, for example 01712345678",
  },

  message: { bn: "নতুন বুকিং", en: "New booking" },
  msgTrip: { bn: "যাত্রা", en: "Trip" },
  msgWhen: { bn: "কবে", en: "When" },
  msgPickup: { bn: "পিকআপ", en: "Pickup" },
  msgDestination: { bn: "গন্তব্য", en: "Destination" },
  msgPhone: { bn: "মোবাইল", en: "Mobile" },
  msgNotes: { bn: "অন্যান্য", en: "Notes" },

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
  startOver: { bn: "ফর্মে ফিরে যান", en: "Back to the form" },
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
 * "09:30" -> "সকাল ৯:৩০" / "9:30 am". Bangla names the part of the day
 * rather than writing AM/PM, which the bn-BD locale leaves in Latin.
 */
function describeTime(locale: Locale, time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mm = String(m).padStart(2, "0");
  if (locale === "en") return `${h12}:${mm} ${h < 12 ? "am" : "pm"}`;
  const period =
    h >= 4 && h < 12 ? "সকাল" : h < 16 && h >= 12 ? "দুপুর" : h >= 16 && h < 18 ? "বিকেল" : h >= 18 && h < 20 ? "সন্ধ্যা" : "রাত";
  return `${period} ${localeDigits(locale, `${h12}:${mm}`)}`;
}

/** "2026-10-12" + "09:30" -> "সোমবার, ১২ অক্টোবর, সকাল ৯:৩০". */
function describeWhen(locale: Locale, date: string, time: string): string {
  const parts: string[] = [];
  if (date) {
    const d = new Date(`${date}T00:00`);
    if (!Number.isNaN(d.getTime())) {
      parts.push(
        d.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
      );
    }
  }
  if (time) parts.push(describeTime(locale, time));
  return parts.join(", ");
}

/**
 * The booking flow: trip, when, where, car, then name and number. Only the
 * last two are required. A trip tile, a route row or a car elsewhere on the
 * site links here with ?trip=, ?to= or ?vehicle= set, and those arrive
 * already chosen.
 *
 * Nothing is sent until name and number pass the same checks the server
 * uses, with the message in Bangla under the field.
 */
export function BookingForm({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Errors>({});
  const [lastValues, setLastValues] = useState<Fields>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Prefill from the query string; a static export can only read it here.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const params = new URLSearchParams(window.location.search);

    const trip = params.get("trip");
    if (isTripKey(trip)) {
      const radio = form.querySelector<HTMLInputElement>(`input[name="trip"][value="${trip}"]`);
      if (radio) radio.checked = true;
    }
    const vehicle = params.get("vehicle");
    const car = FLEET.find((v) => v.slug === vehicle);
    if (car) {
      const radio = form.querySelector<HTMLInputElement>(`input[name="vehicle"][value="${car.slug}"]`);
      if (radio) radio.checked = true;
    }
    const to = params.get("to");
    const destination = form.elements.namedItem("destination") as HTMLInputElement | null;
    if (to && destination) destination.value = to;

    // Today, in the visitor's own clock, as the earliest date.
    const date = form.elements.namedItem("date") as HTMLInputElement | null;
    if (date) {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      date.min = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    }
  }, []);

  const tripLabel = (key: string) => {
    const trip = TRIPS.find((x) => x.key === key);
    return trip ? t(locale, trip.label) : "";
  };
  const carName = (slug: string) => FLEET.find((v) => v.slug === slug)?.name ?? "";

  function whatsappHref(values: Fields) {
    const when = describeWhen(locale, values.date ?? "", values.time ?? "");
    const lines = [`*${t(locale, COPY.message)}*`];
    const add = (label: { bn: string; en: string }, value: string | undefined) => {
      if (value) lines.push(`${t(locale, label)}: ${value}`);
    };
    add(COPY.msgTrip, tripLabel(values.trip ?? ""));
    add(COPY.msgWhen, when);
    add(COPY.msgPickup, values.pickup);
    add(COPY.msgDestination, values.destination);
    add(COPY.stepCar, carName(values.vehicle ?? ""));
    add(COPY.name, values.name);
    add(COPY.msgPhone, values.phone);
    add(COPY.msgNotes, values.notes);
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = Object.fromEntries(
      [...data.entries()].map(([k, v]) => [k, String(v).trim()]),
    ) as Fields;

    const found = validate(locale, values);
    setErrors(found);
    if (found.name || found.phone) {
      const first = form.elements.namedItem(found.name ? "name" : "phone");
      (first as HTMLElement | null)?.focus();
      return;
    }

    setLastValues(values);

    if (!API_LIVE) {
      setStatus({ kind: "opened" });
      window.location.href = whatsappHref(values);
      return;
    }

    // The API's schema has no fields for trip, time or pickup, so they
    // travel in the notes.
    const extra = [
      values.trip ? `${t(locale, COPY.msgTrip)}: ${tripLabel(values.trip)}` : "",
      values.time ? `${t(locale, COPY.time)}: ${describeTime(locale, values.time)}` : "",
      values.pickup ? `${t(locale, COPY.msgPickup)}: ${values.pickup}` : "",
      values.notes ?? "",
    ].filter(Boolean);

    setStatus({ kind: "sending" });
    try {
      const response = await fetch(BOOKING_API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          vehicle: carName(values.vehicle ?? ""),
          date: values.date,
          destination: values.destination,
          notes: extra.join("\n"),
          website: values.website,
          locale,
        }),
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
      <div role="status" className="border-line bg-raised rounded-lg border p-6 md:p-8">
        <h3 className="text-2xl">{t(locale, title)}</h3>
        <p className="text-ink-soft mt-3 max-w-xl">{t(locale, body)}</p>
        {status.kind === "sent" && status.id ? (
          <p className="text-ink-soft mt-2 text-sm">
            {t(locale, COPY.reference)}: #{localeDigits(locale, status.id)}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={whatsappHref(lastValues)} className="btn btn-primary">
            <WhatsAppIcon className="size-5" />
            {t(locale, status.kind === "sent" ? COPY.alsoWhatsapp : COPY.sendOnWhatsapp)}
          </a>
          <a href={`tel:${SITE.phone}`} className="btn btn-quiet">
            <PhoneIcon className="size-5" />
            {t(locale, COPY.callInstead)}
          </a>
          <button
            type="button"
            onClick={() => setStatus({ kind: "idle" })}
            className="text-leaf inline-flex min-h-12 items-center px-2 underline-offset-4 hover:underline"
          >
            {t(locale, COPY.startOver)}
          </button>
        </div>
      </div>
    );
  }

  const sending = status.kind === "sending";
  const optional = <span className="text-ink-soft"> ({t(locale, COPY.optional)})</span>;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-10">
      <Step n={1} locale={locale} title={t(locale, COPY.stepTrip)}>
        <div className="grid grid-cols-2 gap-2">
          {TRIPS.map((trip) => (
            <Choice key={trip.key} name="trip" value={trip.key}>
              <span className="type-display leading-snug">{t(locale, trip.label)}</span>
            </Choice>
          ))}
        </div>
      </Step>

      <Step n={2} locale={locale} title={t(locale, COPY.stepWhen)}>
        <div className="grid grid-cols-2 gap-3">
          <Field id="booking-date" label={t(locale, COPY.date)}>
            <input id="booking-date" name="date" type="date" className={INPUT} />
          </Field>
          <Field id="booking-time" label={t(locale, COPY.time)}>
            <input id="booking-time" name="time" type="time" className={INPUT} />
          </Field>
        </div>
      </Step>

      <Step n={3} locale={locale} title={t(locale, COPY.stepWhere)}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="booking-pickup" label={t(locale, COPY.pickup)}>
            <input
              id="booking-pickup"
              name="pickup"
              autoComplete="street-address"
              placeholder={t(locale, COPY.pickupHint)}
              className={INPUT}
            />
          </Field>
          <Field id="booking-destination" label={<>{t(locale, COPY.destination)}{optional}</>}>
            <input
              id="booking-destination"
              name="destination"
              placeholder={t(locale, COPY.destinationHint)}
              className={INPUT}
            />
          </Field>
        </div>
      </Step>

      <Step n={4} locale={locale} title={t(locale, COPY.stepCar)}>
        <div className="grid gap-2 sm:grid-cols-2">
          <Choice name="vehicle" value="" defaultChecked>
            <span className="grid">
              <span className="type-display">{t(locale, COPY.anyCar)}</span>
              <span className="text-ink-soft text-sm">{t(locale, COPY.anyCarNote)}</span>
            </span>
          </Choice>
          {FLEET.map((v) => (
            <Choice key={v.slug} name="vehicle" value={v.slug}>
              <span className="flex flex-1 items-center justify-between gap-3">
                <span className="grid">
                  <span className="type-display">{v.name}</span>
                  <span className="text-ink-soft text-sm">
                    {t(locale, v.type)} · {localeDigits(locale, v.seats)} {t(locale, COPY.seats)}
                  </span>
                </span>
                <span className="text-end whitespace-nowrap">
                  <span className="figures text-lg">৳{formatTaka(locale, v.pricePerDay)}</span>
                  <span className="text-ink-soft block text-xs">{t(locale, COPY.perDay)}</span>
                </span>
              </span>
            </Choice>
          ))}
        </div>
      </Step>

      <Step n={5} locale={locale} title={t(locale, COPY.stepYou)}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="booking-name" label={t(locale, COPY.name)} error={errors.name}>
            <input
              id="booking-name"
              name="name"
              autoComplete="name"
              required
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "booking-name-error" : undefined}
              className={INPUT}
            />
          </Field>
          <Field id="booking-phone" label={t(locale, COPY.phone)} error={errors.phone}>
            <input
              id="booking-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="01XXXXXXXXX"
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? "booking-phone-error" : undefined}
              className={INPUT}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field id="booking-notes" label={<>{t(locale, COPY.notes)}{optional}</>}>
              <textarea id="booking-notes" name="notes" rows={3} className={`${INPUT} py-3`} />
            </Field>
          </div>
        </div>
      </Step>

      {/* Honeypot: invisible to people, filled in by bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] size-0 opacity-0"
      />

      <div className="grid gap-3">
        <button type="submit" disabled={sending} className="btn btn-primary min-h-14 w-full text-lg disabled:opacity-70">
          {API_LIVE ? null : <WhatsAppIcon className="size-5" />}
          {sending ? t(locale, COPY.sending) : t(locale, API_LIVE ? COPY.submitApi : COPY.submitWhatsapp)}
        </button>
        {API_LIVE ? null : <p className="text-ink-soft text-sm">{t(locale, COPY.whatsappNote)}</p>}
      </div>
    </form>
  );
}

const INPUT =
  "border-field bg-raised text-ink placeholder:text-ink-soft min-h-12 w-full rounded-lg border px-3.5 text-base aria-[invalid=true]:border-pin-ink aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-pin-ink";

function Step({
  n,
  locale,
  title,
  children,
}: {
  n: number;
  locale: Locale;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-4 flex items-baseline gap-3">
        <span aria-hidden="true" className="figures text-leaf text-2xl">
          {localeDigits(locale, n)}
        </span>
        <span className="type-display text-xl md:text-2xl">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}

/** A radio drawn as a tile: the whole tile is the hit area. */
function Choice({
  name,
  value,
  defaultChecked,
  children,
}: {
  name: string;
  value: string;
  defaultChecked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="border-field bg-raised has-[:checked]:border-leaf has-[:checked]:ring-leaf has-[:focus-visible]:outline-focus flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors has-[:checked]:ring-1 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2">
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="accent-leaf size-4 shrink-0 focus-visible:outline-none"
      />
      {children}
    </label>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid content-start gap-1.5">
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-pin-ink text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
