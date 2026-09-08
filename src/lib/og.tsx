import { ImageResponse } from "next/og";
import { FLEET, SITE } from "@/config/site";
import { type Locale, t } from "@/lib/locale";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Google Fonts serves TTF to unknown user agents and WOFF2 to modern ones.
 * Satori (behind ImageResponse) cannot read WOFF2, so the default fetch UA is
 * deliberately left alone here.
 */
async function loadBanglaFont(): Promise<ArrayBuffer> {
  const css = await fetch(
    "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@600",
  ).then((r) => r.text());

  const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
  if (!url) throw new Error("Could not find a font URL in the Google Fonts CSS");

  return fetch(url).then((r) => r.arrayBuffer());
}

/*
 * The site itself uses Anek Bangla, but this image deliberately does not:
 * satori renders "শুরু" as "শবু" in Anek Bangla. Hind Siliguri is the face
 * whose output here has actually been checked glyph by glyph, and a correct
 * share card matters more than matching the page exactly.
 *
 * Satori (behind ImageResponse) does not shape Bengali reliably. "গাড়ি ভাড়া"
 * rendered as "গাড়ভিাড়া" here — the ি jumped across the word boundary — while
 * the same string is fine in the browser.
 *
 * So every Bangla string in this image is built only from tokens that have
 * been rendered and visually checked. If you change one, regenerate the image
 * and LOOK at it before shipping.
 */
const COPY = {
  tagline: {
    bn: "ড্রাইভারসহ ভাড়া · ২৪ ঘণ্টা",
    en: "Car rental with driver · 24/7",
  },
  from: { bn: "ভাড়া শুরু", en: "From" },
  perDay: { bn: "প্রতিদিন", en: "per day" },
} as const;

export async function renderOgImage(locale: Locale) {
  const font = await loadBanglaFont();
  const cheapest = Math.min(...FLEET.map((v) => v.pricePerDay));
  const price = new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US").format(
    cheapest,
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b6b3a",
          color: "#ffffff",
          padding: 72,
          fontFamily: "Hind Siliguri",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 30, opacity: 0.85 }}>rajshahirentacar.bd</div>
          <div style={{ fontSize: 78, lineHeight: 1.25 }}>{t(locale, SITE.name)}</div>
          <div style={{ fontSize: 40, opacity: 0.9 }}>{t(locale, COPY.tagline)}</div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 14,
              background: "#b45309",
              padding: "16px 28px",
              borderRadius: 14,
              fontSize: 36,
            }}
          >
            <span style={{ opacity: 0.9 }}>{t(locale, COPY.from)}</span>
            <span style={{ fontSize: 46 }}>৳{price}</span>
            <span style={{ opacity: 0.9, fontSize: 28 }}>{t(locale, COPY.perDay)}</span>
          </div>
          <div style={{ fontSize: 38 }}>{t(locale, SITE.phoneDisplay)}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "Hind Siliguri", data: font, weight: 600, style: "normal" }],
    },
  );
}
