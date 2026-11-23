import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Compass } from "lucide-react";
import { destinationService } from "@/services/destinationService";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Destinations & Sanctuaries | Amber Plains Travel",
  description:
    "Explore East Africa’s prime wildlife sanctuaries: Tsavo, Amboseli, Maasai Mara, and the Swahili Coast with Amber Plains Travel.",
  alternates: {
    canonical: "https://amberplains.co.ke/destinations",
  },
};

export default async function DestinationsPage() {
  const destinations = await destinationService.getAllDestinations();

  return (
    <div className="pt-32 pb-24 bg-safari-night text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Geographic Sanctuaries"
          title="The Wilderness of East Africa"
          description="From our native coral shores in Mombasa to the ancient volcano slopes of Kilimanjaro and the predator-dense Mara river valleys."
          align="center"
          theme="dark"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
          {destinations.map((dest) => (
            <article
              key={dest.id}
              className="group bg-safari-card border border-safari-border rounded overflow-hidden flex flex-col justify-between hover:border-gold-400/40 transition-colors shadow-luxury"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-safari-dark">
                <Image
                  src={dest.heroImage}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-safari-night via-transparent to-transparent" />

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-safari-night/80 backdrop-blur-md text-[10px] font-mono uppercase tracking-widest text-gold-400 border border-white/10">
                  {dest.region}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="font-serif text-3xl text-white font-normal group-hover:text-gold-200 transition-colors">
                    <Link href={`/destinations/${dest.slug}`}>{dest.name}</Link>
                  </h3>
                  <p className="text-sm font-light text-safari-sand/85 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    {dest.wildlifeHighlights.map((wildlife, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono text-safari-sand/70 bg-white/5 border border-white/5 px-2.5 py-0.5 rounded"
                      >
                        {wildlife}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-safari-border flex items-center justify-between">
                  <div className="text-xs font-mono text-safari-sand/60">
                    <span>Mombasa Transit: </span>
                    <span className="text-gold-400">{dest.distanceFromMombasa}</span>
                  </div>

                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gold-400 hover:text-gold-300"
                  >
                    Explore Region <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
