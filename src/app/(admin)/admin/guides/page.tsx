"use client";

import React, { useState } from "react";
import { Smartphone, Plus } from "lucide-react";
import { mockGuides } from "@/data/adminMockData";
import { SafariGuide } from "@/types/admin";
import {
  SectionHeader,
  Card,
  StatusBadge,
  EmptyState,
} from "@/components/admin/ui/AdminUIKit";

export default function AdminGuidesPage() {
  const [guides] = useState<SafariGuide[]>(mockGuides);
  const [selectedGuide, setSelectedGuide] = useState<SafariGuide | null>(
    guides[0] || null
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Field Naturalists Roster"
        title="Safari Guides & Driver Operations"
        action={
          <button
            onClick={() => alert("New Guide Onboarding form opened.")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400 text-safari-night font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-300 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Certified Guide
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Card noPadding className="lg:col-span-6 overflow-hidden">
          <div className="px-5 py-4 border-b border-safari-border">
            <span className="text-xs font-mono uppercase tracking-wider text-safari-sand/70">
              Guiding Fellowship ({guides.length})
            </span>
          </div>

          <div className="divide-y divide-safari-border">
            {guides.map((g) => {
              const isSelected = selectedGuide?.id === g.id;
              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGuide(g)}
                  className={`p-5 cursor-pointer transition-colors space-y-1.5 ${isSelected
                      ? "bg-safari-night border-l-2 border-gold-400"
                      : "hover:bg-safari-night/50"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-gold-400">
                      KPSGA {g.kpsgaLevel} Naturalist
                    </span>
                    <StatusBadge
                      status={g.status.replace("_", " ")}
                      variant={
                        g.status === "available"
                          ? "confirmed"
                          : g.status === "on_safari"
                            ? "in_safari"
                            : "neutral"
                      }
                    />
                  </div>

                  <h3 className="font-serif text-lg text-white font-normal">{g.fullName}</h3>

                  <div className="flex items-center gap-3 text-xs font-mono text-safari-sand/60 pt-1">
                    <span>License: {g.licenseNumber}</span>
                    <span>•</span>
                    <span>{g.languages.join(", ")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="lg:col-span-6 space-y-6">
          {selectedGuide ? (
            <>
              <div className="border-b border-safari-border pb-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-gold-400">
                    {selectedGuide.licenseNumber}
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    {selectedGuide.driverAppLinked
                      ? "✓ Driver App Synchronized"
                      : "App Unlinked"}
                  </span>
                </div>
                <h2 className="font-serif text-2xl text-white font-normal">
                  {selectedGuide.fullName}
                </h2>
                <p className="text-xs text-safari-sand/70">
                  Languages: {selectedGuide.languages.join(" · ")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 bg-safari-night rounded-xl border border-safari-border">
                  <span className="text-safari-sand/50 block text-[10px]">CURRENT ROSTER</span>
                  <span className="text-white capitalize mt-0.5 block">
                    {selectedGuide.status.replace("_", " ")}
                  </span>
                </div>
                <div className="p-3.5 bg-safari-night rounded-xl border border-safari-border">
                  <span className="text-safari-sand/50 block text-[10px]">
                    LAST FIELD LOCATION
                  </span>
                  <span className="text-gold-300 mt-0.5 block">
                    {selectedGuide.lastKnownLocation || "Mombasa"}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-safari-night rounded-xl border border-safari-border space-y-2 text-xs font-mono">
                <span className="text-[10px] uppercase text-gold-400 block font-bold">
                  Direct Field Contact
                </span>
                <div className="flex justify-between text-safari-sand/80">
                  <span>Phone / Satellite:</span>
                  <span className="text-white">{selectedGuide.phone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-safari-border flex gap-3">
                <button
                  onClick={() =>
                    alert(
                      `Driver app push notification sent to ${selectedGuide.fullName}.`
                    )
                  }
                  className="flex-1 py-2.5 px-3 rounded-lg bg-safari-night hover:bg-safari-surface border border-safari-border text-xs font-mono text-safari-sand hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-gold-400" /> Ping Driver App
                </button>
              </div>
            </>
          ) : (
            <EmptyState message="Select a guide from the roster" />
          )}
        </Card>
      </div>
    </div>
  );
}
