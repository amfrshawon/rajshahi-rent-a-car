# Mobile, SEO and premium-feel audit — 2026-10-20

Tested on branch `main` (`2f1150b`) with the dev server on port 3100, using
phone emulation at 390 px (home, fleet, ambulance, contact, pricing, `/en/`).
Every built page in `out/` was scanned for SEO tags, and the live site
`rajshahirentacar.bd` was checked. No code was changed.

**Bottom line:** the site is technically healthy (fast, no horizontal overflow
on phones, solid SEO basics). The gaps are mostly content: it doesn't yet show
enough to read as premium, and it undersells the ambulance service.

## 1. Mobile

### Working

- No horizontal scrolling at 390 px. Home is about 3.1 screens long.
- Tap targets are large enough; the sticky Call / Book bar works.
- Images are AVIF and lazy-loaded below the fold. Fonts are small.

### Fix

1. **The ambulance page's sticky bar says "বুক করুন" (book a car).** In an
   emergency it should be a red "অ্যাম্বুলেন্স কল করুন" call button on that
   page. See `src/components/mobile-action-bar.tsx`.
2. **Travel time word order is reversed:** "মিনিট ৫০" / "min 50" should be
   "৫০ মিনিট" / "50 min". See `src/components/home-page.tsx:186`.
3. **The route board looks unfinished.** Four of five routes show
   "যাচাই করুন" instead of a distance. Fill in distance and time, or remove the
   column.
4. **12 px text** in the trip-tile notes, rating badge and ambulance note is
   hard to read in Bangla. Raise it to 13–14 px. See
   `src/components/home-page.tsx:122`, `:139`, `:156`.
5. **The contact form's trip-type dropdown is 41 px tall** (minimum is 44 px).
   See `src/components/booking-form.tsx:130`.

## 2. SEO

### Working

Unique titles and descriptions on every page, canonical URLs, bn/en hreflang,
sitemap and robots.txt, structured data (AutoRental, EmergencyService,
FAQPage, BlogPosting, BreadcrumbList), Open Graph images, and Brotli
compression on the live host.

### Gaps

1. **Google Business Profile has only 2 reviews.** This is the biggest local
   SEO lever. Ask every satisfied customer for a review, and add
   "Ambulance service" as a second category.
2. **No `geo` coordinates or `hasMap` in the business schema.** The ambulance
   schema has `postalCode: "6200"` (`src/components/pages/ambulance-page.tsx:153`)
   but the business schema has none (`src/lib/schema.ts`). Make them
   consistent once the owner confirms the map pin.
3. **`www.rajshahirentacar.bd` returns 200 instead of a 301 redirect** to the
   apex domain. The canonical tag points to the apex, so the risk is low, but a
   one-line `.htaccess` redirect is cleaner.
4. **The 404 page is Next's default English "This page could not be found"**,
   with no branding, navigation or call button. Add a bilingual
   `not-found.tsx`.
5. **There are no landing pages for high-intent searches.** Candidates:
   - Rajshahi to Dhaka car rental
   - Rajshahi airport car rental
   - Microbus rental in Rajshahi
   - Ambulance near Rajshahi Medical College
   - AC, freezer or ICU ambulance (only types actually offered)
6. **Smaller items:**
   - `og:url`, `og:locale` and `og:site_name` are missing.
   - English blog meta descriptions are 165–209 characters; aim for about 155.
   - The Bangla contact page description is only 53 characters.
   - Next.js starter files are still in `public/` (`file.svg`, `vercel.svg`,
     `next.svg`, `globe.svg`, `window.svg`).
   - The tag and category archive pages are thin. Consider `noindex`.

## 3. Premium feel

- **The fleet doesn't read as premium.** Premio, Axio and Hiace are solid cars
  but not premium models. If higher-end cars exist (Prado, Land Cruiser, Noah,
  Alphard, Harrier, …), lead with them, each with 3–4 quality photos.
- **"5.0 · 2 reviews" in the hero works against a premium promise.** Keep it
  out of the hero until there are 10 or more reviews.
- **There are no real photos** of drivers, the ambulance, car interiors or the
  office. Only three car photos exist.

### Suggested home-page sections

| # | Section | Why |
|---|---|---|
| 1 | **Emergency ambulance section**: photo, on-board equipment (oxygen, stretcher, AC, ICU?), a separate emergency number, response time | Today the ambulance is a single row. It's a separate service and needs its own section. |
| 2 | **"Our standard" promise**: uniformed and verified drivers, cars cleaned before every trip, a maximum car age, water and tissues, an all-inclusive fixed fare, an on-time promise | Spells out what "premium" means. Only list what is actually true. |
| 3 | **Packages**: half day, full day, Dhaka round trip, airport transfer, wedding | Premium customers want a clear price before they call. |
| 4 | **Corporate and VIP rentals**: monthly hire, NGO and company accounts, guest pickup | Steady, high-value customers. |
| 5 | **Customer reviews**: three real Google reviews with names | Social proof. |
| 6 | **Short home FAQ** (4–5 questions) with FAQPage schema | Helps Google and AI search answers. |
| 7 | **Office map and service area** | Local search signal and trust. |

To keep the page short on phones, sections 1, 2 and 5 matter most; the others
can be compact.

## Needs the owner

1. The full car list: model, year, seats, daily rate, and any premium models
   planned.
2. Ambulance details: type (AC, ICU, freezer), equipment, and whether it has
   its own phone number.
3. Confirmation of the "within 15 minutes" response time and the "licensed and
   insured" claim already on the ambulance page
   (`src/components/pages/ambulance-page.tsx:45`, `:62`).
4. Distances and times for Bagha, Natore, Chapainawabganj and Dhaka, and the
   office's Google Maps pin.
5. The Facebook page link, to add to the schema's `sameAs`.

## Can be fixed now, without owner input

- Ambulance-page sticky call bar
- Minutes word order
- 12 px text sizes
- Dropdown height
- Bilingual 404 page
- `og:url`, `og:locale` and `og:site_name`
- Removing the starter SVGs
