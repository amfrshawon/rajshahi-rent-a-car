# রাজশাহী রেন্ট এ কার · Rajshahi Rent A Car

Bilingual (বাংলা / English) car rental website for Rajshahi, Bangladesh.
Replaces the existing WordPress site at https://rajshahirentacar.bd/

## Stack

- **Next.js 16** (App Router) · React 19 · TypeScript
- **Tailwind CSS v4**
- **Static export** (`output: "export"`) — no Node process serves pages in production
- **Content as Markdown in the repo** (`src/content/posts/`) — no CMS, no API,
  builds are offline and reproducible
- **motion** (LazyMotion, ~5–10 KB) + CSS scroll-driven animations for the
  motion system; everything degrades to static content without JS
- Deployed to **ExonHost shared hosting** (LiteSpeed, Dhaka/BDIX)

## Why static

Production runs on a shared plan capped at **700 MB RAM / 20 entry processes**
with no root access. Pre-rendering every page to HTML sidesteps that entirely
and gives Rajshahi mobile users near-zero TTFB from inside BDIX.
`next build` runs in CI, never on the host.

See [docs/PLAN.md](docs/PLAN.md) for the full plan, constraints and phasing.

## Language routing

Bangla is the default and is served at the **original WordPress-era URLs**
(the site replaced a WordPress install; its indexed paths are frozen).
English is mirrored under `/en/`.

```
/puthia-temple-day-trip-rajshahi-car/       → বাংলা
/en/puthia-temple-day-trip-rajshahi-car/    → English
```

All **27 legacy URLs** must keep returning 200. The canonical list is
[`src/config/legacy-routes.ts`](src/config/legacy-routes.ts) — treat it as
append-only. Never rename or redirect an entry.

`trailingSlash: true` is required: legacy URLs end in `/`, and the export
needs to emit `route/index.html` for a static host to serve them.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → out/
npm run lint
```

## Project layout

```
src/
  app/            routes (Bangla at root, English under /en)
  config/         legacy-routes.ts and site constants
  content/posts/  blog articles as Markdown (index.md + bn.md per post)
  lib/posts.ts    the Markdown content loader
api/              booking endpoint (separate small Node app)
docs/
  PLAN.md         the agreed plan
```

## Editing content

Posts live in `src/content/posts/<slug>/`. `index.md` is the English article;
`bn.md` carries the Bangla title/excerpt (and body, once translated) in its
frontmatter. Category and tag names live in `src/content/taxonomy.ts`. Commit
the change, push, and CI rebuilds the site — there is no CMS to log into.
