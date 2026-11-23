"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Bed, Utensils, Sparkles } from "lucide-react";
import { ItineraryDay } from "@/types";

interface ItineraryAccordionProps {
  itinerary: ItineraryDay[];
}

export const PackageItineraryAccordion: React.FC<ItineraryAccordionProps> = ({ itinerary }) => {
  // Keep first day expanded by default
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  const expandAll = () => {
    setExpandedDays(itinerary.map((d) => d.day));
  };

  const collapseAll = () => {
    setExpandedDays([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-safari-border text-xs font-mono text-safari-sand/70">
        <span>{itinerary.length} Days Day-by-Day Field Schedule</span>
        <div className="flex items-center gap-3">
          <button
            onClick={expandAll}
            className="text-gold-400 hover:text-gold-300 transition-colors"
          >
            Expand All
          </button>
          <span>•</span>
          <button
            onClick={collapseAll}
            className="text-gold-400 hover:text-gold-300 transition-colors"
          >
            Collapse
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {itinerary.map((day) => {
          const isExpanded = expandedDays.includes(day.day);
          return (
            <div
              key={day.day}
              className="bg-safari-card border border-safari-border rounded overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleDay(day.day)}
                aria-expanded={isExpanded}
                className="w-full p-5 text-left flex items-start sm:items-center justify-between gap-4 hover:bg-safari-surface/50 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <span className="shrink-0 w-9 h-9 rounded-full bg-gold-400/10 border border-gold-400/40 text-gold-300 flex items-center justify-center font-mono text-xs font-semibold">
                    D{day.day}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block mb-0.5">
                      {day.location}
                    </span>
                    <h4 className="font-serif text-lg sm:text-xl text-white font-normal">
                      {day.title}
                    </h4>
                  </div>
                </div>

                <div className="p-1 text-safari-sand/60 shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gold-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-safari-border/50 text-sm font-light text-safari-sand/85 space-y-4 animate-fadeIn">
                  <p className="leading-relaxed">{day.description}</p>

                  {/* Accommodation & Meals Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                    <div className="flex items-center gap-2 p-3 bg-safari-night/70 rounded border border-safari-border">
                      <Bed className="w-4 h-4 text-gold-400 shrink-0" />
                      <div>
                        <span className="text-safari-sand/50 block text-[10px]">CAMP / LODGE:</span>
                        <span className="text-white font-serif">{day.accommodation}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-safari-night/70 rounded border border-safari-border">
                      <Utensils className="w-4 h-4 text-gold-400 shrink-0" />
                      <div>
                        <span className="text-safari-sand/50 block text-[10px]">MEAL PLAN:</span>
                        <span className="text-white">{day.meals}</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights pills */}
                  {day.highlights && day.highlights.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] font-mono text-gold-400 uppercase tracking-wider block mb-2">
                        Day Highlights:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {day.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-safari-sand/90"
                          >
                            <Sparkles className="w-3 h-3 text-gold-400" />
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
