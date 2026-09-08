import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Rajshahi Rent A Car — car rental with driver, 24/7";
export const size = OG_SIZE;
export const dynamic = "force-static";
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage("en");
}
