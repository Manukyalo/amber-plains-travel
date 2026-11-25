import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { recordAuditEvent } from "@/lib/audit/auditLogger";
import {
  verifyPaymentWebhookSignature,
  WebhookProvider,
} from "@/lib/payments/webhookSecurity";

const webhookPayloadSchema = z.object({
  eventId: z.string().min(4),
  eventType: z.string().min(2),
  bookingReference: z.string().min(3),
  idempotencyKey: z.string().min(8),
  amountCents: z.number().int().positive(),
  currency: z.enum(["USD", "KES", "EUR", "GBP"]).default("USD"),
  status: z.enum(["processing", "succeeded", "failed", "refunded"]),
  providerTransactionId: z.string().min(3),
});

// In-memory deduplication fallback when DB is unavailable in local dev
const processedProviderEvents = new Set<string>();

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const providerParam = request.nextUrl.searchParams.get("provider");
  const provider: WebhookProvider =
    providerParam === "stripe" || providerParam === "intasend" || providerParam === "mpesa"
      ? providerParam
      : "stripe";

  const signatureHeader =
    request.headers.get("stripe-signature") ??
    request.headers.get("x-intasend-signature") ??
    request.headers.get("x-mpesa-signature");

  // 1. Verify webhook signature BEFORE touching DB or parsing business state
  const sigCheck = verifyPaymentWebhookSignature(provider, rawBody, signatureHeader);
  if (!sigCheck.verified) {
    console.warn(`[Webhook Rejected] provider=${provider} reason=${sigCheck.reason}`);
    return NextResponse.json(
      { error: "Invalid webhook signature.", code: "INVALID_WEBHOOK_SIGNATURE", status: 401 },
      { status: 401 }
    );
  }

  let jsonBody: unknown;
  try {
    jsonBody = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Malformed JSON payload.", code: "INVALID_JSON", status: 400 },
      { status: 400 }
    );
  }

  const parsed = webhookPayloadSchema.safeParse(jsonBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Webhook schema validation failed.", code: "VALIDATION_ERROR", status: 422 },
      { status: 422 }
    );
  }

  const evt = parsed.data;
  const dedupKey = `${provider}:${evt.eventId}`;

  // 2. Deduplicate by provider event ID
  const adminClient = createAdminClient();
  if (adminClient) {
    const { data: existingEvent } = await adminClient
      .from("integration_webhook_events")
      .select("id")
      .eq("provider", provider)
      .eq("provider_event_id", evt.eventId)
      .maybeSingle();

    if (existingEvent) {
      return NextResponse.json({ success: true, deduplicated: true }, { status: 200 });
    }

    await adminClient.from("integration_webhook_events").insert({
      provider,
      provider_event_id: evt.eventId,
      event_type: evt.eventType,
      signature_verified: true,
      payload: evt,
      processing_status: "processed",
    });

    await adminClient.from("payment_transactions").upsert(
      {
        idempotency_key: evt.idempotencyKey,
        provider,
        provider_event_id: evt.eventId,
        provider_transaction_id: evt.providerTransactionId,
        amount_cents: evt.amountCents,
        currency: evt.currency,
        status: evt.status,
        verified_at: evt.status === "succeeded" ? new Date().toISOString() : null,
      },
      { onConflict: "idempotency_key" }
    );
  } else {
    if (processedProviderEvents.has(dedupKey)) {
      return NextResponse.json({ success: true, deduplicated: true }, { status: 200 });
    }
    processedProviderEvents.add(dedupKey);
  }

  await recordAuditEvent({
    actorRole: "webhook_system",
    action: `PAYMENT_WEBHOOK_${evt.status.toUpperCase()}`,
    entityType: "payment",
    entityId: evt.providerTransactionId,
    newValues: {
      provider,
      bookingReference: evt.bookingReference,
      amountCents: evt.amountCents,
      currency: evt.currency,
      status: evt.status,
    },
  });

  return NextResponse.json({ success: true, status: evt.status }, { status: 200 });
}
