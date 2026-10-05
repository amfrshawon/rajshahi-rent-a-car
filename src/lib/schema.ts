/**
 * Schema.org builders.
 *
 * Only facts the owner has published are encoded. Notably absent:
 *   - `geo` coordinates — the exact location is not on record, and a wrong
 *     pin actively harms local search and maps.
 *   - `postalCode` — not published anywhere.
 *   - `aggregateRating` — the live site shows Google reviews, but inventing
 *     a rating value is both wrong and a structured-data policy violation.
 * Add these once confirmed (docs/PLAN.md §12).
 */

import { FLEET, SITE } from "@/config/site";
import type { Article } from "@/lib/content";
import { type Locale, localePath, t } from "@/lib/locale";

const ORGANISATION_ID = `${SITE.url}/#organisation`;

/** The owner's Google Business Profile — factual, and already linked from the ambulance page. */
const GOOGLE_BUSINESS_PROFILE = "https://share.google/52MSxbL6RCxlZ1huf";

function absolute(locale: Locale, path: string): string {
  return new URL(localePath(locale, path), SITE.url).toString();
}

/** The business itself. AutoRental is the specific LocalBusiness subtype. */
export function businessSchema(locale: Locale) {
  const prices = FLEET.map((v) => v.pricePerDay);
  const logo = {
    "@type": "ImageObject",
    url: `${SITE.url}/media/brand/logo-full.png`,
    width: 512,
    height: 512,
  };

  return {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "@id": ORGANISATION_ID,
    name: t(locale, SITE.name),
    url: absolute(locale, "/"),
    telephone: SITE.phone,
    email: SITE.email,
    inLanguage: locale,
    // Google's local-business logo comes from these two fields.
    logo,
    image: logo,
    sameAs: [GOOGLE_BUSINESS_PROFILE],
    address: {
      "@type": "PostalAddress",
      streetAddress: locale === "bn" ? "কাদিরগঞ্জ, গ্রেটার রোড" : "Kadirgonj Greater Road",
      addressLocality: locale === "bn" ? "রাজশাহী" : "Rajshahi",
      addressCountry: "BD",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: `৳${Math.min(...prices)}–৳${Math.max(...prices)}`,
    currenciesAccepted: "BDT",
    areaServed: {
      "@type": "AdministrativeArea",
      name: locale === "bn" ? "রাজশাহী, বাংলাদেশ" : "Rajshahi, Bangladesh",
    },
  };
}

/** The fleet, as an offer catalogue. */
export function fleetSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: FLEET.map((vehicle, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Car",
        name: vehicle.name,
        vehicleSeatingCapacity: vehicle.seats,
        vehicleTransmission: t(locale, vehicle.transmission),
        fuelType: t(locale, vehicle.fuel),
        offers: {
          "@type": "Offer",
          price: vehicle.pricePerDay,
          priceCurrency: "BDT",
          availability: "https://schema.org/InStock",
          seller: { "@id": ORGANISATION_ID },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: vehicle.pricePerDay,
            priceCurrency: "BDT",
            unitCode: "DAY",
          },
        },
      },
    })),
  };
}

export function articleSchema(locale: Locale, article: Article) {
  const url = absolute(locale, `/${article.slug}/`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.modified,
    inLanguage: locale,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    author: { "@id": ORGANISATION_ID },
    publisher: { "@id": ORGANISATION_ID },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(locale: Locale, crumbs: readonly Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(locale, crumb.path),
    })),
  };
}
