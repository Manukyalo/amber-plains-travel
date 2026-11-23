import React from "react";
import { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedPackages } from "@/components/home/FeaturedPackages";
import { DestinationsDiscovery } from "@/components/home/DestinationsDiscovery";
import { ExperiencesGrid } from "@/components/home/ExperiencesGrid";
import { CuratedGalleryPreview } from "@/components/home/CuratedGalleryPreview";
import { BrandStory } from "@/components/home/BrandStory";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { AppPromoSection } from "@/components/home/AppPromoSection";
import { EnquiryCtaSection } from "@/components/home/EnquiryCtaSection";

import { packageService } from "@/services/packageService";
import { destinationService } from "@/services/destinationService";
import { experienceService } from "@/services/experienceService";
import { galleryService } from "@/services/galleryService";
import { testimonialService } from "@/services/testimonialService";

export const metadata: Metadata = {
  title: "Amber Plains Travel | Bespoke East African Safaris & Coastal Expeditions",
  description:
    "Private luxury safaris departing Mombasa and Diani Beach. Experience Tsavo's red elephants, Amboseli under Mount Kilimanjaro, and the Maasai Mara migration.",
};

export default async function HomePage() {
  const [featuredPackages, destinations, experiences, galleryItems, testimonials] =
    await Promise.all([
      packageService.getFeaturedPackages(),
      destinationService.getFeaturedDestinations(),
      experienceService.getAllExperiences(),
      galleryService.getCuratedPreview(6),
      testimonialService.getAllTestimonials(),
    ]);

  return (
    <>
      {/* 1. Cinematic Hero with full-bleed photography, minimal navigation & Explore actions */}
      <HeroSection />

      {/* 2. Featured safari packages sourced from structured package data */}
      <FeaturedPackages packages={featuredPackages} />

      {/* 3. Destination discovery with editorial imagery */}
      <DestinationsDiscovery destinations={destinations} />

      {/* 4. Experiences and travel styles */}
      <ExperiencesGrid experiences={experiences} />

      {/* 5. Curated gallery preview with keyboard-accessible lightbox */}
      <CuratedGalleryPreview items={galleryItems} />

      {/* 6. Brand story / why travel with us */}
      <BrandStory />

      {/* 7. Approved & verified safari testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 9. Premium 'Get the app' promotion */}
      <AppPromoSection />

      {/* 8. Enquiry CTA and refined footer (Footer rendered in root layout) */}
      <EnquiryCtaSection />
    </>
  );
}
