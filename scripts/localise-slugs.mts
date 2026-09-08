/**
 * Renames exported route directories to their Bangla slugs.
 *
 * Next 16 cannot prerender a route whose directory name is non-ASCII: the
 * export throws InvalidCharacterError because the path goes through a
 * Latin-1-only encoder. So the routes live in ASCII directories, the built
 * HTML already links to the Bangla paths (src/config/routes.ts), and this
 * step moves the directories to match after `next build`.
 *
 * Fails loudly rather than leaving links pointing at directories that do not
 * exist.
 */

import { access, rename } from "node:fs/promises";
import path from "node:path";
import { ROUTES } from "../src/config/routes.ts";

const OUT = path.join(process.cwd(), "out");
const strip = (p: string) => p.replace(/^\/+/, "").replace(/\/+$/, "");

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

let renamed = 0;
const problems: string[] = [];

for (const [key, def] of Object.entries(ROUTES)) {
  const ascii = "ascii" in def ? strip(def.ascii as string) : null;
  if (!ascii) continue;

  const bangla = strip(def.bn);
  if (bangla === ascii) continue;

  const from = path.join(OUT, ascii);
  const to = path.join(OUT, bangla);

  if (await exists(to)) {
    renamed++; // already localised (re-run against an existing export)
    continue;
  }
  if (!(await exists(from))) {
    problems.push(`${key}: expected ${from} to exist`);
    continue;
  }

  await rename(from, to);
  if (!(await exists(path.join(to, "index.html")))) {
    problems.push(`${key}: ${to}/index.html missing after rename`);
    continue;
  }
  renamed++;
}

if (problems.length > 0) {
  console.error("\n✗ slug localisation failed:\n");
  for (const p of problems) console.error(`    ${p}`);
  process.exit(1);
}

console.log(`✓ localised ${renamed} route directories to Bangla slugs`);
