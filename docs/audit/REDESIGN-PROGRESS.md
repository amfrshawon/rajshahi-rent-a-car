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
- **Next:** Phase 1 — fix the nine defects.

## Decisions

- **Environment note (not a design call).** The shell environment exports
  `NODE_ENV=production`, which made `npm ci` skip devDependencies and the
  `sharp` optional binary. Installed with `NODE_ENV=development` and the dev
  server also runs with `NODE_ENV=development`. No repo change needed.
- **Baseline measured from this machine, not from outside Bangladesh.** The
  audit's numbers were slower (home LCP 4.5 s) because its first byte came from
  outside BDIX. Both are recorded under Measurements so before/after stays
  apples-to-apples with the same harness.

## Needs the owner

- **Deploy the booking API** (`api/`) so `/api/health` returns 200
  (`docs/DEPLOY.md` §5b). Needs cPanel access. Until then the form leads with
  WhatsApp.
- **Confirm the server headers** with `curl -I` after this branch is deployed
  (Phase 1, defect 7 — the `.htaccess` fix cannot be verified locally).
- **Native review of new/changed Bangla copy** — accumulated below as the
  phases add strings.
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
