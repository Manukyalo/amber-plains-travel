import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Destination } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface DestinationsDiscoveryProps {
  destinations: Destination[];
}

export const DestinationsDiscovery: React.FC<DestinationsDiscoveryProps> = ({ destinations }) => {
  return (
    <section className="py-20 lg:py-28 bg-safari-cream text-safari-night">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Sanctuaries & Territories"
          title="Untamed East Africa"
          description="From the ancient volcanic red earth of Tsavo to the snowcap of Mount Kilimanjaro and the world’s greatest predator arena in the Mara."
          align="center"
          theme="light"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group relative h-[420px] rounded overflow-hidden flex flex-col justify-end p-6 bg-safari-night transition-all duration-500 shadow-editorial"
            >
              <Image
                src={dest.heroImage}
                alt={dest.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.75] group-hover:brightness-[0.65]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-safari-night via-safari-night/40 to-transparent" />

              <div className="relative z-10">
                <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 block mb-1">
                  {dest.region}
                </span>
                <h3 className="font-serif text-2xl text-white font-normal group-hover:text-gold-200 transition-colors flex items-center justify-between">
                  <span>{dest.name}</span>
                  <ArrowUpRight className="w-5 h-5 text-gold-400 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all" />
                </h3>
                <p className="text-xs text-safari-sand/80 font-light mt-2 line-clamp-2">
                  {dest.tagline}
                </p>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-safari-sand/70">
                  <span>From Mombasa:</span>
                  <span className="text-gold-300">{dest.distanceFromMombasa.split("/")[0]}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
