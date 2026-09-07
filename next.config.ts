import type { NextConfig } from "next";

/**
 * Static-first build.
 *
 * The site is served by LiteSpeed on ExonHost shared hosting (Dhaka/BDIX),
 * which has a 700 MB memory cap and no root access — so there is no Node
 * process serving pages in production. Every route is pre-rendered to HTML
 * in CI and uploaded as plain files.
 *
 * `trailingSlash` is REQUIRED: every legacy WordPress URL ends in "/"
 * (e.g. /best-rent-a-car-in-rajshahi/) and those slugs must not change.
 * It also makes the export emit `<route>/index.html`, which is what a
 * static host needs in order to serve directory-style URLs.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,

  // No Node image optimizer exists in an export; responsive images are
  // generated ahead of time with sharp and referenced directly.
  images: { unoptimized: true },

  // Fail the build on type errors rather than shipping them.
  typescript: { ignoreBuildErrors: false },

  // There is an unrelated package-lock.json in the user's home directory.
  // Without this, Turbopack walks up and infers the wrong workspace root.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
