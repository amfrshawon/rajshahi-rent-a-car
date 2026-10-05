import type { Metadata } from "next";
import { PickupPage } from "@/components/pages/pickup-page";
import { ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Airport & Railway Station Pickup–Drop — Rajshahi",
  description:
    "24-hour pickup and drop at Shah Makhdum Airport and Rajshahi Railway Station. Share your arrival time — a driver is there at the agreed hour.",
  alternates: {
    canonical: ROUTES.pickup.en,
    languages: {
      bn: ROUTES.pickup.bn,
      en: ROUTES.pickup.en,
      "x-default": ROUTES.pickup.bn,
    },
  },
};

export default function Page() {
  return <PickupPage locale="en" />;
}
