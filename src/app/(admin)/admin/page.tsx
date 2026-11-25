"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DollarSign,
  AlertTriangle,
  Clock,
  ArrowRight,
  Truck,
  CalendarCheck,
  CreditCard,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import {
  currentAdminUser,
  mockBookings,
  mockVehicles,
  mockGuides,
  mockCallEvents,
  mockTransactions,
  mockMerchandise,
} from "@/data/adminMockData";
import {
  TODAY_ISO,
  computeBookingStage,
  isBookingInSafariToday,
  isBookingActivePipeline,
  getUpcomingDepartures,
} from "@/utils/bookingDates";
import { KpiCard, StatusBadge, Card } from "@/components/admin/ui/AdminUIKit";
import { RevenueChart } from "@/components/admin/ui/RevenueChart";

const USD_TO_KES = 129;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatOperationalDate(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function stageToBadgeVariant(
  stage: string
): "confirmed" | "in_safari" | "completed" | "pending" | "neutral" {
  if (stage === "confirmed") return "confirmed";
  if (stage === "in_safari") return "in_safari";
  if (stage === "completed") return "completed";
  if (stage === "deposit_pending") return "pending";
  return "neutral";
}

export default function AdminOverviewPage() {
  // Real revenue calculated from immutable succeeded transaction rows
  const totalRevenueUsd = mockTransactions
    .filter((t) => t.status === "succeeded")
    .reduce((sum, t) => sum + t.amountCents / 100, 0);

  // Outstanding balances from all active (uncompleted / uncancelled) bookings
  const activeBookings = mockBookings.filter((b) =>
    isBookingActivePipeline(b, TODAY_ISO)
  );
  const totalBalanceDueUsd = activeBookings.reduce(
    (sum, b) => sum + b.balanceDueUsd,
    0
  );

  // In-field safari cruisers calculation
  const inSafariBookings = mockBookings.filter((b) =>
    isBookingInSafariToday(b, TODAY_ISO)
  );
  const inSafariVehicleIds = new Set(
    inSafariBookings.map((b) => b.assignedVehicleId).filter(Boolean)
  );
  const activeFleetVehicles = mockVehicles.filter(
    (v) => v.status !== "scheduled_maintenance"
  );
  const vehiclesOnSafariToday = mockVehicles.filter((v) =>
    inSafariVehicleIds.has(v.id)
  ).length;
  const fleetUtilizationPct =
    activeFleetVehicles.length > 0
      ? Math.round((vehiclesOnSafariToday / activeFleetVehicles.length) * 100)
      : 0;

  // Upcoming field departures (start_date >= today, sorted ascending, limit 5)
  const upcomingDepartures = getUpcomingDepartures(mockBookings, TODAY_ISO, 5);
  const missedCalls = mockCallEvents.filter((c) => c.status === "missed").length;
  const lowStockCount = mockMerchandise.filter(
    (m) => m.status === "low_stock" || m.status === "out_of_stock"
  ).length;
  const totalAlerts = missedCalls + Math.max(1, lowStockCount);

  const firstName = currentAdminUser.name.split(" ")[0];
  const recentPayments = mockTransactions.slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Welcome Hero Banner ── */}
      <section className="relative rounded-2xl overflow-hidden border border-safari-border bg-safari-card">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-safari.jpg"
            alt="Amber Plains Savanna"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-safari-night via-safari-night/90 to-safari-night/40" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/15 border border-gold-400/30 text-gold-300 text-xs font-mono">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatOperationalDate(TODAY_ISO)} · Mombasa Duty Desk</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
              {getGreeting()}, {firstName}
            </h1>
            <p className="text-sm text-safari-sand/75 font-light">
              Here is today&apos;s live safari pipeline, settled ledger telemetry, and field fleet dispatch across Kenya.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/admin/bookings"
              className="px-4 py-2.5 rounded-lg bg-safari-night/80 border border-safari-border text-xs font-mono text-safari-sand hover:text-white hover:border-gold-400/60 transition-colors"
            >
              Manage Bookings
            </Link>
            <Link
              href="/admin/costing"
              className="px-4 py-2.5 rounded-lg bg-gold-400 hover:bg-gold-300 text-safari-night font-mono text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              Calculate Safari Costing
            </Link>
          </div>
        </div>
      </section>

      {/* ── KPI Cards (4) ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <KpiCard
          label="Settled Revenue"
          value={`$${totalRevenueUsd.toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
          subtext={`KES ${Math.round(totalRevenueUsd * USD_TO_KES).toLocaleString()} · Verified ledger`}
          trend="up"
          icon={DollarSign}
          variant="emerald"
        />

        <KpiCard
          label="Outstanding Balances"
          value={`$${totalBalanceDueUsd.toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
          subtext={`Across ${activeBookings.length} active bookings`}
          icon={Clock}
          variant="gold"
        />

        <div className="bg-safari-card border border-safari-border rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-safari-sand/60">
              Fleet Utilization
            </span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-500/15 text-blue-400">
              <Truck className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="font-serif text-3xl font-normal text-white leading-none">
              {vehiclesOnSafariToday} / {activeFleetVehicles.length}
            </div>
            <span className="text-xs font-mono text-blue-400 font-semibold">
              {fleetUtilizationPct}% active
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-safari-night overflow-hidden">
            <div
              className="h-full rounded-full bg-gold-400 transition-all duration-300"
              style={{ width: `${fleetUtilizationPct}%` }}
            />
          </div>
        </div>

        <KpiCard
          label="Actionable Alerts"
          value={totalAlerts}
          subtext={`${missedCalls} missed call · ${lowStockCount} low stock`}
          icon={AlertTriangle}
          variant="rose"
        />
      </section>

      {/* ── Analytics & Upcoming Field Departures ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <RevenueChart settledRevenueUsd={totalRevenueUsd} />
        </div>

        <div className="lg:col-span-5">
          <Card noPadding className="overflow-hidden">
            <div className="p-5 border-b border-safari-border flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg text-white">Upcoming Field Departures</h3>
                <p className="text-xs text-safari-sand/55">
                  On or after {TODAY_ISO}
                </p>
              </div>
              <Link
                href="/admin/fleet"
                className="text-xs font-mono text-gold-400 hover:text-gold-300 flex items-center gap-1"
              >
                Fleet <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {upcomingDepartures.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-safari-sand/50 flex flex-col items-center gap-2">
                <CalendarCheck className="w-6 h-6 text-safari-sand/30" />
                <span>No upcoming field departures scheduled on or after {TODAY_ISO}.</span>
              </div>
            ) : (
              <div className="divide-y divide-safari-border">
                {upcomingDepartures.map((departure) => {
                  const assignedGuide = mockGuides.find(
                    (g) => g.id === departure.assignedGuideId
                  );
                  const assignedVehicle = mockVehicles.find(
                    (v) => v.id === departure.assignedVehicleId
                  );

                  return (
                    <div
                      key={departure.id}
                      className="p-4 hover:bg-safari-night/50 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono text-gold-400 uppercase tracking-wider block">
                            {departure.startDate} · {departure.durationDays} Days
                          </span>
                          <h4 className="font-serif text-base text-white truncate">
                            {departure.guest.fullName}
                          </h4>
                          <p className="text-xs text-safari-sand/60 truncate">
                            {departure.customTitle}
                          </p>
                        </div>
                        <StatusBadge
                          status={departure.stage.replace("_", " ")}
                          variant={stageToBadgeVariant(departure.stage)}
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-safari-sand/70">
                        <span className="px-2 py-0.5 rounded bg-safari-night border border-safari-border">
                          Guide: {assignedGuide ? assignedGuide.fullName : "Roster Pending"}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-safari-night border border-safari-border">
                          {assignedVehicle ? assignedVehicle.registrationPlate : "Unassigned"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* ── Operational Sections: Pipeline & Action Items ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Safari Pipeline + Recent Payments */}
        <div className="lg:col-span-8 space-y-6">
          <Card noPadding className="overflow-hidden">
            <div className="p-5 border-b border-safari-border flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg text-white">Active Safari Pipeline</h3>
                <p className="text-xs text-safari-sand/60">
                  Date-driven operational status ({TODAY_ISO})
                </p>
              </div>
              <Link
                href="/admin/bookings"
                className="text-xs font-mono text-gold-400 hover:text-gold-300 flex items-center gap-1"
              >
                View Pipeline <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[640px]">
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
                  {mockBookings.map((b) => {
                    const currentStage = computeBookingStage(b, TODAY_ISO);
                    return (
                      <tr key={b.id} className="hover:bg-safari-night/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-gold-300 font-semibold whitespace-nowrap">
                          {b.referenceCode}
                        </td>
                        <td className="py-3.5 px-4 font-serif text-sm text-white">
                          {b.guest.fullName}
                          <span className="block text-[10px] font-mono text-safari-sand/50">
                            {b.guest.country} · {b.adultsCount} Adults
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] whitespace-nowrap">
                          {b.startDate} ({b.durationDays}D)
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge
                            status={currentStage.replace("_", " ")}
                            variant={stageToBadgeVariant(currentStage)}
                          />
                        </td>
                        <td className="py-3.5 px-4 text-right font-serif text-sm text-white whitespace-nowrap">
                          ${b.totalSellingPriceUsd.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-[11px] whitespace-nowrap">
                          {b.depositPaid ? (
                            <span className="text-emerald-400">✓ Paid</span>
                          ) : (
                            <span className="text-amber-400">
                              Due ${b.depositAmountUsd.toLocaleString()}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Recent Payments Mini-Ledger */}
          <Card noPadding className="overflow-hidden">
            <div className="p-5 border-b border-safari-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gold-400" />
                <h3 className="font-serif text-lg text-white">Recent Payments</h3>
              </div>
              <Link
                href="/admin/payments"
                className="text-xs font-mono text-gold-400 hover:text-gold-300 flex items-center gap-1"
              >
                Full Ledger <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[520px]">
                <thead className="bg-safari-night/70 text-[10px] font-mono uppercase tracking-wider text-safari-sand/60 border-b border-safari-border">
                  <tr>
                    <th className="py-2.5 px-4">Booking Ref</th>
                    <th className="py-2.5 px-4">Gateway</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-safari-border">
                  {recentPayments.map((tx) => (
                    <tr key={tx.id} className="hover:bg-safari-night/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-white">
                        {tx.bookingReference}
                      </td>
                      <td className="py-3 px-4 font-mono uppercase text-safari-sand/70">
                        {tx.provider}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          status={tx.status}
                          variant={
                            tx.status === "succeeded"
                              ? "confirmed"
                              : tx.status === "pending"
                                ? "pending"
                                : "alert"
                          }
                        />
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-white">
                        ${(tx.amountCents / 100).toLocaleString()} {tx.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right: Duty Officer Action Items, Fleet Availability & CMS Pulse */}
        <div className="lg:col-span-4 space-y-6">
          {/* Duty Officer Action Items */}
          <Card className="space-y-4">
            <h3 className="font-serif text-lg text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-gold-400" />
              Duty Officer Action Items
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-safari-night rounded-lg border border-rose-500/40 text-rose-200 space-y-1">
                <span className="font-mono text-[10px] uppercase text-rose-400 block font-semibold">
                  Missed Call Follow-Up
                </span>
                <p>Nairobi partner call +254 722 400 918 marked urgent same-day request.</p>
                <Link
                  href="/admin/receptionist"
                  className="text-xs font-mono text-gold-300 hover:underline block pt-1"
                >
                  View Transcript & Callback →
                </Link>
              </div>

              <div className="p-3.5 bg-safari-night rounded-lg border border-safari-border text-safari-sand/80 space-y-1">
                <span className="font-mono text-[10px] uppercase text-gold-400 block font-semibold">
                  Contract Review Due
                </span>
                <p>Tortilis Camp 2026 peak season allocation has 4 blackout dates to verify.</p>
                <Link
                  href="/admin/suppliers"
                  className="text-xs font-mono text-gold-300 hover:underline block pt-1"
                >
                  Inspect Contract Document →
                </Link>
              </div>

              <div className="p-3.5 bg-safari-night rounded-lg border border-safari-border text-safari-sand/80 space-y-1">
                <span className="font-mono text-[10px] uppercase text-emerald-400 block font-semibold">
                  Vehicle Maintenance Complete
                </span>
                <p>Cruiser KDG 893L completed 10,000km scheduled service at Mombasa Depot.</p>
                <Link
                  href="/admin/fleet"
                  className="text-xs font-mono text-gold-300 hover:underline block pt-1"
                >
                  Update Vehicle Odometer →
                </Link>
              </div>
            </div>
          </Card>

          {/* Fleet Availability Snapshot */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg text-white">Fleet Availability</h3>
              <Link href="/admin/fleet" className="text-xs font-mono text-gold-400 hover:underline">
                Roster →
              </Link>
            </div>
            <div className="space-y-2.5">
              {mockVehicles.map((v) => (
                <div
                  key={v.id}
                  className="p-3 rounded-lg bg-safari-night border border-safari-border flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-mono font-bold text-white block">
                      {v.registrationPlate}
                    </span>
                    <span className="text-safari-sand/60 truncate block">
                      {v.makeModel}
                    </span>
                  </div>
                  <StatusBadge
                    status={v.status.replace("_", " ")}
                    variant={
                      v.status === "available"
                        ? "confirmed"
                        : v.status === "on_safari"
                          ? "in_safari"
                          : "alert"
                    }
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Quick CMS & App Distribution Pulse */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg text-white">App & Website CMS</h3>
              <ShieldCheck className="w-4 h-4 text-gold-400" />
            </div>
            <div className="space-y-2 text-xs font-mono text-safari-sand/80">
              <div className="flex justify-between py-1.5 border-b border-safari-border">
                <span>Stable QR URL:</span>
                <span className="text-gold-300 font-bold truncate max-w-[160px]">
                  amberplains.co.ke/app
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-safari-border">
                <span>App Store Status:</span>
                <span className="text-amber-400">Phase 3 Coming Soon</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-safari-border">
                <span>VIP Waitlist Leads:</span>
                <span className="text-white">76 Confirmed Guests</span>
              </div>
            </div>

            <Link
              href="/admin/cms"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-safari-night hover:bg-safari-surface border border-safari-border text-xs font-mono text-gold-400 transition-colors"
            >
              Manage CMS & App Links →
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}
