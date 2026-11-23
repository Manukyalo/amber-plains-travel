import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, User, Calendar, ArrowLeft, Share2 } from "lucide-react";
import { journalService } from "@/services/journalService";
import { Button } from "@/components/ui/Button";

interface JournalPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: JournalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const art = await journalService.getArticleBySlug(slug);

  if (!art) return { title: "Article Not Found" };

  return {
    title: art.metaTitle || `${art.title} | Amber Plains Journal`,
    description: art.metaDescription || art.excerpt,
    alternates: {
      canonical: `https://amberplains.co.ke/journal/${art.slug}`,
    },
    openGraph: {
      title: art.title,
      description: art.excerpt,
      images: [{ url: art.coverImage }],
    },
  };
}

export async function generateStaticParams() {
  const articles = await journalService.getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function JournalArticlePage({ params }: JournalPageProps) {
  const { slug } = await params;
  const art = await journalService.getArticleBySlug(slug);

  if (!art) notFound();

  return (
    <article className="bg-safari-night text-white min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/journal"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gold-400 hover:text-gold-300 mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal
        </Link>

        {/* Article Header */}
        <div className="space-y-4 mb-10">
          <span className="px-3 py-1 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-300 text-xs font-mono uppercase tracking-widest inline-block">
            {art.category}
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-tight">
            {art.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-safari-sand/70 pt-2 border-b border-safari-border pb-6">
            <span className="flex items-center gap-1.5 text-white">
              <User className="w-3.5 h-3.5 text-gold-400" />
              {art.author.name} ({art.author.role})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold-400" />
              {art.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              {art.readTime}
            </span>
          </div>
        </div>

        {/* Hero Cover Image */}
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-12 bg-safari-card border border-safari-border">
          <Image
            src={art.coverImage}
            alt={art.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
        </div>

        {/* Editorial Body Text */}
        <div className="space-y-6 text-base sm:text-lg font-light text-safari-sand/90 leading-relaxed font-sans border-b border-safari-border pb-12">
          {art.content.map((paragraph, idx) => (
            <p key={idx} className={idx === 0 ? "first-letter:text-5xl first-letter:font-serif first-letter:text-gold-400 first-letter:float-left first-letter:mr-3 first-letter:leading-none" : ""}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Author Bio Box & Next Action */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-safari-card border border-safari-border rounded-lg p-6 mt-8">
          <div className="space-y-1">
            <h4 className="font-serif text-lg text-white">Curated by {art.author.name}</h4>
            <p className="text-xs text-safari-sand/70 font-light">{art.author.role}</p>
          </div>

          <Button href="/contact" variant="primary" size="sm">
            Discuss with an Expedition Director
          </Button>
        </div>
      </div>
    </article>
  );
}
