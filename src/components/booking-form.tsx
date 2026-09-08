"use client";

import { useState } from "react";
import { FLEET, SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

const COPY = {
  name: { bn: "আপনার নাম", en: "Your name" },
  phone: { bn: "মোবাইল নম্বর", en: "Mobile number" },
  vehicle: { bn: "গাড়ি", en: "Vehicle" },
  anyVehicle: { bn: "যেকোনো গাড়ি", en: "Any vehicle" },
  date: { bn: "তারিখ", en: "Date" },
  destination: { bn: "কোথায় যাবেন", en: "Destination" },
  destinationHint: { bn: "যেমন: পুঠিয়া, নাটোর, ঢাকা", en: "e.g. Puthia, Natore, Dhaka" },
  notes: { bn: "অতিরিক্ত তথ্য", en: "Anything else" },
  submit: { bn: "হোয়াটসঅ্যাপে বুকিং পাঠান", en: "Send booking on WhatsApp" },
  note: {
    bn: "বোতামে চাপ দিলে হোয়াটসঅ্যাপ খুলবে এবং আপনার তথ্যগুলো লেখা থাকবে। পাঠানোর আগে দেখে নিতে পারবেন।",
    en: "This opens WhatsApp with your details filled in. You can review the message before sending.",
  },
  required: { bn: "আবশ্যক", en: "required" },
} as const;

export function BookingForm({ locale }: { locale: Locale }) {
  const [pending, setPending] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    const lines = [
      t(locale, { bn: "নতুন বুকিং", en: "New booking" }),
      `${t(locale, COPY.name)}: ${value("name")}`,
      `${t(locale, COPY.phone)}: ${value("phone")}`,
      `${t(locale, COPY.vehicle)}: ${value("vehicle")}`,
      `${t(locale, COPY.date)}: ${value("date")}`,
      `${t(locale, COPY.destination)}: ${value("destination")}`,
    ];

    const notes = value("notes");
    if (notes) lines.push(`${t(locale, COPY.notes)}: ${notes}`);

    window.location.href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
      lines.join("\n"),
    )}`;
  }

  const field =
    "border-border bg-surface-raised text-fg w-full rounded-lg border px-3 py-2.5 text-base";

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1.5">
        <span className="text-sm font-medium">
          {t(locale, COPY.name)} <span className="text-muted">({t(locale, COPY.required)})</span>
        </span>
        <input name="name" required autoComplete="name" className={field} />
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-medium">
          {t(locale, COPY.phone)} <span className="text-muted">({t(locale, COPY.required)})</span>
        </span>
        <input
          name="phone"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          className={field}
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-medium">{t(locale, COPY.vehicle)}</span>
        <select name="vehicle" defaultValue="" className={field}>
          <option value="">{t(locale, COPY.anyVehicle)}</option>
          {FLEET.map((v) => (
            <option key={v.slug} value={v.name}>
              {v.name} — {t(locale, v.type)}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-medium">{t(locale, COPY.date)}</span>
        <input name="date" type="date" className={field} />
      </label>

      <label className="grid gap-1.5 sm:col-span-2">
        <span className="text-sm font-medium">{t(locale, COPY.destination)}</span>
        <input
          name="destination"
          placeholder={t(locale, COPY.destinationHint)}
          className={field}
        />
      </label>

      <label className="grid gap-1.5 sm:col-span-2">
        <span className="text-sm font-medium">{t(locale, COPY.notes)}</span>
        <textarea name="notes" rows={3} className={field} />
      </label>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-whatsapp inline-flex min-h-12 w-full items-center justify-center rounded-xl px-6 font-semibold text-black transition active:scale-[0.98] disabled:opacity-70 sm:w-auto"
        >
          {t(locale, COPY.submit)}
        </button>
        <p className="text-muted mt-3 text-sm">{t(locale, COPY.note)}</p>
      </div>
    </form>
  );
}
