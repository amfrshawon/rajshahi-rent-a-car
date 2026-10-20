# Owner TODO — facts only you can supply

Everything below is deliberately missing from the site rather than guessed.
Each item lists where it will appear once supplied.

## 1. Fleet and photography

- Full car list: model, year, seats, daily rate, and any premium models offered
  on request. The site currently shows three cars (Premio, Axio, Hiace).
- Real photography: clean three-quarter exterior, front and rear interior,
  boot/luggage, chauffeur, airport meet-and-greet, wedding decoration, and an
  owner/team photo. The three current car photos are street snapshots
  (`public/media/generated/`) and are the biggest gap in how premium the site
  feels. Replace the file and keep the same basename to update every page.

## 2. Ambulance

- Type(s) offered (AC / ICU / freezer) — **no ambulance-type pages are built**
  until this is confirmed, because the wrong claim is a safety issue.
- Dedicated ambulance number, if it differs from the booking number.
- Confirm or withdraw: "under 15 minutes" response time and "licensed and
  insured". The home page currently makes neither claim.

## 3. Distances and map

- Distances/times for Bagha, Natore, Chapainawabganj and Dhaka. Only Puthia
  (32 km / ~50 minutes) is published. The route board hides the distance column
  for every other route instead of showing a placeholder.
- Google Maps pin for the Kadirgonj office. When you have the coordinates, set
  them in `PROFILE.geo` in `src/config/site.ts` (plus `PROFILE.mapUrl`); the
  schema fields are already wired and emit nothing while unset.

## 4. Facebook

- Page URL for `PROFILE.facebookUrl` in `src/config/site.ts`. It is added to
  `sameAs` in the business schema once set.

## 5. Reviews

- A Google Business Profile for the **rental** business. The only profile on
  record is the ambulance service's (5.0, 2 reviews). The home page rating
  badge is gated behind `GOOGLE_RATING.count >= 10` and is therefore hidden.
  A reviews section is not built for the same reason: two reviews reads thin
  to a premium customer. Raise the count in `src/config/trips.ts` as real
  reviews arrive.

## 6. HSTS

- Confirm every subdomain serves HTTPS before adding
  `Strict-Transport-Security` to `public/.htaccess`. It is not added yet.
  A `Permissions-Policy` header is in place.

## 7. Booking terms

- Cancellation, deposit, fuel policy and driver allowance. The pricing and FAQ
  pages cover day rates and outstation quoting, but not cancellation.

## 8. Bangla copy review

- A native review of the new copy: home page (standard, packages, ambulance,
  corporate, FAQ, service area), the three landing pages
  (`src/content/landing.ts`) and the vehicle pages
  (`src/components/pages/vehicle-page.tsx`). All of it is written from facts
  already published on the site; nothing is presented as a measurement.
