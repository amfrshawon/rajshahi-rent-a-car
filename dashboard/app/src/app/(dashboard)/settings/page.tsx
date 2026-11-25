import { requireOwner } from "@/lib/auth";
import { updateSettings } from "./actions";

const FIELDS = [
  {
    name: "due_limit",
    label: "বকেয়া সীমা / Due limit (৳)",
    hint: "সীমা ছাড়ালে ড্রাইভার নতুন ট্রিপ পাবে না। Over the limit, a driver stops getting trips.",
    step: 1,
  },
  {
    name: "accept_timeout_sec",
    label: "অ্যাকসেপ্টের সময় / Accept timeout (seconds)",
    hint: "এই সময়ে কেউ না নিলে ট্রিপ unassigned হবে। No accept in this time alerts you.",
    step: 1,
  },
  {
    name: "start_timeout_sec",
    label: "রওনার সময় / On-the-way timeout (seconds)",
    hint: "অ্যাকসেপ্টের পর এই সময়ে 'রওনা' না দিলে সতর্কবার্তা। After accepting, silence this long alerts you.",
    step: 1,
  },
  {
    name: "phone_hide_after_hours",
    label: "ফোন নম্বর লুকানোর সময় / Hide family phone after (hours)",
    hint: "ট্রিপ শেষের পর এতক্ষণে পরিবারের নম্বর ড্রাইভারের অ্যাপ থেকে হারিয়ে যায়।",
    step: 1,
  },
] as const;

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const { supabase } = await requireOwner();

  const { data: settings } = await supabase
    .from("settings")
    .select("due_limit, accept_timeout_sec, start_timeout_sec, phone_hide_after_hours, call_logger_key")
    .eq("id", true)
    .single();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">সেটিংস</h1>
        <p className="text-sm text-zinc-500">
          Settings — dispatch timing and the driver due limit
        </p>
      </div>

      {ok ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          সংরক্ষিত হয়েছে / Saved
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          সংখ্যাগুলো ঠিক নেই / Invalid values
        </p>
      ) : null}

      <form
        action={updateSettings}
        className="flex flex-col gap-5 rounded-xl border border-zinc-200 bg-white p-5"
      >
        {FIELDS.map((field) => (
          <label key={field.name} className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-800">{field.label}</span>
            <input
              name={field.name}
              type="number"
              min={field.name === "due_limit" || field.name === "phone_hide_after_hours" ? 0 : 1}
              step={field.step}
              required
              defaultValue={settings?.[field.name] ?? 0}
              className="w-40 rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900"
            />
            <span className="text-xs text-zinc-500">{field.hint}</span>
          </label>
        ))}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-800">
            কল লগার কী / Call-logger key
          </span>
          <input
            name="call_logger_key"
            required
            minLength={16}
            defaultValue={settings?.call_logger_key ?? ""}
            className="w-full max-w-md rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm text-zinc-900"
          />
          <span className="text-xs text-zinc-500">
            MacroDroid এই কী দিয়ে কল পাঠাবে। The phone sends this key with every call.
          </span>
        </label>
        <div>
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            সংরক্ষণ করুন / Save
          </button>
        </div>
      </form>
    </div>
  );
}
