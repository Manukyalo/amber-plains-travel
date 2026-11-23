import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SafariPackage } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PackageCard } from "@/components/safaris/PackageCard";
import { Button } from "@/components/ui/Button";

interface FeaturedPackagesProps {
  packages: SafariPackage[];
}

export const FeaturedPackages: React.FC<FeaturedPackagesProps> = ({ packages }) => {
  return (
    <section className="py-20 lg:py-28 bg-safari-night text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <SectionHeading
            eyebrow="Signature Expeditions"
            title="Curated Private Safaris"
            description="Meticulously choreographed overland journeys and fly-in wing safaris departing directly from Mombasa, Diani Beach, and private coastal airstrips."
            align="left"
            theme="dark"
            className="mb-0"
          />

          <div className="mt-6 md:mt-0">
            <Button
              href="/safaris"
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View All Safaris
            </Button>
          </div>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.slice(0, 3).map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};
