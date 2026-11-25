"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireDriver } from "@/lib/auth";

export async function setDuty(formData: FormData) {
  const { user, supabase } = await requireDriver();
  const onDuty = formData.get("on_duty") === "on";

  await supabase.from("profiles").update({ on_duty: onDuty }).eq("id", user.id);

  revalidatePath("/driver");
  redirect("/driver");
}

export async function acceptTrip(formData: FormData) {
  const { supabase } = await requireDriver();
  const tripId = String(formData.get("trip_id") ?? "");
  if (!tripId) redirect("/driver?error=notfound");

  const { error } = await supabase.rpc("accept_trip", { p_trip: tripId });

  revalidatePath("/driver");
  if (error) {
    redirect(`/driver?error=${error.message === "already_taken" ? "taken" : "accept"}`);
  }
  redirect("/driver?ok=accepted");
}

export async function advanceTrip(formData: FormData) {
  const { supabase } = await requireDriver();
  const tripId = String(formData.get("trip_id") ?? "");
  const status = String(formData.get("status") ?? "");
  const latRaw = formData.get("lat");
  const lngRaw = formData.get("lng");
  const lat = latRaw ? Number(latRaw) : null;
  const lng = lngRaw ? Number(lngRaw) : null;

  if (!tripId || !["on_the_way", "arrived", "onboard", "completed"].includes(status)) {
    redirect("/driver?error=bad");
  }

  const { error } = await supabase.rpc("set_trip_status", {
    p_trip: tripId,
    p_status: status,
    p_lat: lat,
    p_lng: lng,
  });

  revalidatePath("/driver");
  if (error) redirect("/driver?error=status");
  redirect(`/driver?ok=${status}`);
}

export async function driverCancel(formData: FormData) {
  const { supabase } = await requireDriver();
  const tripId = String(formData.get("trip_id") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  if (!tripId || !reason) redirect("/driver?error=reason");

  const { error } = await supabase.rpc("cancel_trip", {
    p_trip: tripId,
    p_reason: reason,
  });

  revalidatePath("/driver");
  if (error) redirect("/driver?error=cancel");
  redirect("/driver?ok=cancelled");
}
