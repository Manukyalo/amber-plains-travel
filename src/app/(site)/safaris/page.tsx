import React from "react";
import { Metadata } from "next";
import { packageService } from "@/services/packageService";
import { destinationService } from "@/services/destinationService";
import { experienceService } from "@/services/experienceService";
import { SafarisListingClient } from "@/components/safaris/SafarisListingClient";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Safaris & Expeditions | Amber Plains Travel Mombasa",
  description:
    "Explore curated luxury safari itineraries departing Mombasa, Diani, and coastal airstrips into Tsavo, Amboseli, and the Maasai Mara.",
  alternates: {
    canonical: "https://amberplains.co.ke/safaris",
  },
};

export default async function SafarisPage() {
  const packages = await packageService.getAllPackages();

  // Extract unique destinations & experience types for the filter dropdowns
  const allDestinations = Array.from(
    new Set(packages.flatMap((p) => p.destinations))
  ).sort();

  const allExperienceTypes = Array.from(
    new Set(packages.flatMap((p) => p.experienceTypes))
  ).sort();

  return (
    <div className="pt-32 pb-24 bg-safari-night text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Expeditions & Itineraries"
          title="Curated Private Safaris"
          description="Every safari is fully private with dedicated KPSGA-certified Gold naturalists, custom 4x4 Land Cruisers, and bespoke camp accommodations."
          align="center"
          theme="dark"
        />

        <SafarisListingClient
          initialPackages={packages}
          allDestinations={allDestinations}
          allExperienceTypes={allExperienceTypes}
        />
      </div>
    </div>
  );
}
