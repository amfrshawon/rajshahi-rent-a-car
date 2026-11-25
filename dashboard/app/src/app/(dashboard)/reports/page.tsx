import Link from "next/link";
import { requireOwner } from "@/lib/auth";

type Period = "today" | "week" | "month";

function resolvePeriod(raw?: string): Period {
  return raw === "week" || raw === "month" ? raw : "today";
}

function periodBounds(period: Period) {
  const now = new Date();
  const start = new Date(now);
  const prevStart = new Date(now);

  if (period === "today") {
    start.setHours(0, 0, 0, 0);
    prevStart.setDate(prevStart.getDate() - 1);
    prevStart.setHours(0, 0, 0, 0);
  } else if (period === "week") {
    const offset = (start.getDay() + 6) % 7; // Monday start
    start.setDate(start.getDate() - offset);
    start.setHours(0, 0, 0, 0);
    prevStart.setDate(start.getDate() - 7);
    prevStart.setHours(0, 0, 0, 0);
  } else {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    prevStart.setMonth(prevStart.getMonth() - 1);
    prevStart.setDate(1);
    prevStart.setHours(0, 0, 0, 0);
  }

  return { start, prevStart, now };
}

const PERIODS: { key: Period; label: string }[] = [
  { key: "today", label: "আজ / Today" },
  { key: "week", label: "এই সপ্তাহ / Week" },
  { key: "month", label: "এই মাস / Month" },
];

