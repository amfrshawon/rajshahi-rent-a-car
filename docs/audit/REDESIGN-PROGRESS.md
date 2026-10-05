# Redesign progress — `redesign/claude`

One of two independent redesigns built from `docs/audit/REDESIGN-PROMPT.md`,
so the owner can compare them. The other agent works on `redesign/premium`
(preview on port 3100). This one never touches that branch or folder.

## Preview

| | Address |
| --- | --- |
| This computer | **http://localhost:3200** |
| A phone on the same Wi-Fi | **http://192.168.0.118:3200** |
| Worktree | `/Users/dfs/Documents/rent-a-car-claude` |
| Branch | `redesign/claude` |

The server hot-reloads, so changes appear as they are saved. In development
the Bangla pages use their ASCII paths; the Bangla slugs (`/গাড়িবহর/`) only
exist in the built export.

| Page | Bangla (local) | English (local) |
| --- | --- | --- |
| Home | `/` | `/en/` |
| Fleet | `/fleet/` | `/en/fleet/` |
| Pricing | `/pricing/` | `/en/pricing/` |
| Tour packages | `/tour-packages/` | `/en/tour-packages/` |
| Wedding cars | `/wedding-car/` | `/en/wedding-car/` |
| Airport and station | `/airport-station-pickup/` | `/en/airport-station-pickup/` |
| Ambulance | `/ambulance-service/` | `/en/ambulance-service/` |
| About | `/about/` | `/en/about/` |
| Contact and booking | `/contact/` | `/en/contact/` |
| FAQ | `/faq/` | `/en/faq/` |
| Blog | `/blog/` | `/en/blog/` |
| An article | `/puthia-temple-day-trip-rajshahi-car/` | `/en/puthia-temple-day-trip-rajshahi-car/` |

## Status

- [x] **Phase 0 — set up and baseline.** Worktree, branch, dependencies,
  preview server, this file.
- [x] **Phase 1 — fixes.** Booking goes to WhatsApp with Bangla checks
  before anything is sent; ambulance tile is a call link; route chips open
  booking with the destination filled in; email icon; tap targets and the
  ambulance spoken label; header logo 216 KB → 5 KB; first screen no longer
  animates; the deploy keeps `.htaccess`.
- [x] **Phase 2 — design system.** Padma / Leaf / Pin / Mist / Ink tokens
  with a computed dark palette; one type family in three local cuts; new
  header, footer with the closing call strip, sticky bar and page header.
  (Fonts revised in Phase 3, see Decisions.)
  Retired: the pulsing call button, the closing CTA band, the grey page
  header with its green bar, and every reveal / rise / parallax / tilt /
  lift animation.
- [x] **Phase 3 — home and booking.** A Padma green opening that asks
  "কোথায় যাবেন?" inside the first phone screen, four trip tiles and an
  ambulance call line; a route board from Rajshahi; the fleet; booking in
  three steps. Booking is one form in five steps, prefilled from any tile,
  route row or car, checked in Bangla, sent through WhatsApp.
- [ ] Phase 4 — inner pages
- [ ] Phase 5 — verify
- [ ] Phase 6 — hand back

## Measurements

**Baseline** is the 5 October audit of dev at `75da6d9`. The site's code is
unchanged between that commit and this branch's starting point `1adeb1d`
(only docs and `.gitignore` changed), so the audit numbers stand.

| Page | Performance | LCP | Weight |
| --- | --- | --- | --- |
| Home | 84 | 4.5 s | 695 KB (logo 211, fonts 242) |
| Contact | 87 | 4.1 s | 615 KB |

Home on a 360 × 780 phone: 7 screens (5,467 px). Accessibility 96 on every
page (tap-target failure).

**After Phase 3**, Lighthouse 12 mobile (simulated slow 4G) on the
production export served locally (`npx serve out -l 4200`):

| Page | Performance | Accessibility | Best practices | LCP | Weight |
| --- | --- | --- | --- | --- | --- |
| Home (Bangla) | 99 | 100 | 100 | 2.0 s | 315 KB |
| Home (English) | 98 | 100 | 100 | 2.4 s | 284 KB |

Home on a 360 × 780 phone: 3,450 px (4.4 screens), measured with the
placeholders hidden as they are in production. No horizontal overflow at
360 px in either language.

## Decisions

- **Fonts are cut locally instead of loaded from Google.** Measured: the
  Bangla font with the width axis is 437 KB, and asking Google for two
  weights returns the full 152 KB variable file. `scripts/build-fonts.py`
  cuts static files from the OFL source into `src/fonts/`, served through
  `next/font/local`. Renamed internally to "RRC Sans", as the OFL asks of
  modified versions.
- **Bangla pages load one web font: the display cut.** Anek Bangla at
  width 125, weight 800 sets headlines, figures, buttons and labels: the
  part of the type that carries the brand. Reading text uses the phone's
  own Bengali font (Noto Sans Bengali on Android, Kohinoor Bangla on
  iPhone, Nirmala UI on Windows). Measured on the home page: with Anek's
  reading cut as well, 130 KB of font loaded before the first paint and
  Lighthouse LCP was 2.8 s; without it LCP is 2.0 s and the page weighs
  315 KB. The brief asked for Anek in reading text too; this is the one
  place I traded it for the LCP and weight budgets.
