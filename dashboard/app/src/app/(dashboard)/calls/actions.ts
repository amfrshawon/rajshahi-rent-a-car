"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";

function normalisePhone(raw: string): string {
  const cleaned = raw.replace(/[\s\-().]/g, "");
  if (cleaned.startsWith("+880")) return cleaned;
  if (cleaned.startsWith("880")) return `+${cleaned}`;
  if (cleaned.startsWith("0")) return `+880${cleaned.slice(1)}`;
  return cleaned;
}

export async function markNoTrip(formData: FormData) {
  const { supabase } = await requireOwner();
  const id = String(formData.get("call_id") ?? "");
  const note = String(formData.get("outcome_note") ?? "").trim();

  if (!id || !note) redirect("/calls?error=note");

  await supabase.from("calls").update({ handled: true, outcome_note: note }).eq("id", id);

  revalidatePath("/calls");
  redirect("/calls");
}

export async function logManualCall(formData: FormData) {
  const { supabase } = await requireOwner();
  const number = String(formData.get("caller_number") ?? "").trim();
  const direction = String(formData.get("direction") ?? "incoming");

  if (!number || !["incoming", "outgoing", "missed", "rejected"].includes(direction)) {
    redirect("/calls?error=invalid");
  }

  await supabase.from("calls").insert({
    caller_number: normalisePhone(number),
    direction,
    started_at: new Date().toISOString(),
    duration_sec: 0,
    source: "manual",
  });

  revalidatePath("/calls");
  redirect("/calls?ok=logged");
}

export async function markHandled(formData: FormData) {
  const { supabase } = await requireOwner();
  const id = String(formData.get("call_id") ?? "");
  if (!id) redirect("/calls?error=invalid");

  await supabase.from("calls").update({ handled: true }).eq("id", id);

  revalidatePath("/calls");
  redirect("/calls");
}
