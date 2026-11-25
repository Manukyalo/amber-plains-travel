"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";

interface MonthlyPoint {
  month: string;
  revenueUsd: number;
}

const HISTORICAL_SERIES: MonthlyPoint[] = [
  { month: "Jun", revenueUsd: 14200 },
  { month: "Jul", revenueUsd: 18900 },
  { month: "Aug", revenueUsd: 24500 },
  { month: "Sep", revenueUsd: 21800 },
  { month: "Oct", revenueUsd: 27400 },
  { month: "Nov", revenueUsd: 31200 },
];

const USD_TO_KES = 129;

type DateRangeKey = "6m" | "3m" | "ytd";
type DisplayCurrency = "USD" | "KES";

interface RevenueChartProps {
  settledRevenueUsd: number;
}

export function RevenueChart({ settledRevenueUsd }: RevenueChartProps) {
  const [range, setRange] = useState<DateRangeKey>("6m");
  const [currency, setCurrency] = useState<DisplayCurrency>("USD");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const visiblePoints = useMemo(() => {
    const base =
      range === "3m"
        ? HISTORICAL_SERIES.slice(-3)
        : HISTORICAL_SERIES;
    // Reflect live settled revenue in the current month (Nov)
    return base.map((pt, i) =>
      i === base.length - 1
        ? { ...pt, revenueUsd: Math.max(pt.revenueUsd, Math.round(settledRevenueUsd)) }
        : pt
    );
  }, [range, settledRevenueUsd]);

  const multiplier = currency === "KES" ? USD_TO_KES : 1;
  const maxVal = Math.max(...visiblePoints.map((p) => p.revenueUsd * multiplier), 1);

  const firstVal = visiblePoints[0]?.revenueUsd ?? 1;
  const lastVal = visiblePoints[visiblePoints.length - 1]?.revenueUsd ?? 1;
  const growthPct = Math.round(((lastVal - firstVal) / Math.max(firstVal, 1)) * 1000) / 10;

  const formatMoney = (valUsd: number) => {
    const converted = Math.round(valUsd * multiplier);
    return currency === "KES"
      ? `KES ${converted.toLocaleString()}`
      : `$${converted.toLocaleString()}`;
  };

  // SVG coordinate geometry
  const width = 560;
  const height = 180;
  const padX = 28;
  const padTop = 20;
  const padBottom = 28;
  const plotW = width - padX * 2;
  const plotH = height - padTop - padBottom;

  const coords = visiblePoints.map((pt, idx) => {
    const x =
      visiblePoints.length === 1
        ? padX + plotW / 2
        : padX + (idx / (visiblePoints.length - 1)) * plotW;
    const y = padTop + plotH - ((pt.revenueUsd * multiplier) / (maxVal * 1.12)) * plotH;
    return { x, y, ...pt };
  });

  const linePath = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");

  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`
      : "";

  const activePoint = hoveredIdx !== null ? coords[hoveredIdx] : coords[coords.length - 1];

  return (
    <div className="bg-safari-card border border-safari-border rounded-xl p-5 sm:p-6 space-y-5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block">
            Financial Performance
          </span>
          <h3 className="font-serif text-xl text-white mt-0.5">Revenue Overview</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Currency toggle */}
          <div className="inline-flex rounded-lg bg-safari-night border border-safari-border p-0.5 text-[10px] font-mono">
            {(["USD", "KES"] as DisplayCurrency[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  currency === c
                    ? "bg-gold-400 text-safari-night font-bold"
                    : "text-safari-sand/60 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Date-range filter */}
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as DateRangeKey)}
            aria-label="Filter revenue date range"
            className="bg-safari-night border border-safari-border rounded-lg px-2.5 py-1.5 text-xs font-mono text-safari-sand focus:outline-none focus:border-gold-400"
          >
            <option value="6m">Last 6 Months</option>
            <option value="3m">Last 3 Months</option>
            <option value="ytd">Year to Date</option>
          </select>
        </div>
      </div>

      {/* Headline figure + growth */}
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="font-serif text-3xl text-white">
            {formatMoney(activePoint ? activePoint.revenueUsd : settledRevenueUsd)}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs font-mono">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />+{Math.max(0, growthPct)}%
            </span>
            <span className="text-safari-sand/50">
              vs start of period ({activePoint?.month ?? "Nov"})
            </span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-safari-sand/50">
          Settled Ledger: {formatMoney(settledRevenueUsd)}
        </span>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 select-none"
          role="img"
          aria-label="Historical revenue performance chart"
        >
          <defs>
            <linearGradient id="amberRevenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF6A" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#D4AF6A" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Subtle horizontal gridlines */}
          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const yPos = padTop + plotH * (1 - ratio);
            return (
              <line
                key={ratio}
                x1={padX}
                y1={yPos}
                x2={width - padX}
                y2={yPos}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="3 3"
              />
            );
          })}

          {/* Area & Line */}
          {areaPath && <path d={areaPath} fill="url(#amberRevenueFill)" />}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#D4AF6A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points & X-axis labels */}
          {coords.map((pt, idx) => {
            const isActive =
              hoveredIdx === idx || (hoveredIdx === null && idx === coords.length - 1);
            return (
              <g
                key={pt.month}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? 5.5 : 3.5}
                  fill={isActive ? "#D4AF6A" : "#0B0D0C"}
                  stroke="#D4AF6A"
                  strokeWidth="2"
                />
                <text
                  x={pt.x}
                  y={height - 6}
                  textAnchor="middle"
                  className="fill-safari-sand/50 text-[11px] font-mono"
                >
                  {pt.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
