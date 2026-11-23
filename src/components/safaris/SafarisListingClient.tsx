"use client";

import React, { useState, useMemo } from "react";
import { SafariPackage } from "@/types";
import { PackageFilterBar } from "@/components/safaris/PackageFilterBar";
import { PackageCard } from "@/components/safaris/PackageCard";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SafarisListingClientProps {
  initialPackages: SafariPackage[];
  allDestinations: string[];
  allExperienceTypes: string[];
}

export const SafarisListingClient: React.FC<SafarisListingClientProps> = ({
  initialPackages,
  allDestinations,
  allExperienceTypes,
}) => {
  const [selectedDestination, setSelectedDestination] = useState<string>("all");
  const [selectedDuration, setSelectedDuration] = useState<"all" | "short" | "medium" | "extended">("all");
  const [selectedExperience, setSelectedExperience] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPackages = useMemo(() => {
    return initialPackages.filter((pkg) => {
      // 1. Destination filter
      if (selectedDestination !== "all") {
        const matchesDest = pkg.destinations.some(
          (d) => d.toLowerCase() === selectedDestination.toLowerCase()
        );
        if (!matchesDest) return false;
      }

      // 2. Duration filter
      if (selectedDuration !== "all") {
        if (selectedDuration === "short" && pkg.durationDays > 4) return false;
        if (selectedDuration === "medium" && (pkg.durationDays < 5 || pkg.durationDays > 7)) return false;
        if (selectedDuration === "extended" && pkg.durationDays < 8) return false;
      }

      // 3. Experience style filter
      if (selectedExperience !== "all") {
        const matchesExp = pkg.experienceTypes.some(
          (e) => e.toLowerCase() === selectedExperience.toLowerCase()
        );
        if (!matchesExp) return false;
      }

      // 4. Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          pkg.title.toLowerCase().includes(q) ||
          pkg.subtitle.toLowerCase().includes(q) ||
          pkg.overview.toLowerCase().includes(q) ||
          pkg.destinations.some((d) => d.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [initialPackages, selectedDestination, selectedDuration, selectedExperience, searchQuery]);

  const handleReset = () => {
    setSelectedDestination("all");
    setSelectedDuration("all");
    setSelectedExperience("all");
    setSearchQuery("");
  };

  return (
    <div>
      <PackageFilterBar
        destinations={allDestinations}
        experienceTypes={allExperienceTypes}
        selectedDestination={selectedDestination}
        selectedDuration={selectedDuration}
        selectedExperience={selectedExperience}
        searchQuery={searchQuery}
        onDestinationChange={setSelectedDestination}
        onDurationChange={setSelectedDuration}
        onExperienceChange={setSelectedExperience}
        onSearchChange={setSearchQuery}
        onReset={handleReset}
        resultCount={filteredPackages.length}
      />

      {filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      ) : (
        <div className="bg-safari-card border border-safari-border rounded-lg p-12 text-center text-white space-y-4 my-8">
          <Compass className="w-10 h-10 text-gold-400 mx-auto" />
          <h3 className="font-serif text-2xl font-normal">No Expeditions Match Your Criteria</h3>
          <p className="text-xs text-safari-sand/70 max-w-md mx-auto">
            We specialize in bespoke itineraries. If your preferred combination of days and
            destinations isn’t listed, our Mombasa team will curate it from scratch.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={handleReset}
              className="text-xs font-mono uppercase text-gold-400 hover:underline"
            >
              Reset Filters
            </button>
            <Button href="/contact" variant="primary" size="sm">
              Request Custom Itinerary
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
