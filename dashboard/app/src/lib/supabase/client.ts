import { createBrowserClient } from "@supabase/ssr";

/** Browser client (cookies carry the session); used for Realtime only. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
