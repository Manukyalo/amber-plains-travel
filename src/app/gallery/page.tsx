import React from "react";
import { Metadata } from "next";
import { galleryService } from "@/services/galleryService";
import { GalleryClient } from "@/components/gallery/GalleryClient";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Visual Gallery & Dispatches | Amber Plains Travel",
  description:
    "Curated photography from the African wild: Tsavo's red elephants, Amboseli tusker bulls, Mara big cats, and Swahili coastal dhows.",
  alternates: {
    canonical: "https://amberplains.co.ke/gallery",
  },
};

export default async function GalleryPage() {
  const items = await galleryService.getGalleryItems("all");

  return (
    <div className="pt-32 pb-24 bg-safari-night text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Visual Dispatches"
          title="The Light of East Africa"
          description="A living photographic chronicle of wildlife encounters, savanna sunsets, luxury tented sanctuaries, and coastal marine voyages."
          align="center"
          theme="dark"
        />

        <GalleryClient initialItems={items} />
      </div>
    </div>
  );
}
