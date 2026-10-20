# Architecture

## Overview

```
 Owner's Android phone                     Partner drivers' phones
 ┌──────────────────┐                      ┌───────────────────────┐
 │ Call logger app  │                      │ Driver app             │
 │ (M2: MacroDroid, │                      │ (M3: web, M5: Android  │
 │  M6: own app)    │                      │  wrapper, loud alerts) │
 └────────┬─────────┘                      └──────────┬────────────┘
          │ HTTPS: call events                        │ login, accept,
          ▼                                           │ status, location
 ┌──────────────────────────────────────────────────────────────────┐
 │ Supabase                                                         │
 │  Postgres  — tables, row-level security, accept_trip() function   │
 │  Auth      — owner + driver accounts                              │
 │  Realtime  — live updates to the dashboard and the driver app     │
 │  Edge Functions — ingest-call, dispatch-push, dispatch-timeout    │
 │  pg_cron   — runs the 2-minute "nobody accepted" check            │
 └───────────────┬───────────────────────────────┬──────────────────┘
                 │ Realtime                      │ Firebase Cloud Messaging
                 ▼                               ▼ (high-priority push)
 ┌──────────────────────────┐          ┌───────────────────────┐
 │ Owner dashboard (web)    │          │ Driver phones ring     │
 │ calls · trips · drivers  │          └───────────────────────┘
 │ fares · money · reports  │
 └──────────────────────────┘
```

## Parts

| Part | Built with | Job | Depends on |
|---|---|---|---|
| **Database and API** | Supabase (Postgres, Auth, Realtime, Edge Functions, pg_cron) | Stores everything. Enforces who can see what. Decides who wins a trip. | — |
| **Owner dashboard** | Next.js 16 + TypeScript + Tailwind 4 (same stack as the website), `@supabase/supabase-js` | Call inbox, trip creation, live dispatch board, drivers, fares, commission, reports | Supabase |
| **Driver screens** | The same Next.js app, under `/driver`, built mobile-first | Duty switch, incoming trip, accept, status buttons, own earnings and dues | Supabase |
| **Driver Android app** | Capacitor wrapping the driver screens, plus the Firebase Cloud Messaging plugin | Rings loudly on a new trip, even when the phone is locked or on silent | Driver screens, FCM |
| **Call logger** | M2: MacroDroid rule. M6: small Kotlin app. | Sends every call on the business SIM to `ingest-call` | Edge Function |

## Key choices and why

1. **One web app for the owner and drivers.** One codebase, one login system,
   and the driver screens can be tested in a browser before the Android
   wrapper exists.
2. **The Capacitor wrapper exists for the alert sound.** A browser
   notification is quiet and easy to miss. A native notification channel with
   an alarm sound and a full-screen alert is what makes a driver respond
   within seconds. Everything else in the driver app stays web code.
3. **The database decides who wins a trip,** not the app. `accept_trip()` is a
   single atomic `UPDATE … WHERE status = 'dispatching'`, so only the first
   accept succeeds, however many arrive together. See
   [04-data-model.md](04-data-model.md).
4. **Security lives in row-level security.** Drivers can only read open trips
   that match their type, without the family's number. They see the number
   only for trips they won. The owner reads everything.
5. **No map service at first.** Preset destinations with stored distances,
   plus manually typed km, avoid Google Maps billing. A map can be added
   later without changing the data model, since locations are stored as
   latitude and longitude.
6. **Website and dashboard stay separate.** The public site in `src/` stays a
   static export. Later, its booking form can post leads to Supabase
   (Phase B), but nothing on the site breaks if the dashboard is down.

## Hosting

| Part | First version | Later |
|---|---|---|
| Supabase | Supabase Cloud free tier (Singapore region, closest to BD) | Paid tier, or self-hosted on a VPS when hosting is switched |
| Owner dashboard and driver screens | Vercel free tier, or any Node host. Suggested address: `dashboard.rajshahirentacar.bd`. | The same host as the new website hosting |
| Driver Android app | APK shared directly with drivers | Google Play internal testing, then a public listing |
| Call logger | Installed from a file on the owner's phone only | The same (Play Store does not allow call-log apps unless they are dialers) |

The free tier pauses a project after 7 days with no activity. Daily calls keep
it active, but move to the paid tier before relying on it in production.

## Failure handling

| What fails | What happens |
|---|---|
| The owner's phone is offline | The call logger queues events and sends them later. The dashboard shows each call's real time, not when it arrived. |
| A driver's push alert doesn't arrive | The trip also appears in the driver app's live list through Realtime. The 2-minute timeout alerts the owner. |
| Two drivers accept at once | One wins. The other sees "অন্য ড্রাইভার নিয়েছেন" (another driver took it). |
| A driver accepts, then goes silent | If they haven't marked "On the way" within 5 minutes (assumed), the owner is alerted and can re-dispatch. |
| Supabase is down | The owner falls back to calling drivers directly. Trips can be entered afterwards with their real times. |
