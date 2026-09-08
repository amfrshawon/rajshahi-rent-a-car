import { createServer } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { insertBooking, listBookings } from "./db.js";
import { sendBookingEmail } from "./mail.js";
import { bookingSchema } from "./validation.js";

/**
 * Booking endpoint.
 *
 * The site itself is a static export, so this is the only server-side piece.
 * It runs under cPanel's Node.js Selector (Passenger) on the same shared
 * account, which caps the whole account at 700 MB and 20 entry processes —
 * hence plain node:http, a 3-connection pool and no framework.
 */

const PORT = process.env.PORT || 3001;
const SITE_ORIGIN = process.env.SITE_ORIGIN ?? "https://rajshahirentacar.bd";
const MAX_BODY_BYTES = 16 * 1024;

/* ------------------------------------------------------------------ limits */

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Cheap sweep so the map cannot grow without bound in a long-lived process.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > RATE_MAX;
}

/* ------------------------------------------------------------------ helpers */

function send(res, status, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": SITE_ORIGIN,
    "vary": "Origin",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    ...extraHeaders,
  });
  res.end(body);
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
  return (first ?? req.socket.remoteAddress ?? "").trim();
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Payload too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function authorised(req) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const provided = (req.headers.authorization ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ------------------------------------------------------------------ routes */

async function handleBooking(req, res) {
  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return send(res, 429, { ok: false, error: "too_many_requests" }, { "retry-after": "600" });
  }

  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch (error) {
    return send(res, error.status ?? 400, { ok: false, error: "bad_request" });
  }

  const parsed = bookingSchema.safeParse(payload);
  if (!parsed.success) {
    return send(res, 422, {
      ok: false,
      error: "validation_failed",
      issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }

  // Honeypot: silently accept so a bot cannot tell it was caught.
  if (parsed.data.website) return send(res, 200, { ok: true, id: null });

  const booking = { ...parsed.data, ip: null, userAgent: req.headers["user-agent"] };

  let id;
  try {
    id = await insertBooking(booking);
  } catch (error) {
    console.error("[booking] insert failed", error);
    return send(res, 500, { ok: false, error: "storage_failed" });
  }

  // The booking is durable at this point. Email is best-effort and must not
  // turn a saved booking into a reported failure.
  const mail = await sendBookingEmail(booking, id);
  return send(res, 201, { ok: true, id, emailed: mail.sent });
}

async function handleList(req, res) {
  if (!authorised(req)) return send(res, 401, { ok: false, error: "unauthorised" });
  try {
    return send(res, 200, { ok: true, bookings: await listBookings() });
  } catch (error) {
    console.error("[booking] list failed", error);
    return send(res, 500, { ok: false, error: "storage_failed" });
  }
}

/* ------------------------------------------------------------------ server */

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "OPTIONS") {
    return send(res, 204, {}, {
      "access-control-allow-methods": "POST, GET, OPTIONS",
      "access-control-allow-headers": "content-type, authorization",
      "access-control-max-age": "86400",
    });
  }

  if (req.method === "POST" && url.pathname === "/api/booking") return handleBooking(req, res);
  if (req.method === "GET" && url.pathname === "/api/bookings") return handleList(req, res);
  if (req.method === "GET" && url.pathname === "/api/health") return send(res, 200, { ok: true });

  return send(res, 404, { ok: false, error: "not_found" });
});

server.listen(PORT, () => console.log(`[booking] listening on ${PORT}`));
