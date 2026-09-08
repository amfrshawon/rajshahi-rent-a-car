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

New, additive routes: `/fleet/`, `/pricing/`, `/tour-packages/`,
`/wedding-car/`, `/about/`, `/contact/`, `/faq/`.

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
