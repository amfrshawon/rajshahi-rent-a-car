"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";

const BD_PHONE = /^(?:\+?880|0)1[3-9]\d{8}$/;

function normalisePhone(raw: string): string {
  const cleaned = raw.replace(/[\s-]/g, "");
  if (cleaned.startsWith("+880")) return cleaned;
  if (cleaned.startsWith("880")) return `+${cleaned}`;
  return `+880${cleaned.replace(/^0/, "")}`;
}

export async function createTrip(formData: FormData) {
  const { user, supabase } = await requireOwner();

  const callId = String(formData.get("call_id") ?? "").trim() || null;
  const familyName = String(formData.get("family_name") ?? "").trim() || null;
  const familyPhoneRaw = String(formData.get("family_phone") ?? "").trim();
  const pickupId = String(formData.get("pickup_place_id") ?? "").trim() || null;
  const pickupText = String(formData.get("pickup_text") ?? "").trim() || null;
  const destId = String(formData.get("dest_place_id") ?? "").trim() || null;
  const destText = String(formData.get("dest_text") ?? "").trim() || null;
  const distance = Number(formData.get("distance_km"));
  const type = String(formData.get("ambulance_type") ?? "");
  const note = String(formData.get("patient_note") ?? "").trim() || null;
  const fareOverrideRaw = String(formData.get("fare_override") ?? "").trim();

  const phoneDigits = familyPhoneRaw.replace(/[\s-]/g, "");
  if (
    !BD_PHONE.test(phoneDigits) ||
    !Number.isFinite(distance) ||
    distance <= 0 ||
    (type !== "non_ac" && type !== "ac") ||
    (!destId && !destText) ||
    (!pickupId && !pickupText)
  ) {
    redirect("/trips/new?error=invalid");
  }

  const { data: bands } = await supabase
    .from("fare_bands")
    .select("fare, commission, min_km, max_km")
    .eq("ambulance_type", type)
    .eq("active", true)
    .order("min_km", { ascending: false });

  const band =
    (bands ?? []).find(
      (b) =>
        distance >= Number(b.min_km) &&
        (b.max_km === null || distance < Number(b.max_km)),
    ) ?? (bands ?? [])[0];

  let fare = Number(band?.fare ?? 0);
  const commission = Number(band?.commission ?? 0);
  let overridden = false;

  if (fareOverrideRaw) {
    const override = Number(fareOverrideRaw);
    if (Number.isFinite(override) && override >= 0 && override !== fare) {
      fare = override;
      overridden = true;
    }
  }

  const { data: trip, error } = await supabase
    .from("trips")
    .insert({
      call_id: callId,
      family_name: familyName,
      family_phone: normalisePhone(familyPhoneRaw),
      pickup_place_id: pickupId,
      pickup_text: pickupId ? null : pickupText,
      dest_place_id: destId,
      dest_text: destId ? null : destText,
      distance_km: distance,
      ambulance_type: type,
      patient_note: note,
      fare,
      commission,
      fare_overridden: overridden,
      status: "draft",
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !trip) redirect("/trips/new?error=save");

  if (overridden) {
    await supabase.from("trip_events").insert({
      trip_id: trip.id,
      actor_id: user.id,
      event: "fare_override",
      data: { fare, commission, overridden: true },
    });
  }

  const { error: dispatchError } = await supabase.rpc("dispatch_trip", {
    p_trip: trip.id,
  });
  if (dispatchError) redirect("/trips?error=dispatch");

  // Best-effort push to the eligible drivers' phones (M5). Without Firebase
  // secrets the function answers firebase_not_configured and nothing happens.
  const pushUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/dispatch-push`;
  await fetch(pushUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""}`,
    },
    body: JSON.stringify({ trip_id: trip.id }),
  }).catch(() => {});

  if (callId) {
    await supabase.from("calls").update({ handled: true }).eq("id", callId);
  }

  revalidatePath("/trips");
  revalidatePath("/calls");
  redirect("/trips?ok=dispatched");
}

export async function assignTrip(formData: FormData) {
  const { supabase } = await requireOwner();
  const tripId = String(formData.get("trip_id") ?? "").trim();
  const driverId = String(formData.get("driver_id") ?? "").trim();

  if (!tripId || !driverId) redirect("/trips?error=invalid");

  const { error } = await supabase.rpc("assign_trip", {
    p_trip: tripId,
    p_driver: driverId,
  });

  revalidatePath("/trips");
  redirect(error ? "/trips?error=assign" : "/trips");
}

export async function cancelTrip(formData: FormData) {
  const { supabase } = await requireOwner();
  const tripId = String(formData.get("trip_id") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();

  if (!tripId || !reason) redirect("/trips?error=reason");

  await supabase.rpc("cancel_trip", { p_trip: tripId, p_reason: reason });

  revalidatePath("/trips");
  redirect("/trips");
}
