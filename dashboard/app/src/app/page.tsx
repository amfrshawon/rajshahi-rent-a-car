import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Status = {
  ok: boolean;
  headline: string;
  detail: string;
};

async function checkSupabase(): Promise<Status> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("drivers").select("id").limit(1);
    if (!error) {
      return {
        ok: true,
        headline: "Connected to Supabase",
        detail: "The dashboard can read and write the project.",
      };
    }
    if (error.code === "PGRST205" || /does not exist|not found/i.test(error.message)) {
      return {
        ok: true,
        headline: "Supabase connection verified",
        detail: "The connection works. Tables and RLS land in milestone M1.",
      };
    }
    if (error.code === "PGRST301" || /JWT|apikey|Invalid API key/i.test(error.message)) {
      return {
        ok: false,
        headline: "Supabase rejected the key",
        detail: "Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in dashboard/app/.env.local.",
      };
    }
    return {
      ok: false,
      headline: "Supabase returned an error",
      detail: error.message,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      headline: /env vars are missing/.test(message)
        ? "Set up the environment first"
        : "Could not reach Supabase",
      detail: message,
    };
  }
}

export default async function Home() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const status = configured ? await checkSupabase() : null;

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col justify-center gap-8 px-6 py-16">
      <header>
        <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
          Rajshahi Rent A Car
        </p>
        <h1 className="mt-1 text-3xl font-medium">M0 — setup check</h1>
      </header>

      {status ? (
        <section
          className={`rounded-xl border p-6 ${
            status.ok ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
          }`}
        >
          <h2
            className={`text-lg font-medium ${status.ok ? "text-emerald-800" : "text-red-800"}`}
          >
            {status.headline}
          </h2>
          <p className={`mt-2 text-sm ${status.ok ? "text-emerald-700" : "text-red-700"}`}>
            {status.detail}
          </p>
        </section>
      ) : (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-medium text-amber-800">
            Environment not configured yet
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-amber-900">
            <li>
              Create the Supabase project (the owner&apos;s account, Singapore region,
              <code className="mx-1 rounded bg-amber-100 px-1">pg_cron</code> enabled).
            </li>
            <li>
              Copy <code className="mx-1 rounded bg-amber-100 px-1">dashboard/.env.example</code>{" "}
              to <code className="mx-1 rounded bg-amber-100 px-1">dashboard/app/.env.local</code> and
              fill in the URL and the anon key.
            </li>
            <li>Restart <code className="mx-1 rounded bg-amber-100 px-1">npm run dev</code>.</li>
          </ol>
        </section>
      )}

      <footer className="text-sm text-zinc-500">
        <p>
          Migrations live in <code className="rounded bg-zinc-100 px-1">dashboard/supabase</code>;
          the first ones arrive with M1 (schema, RLS, seed data).
        </p>
      </footer>
    </main>
  );
}
