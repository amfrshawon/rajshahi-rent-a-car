// Edge Function: dispatch-push (M5)
//
// Called by the dashboard right after dispatch_trip. Sends a high-priority
// FCM data message to every eligible driver (ones with a push token).
//
// Authentication is by capability: the caller must present a key that can
// execute eligible_drivers(), which is granted to the service role only.
// (The legacy service-role JWT and the new sb_secret_… keys both work.)
//
// Required function secrets (dashboard → Edge Functions → Secrets):
//   FIREBASE_PROJECT_ID
//   FIREBASE_CLIENT_EMAIL
//   FIREBASE_PRIVATE_KEY   (the service-account private key, with \n escapes)

import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const bodySchema = z.object({ trip_id: z.string().uuid() });

function base64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/=+$/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function pemToBytes(pem: string): Uint8Array {
  const body = pem
    .replace(/\\n/g, "\n")
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  return Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
}

async function googleAccessToken(
  clientEmail: string,
  privateKey: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const claim = base64url(
    new TextEncoder().encode(
      JSON.stringify({
        iss: clientEmail,
        scope: "https://www.googleapis.com/auth/firebase.messaging",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      }),
    ),
  );
  const unsigned = `${header}.${claim}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToBytes(privateKey),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned),
  );
  const assertion = `${unsigned}.${base64url(new Uint8Array(signature))}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("google_token_failed");
  return data.access_token;
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: "invalid_body", issues: parsed.error.issues }, 400);
  }

  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "unauthorized" }, 401);

  const caller = createClient(Deno.env.get("SUPABASE_URL")!, token, {
    auth: { persistSession: false },
  });

  // Capability check: this RPC is granted to service_role only.
  const { data: drivers, error: driversError } = await caller.rpc("eligible_drivers", {
    p_trip: parsed.data.trip_id,
  });
  if (driversError) {
    if (/permission denied|invalid api key|jwt/i.test(driversError.message)) {
      return json({ error: "unauthorized" }, 401);
    }
    // A valid key but a missing trip surfaces as an empty result.
    if (String(driversError.code) === "22P02") return json({ error: "trip_not_found" }, 404);
    return json({ error: "drivers_failed", detail: driversError.message }, 500);
  }

  const { data: trip, error: tripError } = await caller
    .from("trips")
    .select("id, code, ambulance_type, distance_km, fare")
    .eq("id", parsed.data.trip_id)
    .single();
  if (tripError || !trip) return json({ error: "trip_not_found" }, 404);

  const projectId = Deno.env.get("FIREBASE_PROJECT_ID");
  const clientEmail = Deno.env.get("FIREBASE_CLIENT_EMAIL");
  const privateKey = Deno.env.get("FIREBASE_PRIVATE_KEY");
  if (!projectId || !clientEmail || !privateKey) {
    return json({ ok: true, sent: 0, error: "firebase_not_configured" });
  }
  if (!drivers || drivers.length === 0) {
    return json({ ok: true, sent: 0, eligible: 0 });
  }

  const accessToken = await googleAccessToken(clientEmail, privateKey);

  const results = await Promise.all(
    drivers.map(async (driver: { driver_id: string; push_token: string }) => {
      const res = await fetch(
        `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              token: driver.push_token,
              android: {
                priority: "high",
                notification: {
                  channel_id: "trip_alert",
                  title: "নতুন ট্রিপ",
                  body: `${trip.code} · ${trip.distance_km} কিমি · ৳${trip.fare}`,
                },
              },
              data: { trip_id: trip.id, code: trip.code, kind: "trip_alert" },
            },
          }),
        },
      );
      return res.ok;
    }),
  );

  return json({
    ok: true,
    eligible: drivers.length,
    sent: results.filter(Boolean).length,
  });
});
