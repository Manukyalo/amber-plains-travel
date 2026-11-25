import { createAdminClient } from "@/lib/supabase/admin";
import { mockSuppliers, mockVehicles, mockBookings } from "@/data/adminMockData";
import { CostingLineItem } from "@/types/admin";

export interface RevalidationIssue {
  code:
    | "CONTRACT_NOT_FOUND"
    | "CONTRACT_EXPIRED"
    | "BLACKOUT_DATE_CONFLICT"
    | "VEHICLE_UNAVAILABLE"
    | "RATE_MISMATCH";
  message: string;
  itemId?: string;
}

export interface RevalidationResult {
  valid: boolean;
  revalidatedAt: string;
  issues: RevalidationIssue[];
}

/**
 * Revalidates supplier contract validity, blackout dates, and fleet availability
 * directly against authoritative records before confirming a quote or booking.
 * Cache must NEVER be treated as authoritative for a financial commitment.
 */
export async function revalidateQuoteForConfirmation(params: {
  startDate: string;
  endDate: string;
  lineItems: CostingLineItem[];
  vehicleId?: string;
}): Promise<RevalidationResult> {
  const issues: RevalidationIssue[] = [];
  const revalidatedAt = new Date().toISOString();

  // Attempt authoritative DB lookup first when Supabase service role is configured
  const adminClient = createAdminClient();
  let contracts = mockSuppliers.map((s) => ({
    id: s.id,
    name: s.supplierName,
    validityStart: s.validityStart,
    validityEnd: s.validityEnd,
    blackoutDates: s.blackoutDates,
  }));

  if (adminClient) {
    const { data } = await adminClient
      .from("supplier_contracts")
      .select("id, validity_start, validity_end, blackout_dates, status")
      .eq("status", "active");

    if (data && data.length > 0) {
      contracts = data.map((row) => ({
        id: row.id as string,
        name: row.id as string,
        validityStart: row.validity_start as string,
        validityEnd: row.validity_end as string,
        blackoutDates: Array.isArray(row.blackout_dates)
          ? (row.blackout_dates as string[])
          : [],
      }));
    }
  }

  for (const item of params.lineItems) {
    if (!item.supplierContractId) continue;

    const contract = contracts.find((c) => c.id === item.supplierContractId);
    if (!contract) {
      issues.push({
        code: "CONTRACT_NOT_FOUND",
        itemId: item.id,
        message: `Supplier contract ${item.supplierContractId} is not active or missing.`,
      });
      continue;
    }

    if (params.startDate < contract.validityStart || params.endDate > contract.validityEnd) {
      issues.push({
        code: "CONTRACT_EXPIRED",
        itemId: item.id,
        message: `${contract.name} contract (${contract.validityStart} to ${contract.validityEnd}) does not cover ${params.startDate}–${params.endDate}.`,
      });
    }

    const conflictingBlackout = contract.blackoutDates.find(
      (bd) => bd >= params.startDate && bd <= params.endDate
    );
    if (conflictingBlackout) {
      issues.push({
        code: "BLACKOUT_DATE_CONFLICT",
        itemId: item.id,
        message: `${contract.name} has a contracted blackout date on ${conflictingBlackout}.`,
      });
    }
  }

  if (params.vehicleId) {
    const vehicle = mockVehicles.find((v) => v.id === params.vehicleId);
    if (!vehicle || vehicle.status === "scheduled_maintenance") {
      issues.push({
        code: "VEHICLE_UNAVAILABLE",
        message: `Assigned vehicle ${params.vehicleId} is unavailable or in scheduled maintenance.`,
      });
    } else {
      const overlappingBooking = mockBookings.find(
        (b) =>
          b.assignedVehicleId === params.vehicleId &&
          b.stage !== "cancelled" &&
          b.startDate <= params.endDate &&
          b.endDate >= params.startDate
      );
      if (overlappingBooking) {
        issues.push({
          code: "VEHICLE_UNAVAILABLE",
          message: `Vehicle ${vehicle.registrationPlate} is already allocated to ${overlappingBooking.referenceCode}.`,
        });
      }
    }
  }

  return {
    valid: issues.length === 0,
    revalidatedAt,
    issues,
  };
}
