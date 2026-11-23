"use client";

import React from "react";
import { Filter, Search, RotateCcw } from "lucide-react";

interface FilterBarProps {
  destinations: string[];
  experienceTypes: string[];
  selectedDestination: string;
  selectedDuration: "all" | "short" | "medium" | "extended";
  selectedExperience: string;
  searchQuery: string;
  onDestinationChange: (dest: string) => void;
  onDurationChange: (dur: "all" | "short" | "medium" | "extended") => void;
  onExperienceChange: (exp: string) => void;
  onSearchChange: (query: string) => void;
  onReset: () => void;
  resultCount: number;
}

export const PackageFilterBar: React.FC<FilterBarProps> = ({
  destinations,
  experienceTypes,
  selectedDestination,
  selectedDuration,
  selectedExperience,
  searchQuery,
  onDestinationChange,
  onDurationChange,
  onExperienceChange,
  onSearchChange,
  onReset,
  resultCount,
}) => {
  const isFiltered =
    selectedDestination !== "all" ||
    selectedDuration !== "all" ||
    selectedExperience !== "all" ||
    searchQuery.trim().length > 0;

  return (
    <div className="bg-safari-night border border-safari-border rounded-lg p-6 shadow-luxury mb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-safari-border/70">
        <div className="flex items-center gap-2 text-white">
          <Filter className="w-4 h-4 text-gold-400" />
          <h3 className="font-serif text-lg font-normal">Refine Safaris & Expeditions</h3>
          <span className="ml-2 text-xs font-mono text-safari-sand/60 bg-white/5 px-2 py-0.5 rounded border border-white/10">
            {resultCount} {resultCount === 1 ? "journey" : "journeys"} available
          </span>
        </div>

        {isFiltered && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-gold-400 hover:text-gold-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
        {/* Search query input */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-safari-sand/70 mb-1.5">
            Keyword or Wildlife
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="e.g. Migration, Red Elephants..."
              className="w-full bg-safari-dark border border-safari-border rounded px-3 py-2.5 text-xs text-white placeholder-safari-sand/40 focus:outline-none focus:border-gold-400 transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-safari-sand/40 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Destination filter */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-safari-sand/70 mb-1.5">
            Destination / Territory
          </label>
          <select
            value={selectedDestination}
            onChange={(e) => onDestinationChange(e.target.value)}
            className="w-full bg-safari-dark border border-safari-border rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400 transition-colors cursor-pointer"
          >
            <option value="all">All Destinations</option>
            {destinations.map((dest) => (
              <option key={dest} value={dest}>
                {dest}
              </option>
            ))}
          </select>
        </div>

        {/* Duration filter */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-safari-sand/70 mb-1.5">
            Expedition Duration
          </label>
          <select
            value={selectedDuration}
            onChange={(e) => onDurationChange(e.target.value as any)}
            className="w-full bg-safari-dark border border-safari-border rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400 transition-colors cursor-pointer"
          >
            <option value="all">Any Duration</option>
            <option value="short">Short Safari (1 - 4 Days)</option>
            <option value="medium">Classic Expedition (5 - 7 Days)</option>
            <option value="extended">Grand Odyssey (8+ Days)</option>
          </select>
        </div>

        {/* Experience type filter */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-safari-sand/70 mb-1.5">
            Experience Style
          </label>
          <select
            value={selectedExperience}
            onChange={(e) => onExperienceChange(e.target.value)}
            className="w-full bg-safari-dark border border-safari-border rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400 transition-colors cursor-pointer"
          >
            <option value="all">All Travel Styles</option>
            {experienceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
