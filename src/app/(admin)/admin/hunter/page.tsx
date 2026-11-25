"use client";

import React, { useState } from "react";
import { Search, ExternalLink, Check } from "lucide-react";
import { mockCompetitors } from "@/data/adminMockData";
import { CompetitorProfile } from "@/types/admin";
import { SectionHeader, Card, EmptyState } from "@/components/admin/ui/AdminUIKit";

export default function AdminHunterPage() {
  const [competitors, setCompetitors] = useState<CompetitorProfile[]>(mockCompetitors);
  const [selectedComp, setSelectedComp] = useState<CompetitorProfile | null>(
    competitors[0] || null
  );

  const toggleApproval = (compIndex: number, recIndex: number) => {
    const updated = competitors.map((comp, ci) => {
      if (ci !== compIndex) return comp;
      return {
        ...comp,
        aiRecommendations: comp.aiRecommendations.map((rec, ri) =>
          ri === recIndex ? { ...rec, approvedByAdmin: !rec.approvedByAdmin } : rec
        ),
      };
    });
    setCompetitors(updated);
    if (selectedComp && updated[compIndex]?.id === selectedComp.id) {
      setSelectedComp(updated[compIndex]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Public Intelligence & Market Positioning"
        title="Website Hunter & Public Competitor Watchlist"
        action={
          <button
            onClick={() =>
              alert("Scheduled public crawl triggered. Respects all robots.txt rules.")
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400 text-safari-night font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-300 transition-colors shadow-sm"
          >
            <Search className="w-4 h-4" /> Run Public Site Crawl
          </button>
        }
      />

      <Card className="text-xs text-safari-sand/80 space-y-1 font-light">
        <span className="font-mono text-gold-400 uppercase font-bold block text-[10px]">
          Ethical Public Crawl & Privacy Policy
        </span>
        <p>
          Website Hunter only inspects public-facing HTML pages, published price lists, and
          public Open Graph/SEO tags. It strictly observes{" "}
          <code className="text-gold-300 font-mono">robots.txt</code>, enforces rate limits, and
          never bypasses authentication. No private booking volumes, conversion metrics, or internal
          commercial secrets are accessed or modeled.
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Card noPadding className="lg:col-span-5 overflow-hidden">
          <div className="px-5 py-4 border-b border-safari-border">
            <span className="text-xs font-mono uppercase tracking-wider text-safari-sand/70">
              Monitored Tour Operators ({competitors.length})
            </span>
          </div>

          <div className="divide-y divide-safari-border">
            {competitors.map((comp) => {
              const isSelected = selectedComp?.id === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedComp(comp)}
                  className={`p-5 cursor-pointer transition-colors space-y-2 ${
                    isSelected
                      ? "bg-safari-night border-l-2 border-gold-400"
                      : "hover:bg-safari-night/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-lg text-white font-normal">
                      {comp.companyName}
                    </h3>
                    <span className="text-[10px] font-mono text-gold-400 uppercase bg-safari-night px-2 py-0.5 rounded border border-safari-border shrink-0">
                      {comp.marketTier.replace(/_/g, " ")}
                    </span>
                  </div>

                  <a
                    href={comp.publicWebsiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-mono text-safari-sand/60 hover:underline flex items-center gap-1"
                  >
                    {comp.publicWebsiteUrl} <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="pt-1 flex items-center justify-between text-xs font-mono text-safari-sand/70">
                    <span>Packages: {comp.observablePackagesCount}</span>
                    <span className="text-white">
                      ${comp.observedPriceRangeUsd.min.toLocaleString()} - $
                      {comp.observedPriceRangeUsd.max.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="lg:col-span-7 space-y-6">
          {selectedComp ? (
            <>
              <div className="border-b border-safari-border pb-4 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-safari-sand/60">
                  <span>
                    Last Observed: {selectedComp.lastObservedAt.replace("T", " ").slice(0, 16)}
                  </span>
                  <span className="text-emerald-400">
                    Robots.txt: {selectedComp.robotsTxtStatus}
                  </span>
                </div>
                <h2 className="font-serif text-2xl text-white font-normal">
                  {selectedComp.companyName}
                </h2>
                <p className="text-xs font-mono text-safari-sand/70">
                  Focus Regions: {selectedComp.focusRegions.join(" · ")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-safari-night border border-safari-border space-y-2">
                  <span className="text-[10px] font-mono uppercase text-safari-sand/60 block font-bold">
                    Observed Public Features
                  </span>
                  <ul className="text-xs text-safari-sand/80 space-y-1">
                    {selectedComp.observedFeatures.map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-safari-night border border-safari-border space-y-2">
                  <span className="text-[10px] font-mono uppercase text-rose-400 block font-bold">
                    Identified Public SEO & Content Gaps
                  </span>
                  <ul className="text-xs text-safari-sand/80 space-y-1">
                    {selectedComp.detectedSeoGaps.map((gap, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-xs font-mono uppercase text-gold-400 block font-bold">
                  Prioritized Counter-Strategy & Recommendations
                </span>

                <div className="space-y-3">
                  {selectedComp.aiRecommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-safari-night border border-safari-border space-y-2 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-serif text-sm font-bold text-white">{rec.title}</h4>
                        <div className="flex items-center gap-2 font-mono text-[10px]">
                          <span className="px-2 py-0.5 rounded bg-safari-card border border-safari-border text-safari-sand">
                            Effort: {rec.effort.toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-safari-card border border-safari-border text-gold-300">
                            Impact: {rec.impact.toUpperCase()}
                          </span>
                          <span className="text-emerald-400 font-bold">
                            {Math.round(rec.confidenceScore * 100)}% Conf.
                          </span>
                        </div>
                      </div>

                      <p className="text-safari-sand/80 font-light">{rec.opportunity}</p>
                      <p className="text-gold-300 font-mono text-[11px]">
                        Action: {rec.suggestedAction}
                      </p>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            const compIdx = competitors.findIndex(
                              (c) => c.id === selectedComp.id
                            );
                            toggleApproval(compIdx, i);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                            rec.approvedByAdmin
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/50"
                              : "bg-safari-card text-safari-sand/70 hover:text-white border border-safari-border"
                          }`}
                        >
                          {rec.approvedByAdmin ? "✓ Strategy Approved" : "Approve Strategy"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <EmptyState message="Select an operator from the watchlist" />
          )}
        </Card>
      </div>
    </div>
  );
}
