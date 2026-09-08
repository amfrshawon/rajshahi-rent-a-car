# রাজশাহী রেন্ট এ কার — Redesign Plan

Status: approved 2026-09-07. Live site being replaced: https://rajshahirentacar.bd/

---

## 1. Why this is not a translation job

The existing site is written entirely in English for **foreign tourists** —
"English-Speaking Guides", "International Payment", "Hotel Pickup & Drop",
"Cultural Experiences". A Rajshahi local looking to hire a car does not care
about any of that.

So the Bangla site gets its own adapted copy and its own search intents, and
the English content survives untouched for the tourist market.

| Bangla-first intents (new) | Existing English angle |
| --- | --- |
| রাজশাহীতে গাড়ি ভাড়া / প্রাইভেট কার ভাড়া | Tourist day tours |
| বিয়ের গাড়ি ভাড়া ও সাজানো | — |
| ঢাকা–রাজশাহী লং ট্রিপ | Extended trips |
| এয়ারপোর্ট / রেলস্টেশন পিকআপ | Hotel pickup |
| ঘণ্টা ও দিনভিত্তিক ভাড়া, ড্রাইভারসহ | ৳/day only |
| অ্যাম্বুলেন্স সার্ভিস ২৪/৭ | Exists, buried |

## 2. Decisions taken

| Question | Decision |
| --- | --- |
| Language | **Bangla default at the existing URLs**, English mirrored under `/en/` |
| Content source | **Headless WordPress** — the existing install keeps publishing |
| Hosting | **Stay on ExonHost**, static-first on the current Starter plan |
| Bookings | Real form + database + email, with a WhatsApp handoff |

## 3. Hosting reality

Checked directly in the ExonHost client area and cPanel on 2026-09-07.

Account holds **one service**: Shared Hosting "Starter", `rajshahirentacar.bd`,
server `bd25.exonhost.com` (`103.159.36.2`), **Bangladesh / BDIX**,
৳3,599.76/yr, renewing 29-01-2027.

| Resource | Limit | In use |
| --- | --- | --- |
| Physical memory | **700 MB** | 0 |
| Entry processes | 20 | 0 |
| Processes | 100 | 0 |
| CPU | 1 core | 0 |
| Disk | 4.88 GB | 877 MB |
| Bandwidth | 244 GB/mo | 21 MB |
| I/O | 20 MB/s · 4096 IOPS | — |

Available: Node.js Selector (Passenger), Git Version Control, LiteSpeed Redis
Cache, MySQL + PostgreSQL, Cron, **unlimited subdomains**, 1 addon domain.
SSH is disabled. There is **no root and no nginx** — LiteSpeed is the web
server, and that is not changeable on shared hosting.

### Consequences

- `next build` can never run on this server (needs ~2 GB). Builds happen in CI.
- A persistent Next.js SSR process inside 700 MB is possible but fragile —
  exceeding the cap makes CloudLinux kill processes and visitors see 503s.
- **Therefore: static-first.** Every page is pre-rendered to HTML and served
  straight off disk by LiteSpeed inside BDIX. Near-zero TTFB for Rajshahi
  mobile users, and effectively no memory risk.

## 4. Architecture

```
GitHub  ──push──▶  GitHub Actions
                     │  npm ci
                     │  fetch content from WordPress REST
                     │  next build  →  out/  (static HTML/CSS/JS)
                     ▼
                   FTP deploy
                     │
                     ▼
      ExonHost LiteSpeed (Dhaka/BDIX) ── serves static files
                     │
                     ├── cms.rajshahirentacar.bd   WordPress (headless, noindex)
                     └── /api/booking              small Node app (Node.js Selector)
```

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript, `output: "export"` |
| Styling | Tailwind CSS v4 + CSS custom properties |
| i18n | Bangla at root, English under `/en/`; thin per-locale route trees over shared components (no middleware — unavailable in a static export) |
| Content | WordPress REST at build time + Polylang for bn/en pairing |
| Bookings | Node app under cPanel Node.js Selector → MySQL → email + WhatsApp deep link |
| Images | Pre-generated responsive AVIF/WebP via sharp |
| Fonts | Hind Siliguri (Bangla) + Inter (Latin), subset, preloaded, `font-display: swap` |

`trailingSlash: true` is mandatory — every legacy URL ends in `/`, and it makes
the export emit `route/index.html`, which is what static hosting needs.

## 5. URL policy

**All 27 existing URLs must keep returning 200.** Canonical list lives in
`src/config/legacy-routes.ts` and is asserted by a build-time test.

- 3 pages — `/`, `/blog/`, `/ambulance-service/`
- 13 posts — each at its exact existing slug
- 10 category archives — including the nested
  `/category/rajshahi-travel-guide/local-attractions-hidden-gems-historical-sites-in-rajshahi/`
