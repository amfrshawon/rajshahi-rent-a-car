import type { MetadataRoute } from "next";
import { IS_PREVIEW } from "@/config/deploy";
import { SITE } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // A preview deploy is a public copy of the same content; keep it out of
  // the index entirely rather than relying on canonical tags alone.
  if (IS_PREVIEW) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
