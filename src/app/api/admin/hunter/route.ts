import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { mockCompetitors } from "@/data/adminMockData";

const analyzeCompetitorSchema = z.object({
  targetUrl: z.string().url("Please provide a valid competitor URL"),
  competitorName: z.string().min(2),
  marketTier: z.enum(["budget_group", "mid_range", "ultra_luxury_direct"]).default("mid_range"),
});

export async function GET() {
  return NextResponse.json({
    success: true,
    competitors: mockCompetitors,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = analyzeCompetitorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid competitor URL or parameters", code: "VALIDATION_ERROR", status: 422 },
        { status: 422 }
      );
    }

    const { targetUrl, competitorName, marketTier } = parsed.data;

    // Simulate structured public inspection conforming to ethical crawl rules
    const newObservation = {
      id: `comp-${Date.now()}`,
      companyName: competitorName,
      publicWebsiteUrl: targetUrl,
      marketTier,
      focusRegions: ["Tsavo", "Amboseli", "Mombasa Coast"],
      lastObservedAt: new Date().toISOString(),
      robotsTxtStatus: "allowed" as const,
      observablePackagesCount: 14,
      observedPriceRangeUsd: { min: 850, max: 5400 },
      observedFeatures: ["Public pricing table", "Fixed departures", "Standard enquiry form"],
      detectedSeoGaps: ["Missing structured TouristTrip schema", "No offline companion app mention"],
      aiRecommendations: [
        {
          title: "Promote Offline Field App Advantage",
          opportunity: `${competitorName} provides no mobile offline itinerary caching for bush guests.`,
          suggestedAction: "Highlight Amber Plains Companion App's offline maps in Tsavo itineraries.",
          effort: "low" as const,
          impact: "high" as const,
          confidenceScore: 0.91,
          approvedByAdmin: false,
        },
      ],
    };

    return NextResponse.json(
      {
        success: true,
        message: "Public competitor inspection completed. No access controls were bypassed.",
        observation: newObservation,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("[Hunter API Error]", err);
    return NextResponse.json(
      { error: "Failed to process competitor inspection", code: "HUNTER_ERROR", status: 500 },
      { status: 500 }
    );
  }
}
