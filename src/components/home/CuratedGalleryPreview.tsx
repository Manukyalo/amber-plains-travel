"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Maximize2, ArrowRight } from "lucide-react";
import { GalleryItem } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Lightbox } from "@/components/ui/Lightbox";
import { Button } from "@/components/ui/Button";

interface CuratedGalleryPreviewProps {
  items: GalleryItem[];
}

export const CuratedGalleryPreview: React.FC<CuratedGalleryPreviewProps> = ({ items }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpenLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-20 lg:py-28 bg-safari-cream text-safari-night">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeading
            eyebrow="Visual Dispatches"
            title="The African Light"
            description="Captured through the viewfinders of our naturalists, guests, and expedition directors across Kenya."
            align="left"
            theme="light"
            className="mb-0"
          />

          <div className="mt-6 md:mt-0">
            <Button
              href="/gallery"
              variant="secondary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Enter Full Gallery
            </Button>
          </div>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map((item, idx) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(idx)}
              className="group relative h-80 rounded overflow-hidden cursor-pointer bg-safari-night shadow-editorial"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-safari-night/90 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Hover overlay with details */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-end">
                  <span className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>

                <div className="text-white">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 block mb-1">
                    {item.location}
                  </span>
                  <h4 className="font-serif text-xl font-normal leading-snug">{item.title}</h4>
                  <p className="text-xs text-safari-sand/80 font-light mt-1 line-clamp-1">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessible Lightbox */}
      <Lightbox
        items={items}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentIndex}
      />
    </section>
  );
};
