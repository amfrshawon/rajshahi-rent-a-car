import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VehiclePage } from "@/components/pages/vehicle-page";
import { vehicleRoute } from "@/config/routes";
import { FLEET } from "@/config/site";
import { social } from "@/lib/metadata";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return FLEET.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = FLEET.find((v) => v.slug === slug);
  if (!vehicle) return {};

  const path = vehicleRoute("en", slug);
  return {
    title: `${vehicle.name} rental in Rajshahi — ${vehicle.seats} seats, with driver`,
    description: `Rent a ${vehicle.name} (${vehicle.type.en}, ${vehicle.seats} seats, ${vehicle.transmission.en}) with a driver in Rajshahi, from ৳${vehicle.pricePerDay} per day.`,
    ...social("en", path),
    alternates: {
      canonical: path,
      languages: { bn: vehicleRoute("bn", slug), en: path, "x-default": vehicleRoute("bn", slug) },
    },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const vehicle = FLEET.find((v) => v.slug === slug);
  if (!vehicle) notFound();
  return <VehiclePage locale="en" vehicle={vehicle} />;
}

export const dynamicParams = false;
