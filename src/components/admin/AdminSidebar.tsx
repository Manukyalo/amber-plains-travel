"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Calculator,
  CreditCard,
  Building2,
  Truck,
  Users,
  ShoppingBag,
  Globe,
  PhoneCall,
  Search,
  LineChart,
  Settings,
  Compass,
  ArrowUpRight,
  Shield,
  Layers,
} from "lucide-react";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const [isStandaloneAdmin, setIsStandaloneAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname.toLowerCase();
      const isStandalone =
        host.startsWith("admin.") ||
        host.startsWith("admin-") ||
        host.includes("-admin.") ||
        host.includes("admin-amber-plains") ||
        process.env.NEXT_PUBLIC_STANDALONE_ADMIN === "true";
      setIsStandaloneAdmin(isStandalone);
    }
  }, []);

  const publicWebsiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://amberplains.co.ke";

  // Base prefix for links: on standalone domain, links can be "/costing" or "/admin/costing"
  // Using "/admin" or relative links is completely supported because of our middleware
  const navGroups = [
    {
      group: "Command Center",
      links: [
        { label: "Overview", href: "/admin", altHref: "/", icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: "Bookings & CRM", href: "/admin/bookings", altHref: "/bookings", icon: <CalendarCheck className="w-4 h-4" />, badge: "4 Active" },
        { label: "Costing & Pricing", href: "/admin/costing", altHref: "/costing", icon: <Calculator className="w-4 h-4" /> },
        { label: "Payments & Ledger", href: "/admin/payments", altHref: "/payments", icon: <CreditCard className="w-4 h-4" /> },
      ],
    },
    {
      group: "Operations & Logistics",
      links: [
        { label: "Supplier Contracts", href: "/admin/suppliers", altHref: "/suppliers", icon: <Building2 className="w-4 h-4" /> },
        { label: "Packages & Routes", href: "/admin/packages", altHref: "/packages", icon: <Layers className="w-4 h-4" /> },
        { label: "4x4 Safari Fleet", href: "/admin/fleet", altHref: "/fleet", icon: <Truck className="w-4 h-4" /> },
        { label: "Guides & Drivers", href: "/admin/guides", altHref: "/guides", icon: <Users className="w-4 h-4" /> },
        { label: "Merchandise", href: "/admin/merchandise", altHref: "/merchandise", icon: <ShoppingBag className="w-4 h-4" /> },
      ],
    },
    {
      group: "Intelligence & Growth",
      links: [
        { label: "Website CMS & App", href: "/admin/cms", altHref: "/cms", icon: <Globe className="w-4 h-4" /> },
        { label: "AI Receptionist", href: "/admin/receptionist", altHref: "/receptionist", icon: <PhoneCall className="w-4 h-4" />, badge: "Live" },
        { label: "Website Hunter", href: "/admin/hunter", altHref: "/hunter", icon: <Search className="w-4 h-4" /> },
        { label: "SEO Engine", href: "/admin/seo", altHref: "/seo", icon: <LineChart className="w-4 h-4" /> },
      ],
    },
    {
      group: "Governance",
      links: [
        { label: "Reports & Settings", href: "/admin/settings", altHref: "/settings", icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-safari-night border-r border-safari-border flex flex-col justify-between shrink-0 min-h-screen text-safari-sand">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-safari-border flex items-center justify-between">
          <Link href={isStandaloneAdmin ? "/" : "/admin"} className="flex flex-col">
            <span className="font-serif text-xl text-white font-normal tracking-wide">
              Amber Plains
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400">
              Operations Control
            </span>
          </Link>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Online" />
        </div>

        {/* Navigation Sections */}
        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-safari-sand/50 px-3 block mb-1">
                {group.group}
              </span>
              {group.links.map((link) => {
                const isActive =
                  link.href === "/admin"
                    ? pathname === "/admin" || pathname === "/"
                    : pathname === link.href ||
                      pathname.startsWith(link.href) ||
                      pathname === link.altHref ||
                      pathname.startsWith(`${link.altHref}/`);

                // Link target adapts to standalone admin mode
                const targetHref = isStandaloneAdmin ? link.altHref : link.href;

                return (
                  <Link
                    key={link.href}
                    href={targetHref}
                    className={`flex items-center justify-between px-3 py-2 rounded text-xs transition-colors ${
                      isActive
                        ? "bg-gold-400/15 text-gold-300 font-semibold border border-gold-400/40"
                        : "text-safari-sand/80 hover:bg-safari-card hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? "text-gold-400" : "text-safari-sand/60"}>
                        {link.icon}
                      </span>
                      <span>{link.label}</span>
                    </div>

                    {link.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-gold-400/20 text-gold-300 border border-gold-400/30">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Return Link */}
      <div className="p-4 border-t border-safari-border bg-safari-card/40">
        <a
          href={publicWebsiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs font-mono text-safari-sand/70 hover:text-gold-300 hover:bg-safari-card rounded transition-colors"
        >
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-gold-400" /> Public Website
          </span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
};
