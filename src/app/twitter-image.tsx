import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "PandPlicht, gratis indicatieve check voor de energie- en verduurzamingsplichten van uw bedrijfspand.";

export default function Image() {
  return renderOgImage();
}
