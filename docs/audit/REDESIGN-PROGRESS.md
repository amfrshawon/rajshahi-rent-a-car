# Redesign progress — `redesign/premium`

Live log for the redesign brief in [`REDESIGN-PROMPT.md`](./REDESIGN-PROMPT.md).
Updated at the end of every phase and committed with that phase's work.

## Preview

Dev server runs from the worktree on port **3100** (port 3000 belongs to the
agent on `dev`).

- This computer: **http://localhost:3100**
- Phone on the same Wi-Fi: **http://192.168.0.118:3100**

In `next dev` the Bangla pages use their ASCII paths; the Bangla slugs
(`/গাড়িবহর/`) exist only after `npm run build`. Local URLs:

| Page | Local URL (bn) | Local URL (en) |
| --- | --- | --- |
| Home | http://localhost:3100/ | http://localhost:3100/en/ |
| Fleet (গাড়িবহর) | http://localhost:3100/fleet/ | http://localhost:3100/en/fleet/ |
| Pricing (ভাড়ার তালিকা) | http://localhost:3100/pricing/ | http://localhost:3100/en/pricing/ |
| Tours (ট্যুর প্যাকেজ) | http://localhost:3100/tour-packages/ | http://localhost:3100/en/tour-packages/ |
| Wedding (বিয়ের গাড়ি) | http://localhost:3100/wedding-car/ | http://localhost:3100/en/wedding-car/ |
| Airport & station | http://localhost:3100/airport-station-pickup/ | http://localhost:3100/en/airport-station-pickup/ |
| About (আমাদের সম্পর্কে) | http://localhost:3100/about/ | http://localhost:3100/en/about/ |
| Contact (যোগাযোগ) | http://localhost:3100/contact/ | http://localhost:3100/en/contact/ |
| FAQ (সাধারণ জিজ্ঞাসা) | http://localhost:3100/faq/ | http://localhost:3100/en/faq/ |
| Ambulance (legacy) | http://localhost:3100/ambulance-service/ | http://localhost:3100/en/ambulance-service/ |
| Blog (legacy) | http://localhost:3100/blog/ | http://localhost:3100/en/blog/ |

If assets or hot reload fail when opened from the phone, add the LAN origin to
`allowedDevOrigins` in `next.config.ts` — not yet needed.

## Status

- **Phase 0 — done.** Worktree `../rent-a-car-redesign` created from
  `origin/dev` (`1adeb1d`) on branch `redesign/premium`; `npm ci` run; dev
  server live on 3100; baseline measured (below).
- **Phase 1 — done.** All nine defects fixed (see below). Build + lint pass;
  branch pushed.
- **Phase 2 — done.** Palette tokens, Anek typography, shared buttons/tiles,
  restyled header/page-header/sticky bar. Preloaded fonts **111 KB** (was
  242 KB).
- **Phase 3 — done.** Home rebuilt (hero with trip tiles, route board, fleet,
  three booking steps, closing strip); booking flow reworked to the one-flow
  field set. Home is now **3,185 px / 4.08 screens** (was 7.01).
- **Phase 4 — done.** Every inner page — fleet, pricing, tours, wedding,
  airport/station, ambulance, about, contact, FAQ, blog index, articles,
  archives — now draws on the system. Build + lint pass.
- **Phase 5 — done.** All acceptance criteria measured and met (axe clean,
  Lighthouse target met, no overflow, home under length, booking verified).
  Two fixes came out of it: ambulance hero contrast and 44px header controls.
- **Next:** Phase 6 — rebase, final build, open the pull request.

### Phase 1 — the nine defects

1. **Booking** — the failure copy that blamed the customer's connection is
   gone. The form's primary action is now WhatsApp, labelled
   *"হোয়াটসঅ্যাপে বুকিং পাঠান"*, with the details filled in. It still posts to
   the API in the background (best-effort, `keepalive`) for when `api/` is
   deployed. Deploying `api/` remains an owner task.
2. **Validation** — name and phone are checked in the browser with the same
   rules as `api/src/validation.js` (BD mobile `^(?:\+?880|0)1[3-9]\d{8}$`
   after stripping spaces/dashes). Empty submit shows *"নাম লিখুন"* /
   *"সঠিক মোবাইল নম্বর দিন"* and sends nothing. Verified in headless Chrome.
3. **Ambulance tile** — now a direct `tel:` call labelled *"এখনই কল করুন"*
   instead of the mislabelled pickup pill.
4. **Email icon** — contact row uses a new envelope icon, not the WhatsApp one.
5. **Route chips** — each is now a link that opens the booking form on the
   contact page with `?destination=…` prefilled. (Phase 3 replaces them with
   the route board.)
6. **Logo** — the header now loads `logo-device.webp`, **6.8 KB** (was a
   216 KB PNG). The car-and-pin mark only, with the Bangla name as live text.
7. **Server headers** — the `<IfModule mod_headers.c>` wrapper never matched on
   LiteSpeed, so the whole block was skipped. The `Header` directives now run
   unwrapped. Needs `curl -I` confirmation after deploy.
