"use client";

import React, { useState } from "react";
import {
  Users,
  Award,
  Phone,
  Smartphone,
  MapPin,
  CheckCircle,
  Plus,
  Compass,
} from "lucide-react";
import { mockGuides } from "@/data/adminMockData";
import { SafariGuide } from "@/types/admin";

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<SafariGuide[]>(mockGuides);
  const [selectedGuide, setSelectedGuide] = useState<SafariGuide | null>(guides[0] || null);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-safari-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Field Naturalists Roster
          </span>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            Safari Guides & Driver Operations
          </h1>
        </div>

        <button
          onClick={() => alert("New Guide Onboarding form opened.")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gold-400 text-safari-night font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-300 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Certified Guide
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Guides List */}
        <div className="lg:col-span-6 bg-safari-card border border-safari-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-safari-border flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-safari-sand/70">
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
                  className={`p-5 cursor-pointer transition-colors space-y-1.5 ${
                    isSelected ? "bg-safari-night border-l-4 border-gold-400" : "hover:bg-safari-night/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-gold-400">
                      KPSGA {g.kpsgaLevel} Naturalist
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        g.status === "available"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                          : g.status === "on_safari"
                          ? "bg-blue-950 text-blue-300 border border-blue-500/40"
                          : "bg-safari-surface text-safari-sand/70"
                      }`}
                    >
                      {g.status.replace("_", " ")}
                    </span>
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
        </div>

        {/* Selected Guide Details */}
        <div className="lg:col-span-6 bg-safari-card border border-safari-border rounded-lg p-6 sm:p-8 space-y-6">
          {selectedGuide ? (
            <>
              <div className="border-b border-safari-border pb-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-gold-400">
                    {selectedGuide.licenseNumber}
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    {selectedGuide.driverAppLinked ? "✓ Driver App Synchronized" : "App Unlinked"}
                  </span>
                </div>
                <h2 className="font-serif text-2xl text-white font-normal">{selectedGuide.fullName}</h2>
                <p className="text-xs text-safari-sand/70">Languages: {selectedGuide.languages.join(" · ")}</p>
              </div>

              {/* Status & Assignment */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-safari-night rounded border border-safari-border">
                  <span className="text-safari-sand/50 block text-[10px]">CURRENT ROSTER</span>
                  <span className="text-white capitalize">{selectedGuide.status.replace("_", " ")}</span>
                </div>
                <div className="p-3 bg-safari-night rounded border border-safari-border">
                  <span className="text-safari-sand/50 block text-[10px]">LAST FIELD LOCATION</span>
                  <span className="text-gold-300">{selectedGuide.lastKnownLocation || "Mombasa"}</span>
                </div>
              </div>

              {/* Contact info */}
              <div className="p-4 bg-safari-night rounded border border-safari-border space-y-2 text-xs font-mono">
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
                  onClick={() => alert(`Driver app push notification sent to ${selectedGuide.fullName}.`)}
                  className="flex-1 py-2 px-3 rounded bg-safari-night hover:bg-safari-surface border border-safari-border text-xs font-mono text-safari-sand hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-gold-400" /> Ping Driver App
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-xs text-safari-sand/50">
              Select a guide from the roster
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
