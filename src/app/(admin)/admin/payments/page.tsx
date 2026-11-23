"use client";

import React, { useState } from "react";
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Download,
  Plus,
  ShieldCheck,
  Send,
} from "lucide-react";
import { mockTransactions } from "@/data/adminMockData";
import { TransactionRecord, PaymentStatus } from "@/types/admin";

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(mockTransactions);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successNote, setSuccessNote] = useState<string | null>(null);

  // New payment simulation modal state
  const [bookingRef, setBookingRef] = useState("APT-2026-8109");
  const [amountUsd, setAmountUsd] = useState(2520);
  const [provider, setProvider] = useState<"mpesa" | "stripe" | "intasend">("mpesa");

  const totalCollectedCents = transactions
    .filter((t) => t.status === "succeeded")
    .reduce((sum, t) => sum + t.amountCents, 0);

  const handleSimulatePaymentWebhook = async (action: "succeeded" | "failed" | "refund") => {
    setIsProcessing(true);
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
        setSuccessNote(`Transaction ${data.transaction.id} processed: ${data.transaction.status}. Idempotency key verified.`);
        setTimeout(() => setSuccessNote(null), 4000);
      }
    } catch {
      alert("Error committing payment state transition.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-safari-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Treasury & Multi-Gateway Ledger
          </span>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            Payments, Receipts & Immutable Audit Ledger
          </h1>
        </div>

        <button
          onClick={() => alert("CSV Export of verified transactions downloaded.")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-safari-card border border-safari-border text-xs font-mono text-safari-sand hover:text-white hover:border-gold-400 transition-colors"
        >
          <Download className="w-4 h-4 text-gold-400" /> Export Financial Ledger (CSV)
        </button>
      </div>

      {successNote && (
        <div className="p-4 rounded bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNote}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-safari-card border border-safari-border rounded-lg space-y-1">
          <span className="text-xs font-mono text-safari-sand/60">SETTLED FUNDS (USD)</span>
          <div className="font-serif text-3xl text-emerald-400">
            ${(totalCollectedCents / 100).toLocaleString()}
          </div>
          <span className="text-[11px] font-mono text-safari-sand/50">Reconciled via Stripe & IntaSend</span>
        </div>

        <div className="p-5 bg-safari-card border border-safari-border rounded-lg space-y-1">
          <span className="text-xs font-mono text-safari-sand/60">IDEMPOTENT GATEWAYS</span>
          <div className="font-serif text-3xl text-white">M-Pesa · Stripe · IntaSend</div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Webhook Signature Verification Active
          </span>
        </div>

        <div className="p-5 bg-safari-card border border-safari-border rounded-lg space-y-1">
          <span className="text-xs font-mono text-safari-sand/60">PENDING CALLBACKS</span>
          <div className="font-serif text-3xl text-amber-400">1</div>
          <span className="text-[11px] text-safari-sand/50">M-Pesa prompt awaiting guest PIN</span>
        </div>
      </div>

      {/* Simulation / Payment Link Creation Workspace */}
      <div className="bg-safari-card border border-safari-border rounded-lg p-6 space-y-4">
        <h3 className="font-serif text-lg text-white">Payment Request Generator & Webhook Sandbox</h3>
        <p className="text-xs text-safari-sand/60 font-light">
          Simulate verified provider callbacks or initiate idempotent payment links for safari deposits.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 text-xs font-mono">
          <div>
            <label className="text-safari-sand/70 block mb-1">Booking Reference</label>
            <input
              type="text"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              className="w-full bg-safari-night border border-safari-border rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="text-safari-sand/70 block mb-1">Amount (USD)</label>
            <input
              type="number"
              value={amountUsd}
              onChange={(e) => setAmountUsd(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-safari-night border border-safari-border rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="text-safari-sand/70 block mb-1">Provider Gateway</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as any)}
              className="w-full bg-safari-night border border-safari-border rounded px-3 py-2 text-white"
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
              className="flex-1 py-2 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase font-semibold transition-colors disabled:opacity-50"
            >
              Simulate Success
            </button>
            <button
              onClick={() => handleSimulatePaymentWebhook("failed")}
              disabled={isProcessing}
              className="py-2 px-3 rounded bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs uppercase font-semibold transition-colors disabled:opacity-50"
            >
              Fail
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-safari-card border border-safari-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-safari-border flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-safari-sand/70">
            Immutable Transaction Audit Log ({transactions.length})
          </span>
          <span className="text-[11px] font-mono text-safari-sand/50">
            Deduplicated by Provider Event ID
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
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
                <tr key={tx.id} className="hover:bg-safari-night/50">
                  <td className="py-3.5 px-4 font-mono text-gold-300">{tx.id}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{tx.bookingReference}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <span className="uppercase text-gold-400">{tx.provider}: </span>
                    <span className="text-safari-sand/60 truncate max-w-[150px] inline-block align-bottom">
                      {tx.providerTransactionId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                    ${(tx.amountCents / 100).toLocaleString()} {tx.currency}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        tx.status === "succeeded"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                          : tx.status === "pending"
                          ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                          : tx.status === "refunded"
                          ? "bg-purple-950 text-purple-300 border border-purple-500/40"
                          : "bg-rose-950 text-rose-300 border border-rose-500/40"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] uppercase text-safari-sand/70">
                    {tx.type}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-safari-sand/50">
                    {tx.createdAt.replace("T", " ").slice(0, 19)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
