import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, User } from "lucide-react";
import { journalService } from "@/services/journalService";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Travel Journal & Safari Dispatches | Amber Plains Travel",
  description:
    "Authoritative safari guides, wildlife dispatches, and coastal essays authored by our Mombasa expedition directors and naturalists.",
  alternates: {
    canonical: "https://amberplains.co.ke/journal",
  },
};

export default async function JournalPage() {
  const articles = await journalService.getAllArticles();

  return (
    <div className="pt-32 pb-24 bg-safari-night text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Editorial Dispatches"
          title="The Travel Journal"
          description="In-depth wilderness field guides, seasonal advice, photography techniques, and reflections on East African conservation."
          align="center"
          theme="dark"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {articles.map((art) => (
            <article
              key={art.id}
              className="group bg-safari-card border border-safari-border rounded overflow-hidden flex flex-col justify-between hover:border-gold-400/40 transition-colors shadow-luxury"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-safari-dark">
                  <Image
                    src={art.coverImage}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono uppercase tracking-widest text-gold-400 border border-white/10">
                    {art.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-safari-sand/60">
                    <span>{art.publishedAt}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gold-400" /> {art.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-white font-normal group-hover:text-gold-200 transition-colors leading-snug">
                    <Link href={`/journal/${art.slug}`}>{art.title}</Link>
                  </h3>

                  <p className="text-xs text-safari-sand/75 font-light leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-safari-border/50 flex items-center justify-between text-xs font-mono text-safari-sand/70">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gold-400" />
                  {art.author.name}
                </span>

                <Link
                  href={`/journal/${art.slug}`}
                  className="inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 font-semibold"
                >
                  Read Essay <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
