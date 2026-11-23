import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Compass, ArrowRight } from "lucide-react";
import { SafariPackage } from "@/types";

interface PackageCardProps {
  pkg: SafariPackage;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  return (
    <article className="group flex flex-col bg-safari-night border border-safari-border rounded overflow-hidden hover:border-gold-400/50 transition-all duration-300 shadow-luxury">
      {/* Visual Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-safari-dark">
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-safari-night via-transparent to-transparent opacity-80" />

        {/* Duration badge */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-safari-night/85 backdrop-blur-md border border-white/10 text-white text-[11px] font-mono tracking-wider">
          <Clock className="w-3 h-3 text-gold-400" />
          <span>{pkg.durationDays} Days / {pkg.durationDays - 1} Nights</span>
        </div>

        {/* Experience Style Badge */}
        {pkg.experienceTypes[0] && (
          <div className="absolute top-4 right-4 inline-flex items-center px-2.5 py-1 rounded-full bg-gold-400/20 backdrop-blur-md border border-gold-400/40 text-gold-300 text-[10px] font-mono uppercase tracking-widest">
            {pkg.experienceTypes[0]}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-1 p-6 flex flex-col justify-between space-y-5">
        <div>
          {/* Route path */}
          <div className="flex items-center gap-1.5 text-gold-400 text-xs font-mono tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{pkg.startLocation} → {pkg.destinations.join(" · ")}</span>
          </div>

          <h3 className="font-serif text-2xl text-white font-normal group-hover:text-gold-200 transition-colors leading-snug">
            <Link href={`/safaris/${pkg.slug}`}>{pkg.title}</Link>
          </h3>

          <p className="text-sm font-light text-safari-sand/75 line-clamp-2 mt-2 leading-relaxed">
            {pkg.subtitle}
          </p>

          {/* Highlights pills */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {pkg.highlights.slice(0, 2).map((highlight, idx) => (
              <span
                key={idx}
                className="text-[11px] text-safari-sand/80 bg-white/5 border border-white/5 px-2.5 py-1 rounded"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & CTA footer */}
        <div className="pt-4 border-t border-safari-border/70 flex items-center justify-between">
          <div>
            <span className="block text-[10px] uppercase font-mono text-safari-sand/50 tracking-wider">
              From
            </span>
            <div className="text-lg font-serif text-white">
              <span className="text-gold-400">${pkg.pricing.indicativeUsd.toLocaleString()}</span>
              <span className="text-xs font-sans text-safari-sand/60 font-light"> / guest</span>
            </div>
          </div>

          <Link
            href={`/safaris/${pkg.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gold-400 hover:text-gold-300 group-hover:translate-x-0.5 transition-transform"
          >
            Itinerary <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
