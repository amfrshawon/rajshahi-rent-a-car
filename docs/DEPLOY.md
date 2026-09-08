# Deployment

The site is a static export built in GitHub Actions and uploaded over FTPS to
ExonHost shared hosting (LiteSpeed, Dhaka/BDIX). Nothing is built on the
server — the plan has 700 MB of RAM, and `next build` needs far more.

Staging deploys automatically on every push to `main`. **Production is manual
only**, because the apex still serves the live WordPress site until cutover.

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

## 2. Create the staging subdomain

cPanel → **Domains → Domains → Create A New Domain**, e.g.
`new.rajshahirentacar.bd`.

Copy the **document root** cPanel displays. It is typically
`/home/rajshah5/new.rajshahirentacar.bd` or `/public_html/new`. Use whatever
it actually shows — that value becomes `FTP_REMOTE_DIR`, relative to the FTP
account's own home.

## 3. Configure GitHub

Repository → **Settings**.

**Secrets and variables → Actions → Secrets** — add:

| Secret | Value |
| --- | --- |
| `FTP_HOST` | `bd25.exonhost.com` |
| `FTP_USERNAME` | the dedicated FTP login from step 1 |
| `FTP_PASSWORD` | that account's password |
| `FTP_REMOTE_DIR` | document root from step 2, with a trailing slash |

You paste these into GitHub directly. They are write-only once saved and are
masked in logs.

**Secrets and variables → Actions → Variables** — add:

| Variable | Value |
| --- | --- |
| `WP_API_URL` | `https://rajshahirentacar.bd/wp-json/wp/v2` (change to `cms.` after the CMS move) |

**Environments** — create `staging` and `production`. On `production`, add
yourself as a **required reviewer** so a deploy to the live domain always
needs an explicit approval.

## 4. Deploy

- **Staging** — push to `main`, or run the workflow with target `staging`.
- **Production** — Actions → *Build and deploy* → **Run workflow** →
  target `production`. Only do this after cutover (§6).

The build fails, and nothing uploads, if any of the 27 legacy URLs is missing
from the export. That check is `scripts/verify-legacy-routes.mts`.

## 5. Install Polylang on WordPress

wp-admin → **Plugins → Add New** → search "Polylang" → Install → Activate.
Set Bangla as the default language and add English as the second.

Until this is done, Bangla titles and excerpts come from the repo overlay in
`src/content/bn-posts.ts`, and article bodies fall back to English.

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

1. Move WordPress to `cms.rajshahirentacar.bd`, set it to **noindex**, and
   restrict access to admins.
2. Update the `WP_API_URL` variable to the new host.
3. Point the apex document root at the static build (or set
   `FTP_REMOTE_DIR` for the `production` environment to `public_html/`).
4. Run the production deploy.
5. Verify all 27 legacy URLs return 200 on the live domain.
6. Submit the new sitemap in Search Console and watch coverage for two weeks.

## Notes

- `public/.htaccess` ships with the export: it sets the 404 document,
  immutable caching for hashed assets, revalidation for HTML, compression,
  security headers and an HTTPS redirect.
- The deploy excludes `wp-admin`, `wp-content` and `wp-includes` so a
  misconfigured remote directory cannot delete a WordPress install.
- There is no ISR. A newly published post goes live on the next build; wire a
  WordPress publish webhook to `workflow_dispatch` to automate that.
