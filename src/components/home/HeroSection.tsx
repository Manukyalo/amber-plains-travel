"use client";

import React from "react";
import Image from "next/image";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#1C1614]">
      {/* Full-bleed Edge-to-Edge Golden-Hour Safari Photography */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bechti8810.jpg"
          alt="Wild leopard resting in the East African savanna trees - Amber Plains Safaris"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] sm:object-center transition-transform duration-[20000ms] animate-ken-burns will-change-transform"
        />

        {/* Faint, delicate top gradient to keep navigation crisp */}
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/40 via-black/10 to-transparent pointer-events-none" />

        {/* Light warm bottom gradient (approx rgba(0,0,0,0.15)) preserving the sunlit golden tone */}
        <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Spacer to balance vertical centering */}
      <div className="h-24 sm:h-28" />

      {/* Main Editorial Headline - Centered Horizontally & Slightly Above Mid-Height */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto my-auto">
        <h1 className="font-serif font-light text-white text-[clamp(3.5rem,8.5vw,7.5rem)] leading-[0.98] tracking-normal text-center select-none animate-headline-fade drop-shadow-[0_2px_16px_rgba(0,0,0,0.25)]">
          Where the Coast
          <br />
          Meets the Wild
        </h1>
      </div>

      {/* Single-line Small Serif Tagline - Centered at Bottom of Hero */}
      <div className="relative z-20 pb-8 sm:pb-12 px-6 sm:px-12 flex items-center justify-center w-full">
        <p className="font-serif text-sm sm:text-base text-white/90 font-light tracking-wide text-center drop-shadow-sm max-w-xl">
          Bespoke East African wilderness expeditions, guided with quiet precision.
        </p>

        {/* Quiet Details: Fine Geometric Line-Art Motif & 1px Animated Scroll Line */}
        <div className="absolute right-6 sm:right-12 bottom-7 sm:bottom-10 hidden md:flex items-end gap-3 pointer-events-none select-none">
          <div className="opacity-20 text-white pb-0.5" aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="14"
                cy="14"
                r="13"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeDasharray="2 2"
              />
              <circle cx="14" cy="14" r="4.5" stroke="currentColor" strokeWidth="0.75" />
              <line x1="14" y1="1" x2="14" y2="27" stroke="currentColor" strokeWidth="0.75" />
              <line x1="1" y1="14" x2="27" y2="14" stroke="currentColor" strokeWidth="0.75" />
            </svg>
          </div>

          <div className="flex flex-col items-center gap-1.5" aria-hidden="true">
            <span className="text-[9px] font-sans tracking-widest text-white/50 uppercase">
              Scroll
            </span>
            <div className="w-[1px] h-10 bg-white/70 animate-scroll-line" />
          </div>
        </div>
      </div>
    </section>
  );
};
