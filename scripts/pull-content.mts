/**
 * Refreshes src/content/wordpress.json from the live WordPress REST API.
 *
 * Run this after publishing in WordPress, then commit the result. Builds read
 * the snapshot rather than the API, so they stay reproducible and cannot be
 * broken by the CMS being down — see src/lib/wp.ts.
 *
 *     npm run content:pull
 */

import { writeFile } from "node:fs/promises";

const API =
  process.env.WP_API_URL?.trim() || "https://rajshahirentacar.bd/wp-json/wp/v2";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { accept: "application/json", "user-agent": "content-pull" },
  });
  if (!res.ok) throw new Error(`WordPress REST ${res.status} for ${path}`);
  return (await res.json()) as T;
}

console.log(`pulling from ${API}`);

const [posts, categories, tags, pages] = await Promise.all([
  get<unknown[]>(
    "/posts?per_page=100&orderby=date&order=desc&_fields=id,slug,date,modified,modified_gmt,title,excerpt,content,categories,tags",
  ),
  get<unknown[]>("/categories?per_page=100&_fields=id,slug,name,description,parent,count"),
  get<unknown[]>("/tags?per_page=100&_fields=id,slug,name,description,parent,count"),
  get<unknown[]>("/pages?per_page=100&_fields=id,slug,date,modified,title,excerpt,content"),
]);

await writeFile(
  "src/content/wordpress.json",
  JSON.stringify(
    { recoveredAt: new Date().toISOString(), source: API, posts, categories, tags, pages },
    null,
    2,
  ) + "\n",
);

console.log(
  `✓ ${posts.length} posts, ${categories.length} categories, ${tags.length} tags, ${pages.length} pages`,
);
