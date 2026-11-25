// M1 smoke test against a running dev server and the linked Supabase project.
// Usage: node scripts/smoke-m1.mjs <owner-email> <owner-password>
// Creates one test driver through the UI, approves it, checks the other
// screens, then deletes the test driver again.

import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("usage: node scripts/smoke-m1.mjs <owner-email> <owner-password>");
  process.exit(1);
}

const env = readFileSync(".env.local", "utf8");
const get = (k) =>
  env.split("\n").find((line) => line.startsWith(`${k}=`))?.slice(k.length + 1).trim();
const supabaseUrl = get("NEXT_PUBLIC_SUPABASE_URL");
const serviceKey = get("SUPABASE_SERVICE_ROLE_KEY");

const PHONE = "01700000099";
const NAME = "Smoke Test Driver";

function assert(condition, message) {
  if (!condition) throw new Error(`FAIL: ${message}`);
}

const browser = await chromium.launch();
const page = await browser.newPage();

try {
  // Anonymous visit lands on the login page.
  await page.goto(`${BASE}/drivers`);
  await page.waitForURL("**/login");
  assert(await page.getByText("ড্যাশবোর্ডে লগ ইন").isVisible(), "login page renders");

  // Sign in.
  await page.getByLabel(/ইমেইল/).fill(email);
  await page.getByLabel(/পাসওয়ার্ড/).fill(password);
  await page.getByRole("button", { name: /লগ ইন/ }).click();
  await page.waitForURL("**/drivers");
  assert(await page.getByRole("heading", { name: "ড্রাইভার" }).isVisible(), "drivers page after login");

  // Add a driver through the form.
  await page.getByText("নতুন ড্রাইভার যোগ করুন / Add a driver").click();
  await page.getByLabel(/নাম \/ Full name/).fill(NAME);
  await page.getByLabel(/মোবাইল \/ Phone/).fill(PHONE);
  await page.getByLabel(/লগইন পাসওয়ার্ড/).fill("driver123");
  await page.getByLabel(/এনআইডি/).fill("SMOKE-NID-1");
  await page.getByLabel(/লাইসেন্স/).fill("SMOKE-LIC-1");
  await page.getByLabel(/গাড়ির নম্বর/).fill("SMOKE-REG-01");
  await page.getByRole("button", { name: /যোগ করুন \/ Add driver/ }).click();
  await page.waitForURL("**/drivers?ok=added");
  assert(await page.getByText(NAME).isVisible(), "new driver listed");
  assert(await page.getByText("অপেক্ষমাণ / Pending").first().isVisible(), "driver starts pending");

  // Approve it.
  const card = page.locator("article", { hasText: NAME });
  await card.getByRole("button", { name: /অনুমোদন \/ Approve/ }).click();
  await page.waitForLoadState("networkidle");
  await card.getByText("সক্রিয় / Active").waitFor();
  assert(true, "driver approved");

  // Fares screen: placeholder bands and the RMCH place are present.
  await page.goto(`${BASE}/fares`);
  assert(await page.getByText("set these").first().isVisible(), "placeholder bands visible");
  assert(await page.getByText("রাজশাহী মেডিকেল কলেজ হাসপাতাল").isVisible(), "RMCH place visible");

  // Settings screen renders the stored values.
  await page.goto(`${BASE}/settings`);
  assert(
    (await page.getByLabel(/বকেয়া সীমা/).inputValue()) === "2000",
    "due limit is 2000",
  );

  await page.goto(`${BASE}/drivers`);
  await page.screenshot({ path: "m1-drivers.png", fullPage: true });
  console.log("SMOKE PASSED");
} finally {
  await browser.close();

  // Clean up the test driver (profile + auth user).
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };
  const found = await fetch(
    `${supabaseUrl}/rest/v1/profiles?phone=eq.${encodeURIComponent("+8801700000099")}&select=id`,
    { headers },
  ).then((r) => r.json());
  for (const row of found) {
    await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${row.id}`, {
      method: "DELETE",
      headers,
    });
    await fetch(`${supabaseUrl}/auth/v1/admin/users/${row.id}`, {
      method: "DELETE",
      headers,
    });
    console.log(`cleaned up test driver ${row.id}`);
  }
}
