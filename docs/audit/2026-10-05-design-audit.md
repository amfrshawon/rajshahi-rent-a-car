# Design audit — dev.rajshahirentacar.bd

**Date:** 5 October 2026
**Build audited:** `dev` at `75da6d9`, deployed to dev.rajshahirentacar.bd. Re-checked at `2236e6c`, which only changed `.gitignore`, so every line reference still holds.
**Visual report:** [`2026-10-05/index.html`](2026-10-05/index.html) (open locally; screenshots in `2026-10-05/img/`)
**Redesign brief built on this audit:** [`REDESIGN-PROMPT.md`](REDESIGN-PROMPT.md)

> **Verdict:** Built well. Looks like everyone else. Booking is broken.

The engineering underneath is sound. The problems are in the layer customers
see: the site is assembled from one card pattern repeated about twenty times,
nothing in it says Rajshahi, and on dev every booking fails while telling the
customer their internet is down.

The owner's own words: *"its looking a very generic ai website, need to build
very premium"* — with the requirements *easy to understand, easy to book,
mobile responsive*, Bangla first and English second, for all ages and
especially Gen Z and millennials in Rajshahi.

---

## Measured

Lighthouse 12, mobile, simulated slow 4G, 412 px mid-range phone. First byte
was measured from outside Bangladesh, so BDIX visitors will see a faster
start; render delay and page weight do not change with location.

| Page | Performance | LCP | Weight | LCP element |
| --- | --- | --- | --- | --- |
| Home | 84 | **4.5 s** | 695 KB | Hero photo |
| Contact | 87 | **4.1 s** | 615 KB | Fading intro paragraph (`.rise`) |
| Fleet | 94 | **3.1 s** | 705 KB | Premio photo |
| English home | 97 | 2.5 s | 652 KB | Hero photo |
| Ambulance | 99 | 2.2 s | 621 KB | Intro paragraph |
| Reviews post | 99 | 2.1 s | 630 KB | First paragraph |

- Accessibility **96** on every page; Best Practices **100**; CLS **0**; TBT ≤ 40 ms.
- SEO shows 69 only because dev is correctly `noindex`. Not a finding.
- **Home LCP breakdown (4,461 ms):** server 743 ms · image download 1,057 ms ·
  **image downloaded but not painted 2,661 ms (60%)**.
- **Home payload (695 KB):** header logo **211 KB** · car photos 75 KB ·
  fonts **242 KB** (three files: 152 + 47 + 42) · JS 132 KB · other 35 KB.
- About **450 KB of logo and fonts loads on every page**, so even text-only
  pages weigh over 600 KB.
- **Horizontal overflow: none** at 320, 360, 375, 390, 412, 430, 540, 768,
  1024, 1280 and 1440 px across 9 pages. This part is solid.
- **Mobile length:** home is **7 screens** at 360×780; a blog post runs to 13.
- Brotli compression is on.

---

## Fix first

Ordered by what costs bookings. Each was checked on the live dev site, then
traced to the code. Line numbers are valid at `75da6d9` and `2236e6c`.

### 1. Broken — every booking fails, and the message blames the customer
`GET /api/health`, `/api/booking`, `/api/bookings` all return **404** on dev.
`src/components/booking-form.tsx` posts to `/api/booking`; any non-422 failure
sets `status: "failed"`, which renders `failedBody`: *"ইন্টারনেটে সমস্যা হয়েছে…"*.
A customer with perfect signal is told their internet is the problem.
Production will behave the same unless the `api/` service is deployed
(`docs/DEPLOY.md` §5b — needs cPanel access, an owner task).

**Fix:** until `/api/health` returns 200 on the target environment, make
WhatsApp the form's primary action and label the button accordingly. A
server-side failure must never be described as the customer's connection.

### 2. Wrong — none of the server header rules are applied
`public/.htaccess` lines 12–14 set `public, max-age=31536000, immutable` for
JS/CSS/fonts/images, plus security headers. On dev the server sends **none**
of them: JS has no `Cache-Control`, images get a 7-day server default, and
`X-Content-Type-Options` / `Referrer-Policy` are missing. The whole
`<IfModule mod_headers.c>` block is being skipped.

**Fix:** confirm the deployed `.htaccess` is this file, then test whether
LiteSpeed honours the `<IfModule>` wrapper (it supports `Header` directly).
Verify each header with `curl -I` after deploy.

### 3. Wrong — the ambulance tile's link says "পিকআপ-ড্রপ"
`src/components/home-page.tsx:454` renders `COPY.services[2].label`. The
services array is ordered tours, wedding, **pickup**, ambulance, so index 2 is
pickup. The tile links to `/ambulance-service/` correctly; only the label is
wrong. In an emergency a mislabelled link costs seconds.

**Fix:** explicit label, ideally *"এখনই কল করুন"* as a `tel:` link.

### 4. Wrong — the email row shows a WhatsApp icon
`src/components/pages/contact-page.tsx:88` uses `WhatsAppIcon` on the row that
links to `mailto:`.

**Fix:** add an envelope icon to `src/components/icons.tsx` and use it.

### 5. Wrong — route chips look like buttons and do nothing
`src/components/home-page.tsx:336` — `<li>` pills with border, shadow and
`lift`, no link. People will tap them.

**Fix:** each opens booking with the destination prefilled, or restyle as
plain text. The redesign replaces them with a route board.

