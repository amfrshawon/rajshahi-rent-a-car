// M2 smoke test: login -> /calls -> a call inserted outside the browser must
// appear live (Realtime, <5s) -> "No trip" marks it handled with a reason.
// Cleans up every test call it created.
//
// Usage: node scripts/smoke-m2.mjs <owner-email> <owner-password>

import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("usage: node scripts/smoke-m2.mjs <owner-email> <owner-password>");
  process.exit(1);
}

const env = readFileSync(".env.local", "utf8");
const get = (k) =>
  env.split("\n").find((line) => line.startsWith(`${k}=`))?.slice(k.length + 1).trim();
const supabaseUrl = get("NEXT_PUBLIC_SUPABASE_URL");
const serviceKey = get("SUPABASE_SERVICE_ROLE_KEY");

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  "Content-Type": "application/json",
};

const PHONE = "+8801700000098";

function assert(condition, message) {
  if (!condition) throw new Error(`FAIL: ${message}`);
}

const browser = await chromium.launch();
const page = await browser.newPage();

try {
  // Sign in.
  await page.goto(`${BASE}/login`);
  await page.getByLabel(/ইমেইল/).fill(email);
  await page.getByLabel(/পাসওয়ার্ড/).fill(password);
  await page.getByRole("button", { name: /লগ ইন/ }).click();
  await page.waitForURL("**/drivers");

  // Open the calls inbox.
  await page.goto(`${BASE}/calls`);
  await page.getByRole("heading", { name: "কল", exact: true }).waitFor();

  // Insert a call the way MacroDroid would (through the deployed function is
  // already covered by the API test; here we write the row directly so the
  // test is independent of the function key).
  const startedAt = new Date().toISOString();
  const inserted = await fetch(`${supabaseUrl}/rest/v1/calls`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify({
      caller_number: PHONE,
      direction: "missed",
      started_at: startedAt,
      duration_sec: 0,
      source: "manual",
    }),
  }).then((r) => r.json());
  assert(Array.isArray(inserted) && inserted[0]?.id, "test call inserted");

  // Realtime: the row must appear without a reload, within 5 seconds.
  await page.getByText(PHONE).waitFor({ timeout: 5000 });
  assert(true, "call appeared live within 5s");

  // "No trip" with a reason marks it handled.
  const card = page.locator("article", { hasText: PHONE });
  await card.getByPlaceholder("কারণ / Reason").fill("SMOKE: wrong number");
  await card.getByRole("button", { name: /ট্রিপ নয়/ }).click();
  await page.waitForLoadState("networkidle");
  await page.getByText("SMOKE: wrong number").waitFor({ timeout: 5000 });
  assert(true, "call marked handled with a reason");

  console.log("SMOKE M2 PASSED");
} finally {
  await browser.close();

  for (const number of [PHONE, "+8801700000099"]) {
    await fetch(`${supabaseUrl}/rest/v1/calls?caller_number=eq.${encodeURIComponent(number)}`, {
      method: "DELETE",
      headers,
    });
  }
  console.log("test calls cleaned up");
}
