import { requireOwner } from "@/lib/auth";
import { addDriver, setDriverStatus } from "./actions";

const OK: Record<string, string> = {
  added: "ড্রাইভার যোগ হয়েছে — অনুমোদনের অপেক্ষায় / Driver added, pending approval",
};
const ERRORS: Record<string, string> = {
  invalid: "সব ঘর ঠিকভাবে পূরণ করুন / Check the fields and try again",
  account: "অ্যাকাউন্ট তৈরি হয়নি — ফোন নম্বর আগে থেকে থাকতে পারে / Account not created (phone may already exist)",
  profile: "ড্রাইভার প্রোফাইল সংরক্ষণ হয়নি / Driver profile was not saved",
};

const STATUS_LABEL: Record<string, string> = {
  active: "সক্রিয় / Active",
  pending: "অপেক্ষমাণ / Pending",
  suspended: "স্থগিত / Suspended",
};

const STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  suspended: "bg-red-50 text-red-700 border-red-200",
};

const TYPE_LABEL: Record<string, string> = {
  non_ac: "নন-এসি / Non-AC",
  ac: "এসি / AC",
};

export default async function DriversPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const { supabase } = await requireOwner();

  const [{ data: drivers }, { data: balances }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, full_name, phone, status, on_duty, nid_number, license_number, created_at, vehicles(id, reg_number, ambulance_type, active)",
      )
      .eq("role", "driver")
      .order("created_at", { ascending: false }),
    supabase.from("driver_balance").select("driver_id, balance"),
  ]);

  const balanceById = new Map(
    (balances ?? []).map((row) => [row.driver_id as string, row.balance as number]),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">ড্রাইভার</h1>
          <p className="text-sm text-zinc-500">
            Drivers — approve, suspend and see each partner&apos;s balance
          </p>
        </div>
        <p className="text-sm text-zinc-500">
          মোট {drivers?.length ?? 0} জন / {drivers?.length ?? 0} drivers
        </p>
      </div>

      {ok && OK[ok] ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {OK[ok]}
        </p>
      ) : null}
      {error && ERRORS[error] ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {ERRORS[error]}
        </p>
      ) : null}

      <details className="rounded-xl border border-zinc-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-medium text-zinc-900">
          নতুন ড্রাইভার যোগ করুন / Add a driver
        </summary>
        <form action={addDriver} className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            নাম / Full name
            <input name="full_name" required className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            মোবাইল / Phone
            <input
              name="phone"
              required
              inputMode="tel"
              placeholder="01714-424241"
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            লগইন পাসওয়ার্ড / Login password
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            এনআইডি / NID number
            <input name="nid_number" className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            লাইসেন্স / License number
            <input name="license_number" className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            গাড়ির নম্বর / Vehicle reg. number
            <input name="reg_number" required className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            অ্যাম্বুলেন্সের ধরন / Ambulance type
            <select name="ambulance_type" required className="rounded-lg border border-zinc-300 px-3 py-2">
              <option value="non_ac">নন-এসি / Non-AC</option>
              <option value="ac">এসি / AC</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            গাড়ির ছবি ১ / Vehicle photo 1
            <input
              name="photo1"
              type="file"
              accept="image/*"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            গাড়ির ছবি ২ / Vehicle photo 2
            <input
              name="photo2"
              type="file"
              accept="image/*"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
            >
              যোগ করুন / Add driver
            </button>
          </div>
        </form>
      </details>

      <div className="flex flex-col gap-3">
        {(drivers ?? []).length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 bg-white px-4 py-8 text-center text-sm text-zinc-500">
            এখনও কোনো ড্রাইভার নেই / No drivers yet
          </p>
        ) : null}

        {(drivers ?? []).map((driver) => {
          const vehicle = (driver.vehicles ?? [])[0];
          const balance = balanceById.get(driver.id) ?? 0;
          return (
            <article
              key={driver.id}
              className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h2 className="text-base font-semibold text-zinc-900">{driver.full_name}</h2>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                    STATUS_STYLE[driver.status] ?? STATUS_STYLE.pending
                  }`}
                >
                  {STATUS_LABEL[driver.status] ?? driver.status}
                </span>
                {driver.on_duty ? (
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs text-sky-700">
                    ডিউটিতে / On duty
                  </span>
                ) : null}
                <span className="ml-auto text-sm text-zinc-500">{driver.phone}</span>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-600">
                <span>
                  গাড়ি / Vehicle: <span className="text-zinc-900">{vehicle?.reg_number ?? "—"}</span>
                </span>
                <span>
                  ধরন / Type:{" "}
                  <span className="text-zinc-900">
                    {vehicle ? TYPE_LABEL[vehicle.ambulance_type] ?? vehicle.ambulance_type : "—"}
                  </span>
                </span>
                <span>
                  এনআইডি / NID: <span className="text-zinc-900">{driver.nid_number ?? "—"}</span>
                </span>
                <span>
                  লাইসেন্স / License:{" "}
                  <span className="text-zinc-900">{driver.license_number ?? "—"}</span>
                </span>
                <span>
                  বকেয়া / Balance:{" "}
                  <span
                    className={`font-medium ${
                      balance > 2000 ? "text-red-700" : "text-zinc-900"
                    }`}
                  >
                    ৳{balance}
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {driver.status !== "active" ? (
                  <form action={setDriverStatus}>
                    <input type="hidden" name="driver_id" value={driver.id} />
                    <input type="hidden" name="status" value="active" />
                    <button
                      type="submit"
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      অনুমোদন / Approve
                    </button>
                  </form>
                ) : null}
                {driver.status !== "suspended" ? (
                  <form action={setDriverStatus}>
                    <input type="hidden" name="driver_id" value={driver.id} />
                    <input type="hidden" name="status" value="suspended" />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      স্থগিত / Suspend
                    </button>
                  </form>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
