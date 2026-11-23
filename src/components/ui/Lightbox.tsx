"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Camera, MapPin, User } from "lucide-react";
import { GalleryItem } from "@/types";

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const currentItem = items[currentIndex];

  const handleNext = useCallback(() => {
    if (items.length > 0) {
      onNavigate((currentIndex + 1) % items.length);
    }
  }, [currentIndex, items.length, onNavigate]);

  const handlePrev = useCallback(() => {
    if (items.length > 0) {
      onNavigate((currentIndex - 1 + items.length) % items.length);
    }
  }, [currentIndex, items.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Gallery image: ${currentItem.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300"
    >
      {/* Top action bar */}
      <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-white text-xs tracking-widest uppercase font-mono">
          <span className="text-gold-400 font-bold">{currentIndex + 1}</span> / {items.length}
        </div>
        <button
          onClick={onClose}
          aria-label="Close lightbox (Esc)"
          className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Previous image (Left arrow)"
        className="absolute left-4 z-40 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-gold-400"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next image (Right arrow)"
        className="absolute right-4 z-40 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-gold-400"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Main Image Container */}
      <div className="relative w-full h-full max-w-6xl max-h-[85vh] p-4 flex flex-col items-center justify-center">
        <div className="relative w-full h-[65vh] sm:h-[72vh]">
          <Image
            src={currentItem.imageUrl}
            alt={currentItem.caption || currentItem.title}
            fill
            sizes="100vw"
            priority
            className="object-contain"
          />
        </div>

        {/* Editorial Caption & Details Box */}
        <div className="mt-4 w-full max-w-3xl text-center px-4">
          <h3 className="font-serif text-xl sm:text-2xl text-white font-normal mb-1">
            {currentItem.title}
          </h3>
          <p className="text-sm text-safari-sand/80 font-light mb-3 line-clamp-2">
            {currentItem.caption}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-safari-sand/60">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              {currentItem.location}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-gold-400" />
              {currentItem.photographerCredit}
            </span>
            {currentItem.cameraSettings && (
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Camera className="w-3.5 h-3.5 text-gold-400" />
                {currentItem.cameraSettings}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
