import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import { assignTrip, cancelTrip } from "./actions";
import { Elapsed } from "./elapsed";

const ACTIVE = ["dispatching", "unassigned", "accepted", "on_the_way", "arrived", "onboard"];

const COLUMNS: { key: string; label: string; statuses: string[] }[] = [
  { key: "dispatch", label: "ডিসপ্যাচিং / Dispatching", statuses: ["dispatching", "unassigned"] },
  { key: "accepted", label: "নেওয়া / Accepted", statuses: ["accepted"] },
  { key: "on_the_way", label: "পথে / On the way", statuses: ["on_the_way"] },
  { key: "arrived", label: "পৌঁছেছে / Arrived", statuses: ["arrived"] },
  { key: "onboard", label: "রোগী উঠেছেন / On board", statuses: ["onboard"] },
  { key: "done", label: "আজ সম্পন্ন / Done today", statuses: ["completed"] },
];

const TYPE_LABEL: Record<string, string> = {
  non_ac: "নন-এসি / Non-AC",
  ac: "এসি / AC",
};

const EVENT_LABEL: Record<string, string> = {
  "status:unassigned": "কেউ নেয়নি — আবার পাঠান / Nobody accepted",
  timeout_start: "ড্রাইভার রওনা দেয়নি / Driver has not started",
};

function oneHourAgoIso() {
  return new Date(Date.now() - 60 * 60 * 1000).toISOString();
}

function tripCodeOf(alert: { trips?: unknown }): string {
  const embedded = alert.trips as
    | { code?: string }
    | { code?: string }[]
    | null
    | undefined;
  if (Array.isArray(embedded)) return embedded[0]?.code ?? "—";
  return embedded?.code ?? "—";
}

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const { supabase } = await requireOwner();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [{ data: active }, { data: done }, { data: drivers }, { data: places }, { data: alerts }] =
    await Promise.all([
      supabase
        .from("trips")
        .select(
          "id, code, status, ambulance_type, pickup_place_id, pickup_text, dest_place_id, dest_text, distance_km, fare, commission, dispatched_at, accepted_at, completed_at, driver_id",
        )
        .in("status", ACTIVE)
        .order("created_at", { ascending: false }),
      supabase
        .from("trips")
        .select(
          "id, code, status, ambulance_type, pickup_place_id, pickup_text, dest_place_id, dest_text, distance_km, fare, commission, dispatched_at, accepted_at, completed_at, driver_id",
        )
        .eq("status", "completed")
        .gte("completed_at", todayStart.toISOString())
        .order("completed_at", { ascending: false })
        .limit(20),
      supabase
        .from("profiles")
        .select("id, full_name, on_duty")
        .eq("role", "driver")
        .eq("status", "active")
        .order("full_name"),
      supabase.from("places").select("id, name_bn"),
      supabase
        .from("trip_events")
        .select("id, event, at, trips(code)")
        .in("event", ["status:unassigned", "timeout_start"])
        .gte("at", oneHourAgoIso())
        .order("at", { ascending: false })
        .limit(5),
    ]);

  const trips = [...(active ?? []), ...(done ?? [])];
  const placeName = new Map((places ?? []).map((p) => [p.id as string, p.name_bn as string]));
  const driverName = new Map((drivers ?? []).map((d) => [d.id as string, d.full_name as string]));

  function route(trip: (typeof trips)[number]) {
    const pickup = trip.pickup_place_id
      ? placeName.get(trip.pickup_place_id) ?? "—"
      : trip.pickup_text;
    const dest = trip.dest_place_id ? placeName.get(trip.dest_place_id) ?? "—" : trip.dest_text;
    return `${pickup} → ${dest}`;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">ট্রিপ</h1>
          <p className="text-sm text-zinc-500">
            Dispatch board — every trip moves left to right, live
          </p>
        </div>
        <Link
          href="/trips/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          + নতুন ট্রিপ / New trip
        </Link>
      </div>

      {ok === "dispatched" ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          ট্রিপ পাঠানো হয়েছে / Trip dispatched to every eligible driver
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error === "reason"
            ? "কারণ লিখুন / Write a cancellation reason"
            : error === "assign"
              ? "ড্রাইভার নিয়োগ হয়নি / Assign failed"
              : "কিছু ভুল হয়েছে / Something went wrong"}
        </p>
      ) : null}

      {(alerts ?? []).length > 0 ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3">
          <p className="text-sm font-medium text-amber-900">সতর্কবার্তা / Alerts</p>
          <ul className="mt-1 flex flex-col gap-1 text-sm text-amber-800">
            {(alerts ?? []).map((alert) => (
              <li key={alert.id}>
                {tripCodeOf(alert)} · {EVENT_LABEL[alert.event] ?? alert.event}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {COLUMNS.map((column) => {
          const cards = trips.filter((trip) => column.statuses.includes(trip.status));
          return (
            <section key={column.key} className="flex flex-col gap-3">
              <h2 className="flex items-center justify-between text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                {column.label}
                <span className="rounded-full bg-zinc-200 px-2 text-zinc-700">
                  {cards.length}
                </span>
              </h2>

              {cards.length === 0 ? (
                <p className="rounded-lg border border-dashed border-zinc-300 px-3 py-4 text-center text-xs text-zinc-400">
                  খালি / Empty
                </p>
              ) : null}

              {cards.map((trip) => (
                <article key={trip.id} className="rounded-xl border border-zinc-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-900">{trip.code}</span>
                    <span className="text-xs text-zinc-500">
                      {TYPE_LABEL[trip.ambulance_type] ?? trip.ambulance_type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-700">{route(trip)}</p>
                  <p className="text-xs text-zinc-500">
                    {trip.distance_km} কিমি · ভাড়া ৳{trip.fare} · কমিশন ৳{trip.commission}
                  </p>
                  {trip.driver_id ? (
                    <p className="text-xs text-zinc-600">
                      ড্রাইভার / Driver: {driverName.get(trip.driver_id) ?? "—"}
                    </p>
                  ) : null}
                  <div className="mt-1 flex items-center gap-2">
                    {trip.dispatched_at ? <Elapsed since={trip.dispatched_at} /> : null}
                    {trip.status === "unassigned" ? (
                      <span className="rounded-full bg-amber-100 px-2 text-[10px] text-amber-800">
                        কেউ নেয়নি
                      </span>
                    ) : null}
                  </div>

                  {column.key === "dispatch" ? (
                    <form action={assignTrip} className="mt-2 flex items-center gap-1">
                      <input type="hidden" name="trip_id" value={trip.id} />
                      <select
                        name="driver_id"
                        required
                        className="w-full rounded-lg border border-zinc-300 px-2 py-1 text-xs"
                      >
                        <option value="">ড্রাইভার বেছে নিন</option>
                        {(drivers ?? []).map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.full_name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-lg border border-zinc-300 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-100"
                      >
                        দিন
                      </button>
                    </form>
                  ) : null}

                  {column.key !== "done" ? (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-zinc-500">
                        বাতিল / Cancel
                      </summary>
                      <form action={cancelTrip} className="mt-1 flex items-center gap-1">
                        <input type="hidden" name="trip_id" value={trip.id} />
                        <input
                          name="reason"
                          required
                          placeholder="কারণ"
                          className="w-full rounded-lg border border-zinc-300 px-2 py-1 text-xs"
                        />
                        <button
                          type="submit"
                          className="rounded-lg border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                        >
                          বাতিল
                        </button>
                      </form>
                    </details>
                  ) : null}
                </article>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}