- **English pages keep all three Latin cuts** (text 400, display 800, a 600
  for bold words in articles), about 15 KB each.
- **Figures use the display cut.** The brief's narrow 600 cut for numbers
  would have been another file on every page.
- **Display weight is 800, not 760–780.** 800 is the font's own master;
  any weight between masters is interpolated and compresses worse
  (760: 70.6 KB, 780: 69.3 KB, 800: 60.5 KB). The difference is not
  visible.
- **The Bangla display cut includes the Latin alphabet** (+8 KB), so car
  names set in it need no second font.
- **Latin typesetting extras are dropped from the cuts** (fractions,
  ordinals, superiors, slashed zero): about 2 KB per file. Every Bengali
  shaping feature is kept.
- **Each locale preloads only its own fonts** (Bangla 59 KB, English 30 KB;
  was 242 KB). This needed `experimental.cssChunking: { type: "graph",
  requestCost: 100 }` in `next.config.ts`: by default both layouts' CSS
  merged into one file and every page preloaded both locales' fonts.
  Cost: one extra stylesheet request of under 1.5 KB.
- **No `dark:` variants.** Colours are tokens, redefined for dark mode under
  `prefers-color-scheme` and under `html[data-theme]`, so the three states
  work without touching components. Green panels (`.surface-padma`,
  `.surface-deep`) re-scope the tokens, so text, buttons and focus rings
  adapt on them automatically. There is no theme toggle in the UI, as
  before.
- **The dark-ground logo keeps its red pin.** The old "white" logo was a
  grey inversion that turned the pin grey. It is now white swoosh, red pin.
- **Language switch, call and menu are 44 px** (were 36 px).
- **The Google rating is not on the home page.** The brief proposed
  "গুগলে ৫.০ · ২টি রিভিউ" in the hero, but `docs/PLAN.md` records that the
  5.0 from 2 reviews belongs to the ambulance service's Google profile; the
  rental business has none yet. Showing it on the car rental hero would
  credit the rental with the ambulance's reviews. It stays on the ambulance
  page, where it belongs. My brief was wrong on this point.
- **The hero photo is shown from 1024 px up only.** On a phone the first
  screen is the question and the four tiles, and the same car leads the
  fleet a scroll later, so the photo is not downloaded there at all
  (`Photo` takes a `media` query and gives the `<img>` an empty source).
  This keeps the phone home under 3,500 px.
- **The fleet section renders as it nears the screen**
  (`content-visibility: auto` with its real phone height reserved).
- **Photos have a 640 px size.** A phone needs about 580 px for a fleet
  card, and the next size up was 800 (42 KB vs 27 KB for the Premio).
- **Route board placeholders.** Only Puthia's 32 km is on record. Every
  other distance and every travel time is drawn as a dashed "?" on dev and
  preview builds (`Placeholder`, shown when `NEXT_PUBLIC_IS_PREVIEW` is set
  or in `next dev`) and left out of production, so a customer never sees
  an invented or unfinished number. Prices are "quoted by phone", as the
  pricing page already says.
