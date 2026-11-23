import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { mockCallEvents } from "@/data/adminMockData";
import { TelephonyCallEvent } from "@/types/admin";

const telephonyWebhookSchema = z.object({
  callSid: z.string().min(5),
  provider: z.enum(["twilio", "africas_talking", "sip_trunk"]).default("twilio"),
  callerNumber: z.string().min(6),
  callerCountry: z.string().optional(),
  durationSeconds: z.number().int().nonnegative().default(0),
  direction: z.enum(["inbound", "outbound"]).default("inbound"),
  status: z.enum(["completed", "missed", "in_progress", "escalated_to_human"]),
  recordingConsentGiven: z.boolean().default(false),
  transcriptText: z.string().optional(),
  intent: z
    .object({
      callerName: z.string().optional(),
      travelDates: z.string().optional(),
      guestCount: z.number().int().positive().optional(),
      destinationOfInterest: z.string().optional(),
      targetBudgetUsd: z.number().positive().optional(),
      urgency: z.enum(["low", "medium", "urgent_same_day"]).default("medium"),
    })
    .optional(),
  escalationReason: z
    .enum(["human_requested", "complex_budget", "complaint", "uncertain_availability"])
    .optional(),
});

export async function GET() {
  return NextResponse.json({
    success: true,
    totalEvents: mockCallEvents.length,
    callEvents: mockCallEvents,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = telephonyWebhookSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Telephony webhook payload invalid.",
          code: "INVALID_WEBHOOK_PAYLOAD",
          status: 422,
          details: result.error.flatten(),
        },
        { status: 422 }
      );
    }

    const data = result.data;

    // Consent enforcement: if no consent, scrub transcript text for privacy compliance
    const safeTranscript = data.recordingConsentGiven ? data.transcriptText : undefined;

    const eventRecord: TelephonyCallEvent = {
      id: `call-${Date.now()}`,
      callSid: data.callSid,
      provider: data.provider,
      callerNumber: data.callerNumber,
      callerCountry: data.callerCountry || "International / Unknown",
      timestamp: new Date().toISOString(),
      durationSeconds: data.durationSeconds,
      direction: data.direction,
      status: data.status,
      recordingConsentGiven: data.recordingConsentGiven,
      transcriptSnippet: safeTranscript,
      extractedIntent: data.intent,
      escalationReason: data.escalationReason,
      associatedLeadId: data.intent?.callerName ? `lead-${Date.now()}` : undefined,
    };

    console.info(`[Telephony Event Received] CallSid: ${eventRecord.callSid} | Status: ${eventRecord.status} | Urgent: ${eventRecord.extractedIntent?.urgency}`);

    return NextResponse.json(
      {
        success: true,
        message: "Telephony call event processed according to privacy compliance rules.",
        event: eventRecord,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("[Telephony Webhook Error]", err);
    return NextResponse.json(
      { error: "Internal telephony event handler failure", code: "INTERNAL_ERROR", status: 500 },
      { status: 500 }
    );
  }
}