const TYPE_LABEL: Record<string, string> = {
  non_ac: "নন-এসি",
  ac: "এসি",
};

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: rawPeriod } = await searchParams;
  const period = resolvePeriod(rawPeriod);
  const { start, prevStart, now } = periodBounds(period);
  const { supabase } = await requireOwner();

  const [{ data: calls }, { data: trips }, { data: prevTrips }, { data: balances }, { data: drivers }] =
    await Promise.all([
      supabase
        .from("calls")
        .select("direction, duration_sec, started_at")
        .gte("started_at", start.toISOString())
        .lte("started_at", now.toISOString()),
      supabase
        .from("trips")
        .select(
          "id, status, ambulance_type, dest_place_id, dest_text, fare, commission, call_id, dispatched_at, accepted_at, completed_at, driver_id",
        )
        .gte("created_at", start.toISOString())
        .lte("created_at", now.toISOString()),
      supabase
        .from("trips")
        .select("driver_id")
        .eq("status", "completed")
        .gte("completed_at", prevStart.toISOString())
        .lt("completed_at", start.toISOString()),
      supabase.from("driver_balance").select("driver_id, balance"),
      supabase.from("profiles").select("id, full_name").eq("role", "driver"),
    ]);

  const { data: places } = await supabase.from("places").select("id, name_bn");
  const placeName = new Map((places ?? []).map((p) => [p.id as string, p.name_bn as string]));

  const callRows = calls ?? [];
  const tripRows = trips ?? [];
  const completed = tripRows.filter((t) => t.status === "completed");

  const callsTotal = callRows.length;
  const missedCalls = callRows.filter((c) => c.direction === "missed").length;
  const answered = callRows.filter(
    (c) => c.direction === "incoming" && Number(c.duration_sec) > 0,
  );
  const answeredWithin1Min = answered.filter((c) => Number(c.duration_sec) <= 60).length;
  const withCall = tripRows.filter((t) => t.call_id).length;
  const conversion = callsTotal > 0 ? Math.round((withCall / callsTotal) * 100) : 0;

  const completedWithAccept = completed.filter((t) => t.accepted_at && t.dispatched_at);
  const avgAcceptSec =
    completedWithAccept.length > 0
      ? Math.round(
          completedWithAccept.reduce(
            (sum, t) =>
              sum +
              (new Date(t.accepted_at).getTime() - new Date(t.dispatched_at).getTime()) / 1000,
            0,
          ) / completedWithAccept.length,
        )
      : 0;

  const commissionEarned = completed.reduce((sum, t) => sum + Number(t.commission), 0);
  const outstanding = (balances ?? []).reduce((sum, b) => sum + Math.max(0, Number(b.balance)), 0);

  const byType = completed.reduce<Record<string, number>>((acc, t) => {
    acc[t.ambulance_type] = (acc[t.ambulance_type] ?? 0) + 1;
    return acc;
  }, {});

  const byDestination = completed.reduce<Record<string, number>>((acc, t) => {
    const name = t.dest_place_id
      ? placeName.get(t.dest_place_id) ?? "অন্যান্য"
      : t.dest_text ?? "অন্যান্য";
    acc[name] = (acc[name] ?? 0) + 1;
    return acc;
  }, {});
  const topDestinations = Object.entries(byDestination)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const balanceById = new Map(
    (balances ?? []).map((b) => [b.driver_id as string, Number(b.balance)]),
  );

  const perDriver = (drivers ?? [])
    .map((driver) => {
      const current = completed.filter((t) => t.driver_id === driver.id).length;
      const previous = (prevTrips ?? []).filter((t) => t.driver_id === driver.id).length;
      return {
        id: driver.id as string,
        name: driver.full_name as string,
        current,
        previous,
        balance: balanceById.get(driver.id as string) ?? 0,
      };
    })
    .sort((a, b) => b.current - a.current);

  const stats = [
    { label: "কল / Calls", value: callsTotal },
    { label: "মিসড / Missed", value: missedCalls },
    {
      label: "১ মিনিটে উত্তর / Answered ≤1m",
      value: answered.length > 0 ? `${Math.round((answeredWithin1Min / answered.length) * 100)}%` : "—",
    },
    { label: "কল → ট্রিপ / Conversion", value: `${conversion}%` },
    { label: "ট্রিপ / Trips", value: tripRows.length },
    { label: "সম্পন্ন / Completed", value: completed.length },
    { label: "গড় গ্রহণ / Avg accept", value: `${avgAcceptSec}s` },
    { label: "কমিশন আয় / Commission", value: `৳${commissionEarned}` },
    { label: "বাকি / Outstanding", value: `৳${outstanding}` },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">রিপোর্ট</h1>
          <p className="text-sm text-zinc-500">Reports — calls, trips, money and drivers</p>
        </div>
        <div className="flex gap-1">
          {PERIODS.map((option) => (
            <Link
              key={option.key}
              href={`/reports?period=${option.key}`}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                option.key === period
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-xs text-zinc-500">{stat.label}</p>
            <p className="mt-1 text-xl font-semibold text-zinc-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-zinc-900">ধরন অনুযায়ী / By type</h2>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-zinc-700">
            {Object.entries(byType).length === 0 ? <li className="text-zinc-500">—</li> : null}
            {Object.entries(byType).map(([type, count]) => (
              <li key={type} className="flex justify-between">
                <span>{TYPE_LABEL[type] ?? type}</span>
                <span className="tabular-nums">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-zinc-900">শীর্ষ গন্তব্য / Top destinations</h2>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-zinc-700">
            {topDestinations.length === 0 ? <li className="text-zinc-500">—</li> : null}
            {topDestinations.map(([name, count]) => (
              <li key={name} className="flex justify-between">
                <span>{name}</span>
                <span className="tabular-nums">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-zinc-900">ড্রাইভার / Drivers</h2>
          <div className="flex gap-2 text-sm">
            <a
              href="/reports/export?type=trips"
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-100"
            >
              ট্রিপ CSV
            </a>
            <a
              href="/reports/export?type=ledger"
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-100"
            >
              হিসাব CSV
            </a>
          </div>
        </div>
        <div className="mt-3 flex flex-col divide-y divide-zinc-100 text-sm">
          {perDriver.length === 0 ? <p className="py-4 text-zinc-500">No drivers</p> : null}
          {perDriver.map((driver) => {
            const delta = driver.current - driver.previous;
            return (
              <div key={driver.id} className="flex items-center gap-3 py-2">
                <span className="w-40 font-medium text-zinc-900">{driver.name}</span>
                <span className="text-zinc-600">{driver.current} ট্রিপ</span>
                {period === "month" && driver.previous > 0 ? (
                  <span
                    className={`text-xs ${delta < 0 ? "text-red-700" : "text-emerald-700"}`}
                  >
                    {delta >= 0 ? "+" : ""}
                    {delta} vs গত মাস
                  </span>
                ) : null}
                <span className="ml-auto tabular-nums text-zinc-500">৳{driver.balance}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
