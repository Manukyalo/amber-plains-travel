import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/rbac";
import { revalidateQuoteForConfirmation } from "@/services/rateRevalidation";
import { costingEngine } from "@/services/costingEngine";
import { recordAuditEvent } from "@/lib/audit/auditLogger";
import { CostingLineItem } from "@/types/admin";

const confirmQuoteSchema = z.object({
  quotationReference: z.string().min(4),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  vehicleId: z.string().optional(),
  markupRate: z.number().min(0).max(3.0).default(0.28),
  contingencyBufferRate: z.number().min(0).max(0.5).default(0.05),
  lineItems: z.array(
    z.object({
      id: z.string(),
      supplierContractId: z.string().optional(),
      contractVersion: z.string().optional(),
      category: z.enum([
        "accommodation",
        "park_conservancy_fee",
        "vehicle_fuel",
        "guide_allowance",
        "bush_flight",
        "activity",
        "contingency_buffer",
      ]),
      description: z.string().min(1),
      rateBasis: z.enum([
        "per_person_total",
        "per_person_per_night",
        "per_vehicle_per_day",
        "fixed_group",
      ]),
      unitCost: z.number().nonnegative(),
      quantity: z.number().int().positive(),
      multiplier: z.number().nonnegative().default(1),
      currency: z.enum(["USD", "KES"]).default("USD"),
      exchangeRateToUsd: z.number().positive().default(130),
      totalCostUsd: z.number().optional().default(0),
      isConfidentialSupplierRate: z.boolean().default(true),
    })
  ),
});

export async function POST(request: NextRequest) {
  const auth = await requireRole(["admin", "sales", "finance"]);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error, code: "FORBIDDEN", status: auth.status },
      { status: auth.status }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body.", code: "INVALID_JSON", status: 400 },
      { status: 400 }
    );
  }

  const parsed = confirmQuoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Quote confirmation payload failed validation.",
        code: "VALIDATION_ERROR",
        status: 422,
        details: parsed.error.flatten(),
      },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const lineItems = data.lineItems as CostingLineItem[];

  // Revalidate authoritative supplier contracts & fleet availability (never from cache)
  const revalidation = await revalidateQuoteForConfirmation({
    startDate: data.startDate,
    endDate: data.endDate,
    lineItems,
    vehicleId: data.vehicleId,
  });

  if (!revalidation.valid) {
    return NextResponse.json(
      {
        error: "Supplier contract or fleet availability revalidation failed.",
        code: "REVALIDATION_FAILED",
        status: 422,
        issues: revalidation.issues,
      },
      { status: 422 }
    );
  }

  const calculation = costingEngine.calculate({
    lineItems,
    markupRate: data.markupRate,
    contingencyBufferRate: data.contingencyBufferRate,
  });

  await recordAuditEvent({
    actorUserId: auth.actor.userId,
    actorRole: auth.actor.role,
    action: "QUOTE_CONFIRMED",
    entityType: "rate",
    entityId: data.quotationReference,
    newValues: {
      sellingPriceUsd: calculation.sellingPriceUsd,
      grossMarginPercentage: calculation.grossMarginPercentage,
      revalidatedAt: revalidation.revalidatedAt,
    },
  });

  return NextResponse.json(
    {
      success: true,
      revalidatedAt: revalidation.revalidatedAt,
      calculation,
    },
    { status: 200 }
  );
}
