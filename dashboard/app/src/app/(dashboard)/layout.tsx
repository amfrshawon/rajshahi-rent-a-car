import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import { signOut } from "./actions";

const NAV = [
  { href: "/trips", label: "ট্রিপ", en: "Trips" },
  { href: "/calls", label: "কল", en: "Calls" },
  { href: "/drivers", label: "ড্রাইভার", en: "Drivers" },
  { href: "/money", label: "হিসাব", en: "Money" },
  { href: "/fares", label: "ভাড়ার তালিকা", en: "Fares" },
  { href: "/settings", label: "সেটিংস", en: "Settings" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireOwner();

  return (
    <div className="min-h-svh bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link href="/drivers" className="text-sm font-semibold text-zinc-900">
            রাজশাহী রেন্ট এ কার
            <span className="ml-2 hidden font-normal text-zinc-400 sm:inline">
              ড্যাশবোর্ড
            </span>
          </Link>
          <nav className="flex gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              >
                {item.label}
                <span className="ml-1 hidden text-xs text-zinc-400 md:inline">
                  {item.en}
                </span>
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-zinc-500 sm:inline">
              {profile?.full_name}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100"
              >
                লগ আউট
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
