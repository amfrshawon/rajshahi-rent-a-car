/**
 * Asserts that every URL the live WordPress site serves today still exists in
 * the static export — in Bangla at its original path, and in English under
 * /en/. Losing one of these silently would be the most damaging possible
 * regression, so the build fails rather than warns.
 *
 * Run after `next build`: npm run verify:routes
 */

import { access } from "node:fs/promises";
import path from "node:path";
import { ALL_LEGACY_PATHS } from "../src/config/legacy-routes.ts";

const OUT_DIR = path.join(process.cwd(), "out");

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

/** "/blog/" -> "out/blog/index.html"; "/" -> "out/index.html" */
function htmlFileFor(urlPath: string): string {
  const relative = urlPath.replace(/^\/+/, "").replace(/\/+$/, "");
  return relative === ""
    ? path.join(OUT_DIR, "index.html")
    : path.join(OUT_DIR, relative, "index.html");
}

const missing: string[] = [];

for (const legacyPath of ALL_LEGACY_PATHS) {
  const englishPath = legacyPath === "/" ? "/en/" : `/en${legacyPath}`;
  for (const candidate of [legacyPath, englishPath]) {
    if (!(await exists(htmlFileFor(candidate)))) missing.push(candidate);
  }
}

const checked = ALL_LEGACY_PATHS.length * 2;

if (missing.length > 0) {
  console.error(
    `\n✗ ${missing.length} of ${checked} required URLs are missing from the export:\n`,
  );
  for (const m of missing) console.error(`    ${m}`);
  console.error(
    "\nThese paths exist on the live site. Dropping one breaks an indexed URL.\n",
  );
  process.exit(1);
}

console.log(`✓ all ${checked} legacy URLs present (${ALL_LEGACY_PATHS.length} paths × bn/en)`);
