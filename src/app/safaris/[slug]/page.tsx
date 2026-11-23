import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  MapPin,
  Calendar,
  Check,
  X,
  ShieldCheck,
  Compass,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  Sparkles,
  Bed,
} from "lucide-react";
import { packageService } from "@/services/packageService";
import { PackageItineraryAccordion } from "@/components/safaris/PackageItineraryAccordion";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { Button } from "@/components/ui/Button";

interface PackagePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await packageService.getPackageBySlug(slug);

  if (!pkg) {
    return {
      title: "Safari Package Not Found",
    };
  }

  return {
    title: pkg.metaTitle || `${pkg.title} | Amber Plains Travel`,
    description: pkg.metaDescription || pkg.subtitle,
    alternates: {
      canonical: `https://amberplains.co.ke/safaris/${pkg.slug}`,
    },
    openGraph: {
      title: pkg.title,
      description: pkg.subtitle,
      images: [{ url: pkg.heroImage }],
    },
  };
}

export async function generateStaticParams() {
  const packages = await packageService.getAllPackages();
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export default async function PackageDetailPage({ params }: PackagePageProps) {
  const { slug } = await params;
  const pkg = await packageService.getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  // Tour Schema (JSON-LD)
  const tourJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.title,
    description: pkg.overview,
    touristType: ["Wildlife Enthusiasts", "Luxury Safari Travelers"],
    itinerary: {
      "@type": "ItemList",
      itemListElement: pkg.itinerary.map((day) => ({
        "@type": "ListItem",
        position: day.day,
        name: day.title,
        description: day.description,
      })),
    },
    offers: {
      "@type": "Offer",
      price: pkg.pricing.indicativeUsd,
      priceCurrency: pkg.pricing.currency,
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
    },
  };

  return (
    <div className="bg-safari-night text-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tourJsonLd) }}
      />

      {/* Hero Section */}
      <div className="relative min-h-[65vh] lg:min-h-[75vh] flex items-end justify-center overflow-hidden">
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-safari-night via-safari-night/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gold-400/20 backdrop-blur-md border border-gold-400/40 text-gold-300 text-xs font-mono uppercase tracking-widest">
                {pkg.durationDays} Days / {pkg.durationDays - 1} Nights
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-safari-sand text-xs font-mono">
                {pkg.startLocation} → {pkg.endLocation}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-tight">
              {pkg.title}
            </h1>

            <p className="text-base sm:text-lg text-safari-sand/90 font-light leading-relaxed">
              {pkg.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content & Sticky Booking Summary Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Itinerary, Details, Accommodations, Inclusions */}
          <div className="lg:col-span-8 space-y-14">
            {/* 1. Expedition Overview & Key Metrics */}
            <section className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-lg bg-safari-card border border-safari-border text-xs font-mono">
                <div>
                  <span className="text-safari-sand/50 block mb-1">DURATION</span>
                  <span className="text-white text-sm font-semibold">{pkg.durationDays} Days</span>
                </div>
                <div>
                  <span className="text-safari-sand/50 block mb-1">PACE / STYLE</span>
                  <span className="text-white text-sm font-semibold">{pkg.difficulty}</span>
                </div>
                <div>
                  <span className="text-safari-sand/50 block mb-1">BEST SEASON</span>
                  <span className="text-gold-400 text-xs">{pkg.bestTimeToVisit.split("&")[0]}</span>
                </div>
                <div>
                  <span className="text-safari-sand/50 block mb-1">TRANSPORT</span>
                  <span className="text-white text-xs">Private 4x4 Cruiser</span>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white mb-3">
                  Expedition Overview
                </h2>
                <div className="w-10 h-px bg-gold-400 mb-4" />
                <p className="text-base font-light text-safari-sand/85 leading-relaxed">
                  {pkg.overview}
                </p>
              </div>

              {/* Curator Note Callout */}
              <div className="p-5 rounded bg-gold-400/10 border-l-2 border-gold-400 text-xs font-light text-safari-sand/90 space-y-1">
                <span className="font-mono uppercase tracking-wider text-gold-300 font-semibold block">
                  Safari Director’s Note
                </span>
                <p className="leading-relaxed">{pkg.curatorNote}</p>
              </div>
            </section>

            {/* 2. Photo Gallery Highlights */}
            {pkg.galleryImages && pkg.galleryImages.length > 0 && (
              <section className="space-y-4">
                <h3 className="font-serif text-2xl text-white font-normal">Visual Dispatches</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pkg.galleryImages.map((img, i) => (
                    <div
                      key={i}
                      className="relative h-44 rounded overflow-hidden bg-safari-card border border-safari-border"
                    >
                      <Image
                        src={img}
                        alt={`${pkg.title} safari photograph ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Day-by-Day Detailed Itinerary */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                    Field Itinerary
                  </h3>
                  <p className="text-xs text-safari-sand/60 font-light mt-1">
                    Choreographed for unhurried game viewing and peak light photography.
                  </p>
                </div>
              </div>
              <PackageItineraryAccordion itinerary={pkg.itinerary} />
            </section>

            {/* 4. Inclusions & Exclusions */}
            <section className="space-y-6 pt-6 border-t border-safari-border">
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                What’s Included in Your Expedition
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Inclusions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4" /> Comprehensive Inclusions
                  </h4>
                  <ul className="space-y-2 text-xs font-light text-safari-sand/80">
                    {pkg.inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold flex items-center gap-2">
                    <X className="w-4 h-4" /> Guest Discretion (Excluded)
                  </h4>
                  <ul className="space-y-2 text-xs font-light text-safari-sand/80">
                    {pkg.exclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 5. Accommodation & Camp Notes */}
            <section className="space-y-4 pt-6 border-t border-safari-border">
              <h3 className="font-serif text-2xl text-white font-normal flex items-center gap-2">
                <Bed className="w-5 h-5 text-gold-400" />
                Wilderness Accommodation Standards
              </h3>
              <p className="text-sm font-light text-safari-sand/80 leading-relaxed">
                {pkg.accommodationNotes}
              </p>
            </section>

            {/* 6. Frequently Asked Questions */}
            {pkg.faqs && pkg.faqs.length > 0 && (
              <section className="space-y-4 pt-6 border-t border-safari-border">
                <h3 className="font-serif text-2xl text-white font-normal flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-gold-400" />
                  Expedition Questions & Advice
                </h3>
                <div className="space-y-3">
                  {pkg.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-safari-card border border-safari-border rounded space-y-2"
                    >
                      <h4 className="font-serif text-base text-white">{faq.question}</h4>
                      <p className="text-xs text-safari-sand/80 font-light leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 7. Dedicated Enquiry Form anchored to this package */}
            <section id="enquire" className="pt-8 border-t border-safari-border space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                  Direct Booking Inquiry
                </span>
                <h3 className="font-serif text-3xl text-white font-normal">
                  Inquire About This Safari
                </h3>
                <p className="text-xs text-safari-sand/70 font-light">
                  Our Mombasa directors will check lodge availability for your dates and customize
                  the route to your preferences.
                </p>
              </div>

              <EnquiryForm initialPackageTitle={pkg.title} />
            </section>
          </div>

          {/* Right Column: Sticky Indicative Pricing & Concierge Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Pricing Box */}
              <div className="bg-safari-card border border-gold-400/30 rounded-lg p-6 sm:p-8 space-y-6 shadow-luxury">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-safari-sand/60 block">
                    Indicative Investment
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-4xl text-gold-400 font-normal">
                      ${pkg.pricing.indicativeUsd.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono text-safari-sand/70">/ guest sharing</span>
                  </div>
                  <p className="text-[11px] text-safari-sand/60 font-light mt-2 leading-relaxed">
                    {pkg.pricing.priceNote}
                  </p>
                </div>

                {/* Seasonal Rates Table */}
                {pkg.pricing.seasonalRates && (
                  <div className="pt-4 border-t border-safari-border space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gold-300 block">
                      Seasonal Indicative Tariffs
                    </span>
                    <div className="space-y-1.5 text-xs">
                      {pkg.pricing.seasonalRates.map((sr, idx) => (
                        <div key={idx} className="flex justify-between text-safari-sand/80">
                          <span className="font-medium text-white">{sr.season} Season:</span>
                          <span className="font-mono text-gold-400">
                            ${sr.rateUsd.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-3">
                  <Button
                    href="#enquire"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Check Date Availability
                  </Button>

                  <Link
                    href={`https://wa.me/254700123456?text=${encodeURIComponent(
                      `Hello Amber Plains Travel, I am inquiring about the ${pkg.title} (${pkg.durationDays} Days).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded border border-safari-border text-xs font-mono uppercase tracking-wider text-safari-sand hover:text-gold-300 hover:border-gold-400 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
                    Direct WhatsApp Concierge
                  </Link>
                </div>

                <div className="pt-4 border-t border-safari-border text-[11px] text-safari-sand/60 space-y-1.5 font-light">
                  <p className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-400" /> KATO Bonded Scheme
                  </p>
                  <p className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" /> AMREF Flying Doctors Rescue
                  </p>
                </div>
              </div>

              {/* Offline Companion App Card */}
              <div className="p-6 bg-safari-night border border-safari-border rounded-lg space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block">
                  Companion App Included
                </span>
                <h4 className="font-serif text-lg text-white font-normal">
                  Digital Field Schedule & Maps
                </h4>
                <p className="text-xs text-safari-sand/70 font-light leading-relaxed">
                  Upon confirmation, download this itinerary into the Amber Plains App for offline
                  bush access and direct radio/chat link.
                </p>
                <Link
                  href="/app"
                  className="text-xs font-mono uppercase text-gold-400 hover:underline inline-block pt-1"
                >
                  Learn About the App →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
