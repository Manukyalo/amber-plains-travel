"use client";

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { mockCallEvents, mockMerchandise, mockSuppliers } from "@/data/adminMockData";
import { createClient } from "@/lib/supabase/client";

export type SosSeverity = "Emergency" | "Medical" | "Mechanical" | "Stuck";
export type SosStatus = "Active" | "Acknowledged" | "Resolved";

export interface SosAlertItem {
  id: string;
  driverName: string;
  vehiclePlate: string;
  parkName: string;
  emergencyType: SosSeverity;
  status: SosStatus;
  notes: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
}

export type OpsNotificationSeverity = "critical" | "warning" | "info";

export interface OpsNotificationItem {
  id: string;
  title: string;
  body: string;
  severity: OpsNotificationSeverity;
  href: string;
  createdAt: string;
  read: boolean;
  source: "telephony" | "inventory" | "contract" | "sos";
}

interface OpsIntelligenceContextValue {
  sosAlerts: SosAlertItem[];
  activeSosAlerts: SosAlertItem[];
  notifications: OpsNotificationItem[];
  unreadCount: number;
  criticalCount: number;
  acknowledgeSos: (id: string, officerName?: string) => void;
  resolveSos: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
}

const OpsIntelligenceContext = createContext<OpsIntelligenceContextValue | null>(null);

function buildInitialNotifications(): OpsNotificationItem[] {
  const items: OpsNotificationItem[] = [];

  mockCallEvents
    .filter((c) => c.status === "missed")
    .forEach((call) => {
      items.push({
        id: `notif-call-${call.id}`,
        title: `Missed Call: ${call.callerNumber}`,
        body: `${call.callerCountry} · Urgent inbound safari enquiry requires callback.`,
        severity: "critical",
        href: "/admin/receptionist",
        createdAt: call.timestamp,
        read: false,
        source: "telephony",
      });
    });

  mockMerchandise
    .filter((m) => m.status === "low_stock" || m.status === "out_of_stock")
    .forEach((item) => {
      items.push({
        id: `notif-stock-${item.id}`,
        title: `Low Stock: ${item.title}`,
        body: `${item.stockQuantity} units remaining (SKU: ${item.sku}).`,
        severity: "warning",
        href: "/admin/merchandise",
        createdAt: "2026-11-23T08:00:00Z",
        read: false,
        source: "inventory",
      });
    });

  mockSuppliers
    .filter((s) => s.blackoutDates.length > 0)
    .slice(0, 1)
    .forEach((sup) => {
      items.push({
        id: `notif-sup-${sup.id}`,
        title: `Contract Blackout Window: ${sup.supplierName}`,
        body: `${sup.blackoutDates.length} blackout dates flagged on ${sup.contractVersion}.`,
        severity: "info",
        href: "/admin/suppliers",
        createdAt: "2026-11-23T07:30:00Z",
        read: false,
        source: "contract",
      });
    });

  return items;
}

export function OpsIntelligenceProvider({ children }: { children: React.ReactNode }) {
  const [sosAlerts, setSosAlerts] = useState<SosAlertItem[]>([]);
  const [notifications, setNotifications] = useState<OpsNotificationItem[]>(
    buildInitialNotifications
  );

  useEffect(() => {
    let active = true;
    async function loadSosAlerts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("sos_alerts")
          .select(
            "id, driver_name, vehicle_plate, park_name, emergency_type, status, notes, latitude, longitude, created_at, acknowledged_by, resolved_at"
          )
          .order("created_at", { ascending: false })
          .limit(50);

        if (error || !data || !active) return;

        const mapped: SosAlertItem[] = data.map((row) => ({
          id: String(row.id),
          driverName: String(row.driver_name ?? "Field Driver"),
          vehiclePlate: String(row.vehicle_plate ?? "Unknown"),
          parkName: String(row.park_name ?? "Field Sector"),
          emergencyType: (row.emergency_type as SosSeverity) ?? "Emergency",
          status: (row.status as SosStatus) ?? "Active",
          notes: String(row.notes ?? ""),
          latitude: row.latitude != null ? Number(row.latitude) : undefined,
          longitude: row.longitude != null ? Number(row.longitude) : undefined,
          createdAt: String(row.created_at ?? new Date().toISOString()),
          acknowledgedBy: row.acknowledged_by ? String(row.acknowledged_by) : undefined,
          resolvedAt: row.resolved_at ? String(row.resolved_at) : undefined,
        }));
        setSosAlerts(mapped);
      } catch {
        // Table may not be migrated yet or user is unauthenticated; fail gracefully
      }
    }
    loadSosAlerts();
    return () => {
      active = false;
    };
  }, []);

  const activeSosAlerts = useMemo(
    () => sosAlerts.filter((a) => a.status !== "Resolved"),
    [sosAlerts]
  );

  const acknowledgeSos = useCallback((id: string, officerName = "Duty Officer") => {
    const now = new Date().toISOString();
    setSosAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "Acknowledged", acknowledgedBy: officerName } : a
      )
    );
    try {
      const supabase = createClient();
      void supabase
        .from("sos_alerts")
        .update({ status: "Acknowledged", acknowledged_at: now })
        .eq("id", id);
    } catch {
      // Ignore persistence errors in offline/mock mode
    }
  }, []);

  const resolveSos = useCallback((id: string) => {
    const now = new Date().toISOString();
    setSosAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Resolved", resolvedAt: now } : a))
    );
    try {
      const supabase = createClient();
      void supabase
        .from("sos_alerts")
        .update({ status: "Resolved", resolved_at: now })
        .eq("id", id);
    } catch {
      // Ignore persistence errors in offline/mock mode
    }
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length + activeSosAlerts.length,
    [notifications, activeSosAlerts]
  );

  const criticalCount = useMemo(
    () =>
      notifications.filter((n) => !n.read && n.severity === "critical").length +
      activeSosAlerts.filter((a) => a.status === "Active").length,
    [notifications, activeSosAlerts]
  );

  return (
    <OpsIntelligenceContext.Provider
      value={{
        sosAlerts,
        activeSosAlerts,
        notifications,
        unreadCount,
        criticalCount,
        acknowledgeSos,
        resolveSos,
        markNotificationRead,
        markAllNotificationsRead,
        dismissNotification,
      }}
    >
      {children}
    </OpsIntelligenceContext.Provider>
  );
}

export function useOpsIntelligence(): OpsIntelligenceContextValue {
  const ctx = useContext(OpsIntelligenceContext);
  if (!ctx) {
    throw new Error("useOpsIntelligence must be used inside OpsIntelligenceProvider.");
  }
  return ctx;
}
