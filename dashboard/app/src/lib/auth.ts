import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Server-side guard: the session must belong to an active-enough owner. */
export async function requireOwner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, status")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "owner") redirect("/login?error=not-owner");

  return { user, profile, supabase };
}
