"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Bell,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { useOpsIntelligence } from "@/contexts/OpsIntelligenceContext";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    dismissNotification,
  } = useOpsIntelligence();
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all");

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "critical") return n.severity === "critical";
    return true;
  });

  const getSeverityIcon = (severity: "critical" | "warning" | "info") => {
    if (severity === "critical") {
      return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />;
    }
    if (severity === "warning") {
      return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
    }
    return <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />;
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" aria-hidden="true" />
      <aside
        aria-label="Operational notifications"
        onClick={(e) => e.stopPropagation()}
        className="fixed top-4 right-4 bottom-4 w-[calc(100vw-2rem)] sm:w-[400px] bg-safari-card border border-safari-border rounded-2xl shadow-luxury flex flex-col overflow-hidden z-50"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-safari-border flex items-center justify-between bg-safari-night/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold-400/15 border border-gold-400/30 flex items-center justify-center text-gold-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg text-white leading-tight">
                Operations Inbox
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-wider text-safari-sand/55">
                {unreadCount} Unread Signals
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close notifications"
            className="p-1.5 rounded-lg text-safari-sand/60 hover:text-white hover:bg-safari-card transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-5 py-2.5 border-b border-safari-border flex items-center justify-between gap-2 bg-safari-night/30">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase">
            {(["all", "unread", "critical"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filter === tab
                    ? "bg-gold-400 text-safari-night font-bold"
                    : "text-safari-sand/60 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="inline-flex items-center gap-1 text-[10px] font-mono text-gold-400 hover:text-gold-300"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-safari-border">
          {filtered.length === 0 ? (
            <div className="py-16 px-6 text-center text-xs font-mono text-safari-sand/50">
              All clear. No operational alerts in this view.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-4 flex items-start gap-3 transition-colors ${
                  item.read ? "opacity-65 hover:opacity-100" : "bg-safari-night/35"
                }`}
              >
                {getSeverityIcon(item.severity)}
                <div className="flex-1 min-w-0 space-y-1">
                  <Link
                    href={item.href}
                    onClick={() => {
                      markNotificationRead(item.id);
                      onClose();
                    }}
                    className="text-sm font-medium text-white hover:text-gold-300 block transition-colors"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-safari-sand/70 leading-relaxed">{item.body}</p>
                  <span className="text-[10px] font-mono text-safari-sand/45 block">
                    {item.source.toUpperCase()} · {item.createdAt.slice(0, 10)}
                  </span>
                </div>
                <button
                  onClick={() => dismissNotification(item.id)}
                  aria-label="Dismiss notification"
                  className="p-1 text-safari-sand/40 hover:text-rose-400 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
