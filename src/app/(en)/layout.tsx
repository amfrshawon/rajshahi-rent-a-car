import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { RootHtml } from "@/components/root-html";
import { SITE } from "@/config/site";

/** English root layout. Every English route lives under /en/. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Rajshahi Rent A Car — Car Rental with Driver, 24/7",
    template: "%s | Rajshahi Rent A Car",
  },
  description:
    "Rent sedans, microbuses and ambulances in Rajshahi. Fixed rates, experienced drivers, available 24/7.",
  alternates: {
    canonical: "/en/",
    languages: { bn: "/", en: "/en/", "x-default": "/" },
  },
};

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return <RootHtml locale="en">{children}</RootHtml>;
}
