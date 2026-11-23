import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { experienceService } from "@/services/experienceService";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Experiences & Travel Styles | Amber Plains Travel",
  description:
    "Discover unique African safari travel styles: Bush-to-Beach combinations, private 4x4 photographic Land Cruisers, sunrise balloon flights, and guided walking safaris.",
  alternates: {
    canonical: "https://amberplains.co.ke/experiences",
  },
};

export default async function ExperiencesPage() {
  const experiences = await experienceService.getAllExperiences();

  return (
    <div className="pt-32 pb-24 bg-safari-night text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Bespoke Styles"
          title="The Art of African Travel"
          description="Every traveler seeks a distinct communion with the wild. Explore our tailored travel styles choreographed for discerning guests."
          align="center"
          theme="dark"
        />

        <div className="space-y-16 mt-12">
          {experiences.map((exp, index) => {
            const isEven = index % 2 === 1;
            return (
              <article
                key={exp.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-safari-card border border-safari-border rounded-lg p-6 sm:p-10 shadow-luxury ${
                  isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={`lg:col-span-6 relative aspect-[16/10] rounded overflow-hidden bg-safari-dark ${isEven ? "lg:order-2" : ""}`}>
                  <Image
                    src={exp.heroImage}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <div className={`lg:col-span-6 space-y-4 ${isEven ? "lg:order-1" : ""}`}>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400">
                    Bespoke Travel Style
                  </span>

                  <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal">
                    <Link href={`/experiences/${exp.slug}`}>{exp.title}</Link>
                  </h3>

                  <p className="text-sm font-light text-safari-sand/85 leading-relaxed">
                    {exp.summary}
                  </p>

                  <div className="pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-safari-sand/50 block mb-2">
                      Key Highlights:
                    </span>
                    <ul className="space-y-1.5 text-xs text-safari-sand/80 font-light">
                      {exp.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-safari-border/70">
                    <span className="text-xs font-mono text-safari-sand/60">
                      Best for: {exp.suitableFor.slice(0, 2).join(", ")}
                    </span>
                    <Link
                      href={`/experiences/${exp.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-mono uppercase text-gold-400 hover:text-gold-300 font-semibold"
                    >
                      Read Full Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
