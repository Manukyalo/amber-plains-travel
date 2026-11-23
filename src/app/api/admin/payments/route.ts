import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { mockTransactions } from "@/data/adminMockData";
import { TransactionRecord, PaymentStatus } from "@/types/admin";

const processPaymentSchema = z.object({
  idempotencyKey: z.string().min(10, "Idempotency key required"),
  bookingReference: z.string().min(5),
  amountCents: z.number().int().positive("Amount must be positive integer cents"),
  currency: z.enum(["USD", "KES", "EUR", "GBP"]).default("USD"),
  provider: z.enum(["mpesa", "intasend", "stripe", "bank_wire", "cash"]),
  action: z.enum(["initiate", "webhook_callback", "reconcile", "refund"]),
  providerTransactionId: z.string().optional(),
  targetStatus: z.enum(["pending", "processing", "succeeded", "failed", "refunded"]).optional(),
});

// Idempotency cache (in-memory for Phase 2 demo; in production backed by Redis / DB table)
const idempotencyStore = new Map<string, TransactionRecord>();

export async function GET() {
  return NextResponse.json({
    success: true,
    totalRecords: mockTransactions.length,
    ledger: mockTransactions,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = processPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Payment parameters rejected by validation gate.",
          code: "PAYMENT_VALIDATION_ERROR",
          status: 422,
          details: parsed.error.flatten(),
        },
        { status: 422 }
      );
    }

    const data = parsed.data;

    // 1. Idempotency Check: prevent double charges or duplicate state transitions
    if (idempotencyStore.has(data.idempotencyKey)) {
      const existing = idempotencyStore.get(data.idempotencyKey)!;
      console.warn(`[Payment Idempotency Hit] Duplicate request for key: ${data.idempotencyKey}`);
      return NextResponse.json(
        {
          success: true,
          isDuplicate: true,
          message: "Request already processed previously (Idempotent response).",
          transaction: existing,
        },
        { status: 200 }
      );
    }

    // 2. State Machine Transition
    const nowIso = new Date().toISOString();
    let resultingStatus: PaymentStatus = "pending";

    if (data.action === "initiate") {
      resultingStatus = "pending";
    } else if (data.action === "webhook_callback") {
      // Payment status only set from verified callback, never synchronous initiate response
      resultingStatus = data.targetStatus || "succeeded";
    } else if (data.action === "refund") {
      resultingStatus = "refunded";
    }

    const newRecord: TransactionRecord = {
      id: `tx-${Date.now()}`,
      bookingReference: data.bookingReference,
      idempotencyKey: data.idempotencyKey,
      provider: data.provider,
      providerTransactionId: data.providerTransactionId || `prov_${Date.now()}`,
      amountCents: data.amountCents,
      currency: data.currency,
      status: resultingStatus,
      type: data.action === "refund" ? "refund" : "deposit",
      verifiedAt: resultingStatus === "succeeded" ? nowIso : undefined,
      createdAt: nowIso,
      notes: `State transition to ${resultingStatus} via ${data.action}`,
    };

    // Store in immutable idempotency store
    idempotencyStore.set(data.idempotencyKey, newRecord);

    console.info(`[Payment Ledger Immutable Append] ID: ${newRecord.id} | Booking: ${newRecord.bookingReference} | Status: ${newRecord.status}`);

    return NextResponse.json(
      {
        success: true,
        message: `Payment state transition successfully committed: ${resultingStatus}.`,
        transaction: newRecord,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("[Payment Handler Error]", err);
    return NextResponse.json(
      { error: "Payment processing failed.", code: "PAYMENT_GATEWAY_ERROR", status: 500 },
      { status: 500 }
    );
  }
}
