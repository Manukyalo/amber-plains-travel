import { NextRequest, NextResponse } from "next/server";
import { enquirySchema } from "@/types";

// In-memory sliding rate limiter for production stability
const ipRequestTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 6;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequestTimestamps.get(ip) || [];
  const validTimestamps = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  ipRequestTimestamps.set(ip, validTimestamps);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          error: "Too many enquiries submitted from this network. Please wait a moment or reach our duty desk directly on WhatsApp.",
          code: "RATE_LIMITED",
          status: 429,
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // 1. Zod runtime schema validation
    const validationResult = enquirySchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          error: "Please complete all mandatory expedition fields correctly.",
          code: "VALIDATION_ERROR",
          status: 422,
          errors: fieldErrors,
        },
        { status: 422 }
      );
    }

    const data = validationResult.data;

    // 2. Anti-spam honeypot evaluation (silent drop)
    if (data.honeypot && data.honeypot.trim().length > 0) {
      // Fake delay to throttle bot scrapers
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return NextResponse.json(
        {
          success: true,
          referenceNumber: `AP-${Date.now().toString().slice(-6)}`,
          message: "Thank you for contacting Amber Plains Travel.",
        },
        { status: 200 }
      );
    }

    // 3. Generate genuine booking enquiry reference
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `APT-${new Date().getFullYear()}-${randomSuffix}`;

    // 4. In Phase 2, this is persisted to Supabase / PostgreSQL and dispatched to notification webhooks.
    // We log structured data server-side without exposing guest PII in client responses.
    console.info(`[Safari Enquiry Received] Ref: ${referenceNumber} | Destination: ${data.packageOrDestination} | Adults: ${data.adultsCount} | Dates: ${data.preferredDates}`);

    return NextResponse.json(
      {
        success: true,
        referenceNumber,
        message: "Your safari enquiry has been securely registered with our Mombasa expedition planners. A Senior Safari Director will review your dates and respond with tailored proposals within 12 hours.",
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("[Enquiry Handler Error]", err);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while transmitting your enquiry. Please reach us via WhatsApp or phone.",
        code: "INTERNAL_ERROR",
        status: 500,
      },
      { status: 500 }
    );
  }
}
