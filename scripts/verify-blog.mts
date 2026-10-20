/** Check every exported article, not only the reference museum page. */
import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";

const slugs = (await readdir("src/content/posts", { withFileTypes: true }))
  .filter((entry) => entry.isDirectory()).map((entry) => entry.name);
let checked = 0;
for (const slug of slugs) {
  for (const prefix of ["", "en/"]) {
    const file = path.join("out", prefix, slug, "index.html");
    const html = await readFile(file, "utf8");
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${file}: expected one H1`);
    for (const marker of ["article-layout", "article-contents", "article-prose", "article-fleet-title", "related-title", "https://wa.me/", "tel:+8801714424241"]) {
      assert(html.includes(marker), `${file}: missing ${marker}`);
    }
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(ids.length, new Set(ids).size, `${file}: duplicate IDs`);
    for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      if (href.startsWith("#")) assert(ids.includes(href.slice(1)), `${file}: broken anchor ${href}`);
      else if (href.startsWith("/") && !href.startsWith("//")) {
        const url = new URL(href, "https://example.test");
        const target = path.join("out", decodeURIComponent(url.pathname), "index.html");
        await access(target).catch(() => { throw new Error(`${file}: broken page link ${href}`); });
      }
    }
    checked++;
  }
}
console.log(`✓ all ${checked} blog pages: shared sections, H1, anchors and internal links verified`);
