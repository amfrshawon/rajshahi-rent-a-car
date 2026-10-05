import { asset } from "@/config/deploy";

/**
 * The car-and-pin device from the logo, without its lettering: the name is
 * set beside it as live text. Dark grounds get the copy whose swoosh is
 * white and whose pin keeps its red (scripts/generate-images.mts).
 *
 * alt is empty because the name sits next to it; announcing both would say
 * the name twice.
 */
export function BrandMark({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  const light = asset("/media/generated/logo-device.webp");
  const dark = asset("/media/generated/logo-device-on-dark.webp");
  if (onDark) {
    // Only the footer uses this copy on its own, far below the first screen.
    return <img src={dark} alt="" width={150} height={64} loading="lazy" className={className} />;
  }
  return (
    <picture>
      <source srcSet={dark} media="(prefers-color-scheme: dark)" />
      <img src={light} alt="" width={150} height={64} className={className} />
    </picture>
  );
}
