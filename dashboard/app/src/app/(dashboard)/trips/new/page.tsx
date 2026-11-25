import { requireOwner } from "@/lib/auth";
import { createTrip } from "../actions";

export default async function NewTripPage({
  searchParams,
}: {
  searchParams: Promise<{ call?: string; error?: string }>;
}) {
  const { call: callId, error } = await searchParams;
  const { supabase } = await requireOwner();

  const [{ data: places }, callResult] = await Promise.all([
    supabase
      .from("places")
      .select("id, name_bn, name_en, is_default_pickup")
      .order("is_default_pickup", { ascending: false })
      .order("name_en"),
    callId
      ? supabase.from("calls").select("id, caller_number").eq("id", callId).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const call = callResult.data as { id: string; caller_number: string } | null;
  const defaultPickup = (places ?? []).find((p) => p.is_default_pickup);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">নতুন ট্রিপ</h1>
        <p className="text-sm text-zinc-500">
          New trip — the fare and commission fill in from the bands
        </p>
      </div>

      {error === "invalid" ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          সব ঘর ঠিকভাবে পূরণ করুন / Check the fields
        </p>
      ) : null}
      {error === "save" ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          ট্রিপ সংরক্ষণ হয়নি / Trip was not saved
        </p>
      ) : null}

      <form
        action={createTrip}
        className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-5 sm:grid-cols-2"
      >
        {call ? <input type="hidden" name="call_id" value={call.id} /> : null}

        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          পরিবারের নম্বর / Family phone
          <input
            name="family_phone"
            required
            inputMode="tel"
            defaultValue={call?.caller_number ?? ""}
            className="rounded-lg border border-zinc-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          নাম (ঐচ্ছিক) / Family name
          <input name="family_name" className="rounded-lg border border-zinc-300 px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          পিকআপ / Pickup
          <select
            name="pickup_place_id"
            defaultValue={defaultPickup?.id ?? ""}
            className="rounded-lg border border-zinc-300 px-3 py-2"
          >
            {(places ?? []).map((place) => (
              <option key={place.id} value={place.id}>
                {place.name_bn} / {place.name_en}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          পিকআপ (লেখা) / Pickup (typed)
          <input
            name="pickup_text"
            placeholder="নিচে/উপরে লিখলে প্রিসেটের বদলে এটি ব্যবহার হবে"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          গন্তব্য / Destination (preset)
          <select name="dest_place_id" className="rounded-lg border border-zinc-300 px-3 py-2">
            <option value="">— লিখুন / type below —</option>
            {(places ?? []).map((place) => (
              <option key={place.id} value={place.id}>
                {place.name_bn} / {place.name_en}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          গন্তব্য (লেখা) / Destination (typed)
          <input name="dest_text" className="rounded-lg border border-zinc-300 px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          দূরত্ব / Distance (km)
          <input
            name="distance_km"
            type="number"
            min={0.1}
            step="0.1"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          অ্যাম্বুলেন্স / Ambulance type
          <select name="ambulance_type" required className="rounded-lg border border-zinc-300 px-3 py-2">
            <option value="non_ac">নন-এসি / Non-AC</option>
            <option value="ac">এসি / AC</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700 sm:col-span-2">
          রোগীর নোট / Patient note
          <input
            name="patient_note"
            placeholder="যেমন: অক্সিজেন দরকার / e.g. oxygen needed"
            className="rounded-lg border border-zinc-300 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700 sm:col-span-2">
          ভাড়া বদল (ঐচ্ছিক) / Fare override
          <input
            name="fare_override"
            type="number"
            min={0}
            placeholder="খালি রাখলে ব্ୟান্ড থেকে নেওয়া হবে / empty = use the band"
            className="rounded-lg border border-zinc-300 px-3 py-2"
          />
          <span className="text-xs text-zinc-500">
            ভাড়া বদলালে ইভেন্ট লগে থাকবে / An override is written to the event log.
          </span>
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            পাঠান / Dispatch now
          </button>
        </div>
      </form>
    </div>
  );
}
