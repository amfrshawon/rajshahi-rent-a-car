import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "রাজশাহী রেন্ট এ কার — ড্রাইভারসহ গাড়ি ভাড়া, ২৪ ঘণ্টা";
export const size = OG_SIZE;
export const dynamic = "force-static";
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage("bn");
}
