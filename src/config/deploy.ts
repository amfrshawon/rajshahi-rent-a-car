/**
 * Deployment-target differences.
 *
 * Production is the apex of rajshahirentacar.bd, served from ExonHost, where
 * everything sits at the root. A GitHub Pages preview of a project repo is
 * served from /<repo>/ instead, so absolute asset paths need prefixing —
 * Next handles that for next/link and /_next assets, but not for a raw
 * <img src="/media/...">.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * True for preview deploys. A public copy of the site would otherwise compete
 * with the real domain in search results, so previews are marked noindex.
 */
export const IS_PREVIEW = process.env.NEXT_PUBLIC_IS_PREVIEW === "true";

/** Prefix a path in `public/` with the deployment base path. */
export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}

/**
 * Prefix an internal page path for a raw `<a href>`.
 *
 * next/link applies basePath itself, so this is only for plain anchors —
 * the language switch and the booking button, which are deliberately full
 * page loads rather than client navigations.
 */
export function href(path: string): string {
  return `${BASE_PATH}${path}`;
}
