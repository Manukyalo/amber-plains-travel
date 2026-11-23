import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Experience } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ExperiencesGridProps {
  experiences: Experience[];
}

export const ExperiencesGrid: React.FC<ExperiencesGridProps> = ({ experiences }) => {
  return (
    <section className="py-20 lg:py-28 bg-safari-night text-white border-t border-safari-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Art of Safari"
          title="Curated Ways to Experience the Wild"
          description="Every traveler moves at a different rhythm. Discover the distinct travel styles we choreograph across Kenya's ecosystems."
          align="center"
          theme="dark"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="group relative bg-safari-card border border-safari-border rounded overflow-hidden p-8 flex flex-col justify-between hover:border-gold-400/40 transition-all duration-300 shadow-luxury"
            >
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400">
                    Travel Style
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-safari-sand/60">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    <span>Bespoke Charter</span>
                  </div>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal group-hover:text-gold-200 transition-colors">
                  {exp.title}
                </h3>

                <p className="text-sm font-light text-safari-sand/80 leading-relaxed">
                  {exp.summary}
                </p>

                {/* Highlights list */}
                <ul className="space-y-2 pt-2">
                  {exp.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-safari-sand/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 pt-8 mt-6 border-t border-safari-border flex items-center justify-between">
                <span className="text-[11px] font-mono text-safari-sand/60">
                  Ideal for: {exp.suitableFor.slice(0, 2).join(", ")}
                </span>
                <Link
                  href={`/experiences/${exp.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-gold-400 hover:text-gold-300"
                >
                  Explore Style <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