8. **First-screen animation** — `.rise` / `.rise-move` removed from the CSS and
   from every first-screen use (hero, page headers, article/archive heads).
9. **Tap targets & labels** — footer phone/email and nav links are ≥44 px; the
   ambulance call buttons' spoken labels now begin with the visible number.

## Decisions

- **Environment note (not a design call).** The shell environment exports
  `NODE_ENV=production`, which made `npm ci` skip devDependencies and the
  `sharp` optional binary. Installed with `NODE_ENV=development` and the dev
  server also runs with `NODE_ENV=development`. No repo change needed.
- **Baseline measured from this machine, not from outside Bangladesh.** The
  audit's numbers were slower (home LCP 4.5 s) because its first byte came from
  outside BDIX. Both are recorded under Measurements so before/after stays
  apples-to-apples with the same harness.
- **Booking keeps a best-effort API post** rather than dropping it entirely, so
  that deploying `api/` later starts recording bookings with no further code
  change. Its failure is silent and never shown to the customer.
- **Logo exported as WebP, not PNG.** The mark is flat art; WebP supports it
  everywhere and the 136 × 56 output is 6.8 KB against the 10 KB budget. The
  oversized PNG is no longer written at all.
- **`?destination=` prefill uses a ref, not state**, to avoid a
  React `set-state-in-effect` lint error and keep the value out of a render
  cascade.
- **The width axis is on Anek Latin only, not Anek Bangla.** next/font/google
  can only request an axis as a *range*; the Bengali width-axis file is
  **437 KB** and the weight-only Bengali variable is **152 KB**, either of which
  breaks the 150 KB preload budget on its own. Greeking Bangla display by
  weight instead keeps it at 111 KB. The Latin width axis is cheap (~100 KB,
  loaded lazily). The whole family still carries the design; only the Bangla
  width axis is dropped, and the reason is measured, not estimated.
- **Amber, mint and pink are retired.** The primary CTA is Padma green; the
  logo's pin red is used only for pins, live status and emergency; section
  grounds are Mist. `--accent` now resolves to the primary so any un-migrated
  `bg-accent` reads green, and `--accent-soft`/`--emergency-soft` are neutral/
  faint washes pending the per-page cleanup.
- **Shared radii drop from 16px (`rounded-2xl`) to 8px.** The big soft radius
  plus a border and shadow on every block was one of the strongest generated
  tells; only elements that must stand apart get a shadow now.
- **The sticky bar is two actions, not three** (call icon + filled "বুক করুন"),
  per 5.6; WhatsApp keeps its buttons in the page body.
- **The booking flow lives on the contact page, not inline on the home page.**
  Tiles and route rows link to it with `?trip=` / `?destination=`. An inline
  nine-field form would have pushed the home back over the length target; the
  home instead leads with the tiles and the route board, which is the point of
  the redesign.
- **Green text uses the Leaf token, not the Padma surface token.** `--brand` is
  a dark surface in dark mode, so `text-brand` would be unreadable there; all
  green text and icons now use `--leaf`, which lifts in dark mode. Brand
  *surfaces* still use `--brand` with `--brand-fg`.
- **The ambulance row sits on a white ground inside the green hero.** Pin red
  is 4.96:1 on white but fails on Padma green, so the row gets its own ground
  to keep the emergency text legible.
- **Only on-record numbers are shown.** Puthia's 32 km / 50 min (the site's own
  guide) is the only route fact displayed; every other distance shows
  *"যাচাই করুন"* and route prices are absent entirely.
- **The icon-in-a-square card is gone from every page.** Trust strip, services,
  bento grid, contact rows and ambulance features are now plain lists, tables,
  or large numerals. Card chrome is only used where an element must genuinely
  stand apart; tiles sit at 8px radius.
- **No stock photography and no empty photo boxes.** Only the three real fleet
  photos and the logo are used. Rather than ship grey "photo coming" panels on
  a premium page, the owner's shot list stays a logged task (below); the design
  does not depend on images it does not have.
- **Contact is a plain method list** (phone, email, office, hours) with the
  WhatsApp button beneath, not four icon cards. The ambulance page keeps the
  phone number as the first and largest element, and its features and
  call-checklist are plain lists.

## Needs the owner

- **Deploy the booking API** (`api/`) so `/api/health` returns 200
  (`docs/DEPLOY.md` §5b). Needs cPanel access. Until then the form leads with
  WhatsApp.
- **Confirm the server headers** with `curl -I` after this branch is deployed
  (Phase 1, defect 7 — the `.htaccess` fix cannot be verified locally).
- **Native review of new/changed Bangla copy.** Phase 1 added
  *"হোয়াটসঅ্যাপে বুকিং পাঠান"*, *"হোয়াটসঅ্যাপ খুলবে, তথ্য আগেই বসানো থাকবে।
  অ্যাপ না থাকলে সরাসরি কল করুন।"*, *"নাম লিখুন"*, *"সঠিক মোবাইল নম্বর দিন"*,
  and the ambulance tile's *"এখনই কল করুন"*. Phases 3–4 added the home
  headline *"এক কলে গাড়ি দরজায়।"* and support line, the four trip tiles, the
  route-board copy (*"রাজশাহী থেকে"*, *"যাচাই করুন"*, *"ড্রাইভারসহ, ভাড়া আগেই
  জানা"*), the three booking steps, and the booking fields (*"ভাড়ার ধরন"*,
  *"কোথাও থেকে নেব"*). All need a native read.
