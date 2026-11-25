// Edge Function: ingest-call (M2)
//
// The phone (MacroDroid now, the custom call logger in M6) POSTs each call
// event here. Contract: docs/05-call-logging.md.
//
//   POST /functions/v1/ingest-call
//   header: x-device-key: <key from Settings>
//   body:   { number, direction, started_at, duration_sec, sim_slot, event }
//
// `event: "ringing"` only drives the "who is calling" pop-up (M6); nothing is
// stored unless no "ended" follows. `event: "ended"` writes the call row.
// A re-sent event is stored once: unique (caller_number, started_at).
//
// Deployed with JWT verification off: the device key is the authentication.

import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const bodySchema = z.object({
  number: z.string().min(6),
  direction: z.enum(["incoming", "outgoing", "missed", "rejected"]),
  started_at: z.string().datetime({ offset: true }),
  duration_sec: z.number().int().min(0).default(0),
  sim_slot: z.number().int().min(0).max(4).nullish(),
  event: z.enum(["ringing", "ended"]).default("ended"),
});

function normalisePhone(raw: string): string {
  const cleaned = raw.replace(/[\s\-().]/g, "");
  if (cleaned.startsWith("+880")) return cleaned;
  if (cleaned.startsWith("880")) return `+${cleaned}`;
  if (cleaned.startsWith("0")) return `+880${cleaned.slice(1)}`;
  return cleaned;
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Best-effort limiter, per running instance: 60 requests a minute.
const RATE_LIMIT = 60;
const WINDOW_MS = 60_000;
let windowStarted = 0;
let windowCount = 0;

function rateLimited(): boolean {
  const now = Date.now();
  if (now - windowStarted > WINDOW_MS) {
    windowStarted = now;
    windowCount = 0;
  }
  windowCount += 1;
  return windowCount > RATE_LIMIT;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (rateLimited()) return json({ error: "rate_limited" }, 429);

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
  const input = parsed.data;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const { data: settings, error: settingsError } = await supabase
    .from("settings")
    .select("call_logger_key")
    .eq("id", true)
    .single();

  if (settingsError || !settings) return json({ error: "settings_missing" }, 500);

  const deviceKey = req.headers.get("x-device-key") ?? "";
  if (deviceKey !== settings.call_logger_key) return json({ error: "bad_key" }, 403);

  // Ringing only feeds the future pop-up; the "ended" event stores the call.
  if (input.event === "ringing") return json({ ok: true, stored: false });

  const { data, error } = await supabase
    .from("calls")
    .insert({
      caller_number: normalisePhone(input.number),
      direction: input.direction,
      started_at: input.started_at,
      duration_sec: input.duration_sec,
      sim_slot: input.sim_slot ?? null,
      source: "macrodroid",
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return json({ ok: true, duplicate: true });
    return json({ error: "insert_failed", detail: error.message }, 500);
  }

  return json({ ok: true, duplicate: false, id: data.id });
});
