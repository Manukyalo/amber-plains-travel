import { createClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "operations" | "sales" | "finance" | "driver" | "guest";

export interface AuthenticatedActor {
  userId: string;
  email: string;
  role: AppRole;
}

const VALID_ROLES: ReadonlySet<string> = new Set([
  "admin",
  "operations",
  "sales",
  "finance",
  "driver",
  "guest",
]);

/**
 * Resolves the verified authenticated user and their server-controlled app_metadata role.
 * Never reads user_metadata for authorization.
 */
export async function getAuthenticatedActor(): Promise<AuthenticatedActor | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const rawRole = user.app_metadata?.role;
  const role: AppRole =
    typeof rawRole === "string" && VALID_ROLES.has(rawRole)
      ? (rawRole as AppRole)
      : "guest";

  return {
    userId: user.id,
    email: user.email ?? "",
    role,
  };
}

/**
 * Enforces least-privilege role access on API routes and Server Actions.
 */
export async function requireRole(
  allowedRoles: AppRole[]
): Promise<{ ok: true; actor: AuthenticatedActor } | { ok: false; status: 401 | 403; error: string }> {
  const actor = await getAuthenticatedActor();
  if (!actor) {
    return { ok: false, status: 401, error: "Authentication required." };
  }

  if (!allowedRoles.includes(actor.role)) {
    return {
      ok: false,
      status: 403,
      error: `Role '${actor.role}' is not permitted to perform this operation.`,
    };
  }

  return { ok: true, actor };
}
