"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle, ExternalLink, Globe, BarChart3, Sparkles } from "lucide-react";
import { mockSeoAudits } from "@/data/adminMockData";
import { SeoAuditPage } from "@/types/admin";
import {
  SectionHeader,
  KpiCard,
  Card,
  StatusBadge,
} from "@/components/admin/ui/AdminUIKit";

export default function AdminSeoPage() {
  const [audits] = useState<SeoAuditPage[]>(mockSeoAudits);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Organic Search & Indexing Engine"
        title="SEO Audits, Metadata & Keyword Rankings"
        action={
          <span className="px-3 py-1.5 rounded-lg bg-safari-card border border-safari-border text-xs font-mono text-emerald-400 inline-flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Google Search Console Connected
          </span>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <KpiCard
          label="Indexed Pages in Sitemap"
          value="35 / 35"
          subtext="100% crawl coverage via /sitemap.xml"
          icon={Globe}
          variant="emerald"
        />

        <KpiCard
          label="Schema.org Validation"
          value="TravelAgency + TouristTrip"
          subtext="Structured JSON-LD live on all pages"
          icon={Sparkles}
          variant="gold"
        />

        <KpiCard
          label="Top Organic Rankings"
          value="#1 - #3"
          subtext="For Mombasa Bush-to-Beach Queries"
          icon={BarChart3}
          variant="emerald"
        />
      </div>

      <Card noPadding className="overflow-hidden">
        <div className="px-5 py-4 border-b border-safari-border">
          <span className="text-xs font-mono uppercase tracking-wider text-safari-sand/70">
            Audited URL Endpoints & Meta Tags ({audits.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[680px]">
            <thead className="bg-safari-night/70 text-[10px] font-mono uppercase text-safari-sand/60 border-b border-safari-border">
              <tr>
                <th className="py-3 px-4">URL Route</th>
                <th className="py-3 px-4">Meta Title & Length</th>
                <th className="py-3 px-4">Schema.org</th>
                <th className="py-3 px-4">Target Keyword & Position</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-safari-border text-safari-sand/90">
              {audits.map((a, i) => (
                <tr key={i} className="hover:bg-safari-night/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    <Link
                      href={a.path}
                      target="_blank"
                      className="hover:text-gold-300 flex items-center gap-1"
                    >
                      {a.path} <ExternalLink className="w-3 h-3 text-safari-sand/40" />
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-serif text-white block truncate max-w-sm">
                      {a.metaTitle}
                    </span>
                    <span className="text-[10px] font-mono text-safari-sand/50">
                      Length: {a.titleLength} chars (Optimal: 50-65)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-safari-night border border-safari-border text-gold-300">
                      {a.schemaType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs space-y-1">
                    {a.keywordRankings.map((k, ki) => (
                      <div key={ki} className="flex items-center gap-2">
                        <span className="text-white">&ldquo;{k.keyword}&rdquo;</span>
                        <span className="text-emerald-400 font-bold">
                          Position #{k.estimatedPosition}
                        </span>
                      </div>
                    ))}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={a.status} variant="confirmed" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
