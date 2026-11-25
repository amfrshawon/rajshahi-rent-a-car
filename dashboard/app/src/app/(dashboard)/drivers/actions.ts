"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const BD_PHONE = /^(?:\+?880|0)1[3-9]\d{8}$/;

function normalisePhone(raw: string) {
  const cleaned = raw.replace(/[\s-]/g, "");
  if (cleaned.startsWith("+880")) return cleaned;
  if (cleaned.startsWith("880")) return `+${cleaned}`;
  return `+880${cleaned.replace(/^0/, "")}`;
}

export async function addDriver(formData: FormData) {
  const { supabase } = await requireOwner();

  const fullName = String(formData.get("full_name") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nid = String(formData.get("nid_number") ?? "").trim() || null;
  const license = String(formData.get("license_number") ?? "").trim() || null;
  const regNumber = String(formData.get("reg_number") ?? "").trim();
  const ambulanceType = String(formData.get("ambulance_type") ?? "");

  if (
    !fullName ||
    !BD_PHONE.test(phoneRaw.replace(/[\s-]/g, "")) ||
    password.length < 6 ||
    !regNumber ||
    (ambulanceType !== "non_ac" && ambulanceType !== "ac")
  ) {
    redirect("/drivers?error=invalid");
  }

  const phone = normalisePhone(phoneRaw);
  const digits = phone.replace(/\D/g, "");

  // Drivers sign in with phone + password; Supabase Auth needs an email
  // under the hood, so the phone maps to a synthetic address.
  const admin = createAdminClient();
  const { data: created, error: authError } = await admin.auth.admin.createUser({
    email: `${digits}@driver.rajshahirentacar.bd`,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (authError || !created.user) redirect("/drivers?error=account");

  const { error: profileError } = await supabase.from("profiles").insert({
    id: created.user.id,
    role: "driver",
    full_name: fullName,
    phone,
    status: "pending",
    nid_number: nid,
    license_number: license,
  });

  if (profileError) redirect("/drivers?error=profile");

  await supabase.from("vehicles").insert({
    driver_id: created.user.id,
    service: "ambulance",
    ambulance_type: ambulanceType,
    reg_number: regNumber,
    active: true,
  });

  const photos: Array<[string, FormDataEntryValue | null]> = [
    ["vehicle-1", formData.get("photo1")],
    ["vehicle-2", formData.get("photo2")],
  ];
  for (const [name, entry] of photos) {
    if (entry instanceof File && entry.size > 0) {
      const ext = entry.name.split(".").pop() ?? "jpg";
      await admin.storage
        .from("driver-documents")
        .upload(`${created.user.id}/${name}.${ext}`, entry, { upsert: true });
    }
  }

  revalidatePath("/drivers");
  redirect("/drivers?ok=added");
}

export async function setDriverStatus(formData: FormData) {
  const { supabase } = await requireOwner();
  const id = String(formData.get("driver_id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !["active", "suspended", "pending"].includes(status)) {
    redirect("/drivers?error=invalid");
  }

  await supabase.from("profiles").update({ status }).eq("id", id).eq("role", "driver");

  revalidatePath("/drivers");
  redirect("/drivers");
}