- **Photo shoot** (8 shots in the audit) — only three real fleet photos and the
  logo exist; no stock photography was added and no empty placeholders were
  shipped.

## Measurements

### Baseline (Phase 0)

Lighthouse 12, mobile, simulated slow 4G, against the live
`dev.rajshahirentacar.bd` (this machine, 2026-10-05):

| Page | Perf | A11y | BP | LCP | FCP | CLS | Transfer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home | 97 | 96 | 100 | 2.4 s | 1.1 s | 0 | 695 KB |
| Contact | 86 | 96 | 100 | 4.1 s | 1.3 s | 0 | 616 KB |

Audit reference (measured from outside BD, same build): Home 84 / LCP 4.5 s /
695 KB; Contact 87 / LCP 4.1 s / 615 KB.

**Home length:** **5,467 px = 7.01 screens** at 360 × 780 px (target: ≤ 3,500 px
/ ~4 screens).

**Horizontal overflow:** none at any width measured so far.

### Phase 1

- **Header logo:** **6.8 KB** (was 216 KB) — target ≤ 10 KB met.
- **Booking behaviour (headless Chrome, 390 px):** empty submit → errors
  *"নাম লিখুন"*, *"সঠিক মোবাইল নম্বর দিন"*, no navigation, no request; invalid
  phone `12345` → *"সঠিক মোবাইল নম্বর দিন"*; destination prefill from
  `?destination=ঢাকা` verified.
- Full Lighthouse re-measurement is deferred to Phase 5, after the layout work.

### Phase 2

- **Preloaded fonts: 111 KB** (Anek Bangla 400 = 55 KB, Anek Bangla 700 =
  56 KB). Was 242 KB across three files. Target ≤ 150 KB met.
- **Anek Latin width axis:** ~101 KB, loaded on demand (not preloaded).
- **Bengali width-axis variable:** 437 KB — rejected (measured, see Decisions).
- **Contrast (computed, not eyeballed):** Leaf `#1D7A4E` on white 5.32:1, on
  Mist 4.85:1; Pin red `#D7263D` on white 4.96:1, on Mist 4.52:1; white on
  Padma 12.22:1; Ink on white 18.22:1. All ≥ 4.5:1.

### Phase 3

- **Home length: 3,185 px = 4.08 screens** at 360 × 780 (was 5,467 px /
  7.01). Target ≤ 3,500 px met. At 390 px it is 3.98 screens; at 1440 px,
  3.41.
- **Horizontal overflow:** none at 360, 390 or 1440 px on the home, Bangla or
  English.
- **Dark mode:** `data-theme="dark"` resolves `--bg` to `#0a0f0c`; system
  preference and both overrides all switch (three-state intact).
- **Booking:** empty submit and a bad phone both block in the browser; a tile
  link prefills trip type and a route link prefills destination (verified:
  `?trip=outside&destination=ঢাকা` → `outside` / `ঢাকা`).

### Phase 4

- **Horizontal overflow: none** across 15 page types (home bn/en, fleet,
  pricing, tours, wedding, airport/station, about, contact, FAQ, blog, an
  article, a category archive, a tag archive, ambulance) at 320, 360, 375, 390,
  412, 768, 1024 and 1440 px.
- **Before/after home length at 360:** 6,314 px → 3,185 px.

### Phase 5 — acceptance

Lighthouse 12, mobile, simulated slow 4G, against the production export served
**with Brotli** (the local `serve` does not compress, which inflates both LCP
and transfer; the live host is compressed, so the compressed numbers are the
honest ones):

| Page | Perf | A11y | BP | LCP | CLS | Transfer |
| --- | --- | --- | --- | --- | --- | --- |
| Home | 99 | 100 | 100 | 2.1 s | 0 | 388 KB |
| Contact | 100 | 100 | 100 | 1.9 s | 0 | 305 KB |

Against baseline (deployed dev site): Home 97 → 99 perf, LCP 2.4 → 2.1 s,
695 → 388 KB; Contact 86 → 100 perf, LCP 4.1 → 1.9 s, 616 → 305 KB.

- **axe (WCAG 2.1 A/AA): 0 violations** on home (bn + en), fleet, contact,
  ambulance and one article.
- **Overflow:** none at 320–1440 px on every page type.
- **Home length:** 3,204 px at 360 × 780 (target ≤ 3,500).
- **Logo 6.8 KB; preloaded fonts 111 KB; home transfer 388 KB** — all inside
  target.
- **Tap targets:** header controls and standalone links are now ≥ 44 px; links
  inside prose remain inline text (WCAG 2.5.5 exempts inline links). Lighthouse
  `target-size` reports no failures.
- **Dark and light mode** both checked; the three-state override is intact.
- **Headers:** `.htaccess` fixed; `curl -I` confirmation is logged for the
  owner (cannot be done before deploy).
