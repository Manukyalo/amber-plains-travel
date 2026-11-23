import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles, ArrowRight, Compass, ShieldCheck } from "lucide-react";
import { experienceService } from "@/services/experienceService";
import { packageService } from "@/services/packageService";
import { PackageCard } from "@/components/safaris/PackageCard";
import { Button } from "@/components/ui/Button";

interface ExperiencePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ExperiencePageProps): Promise<Metadata> {
  const { slug } = await params;
  const exp = await experienceService.getExperienceBySlug(slug);

  if (!exp) return { title: "Experience Not Found" };

  return {
    title: exp.metaTitle || `${exp.title} | Amber Plains Travel`,
    description: exp.metaDescription || exp.summary,
    alternates: {
      canonical: `https://amberplains.co.ke/experiences/${exp.slug}`,
    },
    openGraph: {
      title: exp.title,
      description: exp.tagline,
      images: [{ url: exp.heroImage }],
    },
  };
}

export async function generateStaticParams() {
  const experiences = await experienceService.getAllExperiences();
  return experiences.map((e) => ({ slug: e.slug }));
}

export default async function ExperienceDetailPage({ params }: ExperiencePageProps) {
  const { slug } = await params;
  const [exp, allPackages] = await Promise.all([
    experienceService.getExperienceBySlug(slug),
    packageService.getAllPackages(),
  ]);

  if (!exp) notFound();

  // Find safari packages that feature this experience
  const matchedPackages = allPackages.filter((pkg) =>
    exp.includedInPackages.includes(pkg.slug)
  );

  return (
    <div className="bg-safari-night text-white min-h-screen">
      {/* Hero */}
      <div className="relative min-h-[55vh] lg:min-h-[65vh] flex items-end justify-center overflow-hidden">
        <Image
          src={exp.heroImage}
          alt={exp.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-safari-night via-safari-night/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-300 text-xs font-mono uppercase tracking-widest inline-block">
              Travel Style & Signature Focus
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-tight">
              {exp.title}
            </h1>
            <p className="text-base sm:text-lg text-safari-sand/90 font-light leading-relaxed">
              {exp.tagline}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-serif text-3xl text-white font-normal">Philosophy & Execution</h2>
            <div className="w-12 h-px bg-gold-400" />
            <p className="text-base font-light text-safari-sand/85 leading-relaxed">
              {exp.description}
            </p>

            <div className="pt-6 space-y-3">
              <h3 className="font-serif text-2xl text-white font-normal">What Sets Our Approach Apart</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {exp.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-4 bg-safari-card border border-safari-border rounded flex items-start gap-3 text-xs text-safari-sand/90"
                  >
                    <Sparkles className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-safari-card border border-safari-border rounded-lg p-6 space-y-5">
            <h4 className="font-serif text-xl text-white font-normal">Experience Suitability</h4>
            <div className="space-y-2 text-xs font-mono text-safari-sand/80">
              {exp.suitableFor.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-safari-border">
              <Button href="/contact" variant="primary" size="md" className="w-full">
                Design a {exp.title} Safari
              </Button>
            </div>
          </div>
        </div>

        {/* Packages featuring this style */}
        {matchedPackages.length > 0 && (
          <section className="space-y-8 pt-8 border-t border-safari-border">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                Itinerary Matches
              </span>
              <h3 className="font-serif text-3xl text-white font-normal mt-1">
                Safaris Styled Around {exp.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {matchedPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
