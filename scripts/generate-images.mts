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
 * The logo has "RAJSHAHI RENT A CAR" baked in below the car-and-pin device.
 * Beside the Bangla brand name in the header that reads as duplicated and, at
 * header size, its lettering is illegible anyway — so the header uses only the
 * device, and the words are set as real text next to it.
 *
 * The seam between device and wordmark is DETECTED rather than hardcoded:
 * it sits at a different height in every version of the logo file the project
 * has had (49% for the 2026-02 WordPress export, ~61% for the 2026-10
 * original). Detection walks the alpha channel's per-row coverage and cuts at
 * the emptiest row inside the middle of the artwork.
 */
{
  const source = "public/media/brand/logo-mark.png";
  const meta = await sharp(source).metadata();
  if (meta.width && meta.height) {
    const { data, info } = await sharp(source)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const coverage = new Array<number>(info.height);
    for (let y = 0; y < info.height; y++) {
      let solid = 0;
      for (let x = 0; x < info.width; x++) {
        if (data[(y * info.width + x) * 4 + 3] > 40) solid++;
      }
      coverage[y] = solid / info.width;
    }

    /*
     * 5% row-coverage separates art from residue: the JPEG-derived master
     * keeps ~2% speckle coverage in the empty gap between device and
     * wordmark, while any real art row (even thin text strokes) exceeds 5%.
     * The seam is the middle of the longest empty run inside the band.
     */
    const EMPTY = 0.05;
    let contentTop = coverage.findIndex((c) => c >= EMPTY);
    let contentBottom = coverage.findLastIndex((c) => c >= EMPTY);
    if (contentTop < 0) { contentTop = 0; contentBottom = info.height - 1; }

    let best = { start: -1, length: 0 };
    let run: { start: number; length: number } | null = null;
    for (let y = contentTop; y <= contentBottom; y++) {
      if (coverage[y] < EMPTY) {
        run ??= { start: y, length: 0 };
        run.length++;
      } else if (run) {
        if (run.length > best.length) best = { start: run.start, length: run.length };
        run = null;
      }
    }
    if (run && run.length > best.length) best = { start: run.start, length: run.length };

    // No gap found (logo without a wordmark): keep the whole content band.
    const seam = best.length >= 4 ? best.start + Math.floor(best.length / 2) : contentBottom + 1;

    // Two passes: within one pipeline sharp applies trim BEFORE extract, so
    // the extract area would be evaluated against the trimmed image and fail.
    const iconRegion = await sharp(source)
      .extract({ left: 0, top: 0, width: meta.width, height: seam })
      .png()
      .toBuffer();

    const deviceOnly = await sharp(iconRegion)
      .trim({ threshold: 5 })
      .png()
      .toBuffer();

    /*
     * Header mark. The header shows it at 28px tall at most, so 56px covers a
     * 2x screen. WebP keeps the flat art to a few KB — the old full-resolution
     * PNG was 216 KB and loaded on every page, five times the hero photo.
     */
    await sharp(deviceOnly)
      .resize({ height: 56, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(OUT_DIR, "logo-device.webp"));

    /*
     * White silhouette for the OG share card (green strokes would sink into
     * its green ground). Satori inlines it at 140px wide, so 280px is ample;
     * the full-resolution PNG was 168 KB sitting unused in the export.
     */
    await sharp(deviceOnly)
      .greyscale()
      .linear(-1, 255)
      .resize({ width: 280, withoutEnlargement: true })
      .png()
      .toFile(path.join(OUT_DIR, "logo-device-white.png"));

    written += 2;
  }
}

/*
 * Favicon and Apple touch icon are committed, not generated here — they only
 * change when the logo does, and sharp cannot write .ico. Regenerate with:
 *   python3 - <<'EOF'
 *   from PIL import Image
 *   d = Image.open('public/media/generated/logo-device.webp').convert('RGBA')
 *   canvas = Image.new('RGBA', (48, 48), (0, 0, 0, 0))
 *   img = d.copy(); img.thumbnail((48, 48), Image.LANCZOS)
 *   canvas.paste(img, ((48 - img.width) // 2, (48 - img.height) // 2), img)
 *   canvas.save('src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
 *   green = Image.new('RGBA', (180, 180), (11, 107, 58, 255))
 *   w = Image.open('public/media/generated/logo-device-white.png')
 *   w.thumbnail((120, 120), Image.LANCZOS)
 *   green.paste(w, ((180 - w.width) // 2, (180 - w.height) // 2), w)
 *   green.convert('RGB').save('src/app/apple-icon.png')
 *   EOF
 */

await writeFile(
  path.join(OUT_DIR, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);

console.log(`✓ generated ${written} image files for ${Object.keys(manifest).length} sources`);
