import { createAdminClient } from "@/lib/supabase/admin";

export type AuditEntityType =
  | "rate"
  | "pricing_rule"
  | "booking"
  | "payment"
  | "role_assignment"
  | "ai_action"
  | "site_setting";

export interface AuditEventInput {
  actorUserId?: string | null;
  actorRole: string;
  action: string;
  entityType: AuditEntityType;
  entityId: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
}

/**
 * Records an immutable audit event for sensitive mutations.
 * Never logs raw card numbers, tokens, or secrets.
 */
export async function recordAuditEvent(input: AuditEventInput): Promise<void> {
  const timestamp = new Date().toISOString();

  // Structured server log for observability
  console.info(
    JSON.stringify({
      event: "AUDIT_EVENT",
      timestamp,
      actorRole: input.actorRole,
      actorUserId: input.actorUserId ?? "system",
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
    })
  );

  const adminClient = createAdminClient();
  if (!adminClient) return;

  const { error } = await adminClient.from("audit_events").insert({
    actor_user_id: input.actorUserId ?? null,
    actor_role: input.actorRole,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId,
    old_values: input.oldValues ?? null,
    new_values: input.newValues ?? null,
    metadata: input.metadata ?? {},
  });

  if (error) {
    console.error("[AuditLogger Error]", error.message);
  }
}
