/**
 * Pre-generates responsive AVIF/WebP derivatives.
 *
 * The production site is a static export with `images.unoptimized`, so there
 * is no Node image optimiser at runtime — every size has to exist as a file.
 * Output goes to public/media/generated/, which is gitignored and rebuilt in
 * CI from the committed originals.
 */

import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE_DIRS = ["public/media/fleet"];
const OUT_DIR = "public/media/generated";
const WIDTHS = [480, 800, 1200, 1600];

await mkdir(OUT_DIR, { recursive: true });

const manifest: Record<string, { width: number; height: number }> = {};
let written = 0;

for (const dir of SOURCE_DIRS) {
  for (const file of await readdir(dir)) {
    if (!/\.(webp|jpe?g|png)$/i.test(file)) continue;

    const name = path.parse(file).name;
    const input = path.join(dir, file);
    const meta = await sharp(input).metadata();
    if (!meta.width || !meta.height) continue;

    manifest[name] = { width: meta.width, height: meta.height };

    for (const width of WIDTHS) {
      // Never upscale past the original.
      if (width > meta.width) continue;

      const resized = sharp(input).resize({ width, withoutEnlargement: true });
      await Promise.all([
        resized
          .clone()
          .avif({ quality: 55 })
          .toFile(path.join(OUT_DIR, `${name}-${width}.avif`)),
        resized
          .clone()
          .webp({ quality: 76 })
          .toFile(path.join(OUT_DIR, `${name}-${width}.webp`)),
      ]);
      written += 2;
    }
  }
}

await writeFile(
  path.join(OUT_DIR, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);

console.log(`✓ generated ${written} image files for ${Object.keys(manifest).length} sources`);
