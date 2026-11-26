"use client";

/**
 * SOS Command Console — Amber Plains Operations
 * Manages emergency alerts from field drivers: Mechanical, Medical, Stuck, Emergency.
 * State machine: Active → Acknowledged → Resolved.
 * Wired to OpsIntelligenceContext for real-time banner and Supabase sync.
 */

import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Wrench,
  Heart,
  Zap,
  Anchor,
  Eye,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  useOpsIntelligence,
  type SosAlertItem,
  type SosSeverity,
  type SosStatus,
} from "@/contexts/OpsIntelligenceContext";

type TabKey = "active" | "acknowledged" | "resolved";

const EMERGENCY_META: Record<
  SosSeverity,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  Emergency: {
    icon: <Zap className="w-4 h-4" />,
    color: "text-red-400",
    bg: "bg-red-400/15 border-red-400/30",
  },
  Medical: {
    icon: <Heart className="w-4 h-4" />,
    color: "text-pink-400",
    bg: "bg-pink-400/15 border-pink-400/30",
  },
  Mechanical: {
    icon: <Wrench className="w-4 h-4" />,
    color: "text-amber-400",
    bg: "bg-amber-400/15 border-amber-400/30",
  },
  Stuck: {
    icon: <Anchor className="w-4 h-4" />,
    color: "text-sky-400",
    bg: "bg-sky-400/15 border-sky-400/30",
  },
};

function statusBadge(status: SosStatus): string {
  if (status === "Active") return "bg-red-500/20 text-red-400 border-red-500/30";
  if (status === "Acknowledged") return "bg-gold-400/15 text-gold-400 border-gold-400/30";
  return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
}

function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}m ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatAbsoluteTime(isoDate: string): string {
  return (
    new Date(isoDate).toLocaleString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Nairobi",
    }) + " EAT"
  );
}

