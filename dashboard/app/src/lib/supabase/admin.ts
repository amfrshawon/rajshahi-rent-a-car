import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client: server-only, bypasses RLS. Used only where the
 * owner's session cannot do the job (creating auth users for drivers).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase service env vars are missing. Fill in dashboard/app/.env.local from dashboard/.env.example.",
    );
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
