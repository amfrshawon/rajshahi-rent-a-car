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

  const path = vehicleRoute("bn", slug);
  return {
    title: `${vehicle.name} ভাড়া — ${vehicle.seats} আসন, ড্রাইভারসহ`,
    description: `রাজশাহীতে ${vehicle.name} (${vehicle.type.bn}, ${vehicle.seats} আসন, ${vehicle.transmission.bn}) ড্রাইভারসহ ভাড়া — দিনে ৳${vehicle.pricePerDay} থেকে।`,
    ...social("bn", path),
    alternates: {
      canonical: path,
      languages: { bn: path, en: vehicleRoute("en", slug), "x-default": path },
    },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const vehicle = FLEET.find((v) => v.slug === slug);
  if (!vehicle) notFound();
  return <VehiclePage locale="bn" vehicle={vehicle} />;
}

export const dynamicParams = false;
