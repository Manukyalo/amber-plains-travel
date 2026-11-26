"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Calculator,
  CreditCard,
  FileText,
  Route,
  Truck,
  Users,
  ShoppingBag,
  Globe,
  Bot,
  Search,
  BarChart3,
  Settings,
  ExternalLink,
  X,
  CloudSun,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { mockBookings } from "@/data/adminMockData";
import { TODAY_ISO, isBookingActivePipeline } from "@/utils/bookingDates";
import { useOpsIntelligence } from "@/contexts/OpsIntelligenceContext";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeVariant?: "gold" | "emerald" | "rose";
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

interface AdminSidebarProps {
  collapsed?: boolean;
  onCloseMobile?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useIsStandaloneAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname.startsWith("admin.");
}

function BadgePill({
  badge,
  variant = "gold",
}: {
  badge: string | number;
  variant?: "gold" | "emerald" | "rose";
}) {
  const styles: Record<string, string> = {
    gold: "bg-gold-400/15 text-gold-400 border-gold-400/30",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    rose: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider border ${styles[variant]}`}
    >
      {badge}
    </span>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AdminSidebar({ collapsed = false, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const isStandalone = useIsStandaloneAdmin();
  const { activeSosAlerts } = useOpsIntelligence();

  const activeBookingsCount = mockBookings.filter((b) =>
    isBookingActivePipeline(b, TODAY_ISO)
  ).length;
  const activeSosCount = activeSosAlerts.length;

  const navGroups: NavGroup[] = [
    {
      group: "Command Centre",
      items: [
        { label: "Command Centre", href: "/admin", icon: LayoutDashboard },
        {
          label: "Bookings & Guests",
          href: "/admin/bookings",
          icon: CalendarDays,
          badge: activeBookingsCount,
          badgeVariant: "gold",
        },
        { label: "Costing & Pricing", href: "/admin/costing", icon: Calculator },
        { label: "Payments & Ledger", href: "/admin/payments", icon: CreditCard },
      ],
    },
    {
      group: "Operations & Logistics",
      items: [
        { label: "Supplier Contracts", href: "/admin/suppliers", icon: FileText },
        { label: "Packages & Routes", href: "/admin/packages", icon: Route },
        { label: "4x4 Safari Fleet", href: "/admin/fleet", icon: Truck },
        { label: "Guides & Drivers", href: "/admin/guides", icon: Users },
        { label: "Weather Intelligence", href: "/admin/weather", icon: CloudSun },
        {
          label: "SOS Command",
          href: "/admin/sos-alerts",
          icon: ShieldAlert,
          badge: activeSosCount > 0 ? activeSosCount : undefined,
          badgeVariant: "rose",
        },
        { label: "Merchandise", href: "/admin/merchandise", icon: ShoppingBag },
      ],
    },
    {
      group: "Intelligence & Growth",
      items: [
        { label: "Website CMS & App", href: "/admin/cms", icon: Globe },
        {
          label: "AI Receptionist",
          href: "/admin/receptionist",
          icon: Bot,
          badge: "Live",
          badgeVariant: "emerald",
        },
        { label: "Website Hunter", href: "/admin/hunter", icon: Search },
        { label: "SEO Engine", href: "/admin/seo", icon: BarChart3 },
      ],
    },
    {
      group: "Governance",
      items: [
        { label: "Audit Trail", href: "/admin/audit", icon: ShieldCheck },
        { label: "Reports & Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const publicHref = isStandalone ? "https://amberplainstravel.com" : "/";

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-screen flex flex-col bg-safari-night border-r border-safari-border transition-all duration-200`}
    >
      {/* ── Brand / Logo ── */}
      <div className="px-4 pt-5 pb-4 border-b border-safari-border">
        <div className="flex items-center justify-between gap-2">
          <Link href="/admin" className="flex items-center gap-3 min-w-0">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-gold-400/25 bg-safari-card">
              <Image
                src="/images/amber-plains-website-logo-transparent.png"
                alt="Amber Plains"
                fill
                sizes="36px"
                className="object-contain p-0.5"
              />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-serif text-base font-normal text-white leading-tight block truncate">
                  Amber Plains
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-gold-400 leading-none block mt-0.5">
                  Operations Control
                </span>
              </div>
            )}
          </Link>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-safari-sand/60 hover:text-white hover:bg-safari-card"
              aria-label="Close navigation menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {!collapsed && (
          <div className="mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-mono text-safari-sand/50">
              All Systems Operational
            </span>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.group}>
            {!collapsed && (
              <span className="px-2 mb-1.5 block text-[9px] font-mono uppercase tracking-[0.15em] text-safari-sand/40 font-semibold">
                {group.group}
              </span>
            )}

            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`
                        group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-sans transition-colors duration-150
                        ${collapsed ? "justify-center" : ""}
                        ${
                          active
                            ? "bg-gold-400/12 text-white border border-gold-400/25"
                            : "text-safari-sand/65 hover:bg-safari-card hover:text-safari-sand border border-transparent"
                        }
                      `}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gold-400 rounded-r" />
                      )}

                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          active
                            ? "text-gold-400"
                            : "text-safari-sand/50 group-hover:text-safari-sand/80"
                        }`}
                      />

                      {!collapsed && (
                        <>
                          <span className="flex-1 text-sm leading-none truncate">
                            {item.label}
                          </span>

                          {item.badge !== undefined && (
                            <BadgePill
                              badge={item.badge}
                              variant={item.badgeVariant ?? "gold"}
                            />
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="px-3 py-3.5 border-t border-safari-border space-y-1">
        <a
          href={publicHref}
          target={isStandalone ? "_blank" : "_self"}
          rel="noreferrer"
          title="Public Website"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-sans text-safari-sand/55 hover:text-safari-sand/90 hover:bg-safari-card transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && <span>Public Website</span>}
        </a>
        {!collapsed && (
          <div className="px-3 py-1 flex items-center justify-between">
            <span className="text-[9px] font-mono text-safari-sand/35">
              © 2026 Amber Plains
            </span>
            <span className="text-[9px] font-mono text-safari-sand/35">
              v1.1.0
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