- **The booking form.** Trip type, date and time, pickup and destination,
  car, then name and number. Only name and number are required. A tile,
  route row or car links in with `?trip=`, `?to=` or `?vehicle=` and those
  arrive chosen. The WhatsApp message is written out in the page's
  language, with the date and time the Bangla way ("সোমবার ১২ অক্টোবর,
  সকাল ৯:৩০"). When the API goes live, trip, time and pickup travel in its
  `notes` field, because its schema has no fields for them.
- **Errors use the pin red.** The brief keeps the red for pins, live status
  and emergencies; a field error is the one other place it appears.
- **Retired on the home page:** the trust strip, the bento grid, the
  duplicated services list, the blog cards (a "travel guides" link stays in
  the footer) and the quick-booking bar over the hero.

- **Booking goes to WhatsApp until the booking server is live.** The
  `/api/booking` service is not deployed, so posting to it always fails. The
  form now checks name and phone in Bangla, then opens WhatsApp with the
  booking written out. Setting `NEXT_PUBLIC_BOOKING_API_LIVE=true` at build
  time switches it back to posting. If posting fails, the message says the
  problem is on our side and offers WhatsApp and a call; it never blames the
  customer's internet.
- **Why `.htaccess` was ignored on dev.** Not LiteSpeed: the file never
  reached the server. `actions/upload-artifact@v4` skips files whose names
  start with a dot, so the deploy artifact had 413 files and no `.htaccess`.
  `deploy.yml` now sets `include-hidden-files: true`.
- **The header logo is the mark only.** The old file was the whole logo at
  977 × 402 px. The script keeps the green swoosh and the red pin and drops
  the lettering, since the Bangla name sits beside it in the header. Shown
  at 75 × 32, saved at 2× as WebP: about 5 KB.

## Needs the owner

- **Create a Google Business Profile for the rental business** and collect
  reviews. The only profile today is the ambulance service's.
- **Confirm the route board figures:** road distance and travel time from
  Rajshahi to Bagha, Natore and Dhaka, and travel time to Puthia. Fill them
  in `src/config/trips.ts` (`distanceKm`) and the placeholders disappear.
- **Confirm payment methods:** the contact page says Bangla QR (bKash,
  Nagad, Rocket, Upay) or bank transfer, and no cards, as `docs/PLAN.md`
  records. Please confirm before launch.
- **Read the new Bangla copy** (list below).
- **Photo shoot** (shot list in the audit). The fleet uses the three
  existing photos at one crop; they still come from three different places.

- **Deploy the booking server**, then build with
  `NEXT_PUBLIC_BOOKING_API_LIVE=true` (`docs/DEPLOY.md` §5b, needs cPanel).
- **After the next deploy, check headers:**
  `curl -I https://dev.rajshahirentacar.bd/_next/static/…` should show
  `Cache-Control: public, max-age=31536000, immutable`.

## New Bangla copy for a native read

Home: রাজশাহী · ২৪ ঘণ্টা · ড্রাইভারসহ · এক কলে গাড়ি দরজায়। · প্রাইভেট কার আর
মাইক্রোবাস, অভিজ্ঞ ড্রাইভারসহ। ভাড়া আগেই ঠিক হয়, পরে কোনো লুকানো খরচ নেই। ·
এখনই কল করুন · কোথায় যাবেন? · শহরের ভেতরে / শহরের বাইরে / বিমানবন্দর ও স্টেশন /
বিয়ের গাড়ি · দিনে ৳৪,০০০ থেকে · পুঠিয়া, নাটোর, ঢাকা · পিকআপ ও ড্রপ, সময়মতো ·
বিয়ের দিনের গাড়ি ও ড্রাইভার · অ্যাম্বুলেন্স? এখনই কল করুন · রাজশাহী থেকে ·
সারিতে চাপ দিলে গন্তব্যসহ বুকিং ফর্ম খুলবে। ভাড়া রুট ও সময় দেখে ফোনে জানানো হয়। ·
রাজশাহী শহর · রাজবাড়ি ও মন্দির চত্বর · ষোড়শ শতকের টেরাকোটা মসজিদ · রাজবাড়ি ও
উত্তরা গণভবন · পদ্মার পাড় · পদ্মা গার্ডেন, শহীদ মিনার, শহর ঘোরা · দূরের লম্বা
ট্রিপ · শহরেই · চালকসহ তিনটি গাড়ি · সব গাড়ি এসি ও নিয়মিত সার্ভিসিং করা। ভাড়া
শহরের ভেতরে, দিনপ্রতি। · আসন, জ্বালানি ও গিয়ার দেখুন · এই গাড়ি বুক করুন ·
বুকিং হয় তিন ধাপে · কল বা মেসেজ করুন / ফোন, হোয়াটসঅ্যাপ বা বুকিং ফর্ম, যেটা
সুবিধা। · ভাড়া নিশ্চিত করি / রুট আর সময় শুনে ভাড়া বলি। রাজি হলে বুকিং পাকা। ·
ড্রাইভার পৌঁছে যান / ঠিক করা সময়ে, আপনার দেওয়া ঠিকানায়।

Shell: রাজশাহী / রেন্ট এ কার (header lockup) · কল · বুক করুন · এয়ারপোর্ট ও
স্টেশন · দিন হোক বা গভীর রাত, ফোন ধরা হয়। · হোয়াটসঅ্যাপে লিখুন · রাজশাহী ভ্রমণ
গাইড · সাইটের পাতা

Booking: বুকিং ও যোগাযোগ · দিনরাত ২৪ ঘণ্টা খোলা। নিচের ফর্মটি এক মিনিটের,
অথবা সরাসরি কল বা হোয়াটসঅ্যাপ করুন। · গাড়ি বুক করুন · শুধু নাম আর নম্বর
বাধ্যতামূলক। বাকিটা জানা থাকলে লিখুন, না থাকলে আমরা ফোনে জেনে নেব। · কোন ধরনের
যাত্রা · কবে, কখন · কোথা থেকে, কোথায় · কোথা থেকে উঠবেন · যেমন: সাহেব বাজার,
রেলস্টেশন · গাড়ি · যেকোনো গাড়ি · যাত্রী আর রুট শুনে আমরা বলে দেব · আপনার নাম ও
নম্বর · আর কিছু জানাতে চাইলে · ঐচ্ছিক · হোয়াটসঅ্যাপ খুলবে, আপনার তথ্য লেখা
থাকবে। পাঠানোর আগে দেখে নিতে পারবেন। · ফর্মে ফিরে যান · সরাসরি · ফোন, ২৪ ঘণ্টা ·
বাংলা কিউআর: বিকাশ, নগদ, রকেট, উপায়, অথবা ব্যাংক ট্রান্সফার। কার্ড নেওয়া হয় না।
WhatsApp message labels: নতুন বুকিং · যাত্রা · কবে · পিকআপ · গন্তব্য · মোবাইল ·
অন্যান্য.
