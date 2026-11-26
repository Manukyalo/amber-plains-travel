"use client";

import React, { useState, useMemo } from "react";
import {
  DollarSign,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { mockTransactions, mockBookings } from "@/data/adminMockData";
import { TransactionRecord } from "@/types/admin";
import {
  SectionHeader,
  KpiCard,
  Card,
  StatusBadge,
} from "@/components/admin/ui/AdminUIKit";

const USD_TO_KES = 129;
const RECONCILIATION_AGE_MS = 30 * 60_000;

function exportTransactionsCsv(rows: TransactionRecord[]): void {
  const header = [
    "Tx ID",
    "Booking Ref",
    "Provider",
    "Provider Tx ID",
    "Amount",
    "Currency",
    "Status",
    "Type",
    "Timestamp",
  ];
  const lines = rows.map((t) =>
    [
      t.id,
      t.bookingReference,
      t.provider,
      t.providerTransactionId,
      (t.amountCents / 100).toFixed(2),
      t.currency,
      t.status,
      t.type,
      t.createdAt,
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `amber-plains-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

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

  const pendingTransactions = useMemo(
    () => transactions.filter((t) => t.status === "pending"),
    [transactions]
  );
  const pendingCount = pendingTransactions.length;

  const stalePendingTransactions = useMemo(
    () =>
      pendingTransactions.filter(
        (t) => Date.now() - new Date(t.createdAt).getTime() > RECONCILIATION_AGE_MS
      ),
    [pendingTransactions]
  );

  const totalReceivablesUsd = useMemo(
    () => mockBookings.reduce((sum, b) => sum + b.balanceDueUsd, 0),
    []
  );

  const handleRunReconciliation = () => {
    setSuccessNote(
      stalePendingTransactions.length === 0
        ? "Reconciliation check complete: 0 stale pending transactions (>30 min)."
        : `Reconciliation flagged ${stalePendingTransactions.length} pending transaction(s) older than 30 min for provider status verification.`
    );
    setTimeout(() => setSuccessNote(null), 5000);
  };

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
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRunReconciliation}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-safari-card border border-safari-border text-xs font-mono text-safari-sand hover:text-white hover:border-gold-400 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gold-400" /> Reconcile Pending
            </button>
            <button
              onClick={() => exportTransactionsCsv(transactions)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-safari-card border border-safari-border text-xs font-mono text-safari-sand hover:text-white hover:border-gold-400 transition-colors"
            >
              <Download className="w-4 h-4 text-gold-400" /> Export Financial Ledger (CSV)
            </button>
          </div>
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
          subtext={
            stalePendingTransactions.length > 0
              ? `${stalePendingTransactions.length} stale (>30m) · Reconcile`
              : "M-Pesa prompt awaiting guest PIN"
          }
          icon={Clock}
          variant="rose"
        />
      </div>

      {/* Stale Pending Reconciliation Alert */}
      {stalePendingTransactions.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">
                {stalePendingTransactions.length} Pending Transaction(s) Older Than 30 Minutes
              </p>
              <p className="text-amber-200/70 mt-0.5">
                Verify provider status via M-Pesa / IntaSend query API before releasing safari vouchers.
              </p>
            </div>
          </div>
          <button
            onClick={handleRunReconciliation}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-mono uppercase hover:bg-amber-500/30 transition-colors"
          >
            Run Reconciliation
          </button>
        </div>
      )}

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

      {/* Booking Receivables & Deposit Collection Ledger */}
      <Card noPadding className="overflow-hidden">
        <div className="px-5 py-4 border-b border-safari-border flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-safari-sand/70 block">
              Booking Receivables & Deposit Collection ({mockBookings.length})
            </span>
            <span className="text-[11px] text-safari-sand/50">
              Total Outstanding Receivables: ${totalReceivablesUsd.toLocaleString()} USD (KES{" "}
              {(totalReceivablesUsd * USD_TO_KES).toLocaleString()})
            </span>
          </div>
          <span className="text-[11px] font-mono text-gold-400">
            1 USD = {USD_TO_KES} KES
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-safari-night/70 text-[10px] font-mono uppercase text-safari-sand/60 border-b border-safari-border">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Deposit</th>
                <th className="py-3 px-4">Balance Due</th>
                <th className="py-3 px-4">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-safari-border text-safari-sand/90">
              {mockBookings.map((b) => (
                <tr key={b.id} className="hover:bg-safari-night/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gold-300">
                    {b.referenceCode}
                  </td>
                  <td className="py-3.5 px-4 text-white">{b.guest.fullName}</td>
                  <td className="py-3.5 px-4 font-mono text-white">
                    ${b.totalSellingPriceUsd.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className={b.depositPaid ? "text-emerald-400" : "text-amber-400"}>
                      ${b.depositAmountUsd.toLocaleString()} ({b.depositPaid ? "Paid" : "Pending"})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    ${b.balanceDueUsd.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-safari-sand/60">
                    {b.balanceDueDate}
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
