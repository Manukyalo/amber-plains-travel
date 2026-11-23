import React from "react";
import { Compass } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="pb-4 border-b border-safari-border flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-3 w-48 bg-safari-card rounded" />
          <div className="h-8 w-72 bg-safari-card rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-32 bg-safari-card rounded" />
          <div className="h-9 w-36 bg-safari-card rounded" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 bg-safari-card border border-safari-border rounded-lg space-y-3">
            <div className="h-3 w-28 bg-safari-night rounded" />
            <div className="h-8 w-24 bg-safari-night rounded" />
            <div className="h-2.5 w-36 bg-safari-night rounded" />
          </div>
        ))}
      </div>

      {/* Content Table Skeleton */}
      <div className="bg-safari-card border border-safari-border rounded-lg p-6 space-y-4">
        <div className="h-5 w-48 bg-safari-night rounded" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-full bg-safari-night rounded border border-safari-border/40" />
          ))}
        </div>
      </div>
    </div>
  );
}
