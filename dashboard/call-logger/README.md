# Call logger (Android) — M6

A small Kotlin app installed only on the owner's phone. It replaces
MacroDroid: a foreground service watches the business SIM's calls and POSTs
them to `ingest-call`, with an offline queue and a ringing pop-up that shows
the caller's past trips before the owner answers.

**Status: compiles and builds** — debug APK at
`call-logger/app/build/outputs/apk/debug/app-debug.apk` (~805 KB), built with
JDK 21 + Android SDK 35. Install it from an APK file; the Play Store is not an
option for `READ_CALL_LOG` apps.

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
