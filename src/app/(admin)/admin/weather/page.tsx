"use client";

/**
 * Weather Intelligence Page — Amber Plains Operations
 * Shows real-time Open-Meteo conditions for 10 Kenyan safari parks.
 * Data fetched client-side; no API key required.
 */

import React, { useEffect, useState, useCallback } from "react";
import {
  CloudSun,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronDown,
} from "lucide-react";
import {
  AMBER_PLAINS_PARKS,
  fetchAllParksWeather,
  fetchParkWeather,
  wmoToIcon,
  getWeatherLabel,
  type ParkWeatherReport,
  type SafariAdvisoryLevel,
} from "@/services/weatherService";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function advisoryColor(level: SafariAdvisoryLevel): string {
  if (level === "Ideal")   return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
  if (level === "Fair")    return "text-gold-400 border-gold-400/30 bg-gold-400/10";
  return                          "text-rose-400 border-rose-400/30 bg-rose-400/10";
}

function advisoryIcon(level: SafariAdvisoryLevel) {
  if (level === "Ideal")   return <CheckCircle2 className="w-3.5 h-3.5" />;
  if (level === "Fair")    return <Clock className="w-3.5 h-3.5" />;
  return                          <AlertTriangle className="w-3.5 h-3.5" />;
}

function formatFetchTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-KE", {
    hour: "2-digit", minute: "2-digit", timeZone: "Africa/Nairobi",
  });
}

