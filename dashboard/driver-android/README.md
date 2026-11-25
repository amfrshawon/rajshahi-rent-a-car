# Driver app (Android) — M5

Capacitor shell around the hosted `/driver` screens, plus FCM push for the
loud trip alerts. **The APK build needs a machine with the Android SDK and a
JDK** (not installed on the dev Mac as of 2026-11-25), and a Firebase
project — both are owner-side steps.

## One-time setup

1. **Firebase project** (console.firebase.google.com, free): add an Android
   app with package name `bd.rajshahirentacar.driver`, download
   `google-services.json`, and place it at `android/app/google-services.json`
   after `npx cap add android`.
2. **Function secrets** (Dashboard → Edge Functions → Secrets, or
   `supabase secrets set`): `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`,
   `FIREBASE_PRIVATE_KEY` (from the Firebase service-account JSON; keep the
   `\n` escapes).
3. **Hosting:** set `server.url` in `capacitor.config.ts` to the deployed
   dashboard URL (M3 deploy step).

## Build

```bash
npm install
npx cap add android          # creates the android/ project (once)
npx cap sync android
cd android && ./gradlew assembleDebug   # android/app/build/outputs/apk/debug/
```

For a signed release APK create a keystore (`keytool -genkeypair ...`), add
the signing config to `android/app/build.gradle`, then
`./gradlew assembleRelease`.

## Saving the push token after login

The webview runs the same `/driver` screens. Add this once the Android
project exists (e.g. in `android/app/src/main/assets/public/push.js`, loaded
by `index.html` after login):

```js
import { PushNotifications } from "@capacitor/push-notifications";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

PushNotifications.addListener("registration", async ({ value }) => {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    await supabase
      .from("profiles")
      .update({ push_token: value })
      .eq("id", data.session.user.id);
  }
});

await PushNotifications.requestPermissions();
await PushNotifications.register();
```

The dashboard calls the `dispatch-push` Edge Function on every dispatch; it
sends a high-priority FCM data message to every eligible driver with a
token, on the `trip_alert` channel.

## Loud alerts (notification channel)

`dispatch-push` sets `channel_id: "trip_alert"` and `priority: "high"`.
Create the channel natively (one-time, e.g. in `MainActivity.onCreate`):

```kotlin
val channel = NotificationChannel(
  "trip_alert", "Trip alerts", NotificationManager.IMPORTANCE_HIGH
).apply {
  setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM), AudioAttributes.Builder()
    .setUsage(AudioAttributes.USAGE_ALARM).build())
  enableVibration(true)
  setBypassDnd(true)
}
getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
```

Add a full-screen intent in the FCM service so the trip card opens on a
locked screen, and ask the driver for "Do not disturb" access.

## Install steps for drivers

- Enable install from unknown sources (or share the APK via a file manager).
- Battery → app → Unrestricted; autostart on for Xiaomi/Redmi/POCO;
  background activity allowed on Realme/Oppo/Vivo; Samsung → never-sleeping
  apps.
- Sign in with the phone number and password the owner set.
