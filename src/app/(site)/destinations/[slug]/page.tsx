import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Sun, Calendar, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { destinationService } from "@/services/destinationService";
import { packageService } from "@/services/packageService";
import { PackageCard } from "@/components/safaris/PackageCard";
import { Button } from "@/components/ui/Button";

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dest = await destinationService.getDestinationBySlug(slug);

  if (!dest) {
    return { title: "Destination Not Found" };
  }

  return {
    title: dest.metaTitle || `${dest.name} | Amber Plains Travel`,
    description: dest.metaDescription || dest.description,
    alternates: {
      canonical: `https://amberplains.co.ke/destinations/${dest.slug}`,
    },
    openGraph: {
      title: dest.name,
      description: dest.tagline,
      images: [{ url: dest.heroImage }],
    },
  };
}

export async function generateStaticParams() {
  const destinations = await destinationService.getAllDestinations();
  return destinations.map((d) => ({ slug: d.slug }));
}

export default async function DestinationDetailPage({ params }: DestinationPageProps) {
  const { slug } = await params;
  const [dest, allPackages] = await Promise.all([
    destinationService.getDestinationBySlug(slug),
    packageService.getAllPackages(),
  ]);

  if (!dest) {
    notFound();
  }

  // Find safari packages that feature this destination
  const relatedPackages = allPackages.filter((pkg) =>
    pkg.destinations.some((d) =>
      dest.name.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(dest.name.toLowerCase().split(" ")[0])
    )
  );

  return (
    <div className="bg-safari-night text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] lg:min-h-[70vh] flex items-end justify-center overflow-hidden">
        <Image
          src={dest.heroImage}
          alt={dest.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-safari-night via-safari-night/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <div className="max-w-3xl space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-gold-400/20 backdrop-blur-md border border-gold-400/40 text-gold-300 text-xs font-mono uppercase tracking-widest inline-block">
              {dest.region}
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-tight">
              {dest.name}
            </h1>

            <p className="text-base sm:text-lg text-safari-sand/90 font-light leading-relaxed">
              {dest.tagline}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Quick Facts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-lg bg-safari-card border border-safari-border text-xs font-mono">
          <div className="flex items-start gap-3">
            <Sun className="w-5 h-5 text-gold-400 shrink-0" />
            <div>
              <span className="text-safari-sand/50 block mb-1">CLIMATE & ATMOSPHERE</span>
              <span className="text-white font-serif text-sm">{dest.climate}</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gold-400 shrink-0" />
            <div>
              <span className="text-safari-sand/50 block mb-1">PRIME VIEWING SEASON</span>
              <span className="text-white font-serif text-sm">{dest.bestTimeToVisit}</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gold-400 shrink-0" />
            <div>
              <span className="text-safari-sand/50 block mb-1">TRANSIT FROM MOMBASA</span>
              <span className="text-white font-serif text-sm">{dest.distanceFromMombasa}</span>
            </div>
          </div>
        </div>

        {/* Narrative & Wildlife Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-serif text-3xl text-white font-normal">Ecological Portrait</h2>
            <div className="w-12 h-px bg-gold-400" />
            <p className="text-base font-light text-safari-sand/85 leading-relaxed">
              {dest.description}
            </p>

            <div className="pt-4 space-y-3">
              <h3 className="font-serif text-2xl text-white font-normal">Wildlife Highlights</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {dest.wildlifeHighlights.map((animal, i) => (
                  <div
                    key={i}
                    className="p-3 bg-safari-card border border-safari-border rounded flex items-center gap-2 text-xs font-mono text-safari-sand"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span>{animal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-safari-card border border-safari-border rounded-lg p-6 space-y-5">
            <h4 className="font-serif text-xl text-white font-normal">Plan a Trip to {dest.name}</h4>
            <p className="text-xs text-safari-sand/70 font-light leading-relaxed">
              We design private custom overland or fly-in charters connecting {dest.name} with your
              coastal beach lodge in Mombasa, Diani, or Watamu.
            </p>
            <Button href="/contact" variant="primary" size="md" className="w-full">
              Enquire About {dest.name}
            </Button>
          </div>
        </div>

        {/* Featured Safaris in this Region */}
        {relatedPackages.length > 0 && (
          <section className="space-y-8 pt-8 border-t border-safari-border">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                  Curated Itineraries
                </span>
                <h3 className="font-serif text-3xl text-white font-normal mt-1">
                  Safaris Featuring {dest.name}
                </h3>
              </div>
              <Link
                href="/safaris"
                className="text-xs font-mono uppercase text-gold-400 hover:text-gold-300 inline-flex items-center gap-1"
              >
                All Packages <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
