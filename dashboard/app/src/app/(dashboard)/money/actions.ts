"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";

const METHODS = ["bkash", "nagad", "rocket", "cash", "bank"];

export async function recordPayment(formData: FormData) {
  const { supabase } = await requireOwner();

  const driverId = String(formData.get("driver_id") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const method = String(formData.get("method") ?? "");
  const reference = String(formData.get("reference") ?? "").trim() || null;
  const note = String(formData.get("note") ?? "").trim() || null;

  if (
    !driverId ||
    !Number.isInteger(amount) ||
    amount <= 0 ||
    !METHODS.includes(method)
  ) {
    redirect("/money?error=payment");
  }

  const { error } = await supabase.rpc("record_payment", {
    p_driver: driverId,
    p_amount: amount,
    p_method: method,
    p_reference: reference,
    p_note: note,
  });

  revalidatePath("/money");
  redirect(error ? "/money?error=payment" : "/money?ok=payment");
}

export async function addAdjustment(formData: FormData) {
  const { supabase } = await requireOwner();

  const driverId = String(formData.get("driver_id") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const note = String(formData.get("note") ?? "").trim();

  if (!driverId || !Number.isInteger(amount) || amount === 0 || !note) {
    redirect("/money?error=adjustment");
  }

  const { error } = await supabase.rpc("add_adjustment", {
    p_driver: driverId,
    p_amount: amount,
    p_note: note,
  });

  revalidatePath("/money");
  redirect(error ? "/money?error=adjustment" : "/money?ok=adjustment");
}
