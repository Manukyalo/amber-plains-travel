"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Search,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { mockSeoAudits } from "@/data/adminMockData";
import { SeoAuditPage } from "@/types/admin";

export default function AdminSeoPage() {
  const [audits, setAudits] = useState<SeoAuditPage[]>(mockSeoAudits);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-safari-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Organic Search & Indexing Engine
          </span>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            SEO Audits, Metadata & Keyword Rankings
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded bg-safari-card border border-safari-border text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Google Search Console Connected
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-safari-card border border-safari-border rounded-lg space-y-1">
          <span className="text-xs font-mono text-safari-sand/60">INDEXED PAGES IN SITEMAP</span>
          <div className="font-serif text-3xl text-white">35 / 35</div>
          <span className="text-[11px] text-emerald-400 font-mono">100% crawl coverage via /sitemap.xml</span>
        </div>

        <div className="p-5 bg-safari-card border border-safari-border rounded-lg space-y-1">
          <span className="text-xs font-mono text-safari-sand/60">SCHEMA.ORG VALIDATION</span>
          <div className="font-serif text-3xl text-gold-300">TravelAgency + TouristTrip</div>
          <span className="text-[11px] text-safari-sand/50">Structured JSON-LD live on all pages</span>
        </div>

        <div className="p-5 bg-safari-card border border-safari-border rounded-lg space-y-1">
          <span className="text-xs font-mono text-safari-sand/60">TOP ORGANIC RANKINGS</span>
          <div className="font-serif text-3xl text-emerald-400">#1 - #3</div>
          <span className="text-[11px] text-safari-sand/50">For Mombasa Bush-to-Beach Queries</span>
        </div>
      </div>

      {/* Page Audit Table */}
      <div className="bg-safari-card border border-safari-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-safari-border flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-safari-sand/70">
            Audited URL Endpoints & Meta Tags ({audits.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
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
                <tr key={i} className="hover:bg-safari-night/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    <Link href={a.path} target="_blank" className="hover:text-gold-300 flex items-center gap-1">
                      {a.path} <ExternalLink className="w-3 h-3 text-safari-sand/40" />
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-serif text-white block truncate max-w-sm">{a.metaTitle}</span>
                    <span className="text-[10px] font-mono text-safari-sand/50">
                      Length: {a.titleLength} chars (Optimal: 50-65)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-safari-night border border-safari-border text-gold-300">
                      {a.schemaType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs">
                    {a.keywordRankings.map((k, ki) => (
                      <div key={ki} className="flex items-center gap-2">
                        <span className="text-white">&ldquo;{k.keyword}&rdquo;</span>
                        <span className="text-emerald-400 font-bold">Position #{k.estimatedPosition}</span>
                      </div>
                    ))}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