- 1 tag — `/tag/rent-a-car-rajshahi/`

Bangla is served at the original path; English at `/en<path>`, paired with
hreflang and self-referencing canonicals.

New, additive routes carry **Bangla slugs in the Bangla tree** and English
slugs under `/en/`:

| Bangla | English |
| --- | --- |
| `/গাড়িবহর/` | `/en/fleet/` |
| `/ভাড়ার-তালিকা/` | `/en/pricing/` |
| `/ট্যুর-প্যাকেজ/` | `/en/tour-packages/` |
| `/বিয়ের-গাড়ি/` | `/en/wedding-car/` |
| `/আমাদের-সম্পর্কে/` | `/en/about/` |
| `/যোগাযোগ/` | `/en/contact/` |
| `/সাধারণ-জিজ্ঞাসা/` | `/en/faq/` |

The 27 legacy paths stay English in both locales, so the site's slugs are
mixed by necessity — `/blog/` and `/ambulance-service/` cannot move.

Next 16 cannot prerender a route whose directory name is non-ASCII; the export
throws `InvalidCharacterError`. So route directories stay ASCII on disk, the
built HTML links to the Bangla paths, and `scripts/localise-slugs.mts` renames
the exported directories afterwards. `route()` returns the ASCII path under
`next dev`, where no rename happens.

### Typography

The owner asked for Prothom Alo's face. That is **Shurjo**, a bespoke
typeface by Jacob Thomas, copyright held exclusively by Prothom Alo, with
"Shurjo" registered as Thomas's trademark. Sites offering it as a free
download are redistributing it without authorisation. It is not usable here.

**Anek Bangla** (Ek Type, SIL OFL) is the closest freely licensed match and is
what the site uses — contemporary squarish forms in the same editorial
register. It costs 199.6 KB of preloaded font per page against 125.3 KB for
Hind Siliguri; Noto Sans Bengali sits between at 152.7 KB if the bytes matter
more than the look.

The OG image is the exception: satori renders "শুরু" as "শবু" in Anek Bangla,
so that image stays on Hind Siliguri, whose output has been checked glyph by
glyph.

## 6. Design direction

- Mobile-first and thumb-first. Sticky bottom bar on mobile:
  **কল করুন · হোয়াটসঅ্যাপ · বুক করুন**. This is how bookings actually happen in BD.
- Hero: real fleet photo, one Bangla headline, a "from ৳" chip, and an inline
  three-field booking widget (গাড়ি / তারিখ / ফোন) — not a nine-field form.
- Fleet cards use CSS scroll-snap, not a JavaScript carousel.
- Trust block: ২৪/৭, ড্রাইভারসহ, ফিক্সড রেট, ইনস্যুরেন্স, plus existing Google reviews.
- Bangla typography treated properly: Hind Siliguri, line-height ~1.75 (Bangla
  needs more than Latin), correct conjunct rendering, no font synthesis.
- Dark mode; full `prefers-reduced-motion` support.
- WCAG AA contrast, 44px tap targets, visible focus, semantic landmarks,
  correct `lang` per locale.

## 7. Performance budget

Targets (Lighthouse mobile, throttled 4G):

- LCP < 2.0s · INP < 200ms · CLS < 0.05
- Server Components by default; client JS only for the booking form
- `content-visibility: auto` below the fold
- Long-lived immutable caching on hashed assets; BDIX peering handles latency

### Measured, 2026-09-08

| | Per page | Note |
| --- | --- | --- |
| HTML | 5.7–8.5 KB gz | all content is in the HTML |
| JS | 173 KB gz | Next 16 + React 19 floor |
| Fonts preloaded | 125 KB | Hind Siliguri 400/600 + Inter |

**The original "< 100 KB first-load JS" target is not reachable on this stack
and has been dropped.** 173 KB is the App Router baseline — react-dom is 70 KB
and the Next runtime 82 KB, with application code negligible. The scripts are
deferred, so they do not block LCP, but they do cost data and hydration time
on low-end phones. Leaving Next entirely (Astro, or plain HTML) is the only
way materially below this; not worth it for the gain here.

Fonts were the fixable half and went from 231 KB to 125 KB preloaded:

