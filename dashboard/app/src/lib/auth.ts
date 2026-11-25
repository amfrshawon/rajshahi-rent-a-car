import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Server-side guard: the session must belong to the owner. */
export async function requireOwner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "driver") redirect("/driver");
  if (profile?.role !== "owner") redirect("/login?error=not-owner");

  return { user, profile, supabase };
}

/** Server-side guard: the session must belong to a driver. */
export async function requireDriver() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, role, status, on_duty")
    .eq("id", user.id)
    .single();

  if (profile?.role === "owner") redirect("/drivers");
  if (profile?.role !== "driver") redirect("/login?error=no-access");

  return { user, profile, supabase };
}
