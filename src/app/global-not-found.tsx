import "./globals.css";
import type { Metadata } from "next";
import { bangla, latin } from "@/lib/fonts";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "পেজ পাওয়া যায়নি | Page not found",
  robots: { index: false, follow: false },
};

const links = [
  { href: "/", bn: "হোম পেজ", en: "Home" },
  { href: "/গাড়িবহর/", bn: "গাড়িবহর", en: "Fleet" },
  { href: "/যোগাযোগ/", bn: "যোগাযোগ ও বুকিং", en: "Contact & booking" },
  { href: "/en/", bn: "", en: "English site" },
];

/**
 * Standalone, bilingual 404. It renders outside both root layouts, so it
 * carries its own <html> and shows Bangla and English together rather than
 * guessing a language from a URL that matched no route.
 */
export default function GlobalNotFound() {
  return (
    <html lang="bn" className={`${bangla.variable} ${latin.variable} h-full antialiased`}>
      <body className="bg-bg text-fg flex min-h-full items-center justify-center px-5 py-12">
        <main className="w-full max-w-md text-center">
          <p className="text-leaf text-sm font-semibold tracking-wide">404</p>
          <h1 className="mt-2 text-3xl font-bold leading-snug">পেজটি পাওয়া যায়নি</h1>
          <p className="text-muted mt-2">This page could not be found.</p>
          <p className="text-muted mt-4">
            লিংকটি পুরনো হতে পারে। নিচ থেকে বেছে নিন, অথবা সরাসরি কল করুন।
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href={`tel:${SITE.phone}`}
              className="bg-brand text-brand-fg flex min-h-12 items-center justify-center rounded-xl px-5 font-semibold"
            >
              কল করুন · Call {SITE.phoneDisplay.en}
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              className="border-border flex min-h-12 items-center justify-center rounded-xl border px-5 font-semibold"
            >
              WhatsApp
            </a>
          </div>

          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-leaf inline-flex min-h-11 items-center font-medium underline-offset-4 hover:underline">
                  {l.bn ? `${l.bn} · ${l.en}` : l.en}
                </a>
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
