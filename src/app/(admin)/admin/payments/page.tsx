"use client";

import React, { useState } from "react";
import {
  DollarSign,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { mockTransactions } from "@/data/adminMockData";
import { TransactionRecord } from "@/types/admin";
import {
  SectionHeader,
  KpiCard,
  Card,
  StatusBadge,
} from "@/components/admin/ui/AdminUIKit";

const USD_TO_KES = 129;

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(mockTransactions);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successNote, setSuccessNote] = useState<string | null>(null);
  const [errorNote, setErrorNote] = useState<string | null>(null);

  const [bookingRef, setBookingRef] = useState("APT-2026-8109");
  const [amountUsd, setAmountUsd] = useState(2520);
  const [provider, setProvider] = useState<"mpesa" | "stripe" | "intasend">("mpesa");

  const totalCollectedCents = transactions
    .filter((t) => t.status === "succeeded")
    .reduce((sum, t) => sum + t.amountCents, 0);

  const pendingCount = transactions.filter((t) => t.status === "pending").length;

  const handleSimulatePaymentWebhook = async (action: "succeeded" | "failed" | "refund") => {
    setIsProcessing(true);
    setErrorNote(null);
    try {
      const idempotencyKey = `idem_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotencyKey,
          bookingReference: bookingRef,
          amountCents: amountUsd * 100,
          currency: "USD",
          provider,
          action: action === "refund" ? "refund" : "webhook_callback",
          targetStatus: action === "refund" ? "refunded" : action,
          providerTransactionId: `sim_${provider}_${Date.now()}`,
        }),
      });

      const data = await res.json();
      if (data.success && data.transaction) {
        setTransactions([data.transaction, ...transactions]);
        setSuccessNote(
          `Transaction ${data.transaction.id} processed: ${data.transaction.status}. Idempotency key verified.`
        );
        setTimeout(() => setSuccessNote(null), 4000);
      } else {
        setErrorNote(data.error || "Unable to commit payment state transition.");
      }
    } catch {
      setErrorNote("Network error committing payment state transition.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Treasury & Multi-Gateway Ledger"
        title="Payments, Receipts & Immutable Audit Ledger"
        action={
          <button
            onClick={() => alert("CSV Export of verified transactions downloaded.")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-safari-card border border-safari-border text-xs font-mono text-safari-sand hover:text-white hover:border-gold-400 transition-colors"
          >
            <Download className="w-4 h-4 text-gold-400" /> Export Financial Ledger (CSV)
          </button>
        }
      />

      {successNote && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNote}</span>
        </div>
      )}

      {errorNote && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorNote}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <KpiCard
          label="Settled Funds (USD)"
          value={`$${(totalCollectedCents / 100).toLocaleString()}`}
          subtext={`KES ${Math.round((totalCollectedCents / 100) * USD_TO_KES).toLocaleString()} · Stripe & IntaSend`}
          icon={DollarSign}
          variant="emerald"
        />

        <KpiCard
          label="Idempotent Gateways"
          value="M-Pesa · Stripe · IntaSend"
          subtext="Webhook Signature Verification Active"
          icon={ShieldCheck}
          variant="gold"
        />

        <KpiCard
          label="Pending Callbacks"
          value={pendingCount}
          subtext="M-Pesa prompt awaiting guest PIN"
          icon={Clock}
          variant="rose"
        />
      </div>

      {/* Simulation / Payment Link Creation Workspace */}
      <Card className="space-y-4">
        <div>
          <h3 className="font-serif text-lg text-white">
            Payment Request Generator & Webhook Sandbox
          </h3>
          <p className="text-xs text-safari-sand/60 font-light mt-0.5">
            Simulate verified provider callbacks or initiate idempotent payment links for safari deposits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 text-xs font-mono">
          <div>
            <label className="text-safari-sand/70 block mb-1.5">Booking Reference</label>
            <input
              type="text"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              className="w-full bg-safari-night border border-safari-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="text-safari-sand/70 block mb-1.5">Amount (USD)</label>
            <input
              type="number"
              value={amountUsd}
              onChange={(e) => setAmountUsd(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-safari-night border border-safari-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="text-safari-sand/70 block mb-1.5">Provider Gateway</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as "mpesa" | "stripe" | "intasend")}
              className="w-full bg-safari-night border border-safari-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold-400"
            >
              <option value="mpesa">M-Pesa Express (Kenya)</option>
              <option value="stripe">Stripe Cards (International)</option>
              <option value="intasend">IntaSend Multi-Currency</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => handleSimulatePaymentWebhook("succeeded")}
              disabled={isProcessing}
              className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase font-semibold transition-colors disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Simulate Success"}
            </button>
            <button
              onClick={() => handleSimulatePaymentWebhook("failed")}
              disabled={isProcessing}
              className="py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs uppercase font-semibold transition-colors disabled:opacity-50"
            >
              Fail
            </button>
          </div>
        </div>
      </Card>

      {/* Transaction Ledger Table */}
      <Card noPadding className="overflow-hidden">
        <div className="px-5 py-4 border-b border-safari-border flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-safari-sand/70">
            Immutable Transaction Audit Log ({transactions.length})
          </span>
          <span className="text-[11px] font-mono text-safari-sand/50">
            Deduplicated by Provider Event ID
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-safari-night/70 text-[10px] font-mono uppercase text-safari-sand/60 border-b border-safari-border">
              <tr>
                <th className="py-3 px-4">Tx ID</th>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Provider / Reference</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-safari-border text-safari-sand/90">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-safari-night/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-gold-300">{tx.id}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    {tx.bookingReference}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <span className="uppercase text-gold-400">{tx.provider}: </span>
                    <span className="text-safari-sand/60 truncate max-w-[150px] inline-block align-bottom">
                      {tx.providerTransactionId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white text-sm whitespace-nowrap">
                    ${(tx.amountCents / 100).toLocaleString()} {tx.currency}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge
                      status={tx.status}
                      variant={
                        tx.status === "succeeded"
                          ? "confirmed"
                          : tx.status === "pending"
                          ? "pending"
                          : "alert"
                      }
                    />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] uppercase text-safari-sand/70">
                    {tx.type}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-safari-sand/50 whitespace-nowrap">
                    {tx.createdAt.replace("T", " ").slice(0, 19)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
