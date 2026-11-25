import React from "react";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

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
  return <AdminShell>{children}</AdminShell>;
}
