"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { OpsIntelligenceProvider } from "@/contexts/OpsIntelligenceContext";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { GlobalSOSBanner } from "./GlobalSOSBanner";
import { NotificationDrawer } from "./NotificationDrawer";
import { CommandPalette } from "./CommandPalette";

interface AdminShellProps {
  children: React.ReactNode;
}

function AdminShellInner({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Global Ctrl+K / Cmd+K shortcut for Command Palette
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-safari-night text-safari-sand font-sans">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-out
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:z-20 shrink-0
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <GlobalSOSBanner />
        <AdminHeader
          onToggleSidebar={() => {
            if (typeof window !== "undefined" && window.innerWidth < 1024) {
              setMobileMenuOpen((prev) => !prev);
            } else {
              setSidebarCollapsed((prev) => !prev);
            }
          }}
          onOpenCommandPalette={() => setCommandOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-safari-night overflow-x-hidden">
          {children}
        </main>
      </div>

      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
      <CommandPalette
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
      />
    </div>
  );
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <OpsIntelligenceProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </OpsIntelligenceProvider>
  );
}
