"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";

export async function updateFareBand(formData: FormData) {
  const { supabase } = await requireOwner();

  const id = String(formData.get("band_id") ?? "");
  const fare = Number(formData.get("fare"));
  const commission = Number(formData.get("commission"));
  const active = formData.get("active") === "on";

  if (
    !id ||
    !Number.isInteger(fare) ||
    fare < 0 ||
    !Number.isInteger(commission) ||
    commission < 0
  ) {
    redirect("/fares?error=invalid");
  }

  // Saving a band clears the "set these" placeholder marker.
  await supabase
    .from("fare_bands")
    .update({ fare, commission, active, note: null })
    .eq("id", id);

  revalidatePath("/fares");
  redirect("/fares?ok=saved");
}

export async function addPlace(formData: FormData) {
  const { supabase } = await requireOwner();

  const nameBn = String(formData.get("name_bn") ?? "").trim();
  const nameEn = String(formData.get("name_en") ?? "").trim();
  const km = Number(formData.get("km_from_rmch"));

  if (!nameBn || !nameEn || !Number.isFinite(km) || km < 0) {
    redirect("/fares?error=invalid");
  }

  await supabase.from("places").insert({
    name_bn: nameBn,
    name_en: nameEn,
    km_from_rmch: km,
  });

  revalidatePath("/fares");
  redirect("/fares?ok=place");
}
