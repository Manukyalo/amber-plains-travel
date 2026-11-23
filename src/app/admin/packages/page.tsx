"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Eye, Archive, CheckCircle, Clock, MapPin, Sparkles } from "lucide-react";
import { safariPackages } from "@/data/packagesData";
import { SafariPackage } from "@/types";

export default function AdminPackagesPage() {
  const [packagesList, setPackagesList] = useState<SafariPackage[]>(safariPackages);
  const [selectedPkg, setSelectedPkg] = useState<SafariPackage | null>(packagesList[0] || null);

  const togglePublishStatus = (id: string) => {
    setPackagesList((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, isFeatured: !pkg.isFeatured } : pkg))
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-safari-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Catalog Management
          </span>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            Packages & Day-by-Day Itineraries
          </h1>
        </div>

        <button
          onClick={() => alert("New package creation wizard initiated. Opens structured itinerary builder.")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gold-400 text-safari-night font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-300 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create New Package
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Packages List Table */}
        <div className="lg:col-span-7 bg-safari-card border border-safari-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-safari-border flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-safari-sand/70">
              Active Safari Portfolio ({packagesList.length})
            </span>
          </div>

          <div className="divide-y divide-safari-border">
            {packagesList.map((pkg) => {
              const isSelected = selectedPkg?.id === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`p-5 cursor-pointer transition-colors flex items-start justify-between gap-4 ${
                    isSelected ? "bg-safari-night border-l-4 border-gold-400" : "hover:bg-safari-night/50"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gold-400 text-xs font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{pkg.durationDays} Days / {pkg.durationDays - 1} Nights</span>
                      <span>•</span>
                      <span className="text-safari-sand/60">{pkg.startLocation}</span>
                    </div>

                    <h3 className="font-serif text-lg text-white font-normal">{pkg.title}</h3>

                    <p className="text-xs text-safari-sand/70 line-clamp-1">{pkg.subtitle}</p>

                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-xs font-serif text-gold-300 font-semibold">
                        ${pkg.pricing.indicativeUsd.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono text-safari-sand/50">/ guest</span>
                      <span className="text-safari-sand/30">•</span>
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                          pkg.isFeatured
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                            : "bg-safari-surface text-safari-sand/70"
                        }`}
                      >
                        {pkg.isFeatured ? "Featured" : "Standard"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/safaris/${pkg.slug}`}
                      target="_blank"
                      title="View public page"
                      className="p-1.5 rounded hover:bg-safari-card text-safari-sand/60 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Package Details Inspector */}
        <div className="lg:col-span-5 bg-safari-card border border-safari-border rounded-lg p-6 space-y-6">
          {selectedPkg ? (
            <>
              <div className="flex items-center justify-between border-b border-safari-border pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-gold-400 block">
                    Selected Package
                  </span>
                  <h3 className="font-serif text-xl text-white font-normal">{selectedPkg.title}</h3>
                </div>
                <button
                  onClick={() => togglePublishStatus(selectedPkg.id)}
                  className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded border transition-colors ${
                    selectedPkg.isFeatured
                      ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                      : "bg-safari-night border-safari-border text-safari-sand"
                  }`}
                >
                  {selectedPkg.isFeatured ? "Unfeature" : "Mark Featured"}
                </button>
              </div>

              {/* Quick specs */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded bg-safari-night border border-safari-border">
                  <span className="text-safari-sand/50 block text-[10px]">PACE / DIFFICULTY</span>
                  <span className="text-white">{selectedPkg.difficulty}</span>
                </div>
                <div className="p-3 rounded bg-safari-night border border-safari-border">
                  <span className="text-safari-sand/50 block text-[10px]">BEST SEASON</span>
                  <span className="text-white truncate block">{selectedPkg.bestTimeToVisit.split("&")[0]}</span>
                </div>
              </div>

              {/* Day-by-Day summary */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-safari-sand/70 block">
                  Itinerary Schedule ({selectedPkg.itinerary.length} Days)
                </span>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {selectedPkg.itinerary.map((d) => (
                    <div
                      key={d.day}
                      className="p-2.5 rounded bg-safari-night border border-safari-border text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono text-gold-400 mr-2 font-bold">D{d.day}</span>
                        <span className="text-white">{d.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-safari-sand/50">{d.location}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions summary */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-safari-sand/70 block">
                  Key Inclusions ({selectedPkg.inclusions.length})
                </span>
                <ul className="text-xs text-safari-sand/80 space-y-1">
                  {selectedPkg.inclusions.slice(0, 4).map((inc, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-gold-400 font-bold">•</span>
                      <span className="truncate">{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-safari-border flex gap-3">
                <Link
                  href={`/safaris/${selectedPkg.slug}`}
                  target="_blank"
                  className="flex-1 py-2 rounded bg-safari-night hover:bg-safari-surface border border-safari-border text-xs text-center font-mono text-safari-sand hover:text-white transition-colors"
                >
                  View Public URL
                </Link>
                <Link
                  href="/admin/costing"
                  className="flex-1 py-2 rounded bg-gold-400 hover:bg-gold-300 text-safari-night text-xs text-center font-mono font-semibold uppercase tracking-wider transition-colors"
                >
                  Edit Costing
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-xs text-safari-sand/50">
              Select a package to inspect details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
