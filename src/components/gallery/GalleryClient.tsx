"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Maximize2, Camera, MapPin, Sparkles } from "lucide-react";
import { GalleryItem, GalleryCategory } from "@/types";
import { Lightbox } from "@/components/ui/Lightbox";

interface GalleryClientProps {
  initialItems: GalleryItem[];
}

export const GalleryClient: React.FC<GalleryClientProps> = ({ initialItems }) => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories: { label: string; value: GalleryCategory }[] = [
    { label: "All Dispatches", value: "all" },
    { label: "Wildlife & Predators", value: "wildlife" },
    { label: "Savanna Landscapes", value: "landscapes" },
    { label: "Coastal & Marine", value: "coastal" },
    { label: "Luxury Camps & Lodges", value: "camps" },
    { label: "Culture & Heritage", value: "culture" },
  ];

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return initialItems;
    return initialItems.filter((item) => item.category === activeCategory);
  }, [initialItems, activeCategory]);

  const handleOpenLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
              activeCategory === cat.value
                ? "bg-gold-400 text-safari-night font-bold shadow-md"
                : "bg-safari-card border border-safari-border text-safari-sand hover:border-gold-400/50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Responsive Editorial Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => (
          <article
            key={item.id}
            onClick={() => handleOpenLightbox(idx)}
            className="group relative h-96 rounded overflow-hidden cursor-pointer bg-safari-card border border-safari-border shadow-luxury hover:border-gold-400/40 transition-all duration-500"
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-safari-night via-transparent to-black/30 opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Top location tag */}
            <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-safari-sand border border-white/10">
              <MapPin className="w-3 h-3 text-gold-400" />
              <span>{item.location}</span>
            </div>

            {/* Zoom icon button */}
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white inline-block">
                <Maximize2 className="w-4 h-4" />
              </span>
            </div>

            {/* Bottom editorial metadata & caption */}
            <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col justify-end text-white">
              <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 block mb-1">
                {item.category}
              </span>
              <h3 className="font-serif text-2xl font-normal leading-snug group-hover:text-gold-200 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-safari-sand/80 font-light mt-1.5 line-clamp-2 leading-relaxed">
                {item.caption}
              </p>

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-safari-sand/60">
                <span>By {item.photographerCredit}</span>
                {item.cameraSettings && (
                  <span className="hidden sm:inline text-gold-400/80">{item.cameraSettings.split("·")[0]}</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Accessible Lightbox Component */}
      <Lightbox
        items={filteredItems}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentIndex}
      />
    </div>
  );
};
