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
- [ ] Phase 1 — fixes
- [ ] Phase 2 — design system
- [ ] Phase 3 — home and booking
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

## Decisions

- **Fonts are cut locally instead of loaded from Google.** Measured: the
  Bangla font with the width axis is 437 KB, and asking Google for two
  weights returns the full 152 KB variable file. Single fixed cuts are about
  55 KB. `scripts/build-fonts.py` cuts text 400, strong 600 and display
  800 (width 125) from the OFL source into `src/fonts/`. Bangla pages preload
  text and display (120 KB together). The bold cut and the Latin letters only
  download when a page uses them. Renamed internally to "RRC Sans", as the
  OFL asks of modified versions.

## Needs the owner

_Nothing yet._