- dropped Hind Siliguri's Latin subset — Latin runs fall through to Inter
- dropped the 500 weight (unused) and 700 (headings render at 600 by design;
  Hind Siliguri's bold is too heavy for Bangla at heading sizes anyway)

Bengali subsets are ~40 KB each, so every extra weight is a real cost on a
Bangladeshi mobile connection. Add one only with a reason.

### Accessibility, 2026-09-08

axe-core (WCAG 2.0/2.1 A and AA) across 18 pages in both locales:
**0 violations**. Re-run by serving `out/`, copying
`node_modules/axe-core/axe.min.js` beside it, and running `axe.run()` in each
page.

Three real defects were found and fixed in that pass:

1. `#25d366` — WhatsApp green — as text on white is **1.98:1**, well under the
   4.5:1 minimum. It is fine as a button fill with black text on it, so there
   are now two tokens: `--whatsapp` for fills and `--whatsapp-ink` (5.28:1)
   for text and icons on light surfaces.
2. The fleet scroll-snap rail had no keyboard route in, so its off-screen
   cards were unreachable without a pointer.
3. `/ambulance-service/` shipped a 6.8 KB `<style>` block from WordPress
   containing a `*` reset and `body { font-family: 'Segoe UI' }`, which wiped
   spacing site-wide on that page and replaced the Bangla face with one that
   has no Bengali glyphs. Its heading also carried
   `color: #ffffff !important`, legible only against a hero background defined
   in that same stylesheet — so once the block was removed it was white on
   white. `src/lib/sanitize.ts` now strips document-scope markup and colour
   declarations from all WordPress content.

**Still to do on real hardware.** LCP and FCP could not be measured here: the
preview pane renders the page hidden, and browsers do not report paint timing
for a page that was never visible. Run Lighthouse or PageSpeed Insights
against the staging URL over a real mobile connection — that is the only
measurement that counts anyway, since BDIX latency is the whole point of
hosting locally.

**Content still needing attention:** the ambulance page is a hand-built HTML
landing page pasted into WordPress. It cannot carry its own design inside this
one, so it now renders as plain themed content. It should be rewritten as
ordinary page content.

## 8. Fleet and contact facts (from the live site — to be re-confirmed)

| Vehicle | Type | Seats | Fuel | Transmission | Rate |
| --- | --- | --- | --- | --- | --- |
| Toyota Premio | Sedan | 4 | LPG/Petrol | Automatic | ৳4,500/day |
| Toyota Axio | Sedan | 4 | LPG/Petrol | Automatic | ৳4,000/day |
| Toyota Hiace | Microbus | 15 | LPG/Petrol | Manual | ৳8,000/day |

Phone/WhatsApp +880 1714 424 241 (24/7) · info@rajshahirentacar.bd ·
Kadirgonj Greater Road, Rajshahi.

## 9. Phases

| # | Phase | Output |
| --- | --- | --- |
| 0 | Repo + scaffold | git repo, Next.js 16 + TS + Tailwind, static-export config, legacy URL inventory |
| 1 | Design system | Tokens, Bangla type scale, components, dark mode |
| 2 | Content layer | WP REST client, Polylang, build-time fetch, migrate + adapt 13 posts |
| 3 | Pages | Home, fleet, pricing, ambulance, blog, categories, tag, contact |
| 4 | Bookings | Form, Node API, MySQL, email, WhatsApp, admin view |
| 5 | SEO | Sitemap matching current structure, robots, hreflang, JSON-LD, OG images |
| 6 | Perf + a11y | Lighthouse mobile, real-device check |
| 7 | Deploy | CI build, FTP deploy, staging subdomain, cutover |

## 10. Cutover

1. WordPress moves to `cms.rajshahirentacar.bd`, noindexed, admin-only.
2. New site deploys to a staging subdomain first.
3. Verify all 27 legacy URLs return 200.
4. Swap document root to the static build.
5. Submit the new sitemap in Search Console and watch coverage.

## 11. Known risks

1. **Language swap at existing URLs.** English articles that rank today move to
   `/en/…`, which are new URLs needing re-indexing. Mitigated with hreflang
   pairs, canonicals, internal linking and a sitemap push. Rankings will wobble
   for a few weeks; the posts are recent (Feb–Apr 2026) and few, so exposure is
   limited.
2. **Only 4 real images exist** (3 car photos + logo). A site like this needs
   25–40. Most likely thing to delay launch.
3. **Bangla copy needs native review** before going live.
4. **No ISR.** A new WordPress post appears after a CI rebuild (~2 min),
   triggered by a publish webhook.
5. **700 MB cap** still applies to the booking API — it must stay small.

## 12. Outstanding items needed from the owner

Blocking nothing right now; needed before launch:

- WordPress admin access (install Polylang, move WP to the `cms.` subdomain)
- Real photography — fleet, interiors, drivers, Rajshahi destinations
- SMTP credentials for booking email
- Confirmed business facts: current prices, driver included?, fuel policy,
  hours, ambulance details, service area
- GA4 / Search Console access
- Confirmation that `booking@rajshahirentacar.bd` exists (only one mailbox is
  provisioned on the account today)

**Fix on day one:** the live homepage has a second booking form posting to
`formsubmit.co/fazlayrabbyshawon@gmail.com`, so customer bookings currently
land in a personal Gmail. That goes away.
