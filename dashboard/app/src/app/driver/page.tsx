import { requireDriver } from "@/lib/auth";
import { signOut } from "@/app/(dashboard)/actions";
import { acceptTrip, advanceTrip, driverCancel, setDuty } from "./actions";
import { DriverWatch, GeoButton } from "./driver-watch";

// Session-dependent screen: never prerender at build.
export const dynamic = "force-dynamic";

const STATUS_TEXT: Record<string, string> = {
  accepted: "ট্রিপ নেওয়া হয়েছে — এখন রওনা দিন",
  on_the_way: "আপনি পথে আছেন — পৌঁছে পৌঁছেছি চাপুন",
  arrived: "পৌঁছেছেন — রোগী উঠলে চাপুন",
  onboard: "রোগী উঠেছেন — শেষ হলে চাপুন",
};

const NEXT_ACTION: Record<string, { status: string; label: string }> = {
  accepted: { status: "on_the_way", label: "রওনা দিয়েছি / On the way" },
  on_the_way: { status: "arrived", label: "পৌঁছেছি / Arrived" },
  arrived: { status: "onboard", label: "রোগী উঠেছেন / On board" },
  onboard: { status: "completed", label: "শেষ / Complete" },
};

const OK_TEXT: Record<string, string> = {
  accepted: "ট্রিপ নেওয়া হয়েছে / Trip accepted",
  on_the_way: "শুভ যাত্রা / On the way",
  arrived: "পৌঁছেছেন / Arrived — location recorded",
  onboard: "রোগী উঠেছেন / On board",
  completed: "ট্রিপ শেষ / Trip complete",
  cancelled: "বাতিল হয়েছে / Cancelled, back to dispatch",
};

const ERROR_TEXT: Record<string, string> = {
  taken: "অন্য ড্রাইভার আগে নিয়েছেন / Another driver took it",
  accept: "গ্রহণ করা যায়নি / Could not accept",
  status: "ধাপ পরিবর্তন হয়নি / Could not update",
  reason: "কারণ লিখুন / Write a reason",
  bad: "ভুল অনুরোধ / Bad request",
  notfound: "ট্রিপ পাওয়া যায়নি / Trip not found",
  cancel: "বাতিল হয়নি / Could not cancel",
};

