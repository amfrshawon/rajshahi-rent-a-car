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
- **Next:** Phase 2 — design system.

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

## Needs the owner

- **Deploy the booking API** (`api/`) so `/api/health` returns 200
  (`docs/DEPLOY.md` §5b). Needs cPanel access. Until then the form leads with
  WhatsApp.
- **Confirm the server headers** with `curl -I` after this branch is deployed
  (Phase 1, defect 7 — the `.htaccess` fix cannot be verified locally).
- **Native review of new/changed Bangla copy.** Phase 1 adds:
  *"হোয়াটসঅ্যাপে বুকিং পাঠান"*, *"হোয়াটসঅ্যাপ খুলবে, তথ্য আগেই বসানো থাকবে।
  অ্যাপ না থাকলে সরাসরি কল করুন।"*, *"নাম লিখুন"*, *"সঠিক মোবাইল নম্বর দিন"*,
  and the ambulance tile's *"এখনই কল করুন"*.
- **Photo shoot** (8 shots in the audit) — slots are labelled in the UI.

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
