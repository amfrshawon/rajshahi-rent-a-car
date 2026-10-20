# Call logging

Every call to the business number, `+8801714424241`, should appear on the
dashboard within 5 seconds, missed calls included. The number is on the owner's
Android phone.

## How a call gets to the dashboard

```
Family calls  →  owner's Android phone
                    │  the logger sees the call ring, then end
                    ▼
               POST https://<project>.supabase.co/functions/v1/ingest-call
               header: x-device-key: <secret>
               body:   { number, direction, started_at, duration_sec, sim_slot, event }
                    │
                    ▼
               Edge Function checks the key, normalises the number,
               upserts into `calls` (unique on number + started_at)
                    │  Realtime
                    ▼
               Dashboard call inbox updates live
```

`event` is `ringing` or `ended`.

- **`ringing`** only drives the "who is calling" pop-up: the caller's past
  trips, shown before the owner answers. It is stored only if no `ended`
  follows.
- **`ended`** creates the real call row.

## Stage 1 (Milestone 2): MacroDroid, no custom code

MacroDroid is a free Android automation app from the Play Store. It proves
the whole system works in week one.

**Macro "Call ended → dashboard"**

- **Trigger:** Call Ended (incoming, any contact). Add a second macro with the
  trigger *Call Missed*.
- **Constraint:** SIM = the business SIM, if the phone has two.
- **Action:** HTTP Request
  - Method: `POST`
  - URL: the `ingest-call` function address
  - Header: `x-device-key: <secret from the dashboard settings>`
  - Body (JSON): MacroDroid's magic text for the caller number, the call
    duration and the system time. Set `direction` to `incoming` or `missed`
    per macro.

**Limits:** no ringing pop-up, no offline queue (a call made with no data
connection is lost), and some phones stop MacroDroid in the background.

## Stage 2 (Milestone 6): our own call-logger app

A small Kotlin app, about 300 lines, installed only on the owner's phone from
an APK file.

- **Permissions:** `READ_PHONE_STATE`, `READ_CALL_LOG`, `INTERNET`,
  `POST_NOTIFICATIONS`, `FOREGROUND_SERVICE`,
  `RECEIVE_BOOT_COMPLETED`.
- **Foreground service** with a small permanent notification ("কল লগ চালু
  আছে" — call logging is on), so Android doesn't kill it.
- **Ringing:** a phone-state listener sends the `ringing` event.
- **Ended:** a `CallLog` content observer reads the newest entry (number, type,
  date, duration, SIM) and sends `ended`.
- **Offline queue:** events are kept in a local Room/SQLite table and sent
  with exponential backoff. Once a send succeeds, the event is deleted from
  the queue.
- **Business SIM filter:** chosen once on the settings screen, matched by
  subscription ID.
- **Settings screen:** the function address, the device key, the SIM choice,
  and a "send test call" button.
- **Not published to the Play Store.** Google allows `READ_CALL_LOG` only for
  default dialer apps.

## One-time phone setup

These apply to both stages.

- Battery → app → **Unrestricted** (no battery optimisation).
- Xiaomi/Redmi/POCO: Security → Autostart → on. Recent apps → lock the app.
- Oppo/Realme/Vivo: Battery → allow background activity; Startup manager → on.
- Samsung: Battery → never-sleeping apps → add the app.

## Not covered

- **WhatsApp calls and messages.** Android doesn't expose them. The owner
  uses the dashboard's "manual call" button instead.
- **Call recording.** Android blocks it for normal apps.
- **Several people answering calls.** That needs a virtual business number
  from a Bangladeshi cloud phone (IP-PBX) provider, which logs calls on its
  side. `calls.source` already allows adding a new source.

## Security

- The device key is a long random secret that the owner generates in the
  dashboard and can rotate there. The Edge Function rejects any request
  without it.
- `ingest-call` accepts only the fields above and rate-limits to 60 requests
  per minute.
- Call data is the families' personal data. Only the owner role can read the
  `calls` table.
