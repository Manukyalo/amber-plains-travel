import { NextRequest, NextResponse } from "next/server";
import { appNotifySchema } from "@/types";

const notifyIpTimestamps = new Map<string, number[]>();
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const stamps = notifyIpTimestamps.get(ip) || [];
  const valid = stamps.filter((t) => now - t < WINDOW_MS);

  if (valid.length >= MAX_PER_WINDOW) {
    return true;
  }
  valid.push(now);
  notifyIpTimestamps.set(ip, valid);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute.", code: "RATE_LIMITED", status: 429 },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = appNotifySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address.",
          code: "VALIDATION_ERROR",
          status: 422,
          errors: result.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const data = result.data;
    if (data.honeypot && data.honeypot.trim().length > 0) {
      return NextResponse.json({ success: true, message: "Subscription received." }, { status: 200 });
    }

    console.info(`[App Notification Waitlist] Registered: ${data.email} | Platform: ${data.devicePlatform}`);

    return NextResponse.json(
      {
        success: true,
        message: "You are on the VIP guest list. As soon as the Amber Plains Companion App launches on the App Store & Google Play, we will send your private activation code.",
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("[App Notify Route Error]", err);
    return NextResponse.json(
      { error: "Unable to process subscription.", code: "INTERNAL_ERROR", status: 500 },
      { status: 500 }
    );
  }
}
