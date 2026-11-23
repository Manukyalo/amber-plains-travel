"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  PhoneCall,
  CreditCard,
  HeartPulse,
  Plus,
  ChevronDown,
  Check,
  LogOut,
} from "lucide-react";
import { UserRole } from "@/types/admin";
import { currentAdminUser } from "@/data/adminMockData";
import { createClient } from "@/lib/supabase/client";

export const AdminHeader: React.FC = () => {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<UserRole>(currentAdminUser.role);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Health and connectivity states driven by configuration
  const isTelephonyConfigured = Boolean(
    process.env.NEXT_PUBLIC_TWILIO_SID || process.env.NEXT_PUBLIC_TELEPHONY_ENABLED === "true"
  );
  const isPaymentsConfigured = Boolean(
    process.env.NEXT_PUBLIC_MPESA_ENV || process.env.NEXT_PUBLIC_STRIPE_KEY
  );
  const isAmrefConfigured = Boolean(
    process.env.NEXT_PUBLIC_AMREF_LINK === "true"
  );

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Fallback
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  const roles: { label: string; role: UserRole }[] = [
    { label: "Safari Director (Full Access)", role: "safari_director" },
    { label: "Super Admin", role: "super_admin" },
    { label: "Operations Manager", role: "operations_manager" },
    { label: "Finance Controller", role: "finance_controller" },
    { label: "Head Guide", role: "head_guide" },
  ];

  return (
    <header className="h-16 bg-safari-night border-b border-safari-border px-6 flex items-center justify-between z-30 shrink-0">
      {/* Left: Operational telemetry badges */}
      <div className="flex items-center gap-3">
        <div
          className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-safari-card border border-safari-border text-[11px] font-mono ${
            isTelephonyConfigured ? "text-safari-sand/80" : "text-safari-sand/50"
          }`}
        >
          <PhoneCall
            className={`w-3.5 h-3.5 ${
              isTelephonyConfigured ? "text-emerald-400" : "text-amber-500/70"
            }`}
          />
          <span>{isTelephonyConfigured ? "Telephony: Online" : "Telephony: Not Connected"}</span>
        </div>

        <div
          className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-safari-card border border-safari-border text-[11px] font-mono ${
            isPaymentsConfigured ? "text-safari-sand/80" : "text-safari-sand/50"
          }`}
        >
          <CreditCard
            className={`w-3.5 h-3.5 ${
              isPaymentsConfigured ? "text-gold-400" : "text-safari-sand/40"
            }`}
          />
          <span>{isPaymentsConfigured ? "M-Pesa / Stripe: Active" : "Payments: Standby / Offline"}</span>
        </div>

        <div
          className={`hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-safari-card border border-safari-border text-[11px] font-mono ${
            isAmrefConfigured ? "text-safari-sand/80" : "text-safari-sand/50"
          }`}
        >
          <HeartPulse
            className={`w-3.5 h-3.5 ${
              isAmrefConfigured ? "text-rose-400" : "text-safari-sand/40"
            }`}
          />
          <span>{isAmrefConfigured ? "AMREF SOS: 24/7 Link" : "AMREF SOS: Direct Dispatch"}</span>
        </div>
      </div>

      {/* Right: Actions, Role Selector, User Profile & Sign Out */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/costing"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold-400 text-safari-night text-xs font-mono font-semibold uppercase tracking-wider hover:bg-gold-300 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Quote</span>
        </Link>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-safari-card border border-safari-border text-xs text-safari-sand/90 hover:border-gold-400/50 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-gold-400" />
            <span className="capitalize">{activeRole.replace("_", " ")}</span>
            <ChevronDown className="w-3 h-3 text-safari-sand/60" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-safari-card border border-safari-border rounded-lg shadow-luxury p-2 z-50 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-safari-sand/50 px-2 block py-1">
                Switch Operational Perspective:
              </span>
              {roles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    setActiveRole(r.role);
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-xs flex items-center justify-between ${
                    activeRole === r.role
                      ? "bg-gold-400/15 text-gold-300 font-semibold"
                      : "text-safari-sand/80 hover:bg-safari-night"
                  }`}
                >
                  <span>{r.label}</span>
                  {activeRole === r.role && <Check className="w-3.5 h-3.5 text-gold-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-safari-border">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-safari-card border border-gold-400/40 relative shrink-0">
            <Image
              src={currentAdminUser.avatarUrl || "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=100&q=80"}
              alt={currentAdminUser.name}
              width={32}
              height={32}
              sizes="48px"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-serif text-white">{currentAdminUser.name}</span>
            <span className="block text-[10px] font-mono text-safari-sand/50">Mombasa Duty Desk</span>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            title="Sign out of Operations Control"
            className="p-1.5 ml-1 rounded text-safari-sand/50 hover:text-rose-400 hover:bg-safari-card transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
