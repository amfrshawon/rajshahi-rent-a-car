/**
 * Responsive picture element backed by the derivatives that
 * scripts/generate-images.mts writes into public/media/generated/.
 *
 * The static export has no runtime image optimiser, so every candidate width
 * must already exist as a file. AVIF first, WebP as the fallback.
 */

import { asset } from "@/config/deploy";

const WIDTHS = [480, 640, 800, 1200, 1600] as const;

/** 1 x 1 transparent GIF: an <img> that never makes a request. */
const NOTHING = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

export function Photo({
  name,
  width,
  height,
  alt,
  sizes,
  className,
  priority = false,
  media,
}: {
  name: string;
  width: number;
  height: number;
  alt: string;
  sizes: string;
  className?: string;
  /** Set on the LCP image only. */
  priority?: boolean;
  /**
   * Only show the photo where this media query matches. Elsewhere nothing
   * is downloaded at all; the caller hides the element there with CSS.
   */
  media?: string;
}) {
  const available = WIDTHS.filter((w) => w <= width);
  const widths = available.length > 0 ? available : [width];
  const srcSet = (ext: string) =>
    widths
      .map((w) => `${asset(`/media/generated/${name}-${w}.${ext}`)} ${w}w`)
      .join(", ");

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} media={media} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} media={media} />
      <img
        src={media ? NOTHING : asset(`/media/generated/${name}-${widths[widths.length - 1]}.webp`)}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : undefined}
        className={className}
      />
    </picture>
  );
}
