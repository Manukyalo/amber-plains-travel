import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only privileged Supabase client using SUPABASE_SERVICE_ROLE_KEY.
 * NEVER import this module in client components or expose service-role keys.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("SECURITY_VIOLATION: createAdminClient cannot be called in the browser.");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
