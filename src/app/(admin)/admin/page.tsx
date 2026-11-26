"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {
  DollarSign,
  AlertTriangle,
  Clock,
  ArrowRight,
  Truck,
  CalendarCheck,
  ShieldCheck,
  Calendar,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import {
  currentAdminUser,
  mockBookings,
  mockVehicles,
  mockGuides,
  mockCallEvents,
  mockTransactions,
  mockMerchandise,
  mockSuppliers,
} from "@/data/adminMockData";
import {
  TODAY_ISO,
  computeBookingStage,
  isBookingInSafariToday,
  isBookingActivePipeline,
  getUpcomingDepartures,
} from "@/utils/bookingDates";
import { evaluateBookingReadiness } from "@/services/readinessEngine";
import { KpiCard, StatusBadge, Card } from "@/components/admin/ui/AdminUIKit";
import { RevenueChart } from "@/components/admin/ui/RevenueChart";

// Dynamic client-only import for MapLibre GL WebGL canvas
const EastAfricaSafariMap = dynamic(
  () =>
    import("@/components/admin/geo/EastAfricaSafariMap").then(
      (mod) => mod.EastAfricaSafariMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] bg-safari-card border border-safari-border rounded-xl flex items-center justify-center text-xs font-mono text-safari-sand/50">
        Loading East African Geographic Intelligence…
      </div>
    ),
  }
);

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
  // 1. Authoritative Financial Metrics
  const totalRevenueUsd = mockTransactions
    .filter((t) => t.status === "succeeded")
    .reduce((sum, t) => sum + t.amountCents / 100, 0);

  const activeBookings = mockBookings.filter((b) =>
    isBookingActivePipeline(b, TODAY_ISO)
  );
  const totalBalanceDueUsd = activeBookings.reduce(
    (sum, b) => sum + b.balanceDueUsd,
    0
  );
  const totalPipelineValueUsd = activeBookings.reduce(
    (sum, b) => sum + b.totalSellingPriceUsd,
    0
  );

  // Booking conversion: confirmed + in_safari + completed vs total bookings
  const convertedCount = mockBookings.filter((b) => {
    const s = computeBookingStage(b, TODAY_ISO);
    return s === "confirmed" || s === "in_safari" || s === "completed";
  }).length;
  const conversionRatePct =
    mockBookings.length > 0
      ? Math.round((convertedCount / mockBookings.length) * 100)
      : 0;

  // 2. Fleet Utilization
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

  // 3. Departure Readiness Board (evaluated by ReadinessEngine)
  const upcomingDepartures = getUpcomingDepartures(mockBookings, TODAY_ISO, 5);
  const readinessReports = useMemo(
    () =>
      activeBookings.map((bk) =>
        evaluateBookingReadiness(bk, mockVehicles, mockGuides, undefined, TODAY_ISO)
      ),
    [activeBookings]
  );

  const blockedDepartures = readinessReports.filter((r) => r.status === "blocked").length;
  const missedCalls = mockCallEvents.filter((c) => c.status === "missed").length;
  const lowStockCount = mockMerchandise.filter(
    (m) => m.status === "low_stock" || m.status === "out_of_stock"
  ).length;
  const contractBlackoutsCount = mockSuppliers.reduce(
    (sum, s) => sum + s.blackoutDates.length,
    0
  );
  const totalAlerts = missedCalls + lowStockCount + blockedDepartures;

  const firstName = currentAdminUser.name.split(" ")[0];

  // Destination performance derived from mockBookings
  const destinationBreakdown = useMemo(() => {
    const buckets: Record<string, { count: number; valueUsd: number }> = {};
    mockBookings.forEach((b) => {
      const slug = b.packageSlug ?? "";
      const key = slug.includes("amboseli")
        ? "Amboseli & Kilimanjaro"
        : slug.includes("mara")
        ? "Maasai Mara"
        : "Tsavo & Swahili Coast";
      if (!buckets[key]) buckets[key] = { count: 0, valueUsd: 0 };
      buckets[key].count += 1;
      buckets[key].valueUsd += b.totalSellingPriceUsd;
    });
    return Object.entries(buckets).map(([name, stats]) => ({ name, ...stats }));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── A. Welcome Hero Banner ── */}
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
              <span>{formatOperationalDate(TODAY_ISO)} · Operations Intelligence Centre</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
              {getGreeting()}, {firstName}
            </h1>
            <p className="text-sm text-safari-sand/75 font-light">
              Executive command view across {activeBookings.length} active safaris ($
              {totalPipelineValueUsd.toLocaleString()} pipeline), {conversionRatePct}% booking
              conversion, and live East African park telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/admin/bookings"
              className="px-4 py-2.5 rounded-lg bg-safari-night/80 border border-safari-border text-xs font-mono text-safari-sand hover:text-white hover:border-gold-400/60 transition-colors"
            >
              Bookings & CRM
            </Link>
            <Link
              href="/admin/costing"
              className="px-4 py-2.5 rounded-lg bg-gold-400 hover:bg-gold-300 text-safari-night font-mono text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              Costing & Margin Engine
            </Link>
          </div>
        </div>
      </section>

      {/* ── A. Executive KPI Cards (4) ── */}
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
          subtext={`${activeBookings.length} active · ${conversionRatePct}% conversion`}
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
          subtext={`${blockedDepartures} readiness · ${missedCalls} call · ${lowStockCount} stock`}
          icon={AlertTriangle}
          variant="rose"
        />
      </section>

      {/* ── B. Departure Readiness Board + C. Geographic Map ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <EastAfricaSafariMap liveVehiclePings={[]} heightClassName="h-[420px]" />
        </div>

        <div className="lg:col-span-5">
          <Card noPadding className="overflow-hidden">
            <div className="p-5 border-b border-safari-border flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold-400" />
                  Departure Readiness Board
                </h3>
                <p className="text-xs text-safari-sand/55">
                  Pre-departure checks across fleet, guides & payments
                </p>
              </div>
              <Link
                href="/admin/bookings"
                className="text-xs font-mono text-gold-400 hover:text-gold-300"
              >
                CRM →
              </Link>
            </div>

            <div className="divide-y divide-safari-border max-h-[360px] overflow-y-auto">
              {readinessReports.map((rep) => {
                const missingItems = rep.checks.filter((c) => !c.passed);
                return (
                  <div key={rep.bookingId} className="p-4 space-y-2 hover:bg-safari-night/40">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-gold-400 block">
                          {rep.referenceCode} · Departs {rep.startDate}
                        </span>
                        <h4 className="font-serif text-base text-white truncate">
                          {rep.guestName}
                        </h4>
                      </div>
                      <StatusBadge
                        status={
                          rep.status === "ready"
                            ? `Ready (${rep.scorePct}%)`
                            : rep.status === "blocked"
                            ? `${rep.blockersCount} Blocker`
                            : `${rep.warningsCount} Warning`
                        }
                        variant={
                          rep.status === "ready"
                            ? "confirmed"
                            : rep.status === "blocked"
                            ? "alert"
                            : "pending"
                        }
                      />
                    </div>

                    {missingItems.length === 0 ? (
                      <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>All dispatch & financial gates cleared</span>
                      </div>
                    ) : (
                      <ul className="space-y-1 text-[11px] font-mono">
                        {missingItems.map((m) => (
                          <li
                            key={m.key}
                            className={
                              m.severity === "blocker" ? "text-rose-300" : "text-amber-300"
                            }
                          >
                            • {m.label}: {m.detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </section>

      {/* ── D. Financial Intelligence: Revenue Chart & Destination Breakdown ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <RevenueChart settledRevenueUsd={totalRevenueUsd} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gold-400" />
                  Performance by Destination
                </h3>
                <p className="text-xs text-safari-sand/55">
                  Quoted safari value across Kenya circuits
                </p>
              </div>
              <Link
                href="/admin/costing"
                className="text-xs font-mono text-gold-400 hover:underline"
              >
                Costing →
              </Link>
            </div>

            <div className="space-y-3">
              {destinationBreakdown.map((dest) => {
                const maxDest = Math.max(
                  ...destinationBreakdown.map((d) => d.valueUsd),
                  1
                );
                const pct = Math.round((dest.valueUsd / maxDest) * 100);
                return (
                  <div key={dest.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white">{dest.name}</span>
                      <span className="text-gold-300 font-semibold">
                        ${dest.valueUsd.toLocaleString()} ({dest.count})
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-safari-night overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gold-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* E. Management Action Centre */}
          <Card className="space-y-3">
            <h3 className="font-serif text-lg text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-gold-400" />
              Management Action Centre
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-safari-night rounded-lg border border-rose-500/40 text-rose-200 flex items-center justify-between gap-2">
                <span>{missedCalls} urgent missed partner call awaiting callback</span>
                <Link
                  href="/admin/receptionist"
                  className="font-mono text-gold-300 hover:underline shrink-0"
                >
                  Open →
                </Link>
              </div>
              <div className="p-3 bg-safari-night rounded-lg border border-safari-border text-safari-sand/85 flex items-center justify-between gap-2">
                <span>{contractBlackoutsCount} supplier blackout dates active in 2026</span>
                <Link
                  href="/admin/suppliers"
                  className="font-mono text-gold-300 hover:underline shrink-0"
                >
                  Review →
                </Link>
              </div>
              <div className="p-3 bg-safari-night rounded-lg border border-safari-border text-safari-sand/85 flex items-center justify-between gap-2">
                <span>{lowStockCount} merchandise SKU(s) below reorder threshold</span>
                <Link
                  href="/admin/merchandise"
                  className="font-mono text-gold-300 hover:underline shrink-0"
                >
                  Restock →
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ── Active Safari Pipeline & Upcoming Field Departures ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
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
        </div>

        <div className="lg:col-span-4">
          <Card noPadding className="overflow-hidden">
            <div className="p-5 border-b border-safari-border flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg text-white">Upcoming Departures</h3>
                <p className="text-xs text-safari-sand/55">On or after {TODAY_ISO}</p>
              </div>
              <Link
                href="/admin/fleet"
                className="text-xs font-mono text-gold-400 hover:text-gold-300"
              >
                Fleet →
              </Link>
            </div>

            {upcomingDepartures.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-safari-sand/50 flex flex-col items-center gap-2">
                <CalendarCheck className="w-6 h-6 text-safari-sand/30" />
                <span>No upcoming departures on or after {TODAY_ISO}.</span>
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
                    <div key={departure.id} className="p-4 space-y-1.5">
                      <span className="text-[10px] font-mono text-gold-400 uppercase block">
                        {departure.startDate} · {departure.durationDays}D
                      </span>
                      <h4 className="font-serif text-base text-white">
                        {departure.guest.fullName}
                      </h4>
                      <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-safari-sand/75">
                        <span className="px-2 py-0.5 rounded bg-safari-night border border-safari-border">
                          {assignedGuide ? assignedGuide.fullName : "Guide Pending"}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-safari-night border border-safari-border">
                          {assignedVehicle ? assignedVehicle.registrationPlate : "No Cruiser"}
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
    </div>
  );
}
