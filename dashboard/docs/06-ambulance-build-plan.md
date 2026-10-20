# Ambulance dispatch — build plan

Seven milestones. Each one ends with something the owner can try. Do them in
order. A milestone is done when every check under "Done when" passes.

Before M1 starts, run a design review of screens and edge cases with the
owner, and update [04-data-model.md](04-data-model.md) with the result.

---

## M0 — Setup

**Tasks**

1. Create the Supabase project (Singapore region) and enable the `pg_cron`
   extension.
2. Scaffold `dashboard/app`: Next.js 16 (read `node_modules/next/dist/docs/`
   first, as the root `AGENTS.md` says), TypeScript, Tailwind 4, ESLint,
   `@supabase/supabase-js`, `@supabase/ssr`.
3. Install the Supabase CLI and create `dashboard/supabase/` with migrations
   checked into git.
4. Add `dashboard/.env.example` (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`). Never commit
   real keys.
5. Add a CI job that lints and type-checks `dashboard/app` and runs the
   database tests. Keep it separate from the website's deploy workflow.

**Done when:** `npm run dev` in `dashboard/app` shows a page that reads from
Supabase. `supabase db reset` rebuilds the database from the migrations.

---

## M1 — Data, login, settings

**Tasks**

1. Write migrations for every table, enum, view and trigger in
   [04-data-model.md](04-data-model.md), plus row-level security.
2. Owner login (email + password). The first owner account is created by
   hand in Supabase.
3. **Drivers screen:**
   - add a driver (name, phone, NID, license, document photos) and a vehicle
     (reg number, Non-AC or AC)
   - approve or suspend a driver
   - send an invite: drivers log in with phone + password set by the owner,
     with phone OTP once SMS is bought
4. **Fares screen:** edit the fare bands for each ambulance type (fare +
   commission), and edit the preset places with distances.
5. **Settings screen:** due limit, timeouts, the call-logger device key.
6. Seed data: RMCH as the default pickup, placeholder fare bands marked "set
   these".

**Done when:**

- The owner can log in, add 2 test drivers with vehicles, and set the fare
  bands.
- A driver account cannot read the drivers, calls or fares-admin data
  (checked with a test that queries as a driver).

---

## M2 — Call inbox (MacroDroid)

**Tasks**

1. Edge Function `ingest-call`: checks the key, validates the body (zod),
   normalises the number, upserts the call.
2. **Calls screen:** a live list from Realtime.
   - Missed calls are red and at the top until handled.
   - Each row shows the number (tap to call back), time, duration and "N past
     trips".
   - Actions: **Create trip**, **No trip** (with a reason), **Manual call**
     (for WhatsApp calls).
3. Set up MacroDroid on the owner's phone ([05-call-logging.md](05-call-logging.md)).

**Done when:**

- A call made to the business number appears on the dashboard within
  5 seconds.
- A missed call appears in red.
- Sending the same event twice creates one row.

---

## M3 — Trips and dispatch (web driver screens)

**Tasks**

1. **New trip form**, opened from a call or blank:
   - pickup (RMCH by default), destination (preset or typed), km, type, note
   - fare and commission filled in from the band
   - the owner can override the fare, and the override is logged
2. Functions `dispatch_trip`, `accept_trip`, `set_trip_status`, `cancel_trip`,
   `is_eligible`, plus the `trips` → `trip_events` trigger.
3. **Dispatch board** for the owner: live columns *Dispatching · Accepted ·
   On the way · Arrived · On board · Done today*, each card with a timer.
4. **Timeouts** with `pg_cron` every 15 seconds:
   - no accept within `accept_timeout_sec` → `unassigned`, and the owner is
     alerted (sound + banner on the dashboard)
   - no "On the way" within `start_timeout_sec` → the owner is alerted
5. **Driver screens** (`/driver`, mobile-first, Bangla):
   - duty switch
   - an incoming-trip card with a sound in the open tab (pickup, destination,
     km, fare, type; no family details) and **Accept**
   - the active trip: the family's phone (tap to call) and the buttons
     *রওনা দিয়েছি → পৌঁছেছি → রোগী উঠেছেন → শেষ*. "পৌঁছেছি" records the
     location.
   - cancel with a reason
6. **Assign manually** from the board, for when the owner has called a driver
   directly.

**Done when:**

- Creating and dispatching a trip shows it on both test drivers' screens
  within 5 seconds.
- A test fires 10 parallel `accept_trip` calls: exactly 1 succeeds and the
  other 9 get `already_taken`.
- Before accepting, a driver cannot see `family_phone` (checked with a test).
- A trip's full history appears in `trip_events`.

---

## M4 — Commission and money

**Tasks**

1. A trigger that adds the commission to `ledger` when a trip is completed,
   charged only once.
2. **Money screen:**
   - every driver's balance, sorted by highest unpaid first
   - **Record payment** (amount, bKash/cash, transaction ID)
   - **Adjustment** with a note
3. `is_eligible` excludes drivers over `due_limit`. The driver app shows "বকেয়া
   ৳X — পরিশোধ করলে আবার ট্রিপ পাবেন" (you owe ৳X; pay it to get trips again).
4. Driver earnings screen: trips, fares collected, commission owed, payments
   made.

**Done when:**

- Completing a trip adds exactly one commission entry.
- A driver over the limit gets no alerts until a payment brings their
  balance below it.
- Every taka in a balance can be traced to a trip, payment or adjustment.

---

## M5 — Driver Android app with loud alerts

**Tasks**

1. Set up Capacitor in `dashboard/driver-android`, loading the deployed
   `/driver` screens.
2. Add the Firebase project and `@capacitor/push-notifications`. Save the FCM
   token to `profiles.push_token` after login.
3. Create a notification channel `trip_alert` with importance HIGH, an alarm
   sound, a full-screen intent, and a bypass of Do Not Disturb with the
   driver's permission.
4. Edge Function `dispatch-push`, triggered by `dispatch_trip`: sends an FCM
   data message with high priority to every eligible driver.
5. Tapping the alert opens the trip card with Accept.
6. Build a signed APK and write install steps for drivers, including the
   battery and autostart settings.

**Done when:** on a locked phone in silent mode, a dispatched trip rings
within 5 seconds on the 3 most common phone brands among the drivers.

---

## M6 — Custom call-logger app

**Tasks:** build the Kotlin app described in [05-call-logging.md](05-call-logging.md)
(foreground service, ringing pop-up event, offline queue, SIM filter), then
replace MacroDroid with it.

**Done when:**

- Calls made while the phone has no data appear once it reconnects, with
  their real times.
- The ringing pop-up shows the caller's history before the owner answers.
- The app survives a reboot.

---

## M7 — Reports and pilot

**Tasks**

1. **Reports screen** for today, this week and this month:
   - calls, missed calls, the share of calls answered within 1 minute, and
     calls that became trips
   - trips by type and destination, and the average time to accept
   - commission earned and still owed
   - trips per driver, with a drop compared with the previous month
2. CSV export of trips and ledger.
3. A pilot with 3–5 drivers for 2 weeks. Log every problem in
   `dashboard/docs/pilot-log.md`.
4. Fix what the pilot finds, then open to all partners.

**Done when:** for 2 weeks, every ambulance call and trip went through the
system, and the owner trusts the commission figures enough to collect on them.

---

## When the SMS package is bought

This slots in at any point after M4. Add the Edge Function `send-sms` for the
chosen BD gateway, then send:

- the family: driver name, ambulance number and the owner's number when a
  driver accepts; the "call us next time" message when the trip is completed
- drivers: phone OTP login

## Testing approach

- **Database:** a pgTAP test or SQL script per function. Covers the
  concurrent-accept race, row-level security per role, the commission
  trigger, and the due limit.
- **Edge Functions:** Deno tests for `ingest-call`: bad key, duplicate event,
  bad number.
- **UI:** Playwright for the owner flow (call → trip → dispatch) and the
  driver flow (accept → complete) in a 390 px mobile viewport.
