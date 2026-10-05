# Redesign brief — Rajshahi Rent A Car

You are redesigning **rajshahirentacar.bd** so it stops looking like a generic,
template-built site and becomes a premium, easy-to-book rental brand for
Rajshahi. This file is your complete brief. Read all of it before you change
anything.

**How this job runs:** you work through every phase in section 4 from start
to finish without stopping for approval. The owner watches progress on a
local server you keep running and reviews everything once you are done. Do
not pause between phases to ask whether to continue.

## 0. Read these first, in this order

1. `AGENTS.md` — **this Next.js (16.x) differs from what you know.** Before
   writing code, read the relevant guide in `node_modules/next/dist/docs/`.
   For fonts: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md`.
2. `docs/audit/2026-10-05-design-audit.md` — the audit this brief is built on:
   measured numbers, nine defects with file and line references, and why the
   current site reads as AI-made.
3. `docs/audit/2026-10-05/index.html` — the visual report. Open it in a
   browser. It contains phone and desktop mockups of the target direction.
   Treat them as direction, not pixel spec.
4. `docs/PLAN.md` and `docs/DEPLOY.md` — architecture, hosting limits, the
   `dev` / `main` branch model, and the booking API.

## 1. The business and the people using it

- **Business:** chauffeur-driven car rental in Rajshahi, Bangladesh. Every
  rental includes a driver. Also a 24-hour ambulance service.
- **Fleet (in `src/config/site.ts`):** Toyota Premio ৳4,500/day, Toyota Axio
  ৳4,000/day, Toyota Hiace (15 seats) ৳8,000/day.
- **Contact:** 01714-424241, phone and WhatsApp, 24/7.
- **Users:** all ages, with Gen Z and millennials as the growth audience.
  Mostly Android phones around 360 px wide, on mobile data. Many book by
  calling or WhatsApp rather than filling in forms.
- **Languages:** Bangla first (site root), English second (`/en/`).
- **The owner's words:** *"its looking a very generic ai website, need to
  build very premium"*. Requirements: easy to understand, easy to book,
  mobile responsive, premium, modern.

## 2. How to work

### 2.1 Keep going until it is finished

- Work through phases 0 to 6 in order, then hand back. **Do not stop between
  phases or ask for permission to continue.** The owner reviews once, at the
  end.
- When something needs the owner, such as a price, a distance, a photo or
  credentials, do not wait. Put in a clearly marked placeholder, log it in the
  progress file (2.4) under *Needs the owner*, and carry on.
- Stop early only if continuing would break a constraint in section 3, or the
  build cannot be made to pass. If that happens, record exactly what blocked
  you in the progress file and in your final message.
- Make your own design judgement calls inside this brief. Note the important
  ones in the progress file, with the reasoning, so the owner can review them.

### 2.2 Branch and commits

- Create `redesign/premium` from the latest `origin/dev` in **its own git
  worktree**, for example:

  ```bash
  git fetch origin
  git worktree add ../rent-a-car-redesign -b redesign/premium origin/dev
  cd ../rent-a-car-redesign
  npm ci
  ```

  Another agent may commit to `dev` in the original folder. Never switch that
  folder's branch.
- Commit small and often, each commit explaining *why*, as in the existing
  history. Stage explicit paths only (never `git add -A`). Never commit
  `.commandcode/` or anything you did not create.
- **Push `redesign/premium` at the end of every phase**, so nothing is lost and
  the owner can see the work on GitHub.
- Before each push, `npm run build` and `npm run lint` must pass. `build` also
  regenerates images, localises the Bangla slugs and checks every legacy URL.
- Rebase on `origin/dev` at the start of each phase, so the branch does not
  drift. Never push to `dev` or `main` directly; the result goes back as a
  pull request (phase 6).

### 2.3 Local preview the owner can watch

Start the development server **at the beginning of phase 0, from your
worktree**, and keep it running for the whole job:

```bash
npm run dev -- -p 3100
```

- Use port **3100**. Port 3000 belongs to the other agent working on `dev`.
- Run it as a background process that stays alive between your steps. If
  your environment has a preview or launch feature, use that.
- It hot-reloads, so the owner sees each change as you save it.
- **Tell the owner the address as soon as it is up**, and write both
  addresses at the top of the progress file:
  - this computer: `http://localhost:3100`
  - a phone on the same Wi-Fi: `http://<this computer's LAN IP>:3100` (find
    the IP with `ipconfig getifaddr en0` on macOS). This lets the owner test on
    a real Android phone, which the audit could not do. If assets or hot reload
    fail from the phone, add that origin to `allowedDevOrigins` in
    `next.config.ts` (see
    `node_modules/next/dist/docs/02-pages/04-api-reference/04-config/01-next-config-js/allowedDevOrigins.md`)
    and note it in the progress file.
