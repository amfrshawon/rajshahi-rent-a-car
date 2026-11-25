"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";

export async function updateSettings(formData: FormData) {
  const { supabase } = await requireOwner();

  const dueLimit = Number(formData.get("due_limit"));
  const acceptTimeout = Number(formData.get("accept_timeout_sec"));
  const startTimeout = Number(formData.get("start_timeout_sec"));
  const phoneHide = Number(formData.get("phone_hide_after_hours"));
  const callLoggerKey = String(formData.get("call_logger_key") ?? "").trim();

  const allValid =
    [dueLimit, acceptTimeout, startTimeout, phoneHide].every(
      (value) => Number.isInteger(value) && value >= 0,
    ) && acceptTimeout > 0 && startTimeout > 0 && callLoggerKey.length >= 16;

  if (!allValid) redirect("/settings?error=invalid");

  await supabase
    .from("settings")
    .update({
      due_limit: dueLimit,
      accept_timeout_sec: acceptTimeout,
      start_timeout_sec: startTimeout,
      phone_hide_after_hours: phoneHide,
      call_logger_key: callLoggerKey,
    })
    .eq("id", true);

  revalidatePath("/settings");
  redirect("/settings?ok=saved");
}