function starRow(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ParkCardSkeleton() {
  return (
    <div className="bg-safari-card border border-safari-border rounded-xl p-5 animate-pulse space-y-3">
      <div className="flex justify-between">
        <div className="h-5 bg-safari-border rounded w-36" />
        <div className="h-5 bg-safari-border rounded w-16" />
      </div>
      <div className="h-10 bg-safari-border rounded w-24" />
      <div className="grid grid-cols-3 gap-2">
        {[0,1,2].map(i => <div key={i} className="h-8 bg-safari-border rounded" />)}
      </div>
      <div className="h-14 bg-safari-border rounded" />
    </div>
  );
}

// ─── Park Card ────────────────────────────────────────────────────────────────

function ParkWeatherCard({ report }: { report: ParkWeatherReport }) {
  const { park, current, forecast, advisory, season, fetchedAt } = report;
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="bg-safari-card border border-safari-border rounded-xl p-5 flex flex-col gap-4 transition-shadow hover:border-gold-400/40 hover:shadow-lg hover:shadow-black/30">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <MapPin className="w-3 h-3 text-gold-400 shrink-0" />
            <h3 className="font-serif text-base text-white leading-tight">{park.name}</h3>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-safari-sand/50">
            {park.region} · {park.elevationM}m
          </span>
        </div>
        <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-1 rounded-full border ${advisoryColor(advisory.level)}`}>
          {advisoryIcon(advisory.level)}
          {advisory.level}
        </span>
      </div>

      {/* Current temp + icon */}
      <div className="flex items-end gap-4">
        <div>
          <span className="font-serif text-5xl font-light text-white leading-none">
            {Math.round(current.tempC)}°
          </span>
          <span className="text-sm text-safari-sand/60 ml-1">C</span>
        </div>
        <div className="pb-1">
          <div className="text-3xl leading-none">{wmoToIcon(current.wmoCode)}</div>
          <div className="text-[11px] text-safari-sand/60 mt-0.5">{getWeatherLabel(current.wmoCode)}</div>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-safari-night rounded-lg p-2.5 text-center">
          <Thermometer className="w-3.5 h-3.5 text-gold-400 mx-auto mb-1" />
          <div className="text-xs font-semibold text-white">{Math.round(current.feelsLikeC)}°C</div>
          <div className="text-[9px] text-safari-sand/50 uppercase tracking-wide">Feels like</div>
        </div>
        <div className="bg-safari-night rounded-lg p-2.5 text-center">
          <Wind className="w-3.5 h-3.5 text-sky-400 mx-auto mb-1" />
          <div className="text-xs font-semibold text-white">{Math.round(current.windKph)} km/h</div>
          <div className="text-[9px] text-safari-sand/50 uppercase tracking-wide">{current.windDirection} Wind</div>
        </div>
        <div className="bg-safari-night rounded-lg p-2.5 text-center">
          <Droplets className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
          <div className="text-xs font-semibold text-white">{current.humidity}%</div>
          <div className="text-[9px] text-safari-sand/50 uppercase tracking-wide">Humidity</div>
        </div>
      </div>

      {/* UV + Precip inline */}
      <div className="flex gap-3 text-xs text-safari-sand/70">
        <span className="flex items-center gap-1">
          <Sun className="w-3 h-3 text-amber-400" />
          UV {current.uvIndex.toFixed(1)}
        </span>
        <span className="flex items-center gap-1">
          <Droplets className="w-3 h-3 text-blue-400" />
          {current.precipMm.toFixed(1)} mm
        </span>
        <span className="ml-auto text-[10px] font-mono text-safari-sand/40">
          {current.isDay ? "Daytime" : "Night"}
        </span>
      </div>

      {/* Season badge */}
      <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-safari-sand/60 uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-gold-400/60 inline-block" />
        {season}
      </div>

      {/* Safari Advisory */}
      <div className="bg-safari-night rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-safari-sand/50">Safari Advisory</span>
          <span className="text-[10px] text-safari-sand/50">{starRow(advisory.gameViewingRating)} game viewing</span>
        </div>
        {advisory.fourByFourRequired && (
          <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wide">
            ⚠ 4x4 Diff-Lock Required
          </div>
        )}
        <ul className="space-y-1">
          {advisory.alerts.slice(0, expanded ? undefined : 2).map((alert, i) => (
            <li key={i} className={`text-[11px] leading-relaxed flex gap-1.5 ${
              advisory.level === "Caution" ? "text-rose-300/80" : advisory.level === "Fair" ? "text-amber-300/80" : "text-emerald-300/80"
            }`}>
              <span className="shrink-0 mt-0.5">›</span>
              {alert}
            </li>
          ))}
        </ul>
        {advisory.alerts.length > 2 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] text-safari-sand/40 hover:text-safari-sand/80 flex items-center gap-1 transition-colors"
          >
            {expanded ? "Show less" : `+${advisory.alerts.length - 2} more`}
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}
        <p className="text-[10px] text-safari-sand/40 italic">{advisory.trackConditionNote}</p>
      </div>

      {/* 7-day forecast strip */}
      <div>
        <div className="text-[9px] font-mono uppercase tracking-widest text-safari-sand/40 mb-2">7-Day Forecast</div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {forecast.slice(0, 7).map((day) => {
            const label = new Date(`${day.date}T00:00:00Z`).toLocaleDateString("en-KE", {
              weekday: "short", timeZone: "UTC"
            });
            return (
              <div
                key={day.date}
                className="flex-shrink-0 bg-safari-night rounded-lg px-2 py-2 text-center min-w-[46px]"
              >
                <div className="text-[9px] text-safari-sand/50 uppercase">{label}</div>
                <div className="text-base my-0.5">{wmoToIcon(day.wmoCode)}</div>
                <div className="text-[10px] font-semibold text-white">{Math.round(day.maxTempC)}°</div>
                <div className="text-[9px] text-safari-sand/40">{Math.round(day.minTempC)}°</div>
                {day.precipProbability > 20 && (
                  <div className="text-[9px] text-blue-400 mt-0.5">{day.precipProbability}%</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fetched at */}
      <div className="text-[9px] font-mono text-safari-sand/30 text-right">
        Updated {formatFetchTime(fetchedAt)} EAT
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WeatherIntelligencePage() {
  const [reports, setReports] = useState<ParkWeatherReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [selectedParkId, setSelectedParkId] = useState<string>("all");

  const loadWeather = useCallback(async (force = false) => {
    if (force) setSyncing(true);
    else setLoading(true);
    setError(null);
    try {
      let data: ParkWeatherReport[];
      if (selectedParkId === "all") {
        data = await fetchAllParksWeather();
      } else {
        const park = AMBER_PLAINS_PARKS.find(p => p.id === selectedParkId);
        if (!park) throw new Error("Park not found");
        data = [await fetchParkWeather(park)];
      }
      setReports(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch weather data.");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [selectedParkId]);

  useEffect(() => { loadWeather(); }, [loadWeather]);

  // Aggregate advisory summary
  const cautionCount  = reports.filter(r => r.advisory.level === "Caution").length;
  const fairCount     = reports.filter(r => r.advisory.level === "Fair").length;
  const idealCount    = reports.filter(r => r.advisory.level === "Ideal").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CloudSun className="w-5 h-5 text-gold-400" />
            <h1 className="font-serif text-2xl text-white">Weather Intelligence</h1>
          </div>
          <p className="text-sm text-safari-sand/60">
            Live Open-Meteo conditions · 10 Kenyan safari parks · EAT timezone
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Park filter */}
          <select
            value={selectedParkId}
            onChange={e => setSelectedParkId(e.target.value)}
            className="bg-safari-card border border-safari-border text-safari-sand/80 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-gold-400/60"
          >
            <option value="all">All Parks</option>
            {AMBER_PLAINS_PARKS.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Force sync */}
          <button
            onClick={() => loadWeather(true)}
            disabled={loading || syncing}
            className="flex items-center gap-2 px-4 py-2 bg-gold-400/10 border border-gold-400/30 text-gold-400 text-xs font-mono uppercase tracking-wider rounded-lg hover:bg-gold-400/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing…" : "Force Sync"}
          </button>
        </div>
      </div>

      {/* ── Advisory Summary ── */}
      {!loading && !error && reports.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-safari-card border border-safari-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <div>
              <div className="font-serif text-2xl text-emerald-400">{idealCount}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-safari-sand/50">Ideal Parks</div>
            </div>
          </div>
          <div className="bg-safari-card border border-safari-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold-400/15 flex items-center justify-center shrink-0">
              <Clock className="w-4.5 h-4.5 text-gold-400" />
            </div>
            <div>
              <div className="font-serif text-2xl text-gold-400">{fairCount}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-safari-sand/50">Fair Parks</div>
            </div>
          </div>
          <div className="bg-safari-card border border-safari-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/15 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-400" />
            </div>
            <div>
              <div className="font-serif text-2xl text-rose-400">{cautionCount}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-safari-sand/50">Caution Parks</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="bg-rose-900/20 border border-rose-500/30 rounded-xl p-5 flex gap-3 items-start">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-rose-300">Weather fetch failed</p>
            <p className="text-xs text-rose-300/70 mt-1">{error}</p>
            <button
              onClick={() => loadWeather(true)}
              className="mt-3 text-xs text-rose-400 underline underline-offset-2 hover:text-rose-300"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* ── Park Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: selectedParkId === "all" ? 10 : 1 }).map((_, i) => <ParkCardSkeleton key={i} />)
          : reports.map(report => <ParkWeatherCard key={report.park.id} report={report} />)
        }
      </div>

      {/* ── Attribution ── */}
      <p className="text-[10px] font-mono text-safari-sand/30 text-center pb-4">
        Weather data sourced from{" "}
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-safari-sand/60"
        >
          Open-Meteo
        </a>{" "}
        — open-source, no API key required. Advisory logic is rule-based and does not replace professional field judgement.
      </p>
    </div>
  );
}