- **In development, Bangla pages use their ASCII paths.** `route()` returns
  `/fleet/`, `/contact/` and so on under `next dev`; the Bangla slugs
  (`/গাড়িবহর/`) only exist after `npm run build`. List the local URLs for each
  page in the progress file so the owner is not confused.
- If the server stops or crashes, restart it straight away and note it.
- Leave it running when you finish.

### 2.4 Progress file

Create `docs/audit/REDESIGN-PROGRESS.md` in phase 0 and update it at the end
of every phase. Commit it with that phase's work. It is how the owner follows
along without asking you. Keep these sections:

- **Preview:** the local and phone addresses, and the local URL of each page.
- **Status:** current phase, what is done, what is next.
- **Decisions:** judgement calls you made, with one line of reasoning each.
- **Needs the owner:** every placeholder, unconfirmed fact, new Bangla
  string for native review, and blocker.
- **Measurements:** the baseline from phase 0, then updated numbers.

## 3. Constraints you must not break

1. **Static export.** `output: "export"`. Pages are plain files served by
   LiteSpeed on ExonHost shared hosting (700 MB RAM, no root, Dhaka/BDIX).
   No server rendering, no Next API routes, no middleware. The booking API is
   a separate Node app in `api/`.
2. **Legacy URLs.** All 27 original WordPress URLs must keep returning 200,
   in Bangla at the original path and in English under `/en`. `npm run build`
   enforces this through `scripts/verify-legacy-routes.mts`. Never weaken or
   bypass that script, and never rename a path in
   `src/config/legacy-routes.ts`.
3. **Bangla slugs.** New Bangla pages use Bangla slugs from
   `src/config/routes.ts`. Next 16 cannot prerender non-ASCII directories, so
   directories stay ASCII and `scripts/localise-slugs.mts` renames the
   export. Link with `route(locale, key)`, never hardcoded paths.
