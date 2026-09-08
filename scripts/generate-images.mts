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

/*
 * The supplied logo has "RAJSHAHI RENT A CAR" baked into it. Beside the Bangla
 * brand name in the header that reads as duplicated and, at header size, its
 * lettering is illegible anyway. Crop to the car-and-pin device; the words are
 * set as real text next to it.
 *
 * sharp applies trim before extract within a single pipeline, so this runs in
 * two passes.
 */
{
  const source = "public/media/brand/logo-mark.png";
  const meta = await sharp(source).metadata();
  if (meta.width && meta.height) {
    const deviceOnly = await sharp(source)
      .extract({
        left: 0,
        top: 0,
        width: meta.width,
        height: Math.round(meta.height * 0.49),
      })
      .png()
      .toBuffer();

    await sharp(deviceOnly)
      .trim({ threshold: 5 })
      .png()
      .toFile(path.join(OUT_DIR, "logo-device.png"));
    written += 1;
  }
}

await writeFile(
  path.join(OUT_DIR, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);

console.log(`✓ generated ${written} image files for ${Object.keys(manifest).length} sources`);
