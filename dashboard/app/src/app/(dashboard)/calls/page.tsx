import { requireOwner } from "@/lib/auth";
import { CallsList, type CallRow } from "./calls-list";
import { logManualCall } from "./actions";

export default async function CallsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const { supabase } = await requireOwner();

  const [{ data: calls }, { data: counts }] = await Promise.all([
    supabase
      .from("calls")
      .select(
        "id, caller_number, direction, started_at, duration_sec, handled, outcome_note, source, created_at",
      )
      .order("started_at", { ascending: false })
      .limit(100),
    supabase.from("caller_trip_counts").select("caller_number, trips"),
  ]);

  const tripCounts: Record<string, number> = {};
  for (const row of counts ?? []) {
    tripCounts[row.caller_number as string] = row.trips as number;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">কল</h1>
        <p className="text-sm text-zinc-500">
          Calls — every call to the business number, live from the phone
        </p>
      </div>

      {ok === "logged" ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          কল যোগ হয়েছে / Call logged
        </p>
      ) : null}
      {error === "note" ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          কারণ লিখুন / Write a reason
        </p>
      ) : null}
      {error === "invalid" ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          তথ্য ঠিক নেই / Invalid input
        </p>
      ) : null}

      <details className="rounded-xl border border-zinc-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-medium text-zinc-900">
          ম্যানুয়াল কল / Log a manual call (WhatsApp calls)
        </summary>
        <form action={logManualCall} className="mt-4 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            নম্বর / Number
            <input
              name="caller_number"
              required
              inputMode="tel"
              placeholder="01800-000000"
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            ধরন / Direction
            <select name="direction" className="rounded-lg border border-zinc-300 px-3 py-2">
              <option value="incoming">ইনকামিং / Incoming</option>
              <option value="outgoing">আউটগোয়িং / Outgoing</option>
              <option value="missed">মিসড / Missed</option>
              <option value="rejected">রিজেক্টেড / Rejected</option>
            </select>
          </label>
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            যোগ করুন / Log
          </button>
        </form>
      </details>

      <CallsList initialCalls={(calls ?? []) as CallRow[]} tripCounts={tripCounts} />
    </div>
  );
}
