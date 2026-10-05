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
 * The device cannot be cut out by rows. In the current logo the swoosh's left
 * tail dips down beside the "R" of RAJSHAHI, so no empty row separates the
 * device from the lettering; the only empty band is between RAJSHAHI and RENT
 * A CAR. A row-based cut there kept RAJSHAHI in the header.
 *
 * So it is separated by colour and position instead. The swoosh is the only
 * green in the artwork: every green pixel is kept. The pin and the lettering
 * share the same red, but the pin sits above the lettering and is narrow: red
 * pixels are kept only above the lettering. Width is not a reliable signal
 * (the pin's head is ~12% of the logo's width), but position is: the pin sits
 * entirely in the right third, while the lettering starts at the far left. So
 * the top of the lettering is the first red pixel in the left 60%.
 *
 * The header shows the device about 28 px tall, so it is written at 2× that
 * (64 px) as WebP: a few kilobytes instead of the 216 KB full-size PNG.
 */
{
  const source = "public/media/brand/logo-mark.png";
  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const px = (x: number, y: number) => (y * width + x) * 4;
  const isGreen = (i: number) =>
    data[i + 3] > 40 && data[i + 1] > data[i] + 20 && data[i + 1] > data[i + 2];
  const isRed = (i: number) =>
    data[i + 3] > 40 && data[i] > data[i + 1] + 40 && data[i] > data[i + 2] + 40;

  let letteringTop = height;
  const leftZone = Math.round(width * 0.6);
  search: for (let y = 0; y < height; y++) {
    for (let x = 0; x < leftZone; x++) {
      if (isRed(px(x, y))) {
        letteringTop = Math.max(0, y - 2);
        break search;
      }
    }
  }

  const device = Buffer.alloc(data.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = px(x, y);
      const keep = isGreen(i) || (isRed(i) && y < letteringTop);
      if (!keep) continue;
      device[i] = data[i];
      device[i + 1] = data[i + 1];
      device[i + 2] = data[i + 2];
      device[i + 3] = data[i + 3];
    }
  }

  const deviceOnly = await sharp(device, { raw: { width, height, channels: 4 } })
    .png()
    .toBuffer()
    .then((buf) => sharp(buf).trim({ threshold: 5 }).png().toBuffer());

  // Header: 2x of the ~28 px display height.
  await sharp(deviceOnly)
    .resize({ height: 64 })
    .webp({ quality: 90, alphaQuality: 90 })
    .toFile(path.join(OUT_DIR, "logo-device.webp"));

  // PNG, a little larger, for the favicon tooling.
  await sharp(deviceOnly).resize({ height: 160 }).png().toFile(path.join(OUT_DIR, "logo-device.png"));

  // White silhouette of the same device — for the OG share card (green
  // strokes would sink into its green ground) and any dark-ground use.
  await sharp(deviceOnly)
    .resize({ height: 160 })
    .greyscale()
    .linear(-1, 255)
    .png()
    .toFile(path.join(OUT_DIR, "logo-device-white.png"));

  // And a white WebP for the header in dark mode.
  await sharp(deviceOnly)
    .resize({ height: 64 })
    .greyscale()
    .linear(-1, 255)
    .webp({ quality: 90, alphaQuality: 90 })
    .toFile(path.join(OUT_DIR, "logo-device-white.webp"));

  written += 4;
}

/*
 * Favicon and Apple touch icon are committed, not generated here — they only
 * change when the logo does, and sharp cannot write .ico. Regenerate with:
 *   python3 - <<'EOF'
 *   from PIL import Image
 *   d = Image.open('public/media/generated/logo-device.png').convert('RGBA')
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
