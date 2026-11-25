// M3 smoke test: owner adds and approves a driver, dispatches a trip from
// the form, the driver accepts and walks it to completion, and the owner's
// board shows it under "Done today". Cleans up everything it created.
//
// Usage: node scripts/smoke-m3.mjs <owner-email> <owner-password>

import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("usage: node scripts/smoke-m3.mjs <owner-email> <owner-password>");
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

const DRIVER_NAME = "M3 Test Driver";
const DRIVER_PHONE = "01700000090";
const DRIVER_EMAIL = "8801700000090@driver.rajshahirentacar.bd";
const DRIVER_PASSWORD = "driver123";
const FAMILY_PHONE = "01800000011";

function assert(condition, message) {
  if (!condition) throw new Error(`FAIL: ${message}`);
}

async function login(page, mail, pass) {
  await page.goto(`${BASE}/login`);
  await page.getByLabel(/ইমেইল/).fill(mail);
  await page.getByLabel(/পাসওয়ার্ড/).fill(pass);
  await page.getByRole("button", { name: /লগ ইন/ }).click();
}

const browser = await chromium.launch();
const owner = await browser.newPage();
let tripId = null;
let driverId = null;

try {
  // --- Owner: add and approve a driver -----------------------------------
  await login(owner, email, password);
  await owner.waitForURL("**/drivers");

  await owner.getByText("নতুন ড্রাইভার যোগ করুন / Add a driver").click();
  await owner.getByLabel(/নাম \/ Full name/).fill(DRIVER_NAME);
  await owner.getByLabel(/মোবাইল \/ Phone/).fill(DRIVER_PHONE);
  await owner.getByLabel(/লগইন পাসওয়ার্ড/).fill(DRIVER_PASSWORD);
  await owner.getByLabel(/এনআইডি/).fill("M3-NID");
  await owner.getByLabel(/লাইসেন্স/).fill("M3-LIC");
  await owner.getByLabel(/গাড়ির নম্বর/).fill("M3-REG-01");
  await owner.getByRole("button", { name: /যোগ করুন \/ Add driver/ }).click();
  await owner.waitForURL("**/drivers?ok=added");

  const card = owner.locator("article", { hasText: DRIVER_NAME });
  await card.getByRole("button", { name: /অনুমোদন \/ Approve/ }).click();
  await owner.waitForLoadState("networkidle");
  await card.getByText("সক্রিয় / Active").waitFor();

  const driverRows = await fetch(
    `${supabaseUrl}/rest/v1/profiles?phone=eq.${encodeURIComponent("+8801700000090")}&select=id`,
    { headers },
  ).then((r) => r.json());
  driverId = driverRows[0]?.id;
  assert(driverId, "driver profile created");

  // --- Owner: dispatch a trip -------------------------------------------
  await owner.goto(`${BASE}/trips/new`);
  await owner.getByLabel(/পরিবারের নম্বর/).fill(FAMILY_PHONE);
  await owner.getByLabel(/গন্তব্য \(লেখা\)/).fill("Natore");
  await owner.getByLabel(/দূরত্ব/).fill("15");
  await owner.getByRole("button", { name: /পাঠান \/ Dispatch now/ }).click();
  await owner.waitForURL("**/trips?ok=dispatched");

  const tripText = await owner.locator("article").first().textContent();
  const code = tripText?.match(/A-\d+/)?.[0];
  assert(code, `trip code visible on the board (got: ${tripText?.slice(0, 60)})`);
  console.log(`dispatched ${code}`);

  // --- Driver: duty on, accept, walk the statuses ------------------------
  const driver = await browser.newPage();
  await login(driver, DRIVER_EMAIL, DRIVER_PASSWORD);
  await driver.waitForURL("**/driver");

  await driver.getByRole("checkbox", { name: "" }).check();
  await driver.getByRole("button", { name: "সংরক্ষণ" }).click();
  await driver.waitForLoadState("networkidle");

  await driver.getByRole("button", { name: /গ্রহণ করুন \/ Accept/ }).waitFor({ timeout: 15000 });
  await driver.getByRole("button", { name: /গ্রহণ করুন \/ Accept/ }).click();
  await driver.waitForLoadState("networkidle");
  assert(await driver.getByText(new RegExp(code ?? "")).isVisible(), "active trip visible");

  await driver.getByRole("button", { name: /রওনা দিয়েছি/ }).click();
  await driver.waitForLoadState("networkidle");
  await driver.getByRole("button", { name: /পৌঁছেছি/ }).click();
  await driver.waitForLoadState("networkidle");
  await driver.getByRole("button", { name: /রোগী উঠেছেন/ }).click();
  await driver.waitForLoadState("networkidle");
  await driver.getByRole("button", { name: /শেষ \/ Complete/ }).click();
  await driver.waitForLoadState("networkidle");
  await driver.getByText("ট্রিপ শেষ / Trip complete").waitFor({ timeout: 10000 });

  // --- Owner: the board shows it as done today --------------------------
  await owner.goto(`${BASE}/trips`);
  await owner.getByText(code ?? "").first().waitFor({ timeout: 10000 });
  const doneColumns = await owner.getByText("আজ সম্পন্ন / Done today").isVisible();
  assert(doneColumns, "agent sees the done column");

  // --- Event log --------------------------------------------------------
  const trips = await fetch(
    `${supabaseUrl}/rest/v1/trips?code=eq.${encodeURIComponent(code ?? "")}&select=id,status`,
    { headers },
  ).then((r) => r.json());
  tripId = trips[0]?.id;
  assert(trips[0]?.status === "completed", `trip completed (got ${trips[0]?.status})`);

  const events = await fetch(
    `${supabaseUrl}/rest/v1/trip_events?trip_id=eq.${tripId}&select=event&order=at`,
    { headers },
  ).then((r) => r.json());
  const names = events.map((e) => e.event);
  for (const expected of [
    "created",
    "status:dispatching",
    "status:accepted",
    "status:on_the_way",
    "status:arrived",
    "status:onboard",
    "status:completed",
  ]) {
    assert(names.includes(expected), `event log has ${expected} (has: ${names.join(",")})`);
  }

  console.log("SMOKE M3 PASSED");
} finally {
  await browser.close();

  if (tripId) {
    await fetch(`${supabaseUrl}/rest/v1/trip_events?trip_id=eq.${tripId}`, {
      method: "DELETE",
      headers,
    });
    await fetch(`${supabaseUrl}/rest/v1/trips?id=eq.${tripId}`, { method: "DELETE", headers });
  }
  if (driverId) {
    await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${driverId}`, {
      method: "DELETE",
      headers,
    });
    await fetch(`${supabaseUrl}/auth/v1/admin/users/${driverId}`, {
      method: "DELETE",
      headers,
    });
  }
  console.log("test data cleaned up");
}
