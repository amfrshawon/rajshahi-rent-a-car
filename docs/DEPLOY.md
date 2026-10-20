# Deployment

The site is a static export built in GitHub Actions and uploaded over FTPS to
ExonHost shared hosting (LiteSpeed, Dhaka/BDIX). Nothing is built on the
server — the plan has 700 MB of RAM, and `next build` needs far more.

## Branch model

| Branch | Deploys to | How |
| --- | --- | --- |
| `dev` | **dev.rajshahirentacar.bd** (environment `dev`) | Automatically on every push |
| `main` | **rajshahirentacar.bd** (environment `production`) | Manual: Actions → *Build and deploy* → Run workflow → `production` |

Working flow: push to `dev`, check the dev site, then open a PR
`dev` → `main` (or merge directly) when a change is ready for the live
domain. Production can be made automatic after cutover by adding
`refs/heads/main` to the deploy job's push condition. A GitHub Pages preview
of `dev` also builds on every push (noindex).

---

## 0. Rotate credentials first

If a cPanel or WordPress password has ever been pasted into a chat, email,
screenshot or ticket, change it before doing anything below.

- cPanel — ExonHost client area → the service → **Quick Actions → Change Password**
- WordPress — wp-admin → **Users → Profile → Set New Password**

## 1. Create a dedicated FTP account (do not use the main cPanel login)

cPanel → **Files → FTP Accounts**. Create an account whose directory is the
staging document root *only*.

This matters: the GitHub secret is then scoped to one folder. Even if it
leaked, it could not reach WordPress, the databases or email. The main cPanel
account can reach everything, so it must never go into CI.

Note the exact **Login** value cPanel shows — it is usually
`something@rajshahirentacar.bd`, not the short username.

## 2. Create the dev subdomain

cPanel → **Domains → Domains → Create A New Domain**: `dev.rajshahirentacar.bd`.

Copy the **document root** cPanel displays (typically
`/home/rajshah5/dev.rajshahirentacar.bd` or `/public_html/dev`). That value
becomes the `dev` environment's `FTP_REMOTE_DIR`, relative to the FTP
account's own home.

## 3. Configure GitHub

Repository → **Settings**.

**Secrets and variables → Actions → Secrets** (repository level) — add:

| Secret | Value |
| --- | --- |
| `FTP_HOST` | `bd25.exonhost.com` |
| `FTP_USERNAME` | the dedicated FTP login from step 1 |
| `FTP_PASSWORD` | that account's password |

**Environment secrets** — the two environments (`dev`, `production`) already
exist. Open each under **Environments** and add an environment-scoped secret
`FTP_REMOTE_DIR`:

| Environment | `FTP_REMOTE_DIR` |
| --- | --- |
| `dev` | the dev subdomain's document root, with a trailing slash |
| `production` | `public_html/` (after cutover; before then leave it unset so a mistaken run cannot touch the live domain) |

On `production`, also add yourself as a **required reviewer** — a deploy to
the live domain should always need an explicit approval.

**Variables** — add the master switch, set last:

| Variable | Value |
| --- | --- |
| `FTP_CONFIGURED` | `true` — the deploy job is skipped until this exists, so pushes do not fail while the secrets are still missing. |

## 4. Deploy

- **Dev** — push to `dev`. Live at `https://dev.rajshahirentacar.bd` within
  a couple of minutes, plus the GitHub Pages preview.
- **Production** — merge `dev` → `main`, then Actions → *Build and deploy* →
  **Run workflow** → target `production`. Only do this after cutover (§6).

The build fails, and nothing uploads, if any of the 27 legacy URLs is missing
from the export. That check is `scripts/verify-legacy-routes.mts`.

## 5. Content editing

There is no CMS. Posts are Markdown files in `src/content/posts/<slug>/`
(`index.md` English, `bn.md` Bangla frontmatter and body), with category and
tag names in `src/content/taxonomy.ts`. Edit, commit, push — the staging
deploy rebuilds automatically. New posts appear at `/<slug>/` and `/en/<slug>/`
and must not collide with the legacy URL inventory in
`src/config/legacy-routes.ts`.

## 5b. Booking API

The site is static, so the booking endpoint is a separate small Node app in
`api/`. It runs under cPanel's **Setup Node.js App** on the same account.

MySQL rather than SQLite: `better-sqlite3` is a native module and compiling it
inside a 700 MB LVE is fragile, whereas cPanel already provisions MySQL and
ExonHost backs it up.

1. **Database** — cPanel → *MySQL Database Wizard*. Create a database and a
   user, and grant that user all privileges on it. Then open *phpMyAdmin*,
   select the database, and run `api/schema.sql`.
2. **Upload** — put the contents of `api/` in a folder outside `public_html`,
   e.g. `/home/rajshah5/booking-api`.
3. **Create the app** — cPanel → *Setup Node.js App* → Create:
   - Application root: `booking-api`
   - Application URL: `rajshahirentacar.bd/api`
   - Startup file: `src/server.js`
   Then click **Run NPM Install**.
4. **Environment variables** — add every key from `api/.env.example` in that
   same screen. `ADMIN_TOKEN` should be a long random string; it guards
   `GET /api/bookings`. Never commit real values.
5. **Restart** the app, then check `https://rajshahirentacar.bd/api/health`,
   which should return `{"ok":true}`.

Reading bookings:

```
curl -H "Authorization: Bearer $ADMIN_TOKEN" https://rajshahirentacar.bd/api/bookings
```

Notes:

- A failed email never fails the request. Once the row is committed the
  booking is safe, and reporting failure would make a customer submit again.
- The browser form falls back to WhatsApp if the API is unreachable, so a
  booking is never lost to a server problem.
- Rate limited to 5 submissions per IP per 10 minutes, plus a honeypot field.
- The `ip` column exists for abuse investigation but is **not** currently
  populated. Decide a retention period before you start storing it.

## 6. Cutover

WordPress was retired from the build in October 2026 — content now lives in
the repo — so cutover is a straight replacement:

1. Point the apex document root at the static build (or set
   `FTP_REMOTE_DIR` for the `production` environment to `public_html/`).
2. Run the production deploy.
3. Verify all 27 legacy URLs return 200 on the live domain.
4. Submit the new sitemap in Search Console and watch coverage for two weeks.
5. The old WordPress install (still on the account until now) can be
   archived or deleted once the static site is confirmed live.

## Notes

- `public/.htaccess` ships with the export: it sets the 404 document,
  immutable caching for hashed assets, revalidation for HTML, compression,
  security headers and an HTTPS redirect.
- The deploy excludes `wp-admin`, `wp-content` and `wp-includes` so a
  misconfigured remote directory cannot delete a WordPress install.
- There is no ISR. A content edit goes live on the next push to `main`.
