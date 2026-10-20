/**
 * Responsive picture element backed by the derivatives that
 * scripts/generate-images.mts writes into public/media/generated/.
 *
 * The static export has no runtime image optimiser, so every candidate width
 * must already exist as a file. AVIF first, WebP as the fallback.
 */

import { asset } from "@/config/deploy";

const WIDTHS = [480, 800, 1200, 1600] as const;

export function Photo({
  name,
  width,
  height,
  alt,
  sizes,
  className,
  priority = false,
}: {
  name: string;
  width: number;
  height: number;
  alt: string;
  sizes: string;
  className?: string;
  /** Set on the LCP image only. */
  priority?: boolean;
}) {
  const available = WIDTHS.filter((w) => w <= width);
  const widths = available.length > 0 ? available : [width];
  const srcSet = (ext: string) =>
    widths
      .map((w) => `${asset(`/media/generated/${name}-${w}.${ext}`)} ${w}w`)
      .join(", ");

  return (
    <>
      {/*
        The hero sits below the booking tiles in the phone layout, so the
        browser discovers it late. React hoists this preload into <head> and it
        starts the AVIF download while the tiles are still parsing, which is
        what keeps LCP under 2.5 s on a throttled phone.
      */}
      {priority ? (
        <link
          rel="preload"
          as="image"
          type="image/avif"
          imageSrcSet={srcSet("avif")}
          imageSizes={sizes}
          fetchPriority="high"
        />
      ) : null}
      <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        src={asset(`/media/generated/${name}-${widths[widths.length - 1]}.webp`)}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : undefined}
        className={className}
      />
    </picture>
    </>
  );
}
