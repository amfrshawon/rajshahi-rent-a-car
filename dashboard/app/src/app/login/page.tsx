import { signIn } from "./actions";

const ERRORS: Record<string, string> = {
  missing: "ইমেইল ও পাসওয়ার্ড দিন / Enter email and password",
  invalid: "ইমেইল বা পাসওয়ার্ড ভুল / Wrong email or password",
  "not-owner": "এই অ্যাকাউন্টের ড্যাশবোর্ডে প্রবেশাধিকার নেই / Not an owner account",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error ? ERRORS[error] ?? ERRORS.invalid : null;

  return (
    <main className="flex min-h-svh items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
          Rajshahi Rent A Car
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">
          ড্যাশবোর্ডে লগ ইন
        </h1>
        <p className="text-sm text-zinc-500">Sign in to the dispatch dashboard</p>

        {message ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {message}
          </p>
        ) : null}

        <form action={signIn} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            ইমেইল / Email
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              className="rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-900 outline-none focus:border-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            পাসওয়ার্ড / Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-900 outline-none focus:border-zinc-900"
            />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            লগ ইন / Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
