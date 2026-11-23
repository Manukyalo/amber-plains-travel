import { SafariBooking, BookingStage } from "@/types/admin";

// Today's date anchor for operations
export const TODAY_ISO = "2026-11-23";

/**
 * Computes end date formatted as YYYY-MM-DD from startDate + durationDays - 1
 */
export function computeEndDate(startDate: string, durationDays: number): string {
  const date = new Date(startDate);
  // Add durationDays - 1 days
  date.setDate(date.getDate() + Math.max(1, durationDays) - 1);
  return date.toISOString().split("T")[0];
}

/**
 * Automatically computes current operational stage based on today's date
 */
export function computeBookingStage(
  booking: SafariBooking,
  today: string = TODAY_ISO
): BookingStage {
  if (booking.stage === "cancelled") return "cancelled";

  const start = booking.startDate;
  const end = booking.endDate || computeEndDate(start, booking.durationDays);

  // If safari is active today
  if (start <= today && today <= end) {
    if (booking.stage === "confirmed" || booking.stage === "in_safari") {
      return "in_safari";
    }
  }

  // If safari ended prior to today, it is completed
  if (end < today) {
    if (booking.stage === "in_safari" || booking.stage === "confirmed") {
      return "completed";
    }
  }

  return booking.stage;
}

/**
 * Returns true if the booking is currently roaming in the field today
 */
export function isBookingInSafariToday(
  booking: SafariBooking,
  today: string = TODAY_ISO
): boolean {
  const start = booking.startDate;
  const end = booking.endDate || computeEndDate(start, booking.durationDays);
  return start <= today && today <= end && booking.stage !== "cancelled";
}

/**
 * Active bookings: not completed or cancelled, and whose end_date >= today
 */
export function isBookingActivePipeline(
  booking: SafariBooking,
  today: string = TODAY_ISO
): boolean {
  const end = booking.endDate || computeEndDate(booking.startDate, booking.durationDays);
  const stage = computeBookingStage(booking, today);
  return stage !== "completed" && stage !== "cancelled" && end >= today;
}

/**
 * Filter upcoming field departures: start_date >= today, sorted ascending, limit 5
 */
export function getUpcomingDepartures(
  bookings: SafariBooking[],
  today: string = TODAY_ISO,
  limit: number = 5
): SafariBooking[] {
  return bookings
    .filter((b) => b.startDate >= today && b.stage !== "cancelled")
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit);
}
