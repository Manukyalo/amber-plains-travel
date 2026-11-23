"use client";

import React from "react";
import Link from "next/link";
import {
  DollarSign,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Truck,
  PhoneCall,
  CheckCircle,
  FileText,
  UserCheck,
} from "lucide-react";
import {
  mockBookings,
  mockVehicles,
  mockCallEvents,
  mockMerchandise,
} from "@/data/adminMockData";

export default function AdminOverviewPage() {
  const activeBookings = mockBookings.filter((b) => b.stage !== "completed" && b.stage !== "cancelled");
  const confirmedBookings = mockBookings.filter((b) => b.stage === "confirmed" || b.stage === "in_safari");
  const totalRevenueUsd = confirmedBookings.reduce((sum, b) => sum + b.totalSellingPriceUsd, 0);
  const totalBalanceDueUsd = mockBookings.reduce((sum, b) => sum + b.balanceDueUsd, 0);
  const vehiclesOnSafari = mockVehicles.filter((v) => v.status === "on_safari").length;
  const missedCalls = mockCallEvents.filter((c) => c.status === "missed").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-safari-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Mombasa Headquarters Duty Desk
          </span>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            Operations & Control Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/bookings"
            className="px-3.5 py-2 rounded bg-safari-card border border-safari-border text-xs text-safari-sand hover:text-white hover:border-gold-400 transition-colors"
          >
            Manage All Bookings
          </Link>
          <Link
            href="/admin/costing"
            className="px-3.5 py-2 rounded bg-gold-400 text-safari-night font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-300 transition-colors"
          >
            Calculate Safari Costing
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-safari-card border border-safari-border rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-safari-sand/60">
            <span>CONFIRMED REVENUE</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-serif text-3xl text-white">
            ${totalRevenueUsd.toLocaleString()}
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last quarter
          </span>
        </div>

        <div className="p-5 bg-safari-card border border-safari-border rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-safari-sand/60">
            <span>OUTSTANDING BALANCES</span>
            <Clock className="w-4 h-4 text-gold-400" />
          </div>
          <div className="font-serif text-3xl text-gold-300">
            ${totalBalanceDueUsd.toLocaleString()}
          </div>
          <span className="text-[11px] text-safari-sand/60">Across 3 active pipeline bookings</span>
        </div>

        <div className="p-5 bg-safari-card border border-safari-border rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-safari-sand/60">
            <span>FLEET UTILIZATION</span>
            <Truck className="w-4 h-4 text-gold-400" />
          </div>
          <div className="font-serif text-3xl text-white">
            {vehiclesOnSafari} / {mockVehicles.length}
          </div>
          <span className="text-[11px] text-safari-sand/60">Cruisers currently deep in field</span>
        </div>

        <div className="p-5 bg-safari-card border border-safari-border rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-safari-sand/60">
            <span>ACTIONABLE ALERTS</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="font-serif text-3xl text-rose-400">
            {missedCalls + 1}
          </div>
          <span className="text-[11px] text-rose-300">1 urgent call + 1 low stock warning</span>
        </div>
      </div>

      {/* Main Grid: Pipeline & Operational Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bookings Pipeline & Departures */}
        <div className="lg:col-span-8 space-y-8">
          {/* Active Bookings Stage Table */}
          <div className="bg-safari-card border border-safari-border rounded-lg overflow-hidden">
            <div className="p-5 border-b border-safari-border flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg text-white">Active Safari Pipeline</h3>
                <p className="text-xs text-safari-sand/60">Current bookings moving through operational stages</p>
              </div>
              <Link
                href="/admin/bookings"
                className="text-xs font-mono text-gold-400 hover:text-gold-300 flex items-center gap-1"
              >
                View Pipeline <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-safari-night/70 text-[10px] font-mono uppercase tracking-wider text-safari-sand/60 border-b border-safari-border">
                  <tr>
                    <th className="py-3 px-4">Ref Code</th>
                    <th className="py-3 px-4">Lead Guest</th>
                    <th className="py-3 px-4">Dates / Duration</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4 text-right">Value (USD)</th>
                    <th className="py-3 px-4 text-right">Deposit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-safari-border text-safari-sand/90">
                  {mockBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-safari-night/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-gold-300 font-semibold">
                        {b.referenceCode}
                      </td>
                      <td className="py-3.5 px-4 font-serif text-sm text-white">
                        {b.guest.fullName}
                        <span className="block text-[10px] font-mono text-safari-sand/50">
                          {b.guest.country} · {b.adultsCount} Adults
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {b.startDate} ({b.durationDays}D)
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                            b.stage === "confirmed"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                              : b.stage === "in_safari"
                              ? "bg-blue-950 text-blue-300 border border-blue-500/40 animate-pulse"
                              : b.stage === "deposit_pending"
                              ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                              : "bg-safari-night text-safari-sand/70 border border-safari-border"
                          }`}
                        >
                          {b.stage.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-serif text-sm text-white">
                        ${b.totalSellingPriceUsd.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[11px]">
                        {b.depositPaid ? (
                          <span className="text-emerald-400">✓ Paid</span>
                        ) : (
                          <span className="text-amber-400">Due ${b.depositAmountUsd.toLocaleString()}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Field Departures Schedule */}
          <div className="bg-safari-card border border-safari-border rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg text-white">Upcoming Field Departures</h3>
                <p className="text-xs text-safari-sand/60">Guide roster & cruiser assignments from Mombasa Base</p>
              </div>
              <Link href="/admin/fleet" className="text-xs font-mono text-gold-400 hover:underline">
                Fleet Status →
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded bg-safari-night border border-safari-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block">
                    Departure: August 4, 2026 (07:00 EAT)
                  </span>
                  <h4 className="font-serif text-base text-white">Dr. Elena Rostova Family (Amboseli Crest)</h4>
                  <p className="text-xs text-safari-sand/70">Pick up: Diani Beach Villa · Drop off: Mombasa</p>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-safari-sand/80">
                  <span className="p-1.5 rounded bg-safari-card border border-safari-border">Guide: Jackson Ole Lenku</span>
                  <span className="p-1.5 rounded bg-safari-card border border-safari-border">Vehicle: KDG 893L</span>
                </div>
              </div>

              <div className="p-4 rounded bg-safari-night border border-safari-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block">
                    Departure: September 12, 2026 (06:30 EAT)
                  </span>
                  <h4 className="font-serif text-base text-white">Lord & Lady Harrington (Great Savanna Odyssey)</h4>
                  <p className="text-xs text-safari-sand/70">Pick up: Moi International Airport · Direct Tsavo East Transfer</p>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-safari-sand/80">
                  <span className="p-1.5 rounded bg-safari-card border border-safari-border">Guide: David Ndung'u</span>
                  <span className="p-1.5 rounded bg-safari-card border border-safari-border">Vehicle: KDE 412X</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Operational Alerts & AI Dispatch */}
        <div className="lg:col-span-4 space-y-6">
          {/* Urgent Operational Task Queue */}
          <div className="bg-safari-card border border-safari-border rounded-lg p-5 space-y-4">
            <h3 className="font-serif text-lg text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-gold-400" />
              Duty Officer Action Items
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-safari-night rounded border border-rose-500/40 text-rose-200 space-y-1">
                <span className="font-mono text-[10px] uppercase text-rose-400 block font-semibold">
                  Missed Call Follow-Up
                </span>
                <p>Nairobi partner call +254 722 400 918 marked urgent same-day request.</p>
                <Link
                  href="/admin/receptionist"
                  className="text-xs font-mono text-gold-300 underline block pt-1"
                >
                  View Transcript & Callback →
                </Link>
              </div>

              <div className="p-3 bg-safari-night rounded border border-safari-border text-safari-sand/80 space-y-1">
                <span className="font-mono text-[10px] uppercase text-gold-400 block font-semibold">
                  Contract Review Due
                </span>
                <p>Tortilis Camp 2026 peak season allocation has 4 blackout dates to verify.</p>
                <Link
                  href="/admin/suppliers"
                  className="text-xs font-mono text-gold-300 underline block pt-1"
                >
                  Review Contract attachment →
                </Link>
              </div>

              <div className="p-3 bg-safari-night rounded border border-safari-border text-safari-sand/80 space-y-1">
                <span className="font-mono text-[10px] uppercase text-amber-400 block font-semibold">
                  Low Merchandise Stock
                </span>
                <p>Field Canvas Photography Vests down to 12 units (threshold: 15).</p>
                <Link
                  href="/admin/merchandise"
                  className="text-xs font-mono text-gold-300 underline block pt-1"
                >
                  Reorder from Mombasa supplier →
                </Link>
              </div>
            </div>
          </div>

          {/* Quick CMS & App Distribution Pulse */}
          <div className="bg-safari-card border border-safari-border rounded-lg p-5 space-y-4">
            <h3 className="font-serif text-lg text-white">App Distribution & Website CMS</h3>
            <div className="space-y-2 text-xs font-mono text-safari-sand/80">
              <div className="flex justify-between py-1 border-b border-safari-border">
                <span>Stable QR URL:</span>
                <span className="text-gold-300 font-bold truncate max-w-[150px]">
                  amberplains.co.ke/app
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-safari-border">
                <span>App Store Status:</span>
                <span className="text-amber-400">Phase 3 Coming Soon</span>
              </div>
              <div className="flex justify-between py-1 border-b border-safari-border">
                <span>VIP Waitlist Leads:</span>
                <span className="text-white">76 Confirmed Guests</span>
              </div>
            </div>

            <Link
              href="/admin/cms"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded bg-safari-night hover:bg-safari-surface border border-safari-border text-xs font-mono text-gold-400 transition-colors"
            >
              Manage CMS & App Links →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
