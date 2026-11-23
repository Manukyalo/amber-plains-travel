"use client";

import React, { useState } from "react";
import {
  Building2,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Plus,
  Upload,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { mockSuppliers } from "@/data/adminMockData";
import { SupplierContract, LodgeRoomRate } from "@/types/admin";

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierContract[]>(mockSuppliers);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierContract | null>(suppliers[0] || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleSimulateContractUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess("Executed contract uploaded. AI extraction parsed 3 room rates with 100% confidence. Pending Director verification.");
      setTimeout(() => setUploadSuccess(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-safari-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Procurement & Commercial Inventory
          </span>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            Supplier Contracts & Confidential Net Rates
          </h1>
        </div>

        <button
          onClick={handleSimulateContractUpload}
          disabled={isUploading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gold-400 text-safari-night font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-300 disabled:opacity-50 transition-colors shadow-sm"
        >
          <Upload className="w-4 h-4" /> {isUploading ? "Extracting Rates..." : "Import Contract (PDF / Excel)"}
        </button>
      </div>

      {uploadSuccess && (
        <div className="p-4 rounded bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Supplier List */}
        <div className="lg:col-span-5 bg-safari-card border border-safari-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-safari-border flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-safari-sand/70">
              Active Contracts ({suppliers.length})
            </span>
          </div>

          <div className="divide-y divide-safari-border">
            {suppliers.map((sup) => {
              const isSelected = selectedSupplier?.id === sup.id;
              return (
                <div
                  key={sup.id}
                  onClick={() => setSelectedSupplier(sup)}
                  className={`p-5 cursor-pointer transition-colors space-y-1.5 ${
                    isSelected ? "bg-safari-night border-l-4 border-gold-400" : "hover:bg-safari-night/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-gold-400">
                      {sup.category.replace("_", " ")}
                    </span>
                    <span className="text-[10px] font-mono text-safari-sand/50">
                      {sup.contractVersion}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg text-white font-normal">{sup.supplierName}</h3>
                  <p className="text-xs text-safari-sand/60 truncate">{sup.location}</p>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-safari-sand/70">
                    <span>Validity: {sup.validityStart} to {sup.validityEnd}</span>
                    <span className="text-emerald-400">✓ Verified</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Contract Details & Room Rate Schedule */}
        <div className="lg:col-span-7 bg-safari-card border border-safari-border rounded-lg p-6 sm:p-8 space-y-6">
          {selectedSupplier ? (
            <>
              {/* Supplier Header */}
              <div className="space-y-2 border-b border-safari-border pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-gold-400">
                    Contract ID: {selectedSupplier.contractVersion}
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                    Active & Bonded
                  </span>
                </div>

                <h2 className="font-serif text-2xl text-white font-normal">
                  {selectedSupplier.supplierName}
                </h2>
                <p className="text-xs text-safari-sand/80 font-light">{selectedSupplier.location}</p>
                <div className="text-xs font-mono text-safari-sand/60">
                  Account Contact: {selectedSupplier.contactPerson} ({selectedSupplier.contactEmail} · {selectedSupplier.contactPhone})
                </div>
              </div>

              {/* Blackout dates alert */}
              {selectedSupplier.blackoutDates.length > 0 && (
                <div className="p-3 bg-safari-night rounded border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono uppercase text-[10px] block font-semibold">
                      Contract Blackout Dates
                    </span>
                    <span>
                      Rates are invalid on: {selectedSupplier.blackoutDates.join(", ")}. Direct
                      allocation request required.
                    </span>
                  </div>
                </div>
              )}

              {/* Room Rates Table */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-safari-sand/70 block">
                  Contracted Room Rate Schedule (Confidential Net Rates)
                </span>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-safari-border rounded overflow-hidden">
                    <thead className="bg-safari-night text-[10px] font-mono uppercase text-safari-sand/60 border-b border-safari-border">
                      <tr>
                        <th className="py-2.5 px-3">Room Category</th>
                        <th className="py-2.5 px-3">Season</th>
                        <th className="py-2.5 px-3">Meal Plan</th>
                        <th className="py-2.5 px-3">Rate Basis</th>
                        <th className="py-2.5 px-3 text-right">Net Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-safari-border text-safari-sand/90">
                      {selectedSupplier.roomRates.map((r) => (
                        <tr key={r.id} className="hover:bg-safari-night/50">
                          <td className="py-2.5 px-3 font-serif text-white">{r.roomCategory}</td>
                          <td className="py-2.5 px-3 font-mono text-[10px]">{r.season}</td>
                          <td className="py-2.5 px-3">{r.mealPlan}</td>
                          <td className="py-2.5 px-3 text-[11px] font-mono text-safari-sand/60">
                            {r.rateBasis.replace(/_/g, " ")}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-gold-300">
                            ${r.contractRate} {r.rateCurrency}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="p-4 rounded bg-safari-night border border-safari-border text-xs space-y-1">
                <span className="font-mono uppercase text-[10px] text-safari-sand/50 block font-semibold">
                  Contract Cancellation Terms
                </span>
                <p className="text-safari-sand/80 font-light">{selectedSupplier.cancellationPolicy}</p>
              </div>

              {/* Document Attachment */}
              <div className="flex items-center justify-between p-3 rounded bg-safari-night border border-safari-border text-xs font-mono text-safari-sand/80">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold-400" />
                  <span>{selectedSupplier.documentAttachmentName || "Executed_Contract.pdf"}</span>
                </div>
                <span className="text-[10px] text-emerald-400">Verified by Legal</span>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-xs text-safari-sand/50">
              Select a supplier contract from the directory
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