interface SOSCardProps {
  alert: SosAlertItem;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

function SOSAlertCard({ alert, onAcknowledge, onResolve }: SOSCardProps) {
  const [expanded, setExpanded] = useState(false);
  const emergencyType: SosSeverity = alert.emergencyType ?? "Emergency";
  const meta = EMERGENCY_META[emergencyType] ?? EMERGENCY_META.Emergency;

  return (
    <article
      className={`bg-safari-card border rounded-xl overflow-hidden transition-shadow hover:shadow-lg hover:shadow-black/30 ${
        alert.status === "Active" ? "border-red-500/40" : "border-safari-border"
      }`}
    >
      {alert.status === "Active" && (
        <div className="h-0.5 bg-gradient-to-r from-red-500 via-rose-400 to-transparent animate-pulse" />
      )}

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center border ${meta.bg} ${meta.color} shrink-0`}
            >
              {meta.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-white">{alert.driverName}</span>
                <span className="text-[10px] font-mono text-safari-sand/50">
                  {alert.vehiclePlate}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-[11px] text-safari-sand/60">
                <MapPin className="w-3 h-3 text-gold-400 shrink-0" />
                {alert.parkName}
                {alert.latitude !== undefined && alert.longitude !== undefined && (
                  <span className="ml-1 font-mono text-[10px] text-safari-sand/40">
                    ({alert.latitude.toFixed(4)}°, {alert.longitude.toFixed(4)}°)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-1 rounded-full border ${statusBadge(
                alert.status
              )}`}
            >
              {alert.status === "Active" && <Zap className="w-2.5 h-2.5" />}
              {alert.status === "Acknowledged" && <Clock className="w-2.5 h-2.5" />}
              {alert.status === "Resolved" && <CheckCircle2 className="w-2.5 h-2.5" />}
              {alert.status}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${meta.bg} ${meta.color}`}
            >
              {meta.icon}
              {emergencyType}
            </span>
          </div>
        </div>

        <div className="flex gap-4 text-[10px] font-mono text-safari-sand/40 flex-wrap">
          <span className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            Triggered {formatRelativeTime(alert.createdAt)}
          </span>
          <span className="text-safari-sand/25">{formatAbsoluteTime(alert.createdAt)}</span>
        </div>

        {alert.notes && (
          <div className="bg-safari-night rounded-lg p-3">
            <div className="text-[9px] font-mono uppercase tracking-widest text-safari-sand/40 mb-1">
              Field Notes
            </div>
            <p className="text-xs text-safari-sand/80 leading-relaxed">{alert.notes}</p>
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-safari-sand/40 hover:text-safari-sand/70 flex items-center gap-1 transition-colors"
        >
          <Eye className="w-3 h-3" />
          {expanded ? "Hide details" : "View full details"}
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {expanded && (
          <div className="bg-safari-night rounded-lg p-3 space-y-1.5 font-mono text-[10px] text-safari-sand/60">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="text-safari-sand/40">Alert ID</span>
              <span className="break-all">{alert.id}</span>
              <span className="text-safari-sand/40">Emergency Type</span>
              <span>{emergencyType}</span>
              <span className="text-safari-sand/40">Status</span>
              <span>{alert.status}</span>
              {alert.acknowledgedBy && (
                <>
                  <span className="text-safari-sand/40">Acknowledged By</span>
                  <span>{alert.acknowledgedBy}</span>
                </>
              )}
              {alert.latitude !== undefined && alert.longitude !== undefined && (
                <>
                  <span className="text-safari-sand/40">GPS Latitude</span>
                  <span>{alert.latitude}°</span>
                  <span className="text-safari-sand/40">GPS Longitude</span>
                  <span>{alert.longitude}°</span>
                </>
              )}
            </div>
          </div>
        )}

        {alert.status === "Active" && (
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="flex-1 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold rounded-lg bg-gold-400/10 border border-gold-400/30 text-gold-400 hover:bg-gold-400/20 transition-colors"
            >
              Acknowledge
            </button>
            <button
              onClick={() => onResolve(alert.id)}
              className="flex-1 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              Resolve
            </button>
          </div>
        )}

        {alert.status === "Acknowledged" && (
          <button
            onClick={() => onResolve(alert.id)}
            className="w-full py-2.5 text-xs font-mono uppercase tracking-wider font-semibold rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            Mark Resolved
          </button>
        )}
      </div>
    </article>
  );
}

function EmptyState({ tab }: { tab: TabKey }) {
  const messages: Record<TabKey, { icon: React.ReactNode; title: string; body: string }> = {
    active: {
      icon: <CheckCircle2 className="w-10 h-10 text-emerald-400" />,
      title: "No active emergencies",
      body: "All field teams are operating within normal parameters.",
    },
    acknowledged: {
      icon: <Clock className="w-10 h-10 text-gold-400" />,
      title: "Nothing acknowledged",
      body: "No incidents are currently awaiting field response.",
    },
    resolved: {
      icon: <CheckCircle2 className="w-10 h-10 text-safari-sand/30" />,
      title: "No resolved incidents",
      body: "Resolved emergencies will appear here for the record.",
    },
  };
  const { icon, title, body } = messages[tab];

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      {icon}
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-safari-sand/50 mt-1 max-w-xs">{body}</p>
      </div>
    </div>
  );
}

export default function SOSCommandConsolePage() {
  const { sosAlerts, acknowledgeSos, resolveSos } = useOpsIntelligence();
  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const [filterType, setFilterType] = useState<SosSeverity | "all">("all");

  const filtered = useMemo(() => {
    const statusMatch: Record<TabKey, SosStatus> = {
      active: "Active",
      acknowledged: "Acknowledged",
      resolved: "Resolved",
    };
    return sosAlerts
      .filter((a) => a.status === statusMatch[activeTab])
      .filter((a) => filterType === "all" || a.emergencyType === filterType);
  }, [sosAlerts, activeTab, filterType]);

  const counts = useMemo(
    () => ({
      active: sosAlerts.filter((a) => a.status === "Active").length,
      acknowledged: sosAlerts.filter((a) => a.status === "Acknowledged").length,
      resolved: sosAlerts.filter((a) => a.status === "Resolved").length,
    }),
    [sosAlerts]
  );

  const TABS: { key: TabKey; label: string; countKey: keyof typeof counts }[] = [
    { key: "active", label: "Active", countKey: "active" },
    { key: "acknowledged", label: "Acknowledged", countKey: "acknowledged" },
    { key: "resolved", label: "Resolved", countKey: "resolved" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h1 className="font-serif text-2xl text-white">SOS Command Console</h1>
          </div>
          <p className="text-sm text-safari-sand/60">
            Emergency field incidents · Active → Acknowledged → Resolved
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-safari-sand/40" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as SosSeverity | "all")}
            className="bg-safari-card border border-safari-border text-safari-sand/80 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-gold-400/60"
          >
            <option value="all">All Types</option>
            <option value="Emergency">Emergency</option>
            <option value="Medical">Medical</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Stuck">Stuck</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          {
            key: "active",
            label: "Active Emergencies",
            color: "text-red-400",
            bg: "bg-red-400/15 border-red-400/30",
            icon: <AlertTriangle className="w-4 h-4" />,
          },
          {
            key: "acknowledged",
            label: "Acknowledged",
            color: "text-gold-400",
            bg: "bg-gold-400/15 border-gold-400/30",
            icon: <Clock className="w-4 h-4" />,
          },
          {
            key: "resolved",
            label: "Resolved",
            color: "text-emerald-400",
            bg: "bg-emerald-400/15 border-emerald-400/30",
            icon: <CheckCircle2 className="w-4 h-4" />,
          },
        ].map((item) => (
          <div
            key={item.key}
            className="bg-safari-card border border-safari-border rounded-xl p-4 flex items-center gap-3"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center border ${item.bg} ${item.color} shrink-0`}
            >
              {item.icon}
            </div>
            <div>
              <div className={`font-serif text-2xl ${item.color}`}>
                {counts[item.key as TabKey]}
              </div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-safari-sand/50">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 p-1 bg-safari-card border border-safari-border rounded-xl">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-colors ${
              activeTab === tab.key
                ? "bg-safari-night text-white border border-safari-border/60"
                : "text-safari-sand/50 hover:text-safari-sand/80"
            }`}
          >
            {tab.label}
            {counts[tab.countKey] > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                  tab.key === "active"
                    ? "bg-red-500/30 text-red-400"
                    : "bg-safari-border text-safari-sand/60"
                }`}
              >
                {counts[tab.countKey]}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((alert) => (
            <SOSAlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={(id) => acknowledgeSos(id)}
              onResolve={(id) => resolveSos(id)}
            />
          ))}
        </div>
      )}

      <div className="bg-safari-card border border-safari-border rounded-xl p-4">
        <div className="text-[9px] font-mono uppercase tracking-widest text-safari-sand/40 mb-2">
          Emergency Response Protocol
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-safari-sand/60">
          <div>
            <span className="text-red-400 font-semibold">Emergency / Medical:</span> Contact KWS
            Rangers immediately · Alert nearest medical facility · Notify guest next-of-kin within
            15 min
          </div>
          <div>
            <span className="text-amber-400 font-semibold">Mechanical:</span> Dispatch nearest
            standby vehicle · Coordinate with Nairobi workshop · Guest comfort protocol activated
          </div>
          <div>
            <span className="text-sky-400 font-semibold">Stuck:</span> Recovery team dispatched ·
            Sand ladders and tow rope deployed · Notify duty officer
          </div>
        </div>
      </div>
    </div>
  );
}
