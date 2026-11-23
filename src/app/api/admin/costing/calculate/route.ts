import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { costingEngine } from "@/services/costingEngine";
import { CostingLineItem } from "@/types/admin";

const costingRequestSchema = z.object({
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
  contingencyBufferRate: z.number().min(0).max(0.5).optional(),
  markupRate: z.number().min(0).max(3.0).optional(),
  minimumProfitThresholdMargin: z.number().min(0.05).max(0.5).optional(),
  targetMarginMode: z.boolean().optional(),
  desiredGrossMargin: z.number().min(0.05).max(0.9).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = costingRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid costing line items provided.",
          code: "VALIDATION_ERROR",
          status: 422,
          details: parsed.error.flatten(),
        },
        { status: 422 }
      );
    }

    const result = costingEngine.calculate({
      lineItems: parsed.data.lineItems as CostingLineItem[],
      contingencyBufferRate: parsed.data.contingencyBufferRate,
      markupRate: parsed.data.markupRate,
      minimumProfitThresholdMargin: parsed.data.minimumProfitThresholdMargin,
      targetMarginMode: parsed.data.targetMarginMode,
      desiredGrossMargin: parsed.data.desiredGrossMargin,
    });

    return NextResponse.json(
      {
        success: true,
        calculation: result,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[Costing API Error]", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal calculation error",
        code: "COSTING_ERROR",
        status: 500,
      },
      { status: 500 }
    );
  }
}
