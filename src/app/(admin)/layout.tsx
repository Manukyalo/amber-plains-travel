import React from "react";
import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const metadata: Metadata = {
  title: {
    default: "Operations Control",
    template: "%s | Amber Plains Ops",
  },
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: undefined,
  },
  openGraph: null,
  twitter: null,
};

export default function AdminRouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-safari-night text-safari-sand font-sans">
      {/* Sticky top-0 h-screen Admin Sidebar */}
      <div className="sticky top-0 h-screen shrink-0 overflow-y-auto">
        <AdminSidebar />
      </div>

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-8 bg-safari-night">
          {children}
        </main>
      </div>
    </div>
  );
}
