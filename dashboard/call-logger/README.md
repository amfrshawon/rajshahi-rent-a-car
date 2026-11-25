# Call logger (Android) — M6

A small Kotlin app installed only on the owner's phone. It replaces
MacroDroid: a foreground service watches the business SIM's calls and POSTs
them to `ingest-call`, with an offline queue and a ringing pop-up that shows
the caller's past trips before the owner answers.

**Status: source scaffold.** Building needs a JDK + Android SDK; neither is
installed on the dev Mac (2026-11-25), so this has not been compiled yet.

## Setup

1. Open `call-logger/` in Android Studio (or use the Gradle wrapper).
2. In the app's settings screen enter the function URL
   (`https://jqxycbdvsednzhwhocub.supabase.co/functions/v1/ingest-call`) and
   the call-logger key from the dashboard's Settings screen.
3. Grant the permissions the app asks for (phone state, call log,
   notifications). The Play Store is not an option: Google allows
   `READ_CALL_LOG` only for default dialer apps.
4. `./gradlew assembleRelease` with your keystore, or build a debug APK from
   Android Studio.

## Behaviour

- **Ringing:** a phone-state listener sends `{"event":"ringing"}` so a future
  dashboard pop-up can show the caller's history before answering (the event
  is not stored as a call).
- **Ended:** a `CallLog` content observer reads the newest entry (number,
  type, time, duration, SIM) and sends `{"event":"ended"}`.
- **Offline queue:** every event is written to a local SQLite table first and
  deleted after a successful POST, with retry when connectivity returns.
- **SIM filter:** the subscription id chosen in settings; calls on other
  SIMs are ignored.
- **Boot:** the service restarts after a reboot.