export default async function DriverPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const { profile, supabase } = await requireDriver();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [{ data: openTrips }, { data: activeTrips }, { data: doneTrips }, { data: places }, { data: myBalance }, { data: dueLimit }, { data: monthTrips }, { data: monthPayments }] =
    await Promise.all([
      supabase
        .from("open_trips_for_driver")
        .select("id, code, ambulance_type, distance_km, fare, patient_note, pickup_place_id, pickup_text, dest_place_id, dest_text")
        .order("created_at", { ascending: false }),
      supabase
        .from("my_trips")
        .select("id, code, status, family_name, family_phone, pickup_place_id, pickup_text, dest_place_id, dest_text, distance_km, fare")
        .in("status", ["accepted", "on_the_way", "arrived", "onboard"])
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("my_trips")
        .select("id, code, fare, completed_at")
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(3),
      supabase.from("places").select("id, name_bn"),
      supabase.from("driver_balance").select("balance").maybeSingle(),
      supabase.rpc("current_due_limit"),
      supabase
        .from("my_trips")
        .select("id, fare")
        .eq("status", "completed")
        .gte("completed_at", monthStart.toISOString()),
      supabase
        .from("ledger")
        .select("amount")
        .eq("kind", "payment")
        .gte("at", monthStart.toISOString()),
    ]);

  const balance = Number(myBalance?.balance ?? 0);
  const due = Number(dueLimit ?? 0);
  const faresCollected = (monthTrips ?? []).reduce((sum, trip) => sum + Number(trip.fare), 0);
  const paymentsMade = (monthPayments ?? []).reduce(
    (sum, entry) => sum + Math.abs(Number(entry.amount)),
    0,
  );

  const placeName = new Map((places ?? []).map((p) => [p.id as string, p.name_bn as string]));
  const trip = (activeTrips ?? [])[0];
  const pending = profile?.status !== "active";

  function route(row: {
    pickup_place_id: string | null;
    pickup_text: string | null;
    dest_place_id: string | null;
    dest_text: string | null;
  }) {
    const pickup = row.pickup_place_id
      ? placeName.get(row.pickup_place_id) ?? "—"
      : row.pickup_text;
    const dest = row.dest_place_id ? placeName.get(row.dest_place_id) ?? "—" : row.dest_text;
    return `${pickup} → ${dest}`;
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-4 bg-zinc-50 px-4 py-6">
      <DriverWatch openCount={(openTrips ?? []).length} />

      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500">রাজশাহী রেন্ট এ কার</p>
          <h1 className="text-xl font-semibold text-zinc-900">{profile?.full_name}</h1>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700"
          >
            লগ আউট
          </button>
        </form>
      </header>

      {pending ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          আপনার অ্যাকাউন্ট অনুমোদনের অপেক্ষায়। Owner approval pending.
        </p>
      ) : null}

      {ok && OK_TEXT[ok] ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {OK_TEXT[ok]}
        </p>
      ) : null}
      {error && ERROR_TEXT[error] ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {ERROR_TEXT[error]}
        </p>
      ) : null}

      <form
        action={setDuty}
        className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4"
      >
        <div>
          <p className="text-sm font-medium text-zinc-900">
            {profile?.on_duty ? "ডিউটিতে আছেন" : "ডিউটিতে নেই"}
          </p>
          <p className="text-xs text-zinc-500">
            {profile?.on_duty ? "On duty — trips can reach you" : "Off duty — no new trips"}
          </p>
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="on_duty"
            defaultChecked={Boolean(profile?.on_duty)}
            className="size-5"
          />
          <button
            type="submit"
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700"
          >
            সংরক্ষণ
          </button>
        </label>
      </form>

      {balance > due && due > 0 ? (
        <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          বকেয়া ৳{balance} — পরিশোধ করলে আবার ট্রিপ পাবেন / You owe ৳{balance}; pay to get trips again.
        </p>
      ) : null}

      <section className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-3">
          <p className="text-xs text-zinc-500">এই মাসে ট্রিপ</p>
          <p className="text-lg font-semibold text-zinc-900">{monthTrips?.length ?? 0}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-3">
          <p className="text-xs text-zinc-500">ভাড়া আদায় / Fares</p>
          <p className="text-lg font-semibold text-zinc-900">৳{faresCollected}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-3">
          <p className="text-xs text-zinc-500">কমিশন বাকি / Owed</p>
          <p className="text-lg font-semibold text-zinc-900">৳{balance}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-3">
          <p className="text-xs text-zinc-500">পেমেন্ট / Paid</p>
          <p className="text-lg font-semibold text-zinc-900">৳{paymentsMade}</p>
        </div>
      </section>

      {trip ? (
        <section className="flex flex-col gap-3 rounded-xl border-2 border-emerald-300 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">চলমান ট্রিপ · {trip.code}</h2>
            <span className="text-xs text-zinc-500">{trip.distance_km} কিমি</span>
          </div>
          <p className="text-sm text-zinc-700">{route(trip)}</p>
          <p className="text-sm text-zinc-600">
            ভাড়া / Fare: <span className="font-medium text-zinc-900">৳{trip.fare}</span>
          </p>
          <a
            href={`tel:${trip.family_phone}`}
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-center text-sm font-medium text-white"
          >
            পরিবারকে কল করুন: {trip.family_phone}
          </a>
          <p className="text-xs text-zinc-500">{STATUS_TEXT[trip.status] ?? trip.status}</p>

          {NEXT_ACTION[trip.status] ? (
            <form action={advanceTrip}>
              <input type="hidden" name="trip_id" value={trip.id} />
              <input type="hidden" name="status" value={NEXT_ACTION[trip.status].status} />
              {NEXT_ACTION[trip.status].status === "arrived" ? (
                <>
                  <input type="hidden" name="lat" />
                  <input type="hidden" name="lng" />
                  <GeoButton className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white">
                    {NEXT_ACTION[trip.status].label}
                  </GeoButton>
                </>
              ) : (
                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white"
                >
                  {NEXT_ACTION[trip.status].label}
                </button>
              )}
            </form>
          ) : null}

          <details>
            <summary className="cursor-pointer text-xs text-red-600">বাতিল / Cancel</summary>
            <form action={driverCancel} className="mt-1 flex gap-2">
              <input type="hidden" name="trip_id" value={trip.id} />
              <input
                name="reason"
                required
                placeholder="কারণ / Reason"
                className="w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm"
              />
              <button
                type="submit"
                className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700"
              >
                বাতিল
              </button>
            </form>
          </details>
        </section>
      ) : null}

      {!trip ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-zinc-900">
            নতুন ট্রিপ / Incoming trips
          </h2>
          {(openTrips ?? []).length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-300 bg-white px-4 py-8 text-center text-sm text-zinc-500">
              এখন কোনো ট্রিপ নেই / No open trips right now
            </p>
          ) : null}
          {(openTrips ?? []).map((open) => (
            <article key={open.id} className="rounded-xl border-2 border-amber-300 bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-zinc-900">{open.code}</h3>
                <span className="text-xs text-zinc-500">
                  {open.ambulance_type === "ac" ? "এসি" : "নন-এসি"} · {open.distance_km} কিমি
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-700">{route(open)}</p>
              {open.patient_note ? (
                <p className="text-xs text-zinc-500">নোট: {open.patient_note}</p>
              ) : null}
              <p className="mt-1 text-sm text-zinc-600">
                ভাড়া / Fare: <span className="font-medium text-zinc-900">৳{open.fare}</span>
              </p>
              <form action={acceptTrip} className="mt-3">
                <input type="hidden" name="trip_id" value={open.id} />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
                >
                  গ্রহণ করুন / Accept
                </button>
              </form>
            </article>
          ))}
        </section>
      ) : null}

      {(doneTrips ?? []).length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-zinc-900">সাম্প্রতিক / Recent</h2>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-zinc-600">
            {(doneTrips ?? []).map((done) => (
              <li key={done.id} className="flex justify-between">
                <span>{done.code}</span>
                <span>৳{done.fare}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
