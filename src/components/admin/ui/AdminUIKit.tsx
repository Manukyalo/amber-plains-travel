// Shared admin UI primitives — imported across all admin pages.
// Keep these pure presentational components with no server/data coupling.

import React from "react";

// ─── KPI Card ────────────────────────────────────────────────────────────────

type KpiVariant = "gold" | "emerald" | "rose" | "blue";

interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  icon: React.ElementType;
  variant?: KpiVariant;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
}

const VARIANT_STYLES: Record<KpiVariant, { icon: string; badge: string }> = {
  gold: {
    icon: "bg-gold-400/15 text-gold-400",
    badge: "text-gold-300",
  },
  emerald: {
    icon: "bg-emerald-500/15 text-emerald-400",
    badge: "text-emerald-400",
  },
  rose: {
    icon: "bg-rose-500/15 text-rose-400",
    badge: "text-rose-400",
  },
  blue: {
    icon: "bg-blue-500/15 text-blue-400",
    badge: "text-blue-400",
  },
};

export function KpiCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = "gold",
  trend,
  trendLabel,
}: KpiCardProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div className="bg-safari-card border border-safari-border rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-safari-sand/60">
          {label}
        </span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${styles.icon}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>

      <div className="font-serif text-3xl font-normal text-white leading-none">
        {value}
      </div>

      {(subtext || trendLabel) && (
        <div className="flex items-center gap-1.5">
          {trend === "up" && (
            <span className="text-emerald-400 text-xs font-mono">↑</span>
          )}
          {trend === "down" && (
            <span className="text-rose-400 text-xs font-mono">↓</span>
          )}
          <span className={`text-xs font-mono ${styles.badge}`}>
            {trendLabel ?? subtext}
          </span>
          {subtext && trendLabel && (
            <span className="text-xs text-safari-sand/50">{subtext}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

type BadgeVariant =
  | "confirmed"
  | "pending"
  | "in_safari"
  | "completed"
  | "alert"
  | "live"
  | "neutral";

const BADGE_STYLES: Record<BadgeVariant, string> = {
  confirmed: "bg-emerald-950 text-emerald-300 border-emerald-500/40",
  pending: "bg-amber-950 text-amber-300 border-amber-500/40",
  in_safari: "bg-blue-950 text-blue-300 border-blue-500/40",
  completed: "bg-safari-surface text-safari-sand/70 border-safari-border",
  alert: "bg-rose-950 text-rose-300 border-rose-500/40",
  live: "bg-emerald-950 text-emerald-300 border-emerald-500/40",
  neutral: "bg-safari-card text-safari-sand/70 border-safari-border",
};

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

export function StatusBadge({ status, variant = "neutral", className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded
        text-[10px] font-mono uppercase tracking-wide border
        ${BADGE_STYLES[variant]} ${className}
      `}
    >
      {status}
    </span>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}

export function SectionHeader({ eyebrow, title, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-safari-border">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
          {eyebrow}
        </span>
        <h1 className="font-serif text-3xl font-normal text-white mt-1">{title}</h1>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
  message: string;
  hint?: string;
}

export function EmptyState({ message, hint }: EmptyStateProps) {
  return (
    <div className="py-16 text-center space-y-1">
      <p className="text-sm text-safari-sand/50">{message}</p>
      {hint && <p className="text-xs text-safari-sand/30 font-mono">{hint}</p>}
    </div>
  );
}

// ─── Card Container ───────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, className = "", noPadding = false }: CardProps) {
  return (
    <div
      className={`bg-safari-card border border-safari-border rounded-xl ${
        noPadding ? "" : "p-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}
