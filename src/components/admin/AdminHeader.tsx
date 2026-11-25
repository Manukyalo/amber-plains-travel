"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  PlusCircle,
  Telescope,
  Menu,
  AlertTriangle,
  PhoneMissed,
  Package,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  currentAdminUser,
  mockBookings,
  mockVehicles,
  mockGuides,
  mockCallEvents,
  mockMerchandise,
} from "@/data/adminMockData";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AdminHeaderProps {
  adminName?: string;
  adminRole?: string;
  onToggleSidebar?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AdminHeader({
  adminName,
  adminRole,
  onToggleSidebar,
}: AdminHeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<"safari_director" | "operations_manager">(
    "safari_director"
  );

  const displayName = adminName ?? currentAdminUser.name;
  const displayRole = adminRole ?? currentRole.replace("_", " ");

  // Keyboard shortcut Ctrl+K / Cmd+K for global search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Live notifications derived from operational data
  const missedCalls = mockCallEvents.filter((c) => c.status === "missed");
  const lowStockItems = mockMerchandise.filter(
    (m) => m.status === "low_stock" || m.status === "out_of_stock"
  );
  const alertCount = missedCalls.length + lowStockItems.length;

  // Global search results across bookings, vehicles, guides
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: { label: string; sub: string; href: string; tag: string }[] = [];

    mockBookings.forEach((b) => {
      if (
        b.referenceCode.toLowerCase().includes(q) ||
        b.guest.fullName.toLowerCase().includes(q) ||
        b.customTitle.toLowerCase().includes(q)
      ) {
        results.push({
          label: `${b.guest.fullName} (${b.referenceCode})`,
          sub: b.customTitle,
          href: "/admin/bookings",
          tag: "Booking",
        });
      }
    });

    mockVehicles.forEach((v) => {
      if (
        v.registrationPlate.toLowerCase().includes(q) ||
        v.makeModel.toLowerCase().includes(q)
      ) {
        results.push({
          label: v.registrationPlate,
          sub: v.makeModel,
          href: "/admin/fleet",
          tag: "Fleet",
        });
      }
    });

    mockGuides.forEach((g) => {
      if (g.fullName.toLowerCase().includes(q) || g.licenseNumber.toLowerCase().includes(q)) {
        results.push({
          label: g.fullName,
          sub: `KPSGA ${g.kpsgaLevel} · ${g.licenseNumber}`,
          href: "/admin/guides",
          tag: "Guide",
        });
      }
    });

    return results.slice(0, 6);
  }, [searchQuery]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between gap-3 px-4 sm:px-6 bg-safari-night border-b border-safari-border shrink-0">
      {/* ── Left: Sidebar Toggle + Global Search ── */}
      <div className="flex items-center gap-3 flex-1 min-w-0 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-safari-sand/70 hover:text-white hover:bg-safari-card border border-transparent hover:border-safari-border transition-colors shrink-0"
          aria-label="Toggle navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-safari-sand/40 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            placeholder="Search bookings, guests, fleet…"
            aria-label="Global search"
            className="
              w-full h-9 pl-9 pr-14 rounded-lg
              bg-safari-card border border-safari-border
              text-sm text-safari-sand placeholder:text-safari-sand/35
              focus:outline-none focus:border-gold-400/60 focus:bg-safari-night
              transition-colors
            "
          />
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchOpen(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-safari-sand/50 hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-safari-sand/35 select-none">
              Ctrl+K
            </span>
          )}

          {/* Global Search Results Dropdown */}
          {searchOpen && searchQuery.trim().length > 0 && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setSearchOpen(false)}
              />
              <div className="absolute left-0 right-0 top-full mt-1.5 z-20 bg-safari-card border border-safari-border rounded-xl shadow-luxury overflow-hidden">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-4 text-xs font-mono text-safari-sand/50 text-center">
                    No matching bookings, vehicles, or guides found.
                  </div>
                ) : (
                  <ul className="divide-y divide-safari-border">
                    {searchResults.map((res, idx) => (
                      <li key={idx}>
                        <Link
                          href={res.href}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-safari-night/70 transition-colors"
                        >
                          <div className="min-w-0">
                            <span className="block text-sm text-white truncate">
                              {res.label}
                            </span>
                            <span className="block text-xs text-safari-sand/55 truncate">
                              {res.sub}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-safari-night border border-safari-border text-gold-400 shrink-0">
                            {res.tag}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Right Section ── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Contextual Quick Action */}
        <button
          onClick={() => router.push("/admin/costing")}
          className="
            hidden sm:inline-flex items-center gap-1.5
            px-3.5 py-2 rounded-lg
            bg-gold-400 hover:bg-gold-300 active:bg-gold-500
            text-safari-night text-xs font-mono font-semibold uppercase tracking-wide
            transition-colors shadow-sm
          "
        >
          <PlusCircle className="w-3.5 h-3.5" />
          New Quote
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen((o) => !o);
              setProfileOpen(false);
            }}
            className="relative p-2 rounded-lg text-safari-sand/65 hover:text-safari-sand hover:bg-safari-card transition-colors"
            aria-label={`${alertCount} notifications`}
          >
            <Bell className="w-5 h-5" />
            {alertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-safari-night" />
            )}
          </button>

          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1.5 w-80 z-20 bg-safari-card border border-safari-border rounded-xl shadow-luxury overflow-hidden">
                <div className="px-4 py-3 border-b border-safari-border flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-gold-400 font-semibold">
                    Operational Alerts ({alertCount})
                  </span>
                </div>
                <div className="divide-y divide-safari-border max-h-72 overflow-y-auto">
                  {missedCalls.map((call) => (
                    <Link
                      key={call.id}
                      href="/admin/receptionist"
                      onClick={() => setNotificationsOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-safari-night/60 transition-colors"
                    >
                      <PhoneMissed className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-0.5">
                        <span className="text-white font-medium block">
                          Missed Call: {call.callerNumber}
                        </span>
                        <span className="text-safari-sand/60 block">
                          {call.callerCountry} · Review transcript
                        </span>
                      </div>
                    </Link>
                  ))}
                  {lowStockItems.map((item) => (
                    <Link
                      key={item.id}
                      href="/admin/merchandise"
                      onClick={() => setNotificationsOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-safari-night/60 transition-colors"
                    >
                      <Package className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-0.5">
                        <span className="text-white font-medium block">
                          Low Stock: {item.title}
                        </span>
                        <span className="text-safari-sand/60 block">
                          {item.stockQuantity} units remaining (SKU: {item.sku})
                        </span>
                      </div>
                    </Link>
                  ))}
                  {alertCount === 0 && (
                    <div className="px-4 py-6 text-center text-xs text-safari-sand/50">
                      No active operational alerts.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Role Switcher */}
        <button
          onClick={() =>
            setCurrentRole((r) =>
              r === "safari_director" ? "operations_manager" : "safari_director"
            )
          }
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-safari-border text-[10px] font-mono text-safari-sand/65 hover:border-gold-400/40 hover:text-safari-sand/90 transition-colors"
          title="Switch role view"
        >
          <Telescope className="w-3.5 h-3.5 text-gold-400" />
          <span className="capitalize">{currentRole.replace("_", " ")}</span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen((o) => !o);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-safari-card transition-colors"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-full border-2 border-gold-400/40 bg-gold-400/15 flex items-center justify-center">
              <span className="text-xs font-mono font-bold text-gold-300">
                {getInitials(displayName)}
              </span>
            </div>

            <div className="hidden lg:block text-left">
              <span className="block text-sm font-sans text-white leading-none">
                {displayName}
              </span>
              <span className="block text-[10px] font-mono text-safari-sand/50 capitalize mt-0.5">
                {displayRole}
              </span>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-safari-sand/50 transition-transform ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1.5 w-52 z-20 bg-safari-card border border-safari-border rounded-xl shadow-luxury overflow-hidden">
                <div className="px-4 py-3 border-b border-safari-border">
                  <span className="block text-sm font-sans text-white">
                    {displayName}
                  </span>
                  <span className="block text-[10px] font-mono text-safari-sand/50 capitalize mt-0.5">
                    {displayRole}
                  </span>
                </div>

                <Link
                  href="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-mono text-safari-sand/80 hover:bg-safari-night/70 hover:text-white transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-gold-400" />
                  Governance & Settings
                </Link>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-mono text-rose-400 hover:bg-safari-night/70 transition-colors border-t border-safari-border"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
