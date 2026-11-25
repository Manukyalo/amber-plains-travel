"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { mockBookings } from "@/data/adminMockData";
import { SafariBooking, BookingStage } from "@/types/admin";
import {
  SectionHeader,
  Card,
  StatusBadge,
  EmptyState,
} from "@/components/admin/ui/AdminUIKit";

function stageVariant(
  stage: BookingStage
): "confirmed" | "in_safari" | "completed" | "pending" | "alert" | "neutral" {
  if (stage === "confirmed") return "confirmed";
  if (stage === "in_safari") return "in_safari";
  if (stage === "completed") return "completed";
  if (stage === "deposit_pending") return "pending";
  if (stage === "cancelled") return "alert";
  return "neutral";
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<SafariBooking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<SafariBooking | null>(
    bookings[0] || null
  );
  const [filterStage, setFilterStage] = useState<string>("all");
  const [newNoteText, setNewNoteText] = useState("");

  const filteredBookings = bookings.filter((b) => {
    if (filterStage === "all") return true;
    return b.stage === filterStage;
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedBooking) return;

    const newNote = {
      id: `nt-${Date.now()}`,
      authorName: "David Ndung'u (Safari Director)",
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      text: newNoteText.trim(),
      isInternalOnly: true,
    };

    const updated = {
      ...selectedBooking,
      notes: [newNote, ...selectedBooking.notes],
    };

    setSelectedBooking(updated);
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setNewNoteText("");
  };

  const handleStageChange = (newStage: BookingStage) => {
    if (!selectedBooking) return;
    const updated = { ...selectedBooking, stage: newStage };
    setSelectedBooking(updated);
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Guest Relations & Operations Pipeline"
        title="Bookings & Client CRM"
        action={
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            aria-label="Filter bookings by stage"
            className="bg-safari-card border border-safari-border rounded-lg px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-gold-400"
          >
            <option value="all">All Stages ({bookings.length})</option>
            <option value="new_inquiry">New Inquiries</option>
            <option value="deposit_pending">Deposit Pending</option>
            <option value="confirmed">Confirmed Safaris</option>
            <option value="in_safari">Currently in Bush</option>
            <option value="completed">Completed</option>
          </select>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Bookings List */}
        <Card noPadding className="lg:col-span-6 overflow-hidden">
          <div className="px-5 py-4 border-b border-safari-border flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-safari-sand/70">
              Active Inquiries & Reservations ({filteredBookings.length})
            </span>
          </div>

          {filteredBookings.length === 0 ? (
            <EmptyState
              message="No bookings match the selected stage filter."
              hint="Select 'All Stages' to view the full pipeline."
            />
          ) : (
            <div className="divide-y divide-safari-border">
              {filteredBookings.map((b) => {
                const isSelected = selectedBooking?.id === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className={`p-5 cursor-pointer transition-colors space-y-2 ${
                      isSelected
                        ? "bg-safari-night border-l-2 border-gold-400"
                        : "hover:bg-safari-night/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-gold-300 font-semibold">
                        {b.referenceCode}
                      </span>
                      <StatusBadge
                        status={b.stage.replace("_", " ")}
                        variant={stageVariant(b.stage)}
                      />
                    </div>

                    <h3 className="font-serif text-lg text-white font-normal">
                      {b.guest.fullName}
                    </h3>
                    <p className="text-xs text-safari-sand/70 line-clamp-1">
                      {b.customTitle}
                    </p>

                    <div className="pt-1.5 flex items-center justify-between text-xs font-mono text-safari-sand/60">
                      <span>
                        {b.startDate} · {b.durationDays} Days ({b.adultsCount} Guests)
                      </span>
                      <span className="text-white font-serif font-semibold text-sm">
                        ${b.totalSellingPriceUsd.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Selected Booking CRM Workspace */}
        <Card className="lg:col-span-6 space-y-6">
          {selectedBooking ? (
            <>
              <div className="space-y-3 border-b border-safari-border pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-gold-400">
                    Booking Ref: {selectedBooking.referenceCode}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-safari-sand/60">Stage:</span>
                    <select
                      value={selectedBooking.stage}
                      onChange={(e) => handleStageChange(e.target.value as BookingStage)}
                      aria-label="Booking stage"
                      className="bg-safari-night border border-safari-border rounded-lg px-2.5 py-1 text-xs font-mono text-gold-300 focus:outline-none focus:border-gold-400"
                    >
                      <option value="new_inquiry">New Inquiry</option>
                      <option value="scoping">Scoping & Route Design</option>
                      <option value="quote_drafted">Quote Drafted</option>
                      <option value="quote_sent">Quote Sent to Guest</option>
                      <option value="deposit_pending">Deposit Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_safari">In Safari</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <h2 className="font-serif text-2xl text-white font-normal">
                  {selectedBooking.guest.fullName}
                </h2>
                <p className="text-xs text-safari-sand/75">{selectedBooking.customTitle}</p>
              </div>

              {/* Guest Profile Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono p-4 rounded-lg bg-safari-night border border-safari-border">
                <div className="flex items-center gap-2 text-safari-sand/80 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span className="truncate">{selectedBooking.guest.email}</span>
                </div>
                <div className="flex items-center gap-2 text-safari-sand/80">
                  <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>{selectedBooking.guest.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-safari-sand/80">
                  <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>{selectedBooking.guest.country}</span>
                </div>
                <div className="flex items-center gap-2 text-safari-sand/80">
                  <User className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>
                    Past Journeys: {selectedBooking.guest.totalTripsWithUs}{" "}
                    {selectedBooking.guest.vipStatus && "★ VIP"}
                  </span>
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="p-4 rounded-lg bg-safari-night border border-safari-border grid grid-cols-3 gap-3 text-center">
                <div>
                  <span className="text-[10px] font-mono uppercase text-safari-sand/50 block">
                    Total Quote
                  </span>
                  <span className="font-serif text-lg text-white">
                    ${selectedBooking.totalSellingPriceUsd.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-safari-sand/50 block">
                    Deposit
                  </span>
                  <span className="font-serif text-lg text-gold-300">
                    ${selectedBooking.depositAmountUsd.toLocaleString()}
                  </span>
                  <span className="block text-[9px] font-mono text-emerald-400">
                    {selectedBooking.depositPaid ? "✓ Paid" : "Unpaid"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-safari-sand/50 block">
                    Balance Due
                  </span>
                  <span className="font-serif text-lg text-amber-300">
                    ${selectedBooking.balanceDueUsd.toLocaleString()}
                  </span>
                  <span className="block text-[9px] font-mono text-safari-sand/50">
                    by {selectedBooking.balanceDueDate}
                  </span>
                </div>
              </div>

              {/* Internal Notes & Communications Log */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-safari-sand/70 block">
                  Confidential Staff Communications Log
                </span>

                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Log guide communications, dietary special notes, or dispatch requests..."
                    className="w-full bg-safari-night border border-safari-border rounded-lg p-3 text-xs text-white focus:outline-none focus:border-gold-400 font-light"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newNoteText.trim()}
                      className="px-3.5 py-1.5 rounded-lg bg-gold-400 text-safari-night font-mono text-xs font-semibold uppercase disabled:opacity-50 hover:bg-gold-300 transition-colors"
                    >
                      Append Note
                    </button>
                  </div>
                </form>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedBooking.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-lg bg-safari-night/70 border border-safari-border text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-safari-sand/50">
                        <span className="text-gold-400 font-medium">{note.authorName}</span>
                        <span>{note.createdAt}</span>
                      </div>
                      <p className="text-safari-sand/90 font-light">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-safari-border flex flex-wrap gap-3">
                <Link
                  href="/admin/costing"
                  className="flex-1 py-2.5 px-3 rounded-lg bg-safari-night hover:bg-safari-surface border border-safari-border text-xs text-center font-mono text-safari-sand hover:text-white transition-colors"
                >
                  Open in Costing Engine
                </Link>
                <Link
                  href={`https://wa.me/${selectedBooking.guest.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  className="py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Guest
                </Link>
              </div>
            </>
          ) : (
            <EmptyState message="Select a reservation from the pipeline" />
          )}
        </Card>
      </div>
    </div>
  );
}
