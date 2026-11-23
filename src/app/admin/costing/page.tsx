"use client";

import React, { useState, useMemo } from "react";
import {
  Calculator,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  FileText,
  DollarSign,
  Percent,
  ShieldCheck,
  Download,
  Eye,
} from "lucide-react";
import { costingEngine } from "@/services/costingEngine";
import { CostingLineItem, CostItemCategory } from "@/types/admin";
import { mockSuppliers } from "@/data/adminMockData";

export default function AdminCostingPage() {
  // Line items state
  const [lineItems, setLineItems] = useState<CostingLineItem[]>([
    {
      id: "li-1",
      supplierContractId: "sup-1",
      contractVersion: "2026-ST-V2",
      category: "accommodation",
      description: "Satao Tented Camp (Tsavo East) - 3 Nights Luxury Tent (High Season)",
      rateBasis: "per_person_per_night",
      unitCost: 260,
      quantity: 2, // 2 guests
      multiplier: 3, // 3 nights
      currency: "USD",
      exchangeRateToUsd: 1,
      totalCostUsd: 1560,
      isConfidentialSupplierRate: true,
    },
    {
      id: "li-2",
      supplierContractId: "sup-2",
      contractVersion: "2026-ELE-TC4",
      category: "accommodation",
      description: "Tortilis Camp (Amboseli) - 2 Nights Safari Suite (High Season)",
      rateBasis: "per_person_per_night",
      unitCost: 480,
      quantity: 2,
      multiplier: 2,
      currency: "USD",
      exchangeRateToUsd: 1,
      totalCostUsd: 1920,
      isConfidentialSupplierRate: true,
    },
    {
      id: "li-3",
      category: "park_conservancy_fee",
      description: "Kenya Wildlife Service Tsavo East Park Entry Fees (Non-Resident)",
      rateBasis: "per_person_total",
      unitCost: 104, // $52/day x 2 days
      quantity: 2,
      multiplier: 1,
      currency: "USD",
      exchangeRateToUsd: 1,
      totalCostUsd: 208,
      isConfidentialSupplierRate: false,
    },
    {
      id: "li-4",
      category: "vehicle_fuel",
      description: "Private Extended 4x4 Cruiser + Fuel & Mombasa Bush Transfers (5 Days)",
      rateBasis: "per_vehicle_per_day",
      unitCost: 220,
      quantity: 1,
      multiplier: 5,
      currency: "USD",
      exchangeRateToUsd: 1,
      totalCostUsd: 1100,
      isConfidentialSupplierRate: true,
    },
    {
      id: "li-5",
      category: "guide_allowance",
      description: "KPSGA Silver Lead Guide Per Diem & Wilderness Boarding (5 Days)",
      rateBasis: "per_vehicle_per_day",
      unitCost: 75,
      quantity: 1,
      multiplier: 5,
      currency: "USD",
      exchangeRateToUsd: 1,
      totalCostUsd: 375,
      isConfidentialSupplierRate: true,
    },
  ]);

  // Parameters
  const [contingencyRate, setContingencyRate] = useState<number>(0.05); // 5%
  const [markupRate, setMarkupRate] = useState<number>(0.28); // 28%
  const [minThresholdMargin, setMinThresholdMargin] = useState<number>(0.18); // 18% minimum gross margin
  const [activeTab, setActiveTab] = useState<"calculator" | "guest_quote">("calculator");

  // Deterministic calculation
  const calculation = useMemo(() => {
    return costingEngine.calculate({
      lineItems,
      contingencyBufferRate: contingencyRate,
      markupRate,
      minimumProfitThresholdMargin: minThresholdMargin,
    });
  }, [lineItems, contingencyRate, markupRate, minThresholdMargin]);

  // Add line item
  const handleAddLineItem = () => {
    const newItem: CostingLineItem = {
      id: `li-${Date.now()}`,
      category: "activity",
      description: "Optional Sundowner / Activity in Conservancy",
      rateBasis: "per_person_total",
      unitCost: 65,
      quantity: 2,
      multiplier: 1,
      currency: "USD",
      exchangeRateToUsd: 1,
      totalCostUsd: 130,
      isConfidentialSupplierRate: false,
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof CostingLineItem, value: any) => {
    setLineItems(
      lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-safari-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Deterministic Margin Engine
          </span>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            Costing, Markup & Profit Protection
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-3.5 py-2 rounded text-xs font-mono uppercase transition-colors ${
              activeTab === "calculator"
                ? "bg-gold-400 text-safari-night font-bold"
                : "bg-safari-card border border-safari-border text-safari-sand hover:text-white"
            }`}
          >
            Staff Costing Breakdown
          </button>
          <button
            onClick={() => setActiveTab("guest_quote")}
            className={`px-3.5 py-2 rounded text-xs font-mono uppercase transition-colors ${
              activeTab === "guest_quote"
                ? "bg-gold-400 text-safari-night font-bold"
                : "bg-safari-card border border-safari-border text-safari-sand hover:text-white"
            }`}
          >
            Guest Presentation
          </button>
        </div>
      </div>

      {/* Threshold / Profit Warning Banner */}
      {calculation.belowThresholdWarning && (
        <div className="p-4 rounded bg-rose-950/80 border border-rose-500 text-rose-200 text-xs flex items-start gap-3 animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-mono uppercase font-bold block text-rose-300">
              Profitability Threshold Warning: Below {calculation.minimumProfitThresholdMargin}% Gross Margin
            </span>
            <p>
              Current Gross Margin is <strong>{calculation.grossMarginPercentage}%</strong>.
              Company policy prohibits issuing client quotations below the minimum margin without
              explicit written authorization from a Safari Director.
            </p>
          </div>
        </div>
      )}

      {activeTab === "calculator" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Costing Line Items */}
          <div className="lg:col-span-8 bg-safari-card border border-safari-border rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-safari-border pb-4">
              <div>
                <h3 className="font-serif text-xl text-white">Itemized Direct Expense Lines</h3>
                <p className="text-xs text-safari-sand/60">
                  Separated relational entities for accommodation, park fees, transport, and guide expenses.
                </p>
              </div>
              <button
                onClick={handleAddLineItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-safari-night hover:bg-safari-surface border border-safari-border text-xs font-mono text-gold-400 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line
              </button>
            </div>

            <div className="space-y-4">
              {lineItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded bg-safari-night border border-safari-border space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase text-gold-400 bg-safari-card px-2 py-0.5 rounded border border-safari-border">
                      {item.category.replace(/_/g, " ")}
                    </span>
                    <button
                      onClick={() => handleRemoveLineItem(item.id)}
                      className="text-safari-sand/40 hover:text-rose-400 p-1"
                      title="Remove line"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, "description", e.target.value)}
                    className="w-full bg-safari-card border border-safari-border rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-gold-400 font-serif"
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-safari-sand/50 block text-[10px]">UNIT NET COST</span>
                      <div className="flex items-center gap-1">
                        <span className="text-safari-sand/50">$</span>
                        <input
                          type="number"
                          value={item.unitCost}
                          onChange={(e) =>
                            handleUpdateItem(item.id, "unitCost", parseFloat(e.target.value) || 0)
                          }
                          className="w-full bg-safari-card border border-safari-border rounded px-2 py-1 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-safari-sand/50 block text-[10px]">GUESTS / UNITS</span>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateItem(item.id, "quantity", parseInt(e.target.value, 10) || 1)
                        }
                        className="w-full bg-safari-card border border-safari-border rounded px-2 py-1 text-xs text-white"
                      />
                    </div>

                    <div>
                      <span className="text-safari-sand/50 block text-[10px]">NIGHTS / DAYS</span>
                      <input
                        type="number"
                        value={item.multiplier}
                        onChange={(e) =>
                          handleUpdateItem(item.id, "multiplier", parseInt(e.target.value, 10) || 1)
                        }
                        className="w-full bg-safari-card border border-safari-border rounded px-2 py-1 text-xs text-white"
                      />
                    </div>

                    <div>
                      <span className="text-safari-sand/50 block text-[10px]">SUBTOTAL (USD)</span>
                      <span className="text-gold-300 font-bold block pt-1">
                        ${(item.unitCost * item.quantity * item.multiplier).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Pricing Controls & Margin Protection */}
          <div className="lg:col-span-4 bg-safari-card border border-safari-border rounded-lg p-6 space-y-6">
            <h3 className="font-serif text-xl text-white border-b border-safari-border pb-3">
              Commercial Pricing Controls
            </h3>

            {/* Formula Policy Explanation */}
            <div className="p-3 bg-safari-night rounded border border-safari-border text-[11px] font-mono text-safari-sand/70 space-y-1">
              <span className="text-gold-400 font-bold block uppercase text-[10px]">
                Deterministic Formula:
              </span>
              <p>Selling Price = Cost × (1 + Markup Rate)</p>
              <p>Gross Margin = (Selling Price − Cost) ÷ Selling Price</p>
              <p className="text-safari-sand/50 text-[10px] italic">
                * Note: A 28% markup yields a ~21.8% gross margin.
              </p>
            </div>

            {/* Sliders / Inputs */}
            <div className="space-y-4 text-xs font-mono">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-safari-sand/70">CONTINGENCY BUFFER:</span>
                  <span className="text-gold-300 font-bold">
                    {Math.round(contingencyRate * 100)}% (${calculation.contingencyBufferUsd.toLocaleString()})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.15"
                  step="0.01"
                  value={contingencyRate}
                  onChange={(e) => setContingencyRate(parseFloat(e.target.value))}
                  className="w-full accent-gold-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-safari-sand/70">COMMERCIAL MARKUP RATE:</span>
                  <span className="text-gold-300 font-bold">
                    {Math.round(markupRate * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.60"
                  step="0.01"
                  value={markupRate}
                  onChange={(e) => setMarkupRate(parseFloat(e.target.value))}
                  className="w-full accent-gold-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-safari-sand/70">MIN PROFIT THRESHOLD:</span>
                  <span className="text-amber-400 font-bold">
                    {Math.round(minThresholdMargin * 100)}% Margin
                  </span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.30"
                  step="0.01"
                  value={minThresholdMargin}
                  onChange={(e) => setMinThresholdMargin(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Summary Outputs Table */}
            <div className="pt-4 border-t border-safari-border space-y-2 text-xs font-mono">
              <div className="flex justify-between text-safari-sand/70">
                <span>Total Direct Net Cost:</span>
                <span className="text-white">${calculation.totalDirectCostUsd.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-safari-sand/70">
                <span>Contingency Buffer ({Math.round(contingencyRate * 100)}%):</span>
                <span className="text-white">${calculation.contingencyBufferUsd.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-safari-sand/70">
                <span>Effective Cost Basis:</span>
                <span className="text-white font-bold">${calculation.effectiveTotalCostUsd.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-safari-sand/70">
                <span>Gross Profit (USD):</span>
                <span className="text-emerald-400 font-bold">
                  +${calculation.grossProfitUsd.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-safari-sand/70">
                <span>Resulting Gross Margin:</span>
                <span
                  className={`font-bold ${
                    calculation.belowThresholdWarning ? "text-rose-400" : "text-emerald-400"
                  }`}
                >
                  {calculation.grossMarginPercentage}%
                </span>
              </div>

              <div className="pt-3 border-t border-safari-border flex justify-between items-baseline">
                <span className="text-xs uppercase font-serif text-white">Guest Selling Price:</span>
                <span className="font-serif text-3xl text-gold-400 font-bold">
                  ${calculation.sellingPriceUsd.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Commit Quote Action */}
            <button
              onClick={() => alert(`Quote Version committed to database for $${calculation.sellingPriceUsd.toLocaleString()}. Historical net rates locked.`)}
              className="w-full py-3 rounded bg-gold-400 hover:bg-gold-300 text-safari-night font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              Lock & Generate Quote Version
            </button>
          </div>
        </div>
      ) : (
        /* Guest-Facing Quotation Preview (Confidential supplier details stripped) */
        <div className="max-w-3xl mx-auto bg-white text-safari-night rounded-lg p-8 sm:p-12 shadow-luxury space-y-8">
          <div className="flex items-center justify-between border-b border-safari-sand pb-6">
            <div>
              <span className="font-serif text-2xl font-bold tracking-wide">Amber Plains Travel</span>
              <span className="block text-[10px] font-mono uppercase text-safari-stone">
                Bamburi Beach Ridge · Mombasa, Kenya
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs text-gold-600 font-bold block">
                QUOTE REF: APT-2026-Q104
              </span>
              <span className="text-[10px] font-mono text-safari-stone">
                Date: {new Date().toLocaleDateString("en-GB")}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-mono uppercase text-gold-600 font-bold">
              Private Expedition Quotation
            </span>
            <h2 className="font-serif text-3xl text-safari-night font-normal">
              5-Day Amboseli & Tsavo Wilderness Odyssey
            </h2>
            <p className="text-xs text-safari-stone leading-relaxed font-light">
              Prepared for 2 adult guests departing from Mombasa or Diani Beach in a private custom
              extended Land Cruiser with KPSGA certified Silver guide.
            </p>
          </div>

          <div className="p-6 rounded bg-safari-cream border border-safari-sand flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-safari-stone block">TOTAL INVESTMENT (2 GUESTS)</span>
              <span className="font-serif text-3xl font-bold text-safari-night">
                ${calculation.sellingPriceUsd.toLocaleString()} USD
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-safari-stone block">PER GUEST SHARING</span>
              <span className="font-serif text-xl font-bold text-gold-600">
                ${Math.round(calculation.sellingPriceUsd / 2).toLocaleString()} USD
              </span>
            </div>
          </div>

          {/* Inclusions */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif text-base font-bold text-safari-night">
              What Is Included In Your Journey:
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-safari-stone">
              <li className="flex items-center gap-2">✓ All National Park & Conservancy fees</li>
              <li className="flex items-center gap-2">✓ Private 4x4 Cruiser with pop-up roof</li>
              <li className="flex items-center gap-2">✓ Professional KPSGA certified guide</li>
              <li className="flex items-center gap-2">✓ Full board luxury camp accommodation</li>
              <li className="flex items-center gap-2">✓ AMREF Flying Doctors 24/7 rescue</li>
              <li className="flex items-center gap-2">✓ Coastal hotel roundtrip transfers</li>
            </ul>
          </div>

          <div className="pt-6 border-t border-safari-sand flex items-center justify-between text-xs font-mono text-safari-stone">
            <span>Confidential Net Rates & Margins Are Scrubbed</span>
            <button
              onClick={() => alert("Guest PDF Export generated successfully.")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-safari-night text-white text-xs font-mono uppercase hover:bg-gold-600 transition-colors"
            >
              <Download className="w-4 h-4 text-gold-400" /> Export Guest PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
