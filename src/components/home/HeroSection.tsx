"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-safari-night">
      {/* Full-bleed Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2400&q=85"
          alt="Amber Plains safari land cruiser in the vast golden savanna of East Africa at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.82] contrast-[1.05]"
        />
        {/* Editorial Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-safari-night via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center flex flex-col items-center">
        {/* Subtle Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-gold-300 text-[11px] font-mono tracking-widest uppercase mb-6 animate-fadeIn">
          <Sparkles className="w-3 h-3 text-gold-400" />
          <span>Mombasa & East Africa · Bespoke Wilderness</span>
        </div>

        {/* Editorial Serif Headline (Inspired by the visual reference) */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-normal tracking-tight leading-[1.08] mb-6 drop-shadow-md">
          Sanctuary of <br />
          <span className="italic font-light text-gold-200">Untamed Miracles</span>
        </h1>

        {/* Concise Supporting Copy */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl font-light text-safari-sand/90 leading-relaxed mb-10 drop-shadow">
          The essence of stillness, wildlife communion, and an unhurried sense of place.
          Private bespoke safaris seamlessly bridging Kenya’s Swahili coast with the great plains
          of Tsavo, Amboseli, and the Mara.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            href="/safaris"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Safaris
          </Button>

          <Button
            href="/contact"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto backdrop-blur-sm"
          >
            Plan Bespoke Itinerary
          </Button>
        </div>

        {/* Quiet Authority Footnote */}
        <div className="mt-14 flex items-center justify-center gap-6 text-[11px] font-mono tracking-wider uppercase text-safari-sand/70">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" /> KATO Bonded
          </span>
          <span className="text-white/30">•</span>
          <span>Private 4x4 Cruisers</span>
          <span className="text-white/30">•</span>
          <span>Mombasa Headquarters</span>
        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <div className="absolute bottom-6 inset-x-0 z-10 flex flex-col items-center justify-center pointer-events-none opacity-70 hover:opacity-100 transition-opacity">
        <span className="text-[10px] uppercase font-mono tracking-widest text-safari-sand/60 mb-1">
          Scroll to Discover
        </span>
        <ChevronDown className="w-4 h-4 text-gold-400 animate-bounce" />
      </div>
    </section>
  );
};
