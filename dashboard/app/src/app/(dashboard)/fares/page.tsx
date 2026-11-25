import { requireOwner } from "@/lib/auth";
import { addPlace, updateFareBand } from "./actions";

const OK: Record<string, string> = {
  saved: "ভাড়া সংরক্ষিত হয়েছে / Fare saved",
  place: "জায়গা যোগ হয়েছে / Place added",
};

const TYPE_LABEL: Record<string, string> = {
  non_ac: "নন-এসি / Non-AC",
  ac: "এসি / AC",
};

function range(min: number, max: number | null) {
  return max === null ? `${min}+ কিমি` : `${min}–${max} কিমি`;
}

export default async function FaresPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const { supabase } = await requireOwner();

  const [{ data: bands }, { data: places }] = await Promise.all([
    supabase
      .from("fare_bands")
      .select("id, ambulance_type, min_km, max_km, fare, commission, active, note")
      .order("ambulance_type")
      .order("min_km"),
    supabase.from("places").select("id, name_bn, name_en, km_from_rmch, is_default_pickup").order("name_en"),
  ]);

  const placeholders = (bands ?? []).filter((b) => b.note === "set these").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">ভাড়ার তালিকা</h1>
        <p className="text-sm text-zinc-500">
          Fares — the family pays the fare; the driver owes the commission
        </p>
      </div>

      {ok && OK[ok] ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {OK[ok]}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          তথ্য ঠিক নেই / Invalid values
        </p>
      ) : null}

      {placeholders > 0 ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {placeholders}টি ব্ୟান্ড এখনও প্লেসহোল্ডার — আসল ভাড়া লিখে সংরক্ষণ করুন /{" "}
          {placeholders} bands are still placeholders marked &quot;set these&quot;
        </p>
      ) : null}

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-zinc-900">
          ব্ୟান্ড / Distance bands
        </h2>
        <div className="mt-3 flex flex-col divide-y divide-zinc-100">
          {(bands ?? []).map((band) => (
            <form
              key={band.id}
              action={updateFareBand}
              className="flex flex-wrap items-center gap-3 py-3"
            >
              <input type="hidden" name="band_id" value={band.id} />
              <span className="w-40 text-sm font-medium text-zinc-800">
                {TYPE_LABEL[band.ambulance_type] ?? band.ambulance_type}
              </span>
              <span className="w-32 text-sm text-zinc-600">
                {range(Number(band.min_km), band.max_km === null ? null : Number(band.max_km))}
              </span>
              <label className="flex items-center gap-2 text-sm text-zinc-600">
                ভাড়া / Fare
                <input
                  name="fare"
                  type="number"
                  min={0}
                  required
                  defaultValue={band.fare}
                  className="w-24 rounded-lg border border-zinc-300 px-2 py-1.5 text-zinc-900"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-600">
                কমিশন / Commission
                <input
                  name="commission"
                  type="number"
                  min={0}
                  required
                  defaultValue={band.commission}
                  className="w-24 rounded-lg border border-zinc-300 px-2 py-1.5 text-zinc-900"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-600">
                <input
                  name="active"
                  type="checkbox"
                  defaultChecked={band.active}
                  className="size-4"
                />
                সক্রিয়
              </label>
              {band.note === "set these" ? (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-800">
                  set these
                </span>
              ) : null}
              <button
                type="submit"
                className="ml-auto rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
              >
                সংরক্ষণ
              </button>
            </form>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-zinc-900">
          জায়গা / Preset places
        </h2>
        <ul className="mt-3 flex flex-col divide-y divide-zinc-100 text-sm">
          {(places ?? []).map((place) => (
            <li key={place.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2">
              <span className="font-medium text-zinc-900">{place.name_bn}</span>
              <span className="text-zinc-500">{place.name_en}</span>
              <span className="ml-auto text-zinc-600">
                {place.km_from_rmch !== null ? `${place.km_from_rmch} কিমি` : "—"}
              </span>
              {place.is_default_pickup ? (
                <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs text-sky-700">
                  ডিফল্ট পিকআপ
                </span>
              ) : null}
            </li>
          ))}
        </ul>

        <form action={addPlace} className="mt-4 grid gap-3 border-t border-zinc-100 pt-4 sm:grid-cols-4">
          <input
            name="name_bn"
            required
            placeholder="নাম (বাংলা)"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          <input
            name="name_en"
            required
            placeholder="Name (English)"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          <input
            name="km_from_rmch"
            type="number"
            min={0}
            step="0.1"
            required
            placeholder="কিমি / km from RMCH"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
          >
            যোগ করুন / Add place
          </button>
        </form>
      </section>
    </div>
  );
}
