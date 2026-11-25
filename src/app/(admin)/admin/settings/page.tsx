"use client";

import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { SectionHeader, Card } from "@/components/admin/ui/AdminUIKit";

export default function AdminSettingsPage() {
  const [baseCurrency, setBaseCurrency] = useState<string>("USD");
  const [vatRate, setVatRate] = useState<number>(16);
  const [cateringLevy, setCateringLevy] = useState<number>(2);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNote("System configuration and financial statutory levies updated.");
    setTimeout(() => setSavedNote(null), 3000);
  };

  const auditLogs = [
    {
      id: "log-1",
      actor: "David Ndung'u",
      role: "safari_director",
      action: "Approved costing quote Q-2026-104-V2 ($10,900 USD)",
      timestamp: "2026-02-23 09:40 EAT",
    },
    {
      id: "log-2",
      actor: "System Webhook",
      role: "system",
      action: "Stripe deposit $3,270.00 reconciled for booking APT-2026-7842",
      timestamp: "2026-02-22 14:22 EAT",
    },
    {
      id: "log-3",
      actor: "Amina Hassan",
      role: "operations_manager",
      action: "Allocated Cruiser KDG 893L to Amboseli Crest expedition",
      timestamp: "2026-02-21 16:15 EAT",
    },
    {
      id: "log-4",
      actor: "AI Receptionist",
      role: "telephony_ai",
      action: "Captured validated inbound lead from +1 312 555 0192 (Late October Tsavo)",
      timestamp: "2026-02-21 08:42 EAT",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="System Architecture & Governance"
        title="Reports, Role Access & Business Settings"
        action={
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-gold-400 text-safari-night font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-300 transition-colors shadow-sm"
          >
            Save Settings
          </button>
        }
      />

      {savedNote && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedNote}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="border-b border-safari-border pb-3">
            <h3 className="font-serif text-lg text-white">Currencies & Statutory Levies</h3>
            <p className="text-xs text-safari-sand/60">
              Governs quoting calculations and tax compliance
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-safari-sand/70 block mb-1.5">Base Quoting Currency</label>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="w-full bg-safari-night border border-safari-border rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-400"
              >
                <option value="USD">USD ($) - Primary International Currency</option>
                <option value="KES">KES (KSh) - Kenya Shillings (Local Park Fees)</option>
                <option value="EUR">EUR (€) - European Direct Accounts</option>
                <option value="GBP">GBP (£) - UK Direct Accounts</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-safari-sand/70 block mb-1.5">Kenya VAT Rate (%)</label>
                <input
                  type="number"
                  value={vatRate}
                  onChange={(e) => setVatRate(parseInt(e.target.value, 10) || 16)}
                  className="w-full bg-safari-night border border-safari-border rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="text-safari-sand/70 block mb-1.5">Catering Levy (%)</label>
                <input
                  type="number"
                  value={cateringLevy}
                  onChange={(e) => setCateringLevy(parseInt(e.target.value, 10) || 2)}
                  className="w-full bg-safari-night border border-safari-border rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="border-b border-safari-border pb-3">
            <h3 className="font-serif text-lg text-white">Telephony & Gateway Providers</h3>
            <p className="text-xs text-safari-sand/60">API status and connectivity checks</p>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3.5 bg-safari-night rounded-xl border border-safari-border flex items-center justify-between">
              <div>
                <span className="text-white block">Twilio / Africa&apos;s Talking SIP Trunk</span>
                <span className="text-[10px] text-safari-sand/50">+254 700 123 456 (Voice Line)</span>
              </div>
              <span className="text-emerald-400 font-bold">Connected</span>
            </div>

            <div className="p-3.5 bg-safari-night rounded-xl border border-safari-border flex items-center justify-between">
              <div>
                <span className="text-white block">Stripe Payments (UK & US)</span>
                <span className="text-[10px] text-safari-sand/50">Production Webhooks Active</span>
              </div>
              <span className="text-emerald-400 font-bold">Connected</span>
            </div>

            <div className="p-3.5 bg-safari-night rounded-xl border border-safari-border flex items-center justify-between">
              <div>
                <span className="text-white block">IntaSend Multi-Currency</span>
                <span className="text-[10px] text-safari-sand/50">
                  M-Pesa Express API + Virtual IBAN
                </span>
              </div>
              <span className="text-emerald-400 font-bold">Connected</span>
            </div>
          </div>
        </Card>
      </div>

      <Card noPadding className="overflow-hidden">
        <div className="p-5 border-b border-safari-border flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg text-white">Security & Operational Audit Log</h3>
            <p className="text-xs text-safari-sand/60">
              Immutable record of financial approvals, dispatch changes, and system events
            </p>
          </div>
          <span className="text-xs font-mono text-safari-sand/50">Live Audit Stream</span>
        </div>

        <div className="divide-y divide-safari-border text-xs">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 hover:bg-safari-night/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors"
            >
              <div className="space-y-0.5">
                <span className="font-serif text-white font-medium block">{log.action}</span>
                <div className="flex items-center gap-2 text-[11px] font-mono text-safari-sand/60">
                  <span className="text-gold-400">{log.actor}</span>
                  <span>•</span>
                  <span className="capitalize">{log.role.replace("_", " ")}</span>
                </div>
              </div>
              <span className="font-mono text-[11px] text-safari-sand/50">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
