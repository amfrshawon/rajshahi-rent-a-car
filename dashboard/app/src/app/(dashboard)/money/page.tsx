import { requireOwner } from "@/lib/auth";
import { addAdjustment, recordPayment } from "./actions";

const KIND_LABEL: Record<string, string> = {
  commission: "কমিশন / Commission",
  payment: "পেমেন্ট / Payment",
  adjustment: "সমন্বয় / Adjustment",
};

const METHODS = [
  { value: "bkash", label: "বিকাশ / bKash" },
  { value: "nagad", label: "নগদ / Nagad" },
  { value: "rocket", label: "রকেট / Rocket" },
  { value: "cash", label: "নগদ ক্যাশ / Cash" },
  { value: "bank", label: "ব্যাংক / Bank" },
];

export default async function MoneyPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const { supabase } = await requireOwner();

  const [{ data: balances }, { data: drivers }, { data: entries }] = await Promise.all([
    supabase.from("driver_balance").select("driver_id, balance"),
    supabase.from("profiles").select("id, full_name, phone").eq("role", "driver"),
    supabase
      .from("ledger")
      .select("id, kind, amount, method, reference, note, at, driver_id")
      .order("at", { ascending: false })
      .limit(30),
  ]);

  const nameById = new Map((drivers ?? []).map((d) => [d.id as string, d.full_name as string]));

  const rows = [...(balances ?? [])].sort(
    (a, b) => Number(b.balance) - Number(a.balance),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">হিসাব</h1>
        <p className="text-sm text-zinc-500">
          Money — commission earned, payments received and adjustments
        </p>
      </div>

      {ok === "payment" ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          পেমেন্ট সংরক্ষিত / Payment recorded
        </p>
      ) : null}
      {ok === "adjustment" ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          সমন্বয় সংরক্ষিত / Adjustment recorded
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          তথ্য ঠিক নেই / Invalid values
        </p>
      ) : null}

      <section className="grid gap-3 md:grid-cols-2">
        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 bg-white px-4 py-8 text-center text-sm text-zinc-500 md:col-span-2">
            এখনও কোনো ড্রাইভার নেই / No drivers yet
          </p>
        ) : null}

        {rows.map((row) => {
          const balance = Number(row.balance);
          return (
            <article key={row.driver_id} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-zinc-900">
                  {nameById.get(row.driver_id) ?? "—"}
                </h2>
                <span
                  className={`text-lg font-semibold tabular-nums ${
                    balance > 0 ? "text-red-700" : "text-emerald-700"
                  }`}
                >
                  ৳{balance}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                {balance > 0 ? "বাকি আছে / Owed to you" : "পরিশোধিত / Settled"}
              </p>

              <details className="mt-3">
                <summary className="cursor-pointer text-sm text-zinc-700">
                  পেমেন্ট লিখুন / Record payment
                </summary>
                <form action={recordPayment} className="mt-2 flex flex-wrap items-end gap-2">
                  <input type="hidden" name="driver_id" value={row.driver_id} />
                  <label className="flex flex-col gap-1 text-xs text-zinc-600">
                    টাকা / Amount
                    <input
                      name="amount"
                      type="number"
                      min={1}
                      required
                      className="w-24 rounded-lg border border-zinc-300 px-2 py-1.5 text-sm"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs text-zinc-600">
                    মাধ্যম / Method
                    <select name="method" className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm">
                      {METHODS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-xs text-zinc-600">
                    ট্রানজেকশন / Reference
                    <input
                      name="reference"
                      placeholder="TXN ID"
                      className="w-32 rounded-lg border border-zinc-300 px-2 py-1.5 text-sm"
                    />
                  </label>
                  <button
                    type="submit"
                    className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800"
                  >
                    সংরক্ষণ
                  </button>
                </form>
              </details>

              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-zinc-700">
                  সমন্বয় / Adjustment
                </summary>
                <form action={addAdjustment} className="mt-2 flex flex-wrap items-end gap-2">
                  <input type="hidden" name="driver_id" value={row.driver_id} />
                  <label className="flex flex-col gap-1 text-xs text-zinc-600">
                    টাকা (+ বাকি, − জমা)
                    <input
                      name="amount"
                      type="number"
                      required
                      className="w-28 rounded-lg border border-zinc-300 px-2 py-1.5 text-sm"
                    />
                  </label>
                  <label className="flex flex-1 flex-col gap-1 text-xs text-zinc-600">
                    নোট / Note
                    <input
                      name="note"
                      required
                      className="w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm"
                    />
                  </label>
                  <button
                    type="submit"
                    className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-100"
                  >
                    যোগ করুন
                  </button>
                </form>
              </details>
            </article>
          );
        })}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-zinc-900">সাম্প্রতিক লেনদেন / Recent entries</h2>
        <div className="mt-3 flex flex-col divide-y divide-zinc-100 text-sm">
          {(entries ?? []).length === 0 ? (
            <p className="py-6 text-center text-zinc-500">No entries yet</p>
          ) : null}
          {(entries ?? []).map((entry) => (
            <div key={entry.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
              <span className="w-40 font-medium text-zinc-900">
                {nameById.get(entry.driver_id) ?? "—"}
              </span>
              <span className="text-zinc-600">{KIND_LABEL[entry.kind] ?? entry.kind}</span>
              <span
                className={`tabular-nums font-medium ${
                  Number(entry.amount) > 0 ? "text-red-700" : "text-emerald-700"
                }`}
              >
                {Number(entry.amount) > 0 ? "+" : ""}
                {entry.amount}
              </span>
              {entry.method ? <span className="text-xs text-zinc-500">{entry.method}</span> : null}
              {entry.reference ? (
                <span className="text-xs text-zinc-500">{entry.reference}</span>
              ) : null}
              {entry.note ? <span className="text-xs text-zinc-500">{entry.note}</span> : null}
              <span className="ml-auto text-xs text-zinc-400">
                {new Date(entry.at).toLocaleString("bn-BD", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