4. **Noindex outside production.** Dev and preview builds are noindex. Keep it.
5. **Fonts.** Google Fonts with the SIL Open Font License only, self-hosted
   through `next/font`. Do not use Shurjo (Prothom Alo's face): it is
   proprietary, and the "free download" sites are not a licence.
6. **No invented facts.** Never make up prices, distances, travel times,
   ratings, review counts, trip counts, years in business, staff names or
   service claims. Where the design needs a number that is not on record, use
   a visibly marked placeholder and log it. On record today:
   - Google rating **5.0 from 2 reviews** (owner's Google Business Profile).
   - **Puthia 32 km** from Rajshahi (the site's own guide).
   - Fleet prices and contact details above.
   - The ambulance's published claims: 24 hours, advanced life support
     equipment, trained staff, nationwide transport, licensed and insured.
   Also check existing copy for unconfirmed claims, for example "সাজানো
   গাড়ি" (decorated cars) on the home page, and log them.
7. **No self-serving review markup.** Do not emit `aggregateRating` about the
   business itself.
8. **Accessibility:** WCAG 2.1 AA. Tap targets at least 44 × 44 px. Spoken
   labels start with the visible text. Compute colour contrast; do not
   eyeball it.
9. **Bangla typography:** never apply `letter-spacing` to Bangla text (it
   breaks conjuncts). Body line-height at least 1.6. Use Bangla digits in
   Bangla copy.
10. **OG images:** satori misshapes some Bangla; "শুরু" renders as "শবু" in
    Anek Bangla. If you touch `src/lib/og.tsx`, render the PNG and look at it.
11. **Credentials:** never ask for, enter or store passwords, FTP details or
    tokens. Deployment beyond pushing your branch is the owner's job.

## 4. Phases

Each phase ends the same way: build and lint pass → commit → update the
progress file → push `redesign/premium` → the change is visible on
`localhost:3100`. Then go straight on to the next phase.

### Phase 0 — Set up and measure the starting point

1. Create the worktree and branch, then run `npm ci` (2.2).
2. Start the dev server on port 3100 and tell the owner the addresses (2.3).
3. Create `docs/audit/REDESIGN-PROGRESS.md` (2.4).
4. Record the baseline: Lighthouse for the home and contact pages on
   dev.rajshahirentacar.bd (command in section 5), and the home page's height
   at 360 × 780 px. These become the "before" numbers in your final report.

### Phase 1 — Fix what is broken

Line numbers refer to `dev` at `2236e6c`.

1. **Booking fails and blames the customer.** `/api/booking` returns 404 on
   dev, so `src/components/booking-form.tsx` always shows *"ইন্টারনেটে সমস্যা
   হয়েছে"*. Until `/api/health` returns 200 on the target environment, make
   WhatsApp the form's primary action and label the button to say so. A
   server failure must never be described as the customer's connection.
   Deploying `api/` needs cPanel access; that is the owner's job
   (`docs/DEPLOY.md` §5b), so log it and move on.
2. **Validate before sending.** Both forms use `noValidate` and post
   immediately. Check name and phone client-side with the same rules as
   `api/src/validation.js` (BD mobile: `^(?:\+?880|0)1[3-9]\d{8}$` after
   removing spaces and dashes). Show Bangla messages under each field
   (*"নাম লিখুন"*, *"সঠিক মোবাইল নম্বর দিন"*) and send nothing until valid.
3. **Ambulance tile label.** `src/components/home-page.tsx:454` prints
   `COPY.services[2].label`, which is pickup. Use an explicit label and make
   it a `tel:` link: *"এখনই কল করুন"*.
4. **Email icon.** `src/components/pages/contact-page.tsx:88` uses
   `WhatsAppIcon` for the `mailto:` row. Add an envelope icon.
5. **Route chips.** `src/components/home-page.tsx:336` renders shadowed `<li>`
   pills with no link. Make each one open booking with the destination
   filled in. Phase 3 replaces them with the route board.
6. **Logo weight.** `scripts/generate-images.mts` writes `logo-device.png` at
   977 × 402 px (216 KB). Output it at twice display size as WebP or AVIF, or
   trace an SVG. Budget: 10 KB or less. In the header, show the car-and-pin
   mark only, never the RAJSHAHI wordmark, with the Bangla name as live text.
7. **Server headers.** `public/.htaccess` lines 12–14 set immutable caching
   and security headers, but dev serves none of them, not even
   `X-Content-Type-Options`. Find out why the `<IfModule mod_headers.c>`
   block is skipped (is the deployed file this one? does LiteSpeed honour the
   wrapper?) and fix it in the file. You cannot verify it until the branch is
   deployed, so log *"confirm with `curl -I` after deploy"* under
   *Needs the owner*.
8. **First-screen animation.** Remove `.rise` / `.rise-move`
   (`src/app/globals.css` around 378–400) from all first-screen content. On
   the contact page the LCP element is a fading paragraph (LCP 4.1 s).
9. **Tap targets and labels.** The footer `tel:` link is under 44 px. The
   ambulance page fails `label-content-name-mismatch`.

### Phase 2 — Design system

Build the foundation before touching page layouts, so every page change after
this draws on it.

1. **Colour tokens** in `src/app/globals.css` (5.2).
2. **Typography:** the Anek superfamily and type roles in `src/lib/fonts.ts`
   and `globals.css` (5.3). Measure the font payload against the budget
   before moving on.
3. **Shared pieces:** buttons, the trip-type tile, section and page-header
   layouts, the site header, the footer and the sticky mobile bar.
4. **Retire** the patterns in 5.4 at the component level, so they are not
   reused anywhere.

### Phase 3 — Home page and booking

1. Rebuild the home page to the structure in 5.5.
2. Build the booking flow in 5.6, prefilled from tiles and route rows.
3. Check it at 360, 390 and 1440 px on `localhost:3100`, in Bangla and
   English, in light and dark mode.

### Phase 4 — Inner pages

Apply the system to every remaining page (5.7) in both languages: fleet,
pricing, tour packages, wedding, airport and station pickup, ambulance, about,
contact, FAQ, the blog index, articles, category archives and the tag archive.
Use photographs as described in 5.8 and rewrite stock copy as in 5.9.

### Phase 5 — Verify and polish

Go through every acceptance criterion in section 5. For anything that fails,
fix it and measure again. Do not hand back with a failing criterion unless it
is genuinely blocked; in that case log what blocks it and why.

### Phase 6 — Hand back

1. Rebase on `origin/dev`, run the full build and lint once more, and push.
2. Open a pull request from `redesign/premium` into `dev` (not `main`), with
   everything in section 6.
3. Leave the dev server running on port 3100.
4. Finish with a short message to the owner: the PR link, the local and phone
   addresses, before and after numbers, and the *Needs the owner* list.

## 5. What to build

### 5.1 Direction

Premium here means confident, calm and specific: fewer elements, larger
type, real photographs, a booking flow that feels like a product. Build it
from what the brand already owns: the logo's deep green and red pin, the
Bangla name, and Rajshahi.

1. **Lead with the job, not a banner.** The first screen asks
   *"কোথায় যাবেন?"* and offers trip types as large tiles.
2. **One type family, used with range** (see 5.3).
3. **Colour from the logo.** Padma green surfaces; the logo's red only for
   pins, live status and emergency.
4. **Real numbers are the decoration.** Distances, travel times and per-day
   prices set large.
5. **Photograph the service, not the parking lot.**
6. **Motion only where it means something.** Nothing animates in the first
   screen.

### 5.2 Colour tokens

Replace the current palette in `src/app/globals.css`. Keep the semantic token
pattern: components use tokens, never raw hex values.

| Token | Light | Use |
| --- | --- | --- |
| Padma green | `#0B3D2C` | Hero and booking surfaces, primary button |
| Leaf | `#1D7A4E` | Links, selected states (the logo's green) |
| Pin red | `#D7263D` | Destination pins, live status, emergency. Nothing else. |
| Mist | `#F2F5F3` | Section ground. Faintly green, never cream. |
| Ink | `#0F1713` | Text |
| White | `#FFFFFF` | Page ground, cards |

Retire: amber `#b45309` as the call-to-action colour, the mint
`--brand-soft` icon squares, the pink `--emergency-soft` tile, and
`--brand-vivid`. The ambulance page keeps an urgent treatment, rebuilt in
this palette. Design dark mode properly: the existing three-state token
structure (system, `data-theme="dark"`, `data-theme="light"`) must keep
working. Check every text and background pair for at least 4.5:1 in both
themes, plus the WhatsApp ink against its surfaces.

### 5.3 Typography

- **Anek Bangla + Anek Latin.** Both are OFL and share a design, and both have
  a width axis (75–125) and weight (100–800). Drop Inter.
- **Roles:**
  - Display: width 125, weight 760–780
  - Reading: width 100, weight 400–420
  - Numbers and labels: width 75, weight 600–650, `tabular-nums`
- In `next/font/google`, use `axes: ['wdth']`. Per the Next 16 font docs,
  only weight is included by default to keep files small, so adding width
  will grow the file. **Measure it.**
- **Budget:** 150 KB or less of preloaded font on mobile (it is 242 KB across
  three files today). If the width axis breaks the budget, preload only the
  reading weight and load display widths without preload, or subset with
  `next/font/local`.

### 5.4 Remove these patterns

They are what makes the site read as generated:

- The icon-in-a-pale-square + bold line + grey sentence card, used about 20
  times (trust strip, bento grid, services, contact rows, ambulance
  features). Replace it with plain lists, large numerals, photographs or
  tables.
- The page header in `src/components/page-header.tsx`: grey band with a short
  green bar above the title.
- `rounded-2xl` + border + shadow on every block. Give card styling only to
  the elements that need to stand apart. Tile radius 6–8 px.
- The pulsing ring on the call button, `parallax-drift` on photos,
  `reveal-up` on most section headings, and the rise-in hero.
- Pills that are not buttons.
- Darkened hero photography. Show the car in full colour; any gradient for
  text legibility stays light.

Avoid these as replacements: warm cream with a serif and terracotta accent;
near-black with a single neon accent; purple-to-blue gradients; Inter or
Space Grotesk; emoji as section markers; everything centred. All of them are
common AI-generated defaults.

### 5.5 Home page

Target: about 4 screens at 360 × 780, against 7 today.

1. **Header.** Car-and-pin mark plus the Bangla name as text, a round call
   button, and the menu. The language switch stays compact.
2. **Hero (Padma green panel).**
   - A short line: *রাজশাহী · ২৪ ঘণ্টা · ড্রাইভারসহ*, with a small pin-red dot.
   - A display headline. The proposal, pending native review, is
     *"এক কলে গাড়ি দরজায়।"*
   - One supporting line.
   - The car photo in full colour.
   - A proof chip: *গুগলে ৫.০ · ২টি রিভিউ*. It is real. Show the count, do not
     hide it.
3. **"কোথায় যাবেন?"** Four tiles: শহরের ভেতরে (৳৪,০০০ থেকে / দিন), শহরের
   বাইরে, বিমানবন্দর ও স্টেশন, বিয়ের গাড়ি. Each opens booking with the trip
   type already set. Below the tiles, an ambulance row with a pin-red outline
   that calls directly.
4. **Route board, "রাজশাহী থেকে".** Destinations with distance, time and price
   where they are confirmed. Mark placeholders clearly. Each row opens booking
   with the destination filled in.
5. **Fleet.** Three cars with consistent crop and ratio. Price large in narrow
   numerals, seats, one booking action.
6. **How booking works.** Three real steps, numbered because the order is
   real: you call or message → we confirm the fare → the driver arrives.
7. **Closing call strip and footer.**

Take out: the duplicated services section, the bento grid and the trust icon
list. Reduce the blog teaser to a single text link.

### 5.6 Booking

- One flow: trip type → date and time → pickup area → name and phone →
  confirm. Prefill from tiles and route rows. Validate in the browser, in
  Bangla.
- Confirm through WhatsApp with the details filled in. Post to the API as
  well once `/api/health` returns 200.
- Sticky mobile bar: a call icon button, then **বুক করুন** filled in Padma
  green.

### 5.7 Inner pages

Apply the system to fleet, pricing, tour packages, wedding, airport/station
pickup, about, contact, FAQ, the blog index, articles, category archives and
the tag archive.

- **Ambulance:** the phone number stays the first and largest element.
- **Articles:** about 60–65 characters per line, a large headline, no card
  chrome.
- **Contact:** a short list of real methods, not icon cards.

### 5.8 Photography

The only real assets are three fleet photos and the logo.

- Use the photos in full colour, with the same crop and ratio on every car.
- Leave clearly labelled slots for the owner's planned shoot (the shot list is
  in the audit).
- Do not add stock photography.

### 5.9 Copy

- Write Bangla first: direct and specific.
- Replace the stock headings: "কেন আমাদের বেছে নেবেন", "আমাদের সার্ভিস",
  and repeated "বিস্তারিত →" links. Each heading should say something only
  this business could say.
- Every new or changed Bangla string needs a native read. Log them in the
  progress file.

### 5.10 Acceptance criteria

All of these are measured, not judged by eye.

- `npm run build` passes, including the legacy-URL check. `npm run lint` is clean.
- **Lighthouse 12, mobile, home page:**
  - LCP 2.5 s or less
  - Performance 90 or more
  - Accessibility 98 or more, with no failing audits
  - CLS 0.05 or less
- **Weight:**
  - Home transfer 400 KB or less
  - Logo 10 KB or less
  - Preloaded fonts 150 KB or less
- **axe:** zero WCAG 2.1 A/AA violations on the home page (Bangla and
  English), fleet, contact, ambulance and one article.
- **Overflow:** no horizontal scroll at 320, 360, 375, 390, 412, 768, 1024 and
  1440 px on every page type.
- **Length:** home 3,500 px tall or less at 360 × 780.
- **Booking:**
  - An empty submit shows Bangla errors and sends no request.
  - An invalid phone number is caught in the browser.
  - With the API absent, the flow completes through WhatsApp and never
    mentions the internet.
- Every tappable element is at least 44 × 44 px.
- Dark mode and light mode both checked.
- **Headers:** fixed in `public/.htaccess`; confirmation with `curl -I`
  happens after deploy and is logged for the owner.

**Measuring locally.** Lighthouse needs a production build, not `next dev`.
Build, serve `out/` on another port, and measure that:

```bash
npm run build
npx --yes serve out -l 4100          # leave the dev server on 3100 running
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
npx --yes lighthouse@12 http://localhost:4100/ \
  --form-factor=mobile --throttling-method=simulate \
  --only-categories=performance,accessibility,best-practices \
  --chrome-flags="--headless=new" --output=json --output-path=./lh-home.json
```

For the phase 0 baseline, point Lighthouse at
`https://dev.rajshahirentacar.bd/` instead. Headless Chrome cannot render
narrower than about 500 px, so measure overflow at 320–412 px in a real or
emulated browser viewport, not in headless screenshots.

## 6. What to hand back

A pull request from `redesign/premium` into `dev` containing:

1. Before and after screenshots at 360 and 1440 px of the home, fleet,
   contact and ambulance pages.
2. Lighthouse before (phase 0) and after (phase 5) for the home and contact
   pages.
3. The final progress file, including every placeholder, every unconfirmed
   fact, every new Bangla string for native review, and every decision.
4. Anything you could not do, and why.

## 7. Out of scope: owner tasks

Do not attempt these. Log them under *Needs the owner* and keep working.

- Deploying the booking API (cPanel credentials).
- The photo shoot.
- Collecting Google reviews.
- Confirming distances, travel times and route prices.
- Native review of Bangla copy.
- Confirming the server headers on the deployed site.
- Merging to `dev` and the production cutover to `main`.
