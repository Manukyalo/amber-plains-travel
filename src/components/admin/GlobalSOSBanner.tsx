"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ChevronRight } from "lucide-react";
import { useOpsIntelligence } from "@/contexts/OpsIntelligenceContext";

/**
 * Sticky top-of-shell SOS banner adapted from Axelo's GlobalSOSBanner.
 * Renders only when an active unacknowledged SOS incident exists.
 */
export function GlobalSOSBanner() {
  const { activeSosAlerts } = useOpsIntelligence();
  const urgent = activeSosAlerts.filter((a) => a.status === "Active");

  if (urgent.length === 0) return null;

  const current = urgent[0];

  return (
    <div
      role="alert"
      className="bg-rose-950 border-b border-rose-500/60 text-white px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-rose-500/25 border border-rose-400/50 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-4 h-4 text-rose-300" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300 font-bold block">
            Critical SOS Alert Active ({urgent.length})
          </span>
          <p className="text-xs sm:text-sm font-sans text-white truncate">
            {current.driverName} ({current.vehiclePlate}) · {current.emergencyType} in{" "}
            {current.parkName}
          </p>
        </div>
      </div>

      <Link
        href="/admin/fleet"
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-mono font-semibold uppercase tracking-wider transition-colors shrink-0"
      >
        Inspect Incident <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