### 6. Slow — the header logo is 977 × 402 px and 216 KB
`scripts/generate-images.mts` writes `public/media/generated/logo-device.png`
at source resolution from `public/media/brand/logo-mark.png` (257 KB). It is
shown about 90 px wide and is five times heavier than the hero photo.

**Fix:** output at 2× display size as WebP/AVIF, or trace an SVG. Budget
≤ 10 KB.

### 7. Slow — entrance animations hold back the main content
`.rise` / `.rise-move` (`src/app/globals.css` ~378–400) animate the hero copy
and page intros. On the contact page the LCP element is a `.rise` paragraph
(LCP 4.1 s). `reveal-up` and `parallax-drift` run further down.

**Fix:** nothing in the first screen animates.

### 8. Wrong — nothing is checked before the form is sent
Both forms use `noValidate` and `handleSubmit` posts immediately. An empty
name or a five-digit phone costs a network round trip; while the API is
missing it ends on the internet-problem message. The server-side Zod schema
(`api/src/validation.js`) has good Bangla messages, but they are never reached
on dev.

**Fix:** validate name and phone client-side with the same rules as
`api/src/validation.js`, with Bangla messages under each field
(*"নাম লিখুন"*, *"সঠিক মোবাইল নম্বর দিন"*), before any request.

### 9. Polish — tap targets and a label mismatch
- The footer `tel:` link fails Lighthouse `target-size` on every page.
- The ambulance page fails `label-content-name-mismatch`: the call button's
  `aria-label` does not start with its visible text.

**Fix:** 44 × 44 px minimum hit area; spoken labels begin with the visible words.

### Resolved during the audit
- All 13 blog posts were English bodies under Bangla titles. Fixed in
  `75da6d9` (*Translate all 13 blog posts into Bangla*) and verified live:
  8,160 Bangla characters vs 200 Latin on the reviews post. The translations
  still need a native read.

---

## Why it reads as AI-made

Nothing here is badly made. Every choice is the safe, common one, so the
result looks like every other site built from the same parts.

1. **One card, about twenty times.** Icon in a pale tinted square, bold line,
   grey sentence: the trust strip, the bento grid, the services, the contact
   rows, the ambulance features. With one component carrying everything there
   is no hierarchy. This is the strongest single signal of a generated site.
2. **The stock car-rental hero.** Darkened photo, price pill, headline, two
   buttons, booking bar overlapping the bottom edge. The car is darkened until
   it stops being the subject.
3. **Nothing says Rajshahi.** No Padma, silk, mango orchard or local street.
   The three fleet photos come from three different places: outdoors with a
   yellow number plate, a city street with a Bangla plate, a showroom with
   studio lights in frame. Customers notice borrowed photos.
4. **Everything at the same volume.** Seven screens on a phone; pickup and
   ambulance each appear twice within two scrolls; the ambulance tile switches
   to a pink palette used nowhere else.
5. **Decoration standing in for information.** The route section — the most
   useful content on the page — is five pills with no distance, time or
   price. Pills on fleet cards, a pulsing ring on the call button, parallax on
   photos, a grey band with a short green bar above every inner-page title.
6. **The logo says the name twice.** The logo image contains RAJSHAHI and the
   Bangla name sits beside it. At header size the English lettering is
   unreadable.

---

## The premium direction

Premium here means confident, calm and specific: fewer elements, larger type,
real photographs, and a booking flow that feels like a product. Build it from
what the brand already owns — the logo's deep green and red pin, the Bangla
name, and Rajshahi itself. Full specification in `REDESIGN-PROMPT.md`.

A note on what was rejected: warm cream with a Bangla serif and a terracotta
accent was considered and dropped. That combination is one of the most common
AI-generated looks, so it would swap one template for another.

**Principles**
1. Lead with the job: the first screen asks *"কোথায় যাবেন?"* with four trip
   types as large tiles.
2. One type family used with range: Anek Bangla + Anek Latin, wide and heavy
   for headlines, normal for reading, narrow for numbers. Retire Inter.
3. Colour from the logo: Padma green surfaces, the logo's red only for pins,
   live status and emergency.
4. Real numbers are the decoration: distances, times, per-day prices set large.
5. Photograph the service, not the parking lot.
6. Motion only where it means something; nothing moves in the first screen.

**Tokens:** Padma green `#0B3D2C` · Leaf `#1D7A4E` · Pin red `#D7263D` ·
Mist `#F2F5F3` · Ink `#0F1713` · white.

**Photo shoot (owner task):** each car from the same angle in the same light;
a driver opening the rear door; arrival at Shah Makhdum airport; a family with
luggage at Rajshahi railway station; the Padma at dusk with the car in frame;
interiors; the Hiace with a group at Puthia; a decorated wedding car only if
decoration is actually offered.

---

## Method and limits

- Lighthouse 12 mobile on 6 pages; reports retained outside the repo.
- Overflow measured in a live browser at 11 widths on 9 pages.
- Behaviour checked on the live page; headers read with `curl -I`; findings
  then traced to code.
- **The auditor submitted the quick-booking form once** with test data
  (name রহিম, phone 12345) without asking first. The API returned 404, so
  nothing was stored or sent.
- **Correction:** an earlier version said empty submits showed an English
  browser message. Both forms set `noValidate`, so they send instead (finding 8).
- Not covered: a real Android phone on a Bangladeshi network; dark mode.
