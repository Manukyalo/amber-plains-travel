"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Eye, Clock } from "lucide-react";
import { safariPackages } from "@/data/packagesData";
import { SafariPackage } from "@/types";
import {
  SectionHeader,
  Card,
  StatusBadge,
  EmptyState,
} from "@/components/admin/ui/AdminUIKit";

export default function AdminPackagesPage() {
  const [packagesList, setPackagesList] = useState<SafariPackage[]>(safariPackages);
  const [selectedPkg, setSelectedPkg] = useState<SafariPackage | null>(
    packagesList[0] || null
  );

  const togglePublishStatus = (id: string) => {
    setPackagesList((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, isFeatured: !pkg.isFeatured } : pkg))
    );
    if (selectedPkg?.id === id) {
      setSelectedPkg((prev) => (prev ? { ...prev, isFeatured: !prev.isFeatured } : null));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Catalog Management"
        title="Packages & Day-by-Day Itineraries"
        action={
          <button
            onClick={() =>
              alert("New package creation wizard initiated. Opens structured itinerary builder.")
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400 text-safari-night font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-300 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create New Package
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Card noPadding className="lg:col-span-7 overflow-hidden">
          <div className="px-5 py-4 border-b border-safari-border">
            <span className="text-xs font-mono uppercase tracking-wider text-safari-sand/70">
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
                    isSelected
                      ? "bg-safari-night border-l-2 border-gold-400"
                      : "hover:bg-safari-night/50"
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-gold-400 text-xs font-mono">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {pkg.durationDays} Days / {pkg.durationDays - 1} Nights
                      </span>
                      <span>•</span>
                      <span className="text-safari-sand/60 truncate">{pkg.startLocation}</span>
                    </div>

                    <h3 className="font-serif text-lg text-white font-normal">{pkg.title}</h3>
                    <p className="text-xs text-safari-sand/70 line-clamp-1">{pkg.subtitle}</p>

                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-xs font-serif text-gold-300 font-semibold">
                        ${pkg.pricing.indicativeUsd.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono text-safari-sand/50">/ guest</span>
                      <span className="text-safari-sand/30">•</span>
                      <StatusBadge
                        status={pkg.isFeatured ? "Featured" : "Standard"}
                        variant={pkg.isFeatured ? "confirmed" : "neutral"}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/safaris/${pkg.slug}`}
                      target="_blank"
                      title="View public page"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg hover:bg-safari-card text-safari-sand/60 hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="lg:col-span-5 space-y-6">
          {selectedPkg ? (
            <>
              <div className="flex items-start justify-between gap-3 border-b border-safari-border pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-gold-400 block">
                    Selected Package
                  </span>
                  <h3 className="font-serif text-xl text-white font-normal mt-0.5">
                    {selectedPkg.title}
                  </h3>
                </div>
                <button
                  onClick={() => togglePublishStatus(selectedPkg.id)}
                  className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg border transition-colors shrink-0 ${
                    selectedPkg.isFeatured
                      ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                      : "bg-safari-night border-safari-border text-safari-sand hover:border-gold-400"
                  }`}
                >
                  {selectedPkg.isFeatured ? "Unfeature" : "Mark Featured"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-safari-night border border-safari-border">
                  <span className="text-safari-sand/50 block text-[10px]">PACE / DIFFICULTY</span>
                  <span className="text-white mt-0.5 block">{selectedPkg.difficulty}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-safari-night border border-safari-border">
                  <span className="text-safari-sand/50 block text-[10px]">BEST SEASON</span>
                  <span className="text-white truncate block mt-0.5">
                    {selectedPkg.bestTimeToVisit.split("&")[0]}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-safari-sand/70 block">
                  Itinerary Schedule ({selectedPkg.itinerary.length} Days)
                </span>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {selectedPkg.itinerary.map((d) => (
                    <div
                      key={d.day}
                      className="p-2.5 rounded-lg bg-safari-night border border-safari-border text-xs flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <span className="font-mono text-gold-400 mr-2 font-bold">D{d.day}</span>
                        <span className="text-white truncate">{d.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-safari-sand/50 shrink-0">
                        {d.location}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

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

              <div className="pt-3 border-t border-safari-border flex gap-3">
                <Link
                  href={`/safaris/${selectedPkg.slug}`}
                  target="_blank"
                  className="flex-1 py-2.5 rounded-lg bg-safari-night hover:bg-safari-surface border border-safari-border text-xs text-center font-mono text-safari-sand hover:text-white transition-colors"
                >
                  View Public URL
                </Link>
                <Link
                  href="/admin/costing"
                  className="flex-1 py-2.5 rounded-lg bg-gold-400 hover:bg-gold-300 text-safari-night text-xs text-center font-mono font-semibold uppercase tracking-wider transition-colors"
                >
                  Edit Costing
                </Link>
              </div>
            </>
          ) : (
            <EmptyState message="Select a package to inspect details" />
          )}
        </Card>
      </div>
    </div>
  );
}
