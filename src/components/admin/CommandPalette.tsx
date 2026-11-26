"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Command, X } from "lucide-react";
import {
  mockBookings,
  mockVehicles,
  mockGuides,
  mockSuppliers,
} from "@/data/adminMockData";

interface CommandItem {
  id: string;
  label: string;
  subtitle: string;
  category: "Route" | "Booking" | "Fleet" | "Guide" | "Supplier";
  href: string;
}

const ADMIN_ROUTES: CommandItem[] = [
  { id: "rt-overview", label: "Command Centre Overview", subtitle: "Executive KPIs & Safari Pipeline", category: "Route", href: "/admin" },
  { id: "rt-bookings", label: "Bookings & Guests CRM", subtitle: "Reservations, notes & guest manifests", category: "Route", href: "/admin/bookings" },
  { id: "rt-costing", label: "Costing & Pricing Engine", subtitle: "Deterministic markup & margin controls", category: "Route", href: "/admin/costing" },
  { id: "rt-payments", label: "Payments & Ledger", subtitle: "Stripe, IntaSend & M-Pesa audit log", category: "Route", href: "/admin/payments" },
  { id: "rt-fleet", label: "4x4 Safari Fleet", subtitle: "Vehicles, odometers & workshop service", category: "Route", href: "/admin/fleet" },
  { id: "rt-guides", label: "Guides & Drivers", subtitle: "KPSGA naturalists & driver roster", category: "Route", href: "/admin/guides" },
  { id: "rt-suppliers", label: "Supplier Contracts", subtitle: "Lodges, camps & confidential net rates", category: "Route", href: "/admin/suppliers" },
  { id: "rt-packages", label: "Packages & Routes", subtitle: "Itineraries & catalog portfolio", category: "Route", href: "/admin/packages" },
  { id: "rt-receptionist", label: "AI Receptionist", subtitle: "Inbound call logs & lead capture", category: "Route", href: "/admin/receptionist" },
  { id: "rt-settings", label: "Reports & Settings", subtitle: "Governance, levies & audit stream", category: "Route", href: "/admin/settings" },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  const allItems = useMemo<CommandItem[]>(() => {
    const dynamic: CommandItem[] = [
      ...mockBookings.map((b) => ({
        id: `bk-${b.id}`,
        label: `${b.guest.fullName} (${b.referenceCode})`,
        subtitle: `${b.customTitle} · ${b.startDate}`,
        category: "Booking" as const,
        href: "/admin/bookings",
      })),
      ...mockVehicles.map((v) => ({
        id: `vh-${v.id}`,
        label: v.registrationPlate,
        subtitle: `${v.makeModel} · ${v.status.replace("_", " ")}`,
        category: "Fleet" as const,
        href: "/admin/fleet",
      })),
      ...mockGuides.map((g) => ({
        id: `gd-${g.id}`,
        label: g.fullName,
        subtitle: `KPSGA ${g.kpsgaLevel} · ${g.licenseNumber}`,
        category: "Guide" as const,
        href: "/admin/guides",
      })),
      ...mockSuppliers.map((s) => ({
        id: `sup-${s.id}`,
        label: s.supplierName,
        subtitle: `${s.location} · ${s.contractVersion}`,
        category: "Supplier" as const,
        href: "/admin/suppliers",
      })),
    ];
    return [...ADMIN_ROUTES, ...dynamic];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems.slice(0, 8);
    return allItems
      .filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [query, allItems]);

  const handleSelect = (item: CommandItem) => {
    onClose();
    router.push(item.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (results.length > 0 ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        results.length > 0 ? (i - 1 + results.length) % results.length : 0
      );
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Global Operations Command Palette"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-2xl bg-safari-card border border-safari-border rounded-2xl shadow-luxury overflow-hidden z-50"
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-safari-border bg-safari-night/80">
          <Search className="w-4 h-4 text-gold-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Jump to module, booking ref, guest, cruiser plate, or supplier…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-safari-sand/40 focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close command palette"
            className="p-1 text-safari-sand/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-safari-border/60">
          {results.length === 0 ? (
            <div className="py-10 text-center text-xs font-mono text-safari-sand/50">
              No matching operational records found.
            </div>
          ) : (
            results.map((item, idx) => {
              const selected = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`w-full px-4 py-3 flex items-center justify-between gap-3 text-left transition-colors ${
                    selected ? "bg-gold-400/12" : "hover:bg-safari-night/40"
                  }`}
                >
                  <div className="min-w-0">
                    <span className="text-sm text-white font-medium block truncate">
                      {item.label}
                    </span>
                    <span className="text-xs text-safari-sand/60 block truncate">
                      {item.subtitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-safari-night border border-safari-border text-gold-400">
                      {item.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-safari-sand/40" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-safari-border bg-safari-night/80 flex items-center justify-between text-[10px] font-mono text-safari-sand/45">
          <span className="inline-flex items-center gap-1">
            <Command className="w-3 h-3" /> ↑↓ Navigate · ↵ Open · Esc Close
          </span>
          <span>Amber Plains Operations Index</span>
        </div>
      </div>
    </div>
  );
}
