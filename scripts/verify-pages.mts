/**
 * Asserts that every page this build adds — the landing pages and the vehicle
 * detail pages — exists in the export, in both locales. The 27 legacy paths
 * are covered separately by verify-legacy-routes.mts.
 */

import { access } from "node:fs/promises";
import path from "node:path";
import { ROUTES, vehicleRoute } from "../src/config/routes.ts";
import { FLEET } from "../src/config/site.ts";

const OUT = path.join(process.cwd(), "out");
const file = (urlPath: string) =>
  path.join(OUT, urlPath.replace(/^\/+/, ""), "index.html");

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

const urls: string[] = Object.values(ROUTES).flatMap((r) => [r.bn as string, r.en as string]);
for (const vehicle of FLEET) {
  urls.push(vehicleRoute("bn", vehicle.slug), vehicleRoute("en", vehicle.slug));
}

const missing: string[] = [];
for (const url of urls) {
  if (!(await exists(file(url)))) missing.push(url);
}

if (missing.length > 0) {
  console.error(`\n✗ ${missing.length} page(s) missing from the export:\n`);
  for (const m of missing) console.error(`    ${m}`);
  process.exit(1);
}

console.log(`✓ all ${urls.length} bn/en pages present (landing + vehicle)`);
