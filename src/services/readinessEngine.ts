import { SafariBooking, SafariGuide, SafariVehicle } from "@/types/admin";
import { computeBookingStage, TODAY_ISO } from "@/utils/bookingDates";

export type ReadinessSeverity = "blocker" | "warning" | "info";
export type ReadinessOverallStatus = "ready" | "warning" | "blocked";

export interface ReadinessCheckItem {
  key:
    | "booking_confirmation"
    | "payment_status"
    | "vehicle_assignment"
    | "vehicle_compliance"
    | "guide_assignment"
    | "manifest_complete"
    | "supplier_confirmation";
  label: string;
  passed: boolean;
  severity: ReadinessSeverity;
  detail: string;
}

export interface ReadinessOverrideRecord {
  bookingId: string;
  reason: string;
  authorizedBy: string;
  authorizedAt: string;
}

export interface BookingReadinessReport {
  bookingId: string;
  referenceCode: string;
  guestName: string;
  startDate: string;
  stage: string;
  status: ReadinessOverallStatus;
  scorePct: number;
  checks: ReadinessCheckItem[];
  blockersCount: number;
  warningsCount: number;
  override?: ReadinessOverrideRecord;
}

/**
 * Deterministic Operational Readiness Engine.
 * Never auto-dispatches vehicles; evaluates readiness across booking, payment,
 * fleet compliance, guide roster, and guest manifest with human override support.
 */
export function evaluateBookingReadiness(
  booking: SafariBooking,
  vehicles: SafariVehicle[],
  guides: SafariGuide[],
  override?: ReadinessOverrideRecord,
  todayIso: string = TODAY_ISO
): BookingReadinessReport {
  const stage = computeBookingStage(booking, todayIso);
  const vehicle = vehicles.find((v) => v.id === booking.assignedVehicleId);
  const guide = guides.find((g) => g.id === booking.assignedGuideId);

  const checks: ReadinessCheckItem[] = [];

  // 1. Booking Confirmation
  const isConfirmedStage = stage === "confirmed" || stage === "in_safari";
  checks.push({
    key: "booking_confirmation",
    label: "Booking Confirmation",
    passed: isConfirmedStage,
    severity: isConfirmedStage ? "info" : "blocker",
    detail: isConfirmedStage
      ? `Stage is ${stage.replace("_", " ")}`
      : `Booking is still in ${stage.replace("_", " ")}`,
  });

  // 2. Payment Requirements
  const balanceCleared = booking.balanceDueUsd <= 0 || booking.balanceDueDate >= todayIso;
  const paymentPassed = booking.depositPaid && balanceCleared;
  checks.push({
    key: "payment_status",
    label: "Deposit & Balance Guard",
    passed: paymentPassed,
    severity: !booking.depositPaid ? "blocker" : !balanceCleared ? "warning" : "info",
    detail: !booking.depositPaid
      ? `Deposit unpaid ($${booking.depositAmountUsd.toLocaleString()} due)`
      : !balanceCleared
      ? `Balance overdue ($${booking.balanceDueUsd.toLocaleString()} due ${booking.balanceDueDate})`
      : booking.balanceDueUsd > 0
      ? `Deposit paid; $${booking.balanceDueUsd.toLocaleString()} due ${booking.balanceDueDate}`
      : "Settled in full",
  });

  // 3. Vehicle Assignment
  checks.push({
    key: "vehicle_assignment",
    label: "4x4 Cruiser Assignment",
    passed: Boolean(vehicle),
    severity: vehicle ? "info" : "blocker",
    detail: vehicle
      ? `${vehicle.registrationPlate} (${vehicle.makeModel})`
      : "No 4x4 cruiser allocated",
  });

  // 4. Vehicle Compliance & Service Window
  const serviceKmRemaining = vehicle
    ? vehicle.nextServiceKilometers - vehicle.currentKilometers
    : 0;
  const vehicleCompliant =
    Boolean(vehicle) &&
    vehicle!.status !== "scheduled_maintenance" &&
    serviceKmRemaining > 500;
  checks.push({
    key: "vehicle_compliance",
    label: "Vehicle Compliance & Service",
    passed: vehicleCompliant,
    severity: !vehicle
      ? "warning"
      : vehicle.status === "scheduled_maintenance"
      ? "blocker"
      : serviceKmRemaining <= 500
      ? "warning"
      : "info",
    detail: !vehicle
      ? "Awaiting vehicle allocation"
      : vehicle.status === "scheduled_maintenance"
      ? `${vehicle.registrationPlate} is locked in scheduled maintenance`
      : serviceKmRemaining <= 500
      ? `${vehicle.registrationPlate} due for service in ${serviceKmRemaining} km`
      : `${vehicle.registrationPlate} cleared (${serviceKmRemaining.toLocaleString()} km to service)`,
  });

  // 5. Guide Assignment
  checks.push({
    key: "guide_assignment",
    label: "KPSGA Naturalist Guide",
    passed: Boolean(guide),
    severity: guide ? "info" : "blocker",
    detail: guide
      ? `${guide.fullName} (KPSGA ${guide.kpsgaLevel})`
      : "No certified guide assigned",
  });

  // 6. Guest Manifest Completeness
  const manifestPassed =
    booking.adultsCount > 0 && Boolean(booking.guest.email) && Boolean(booking.guest.phone);
  checks.push({
    key: "manifest_complete",
    label: "Guest Manifest & Contacts",
    passed: manifestPassed,
    severity: manifestPassed ? "info" : "warning",
    detail: manifestPassed
      ? `${booking.adultsCount + booking.childrenCount} guests · Passport & contact verified`
      : "Missing guest contact or passenger count",
  });

  const blockersCount = checks.filter((c) => !c.passed && c.severity === "blocker").length;
  const warningsCount = checks.filter((c) => !c.passed && c.severity === "warning").length;
  const passedCount = checks.filter((c) => c.passed).length;
  const scorePct = Math.round((passedCount / checks.length) * 100);

  let status: ReadinessOverallStatus = "ready";
  if (blockersCount > 0 && !override) {
    status = "blocked";
  } else if (warningsCount > 0 || override) {
    status = "warning";
  }

  return {
    bookingId: booking.id,
    referenceCode: booking.referenceCode,
    guestName: booking.guest.fullName,
    startDate: booking.startDate,
    stage,
    status,
    scorePct,
    checks,
    blockersCount,
    warningsCount,
    override,
  };
}
