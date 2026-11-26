"use client";

import React, { useState } from "react";
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
  Settings,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { currentAdminUser } from "@/data/adminMockData";
import { useOpsIntelligence } from "@/contexts/OpsIntelligenceContext";

interface AdminHeaderProps {
  adminName?: string;
  adminRole?: string;
  onToggleSidebar?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenNotifications?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AdminHeader({
  adminName,
  adminRole,
  onToggleSidebar,
  onOpenCommandPalette,
  onOpenNotifications,
}: AdminHeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  const { unreadCount, criticalCount } = useOpsIntelligence();

  const [profileOpen, setProfileOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<"safari_director" | "operations_manager">(
    "safari_director"
  );

  const displayName = adminName ?? currentAdminUser.name;
  const displayRole = adminRole ?? currentRole.replace("_", " ");

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between gap-3 px-4 sm:px-6 bg-safari-night border-b border-safari-border shrink-0">
      {/* Left: Sidebar Toggle + Command Palette Trigger */}
      <div className="flex items-center gap-3 flex-1 min-w-0 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-safari-sand/70 hover:text-white hover:bg-safari-card border border-transparent hover:border-safari-border transition-colors shrink-0"
          aria-label="Toggle navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onOpenCommandPalette}
          aria-label="Open global command search"
          className="
            flex-1 h-9 px-3 rounded-lg
            bg-safari-card border border-safari-border
            hover:border-gold-400/50 text-left
            flex items-center justify-between gap-2
            transition-colors
          "
        >
          <span className="flex items-center gap-2 text-sm text-safari-sand/45 truncate">
            <Search className="w-4 h-4 text-safari-sand/40 shrink-0" />
            <span className="truncate">Search bookings, fleet, guides, modules…</span>
          </span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-safari-night border border-safari-border text-[10px] font-mono text-safari-sand/45 shrink-0">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 shrink-0">
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

        {/* Notifications Drawer Trigger */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-safari-sand/65 hover:text-safari-sand hover:bg-safari-card transition-colors"
          aria-label={`${unreadCount} unread notifications`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span
              className={`absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-mono font-bold text-white flex items-center justify-center border border-safari-night ${criticalCount > 0 ? "bg-rose-500" : "bg-gold-500 text-safari-night"
                }`}
            >
              {unreadCount}
            </span>
          )}
        </button>

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
            onClick={() => setProfileOpen((o) => !o)}
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
              className={`w-3.5 h-3.5 text-safari-sand/50 transition-transform ${profileOpen ? "rotate-180" : ""
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
                  <Settings className="w-3.5 h-3.5 text-gold-400" />
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
