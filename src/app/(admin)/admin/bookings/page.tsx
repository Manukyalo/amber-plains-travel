"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Plus,
  Search,
  MessageSquare,
  FileText,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { mockBookings } from "@/data/adminMockData";
import { SafariBooking, BookingStage } from "@/types/admin";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<SafariBooking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<SafariBooking | null>(bookings[0] || null);
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-safari-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Guest Relations & Operations Pipeline
          </span>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            Bookings & Client CRM
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="bg-safari-card border border-safari-border rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-gold-400"
          >
            <option value="all">All Stages ({bookings.length})</option>
            <option value="new_inquiry">New Inquiries</option>
            <option value="deposit_pending">Deposit Pending</option>
            <option value="confirmed">Confirmed Safaris</option>
            <option value="in_safari">Currently in Bush</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Bookings List */}
        <div className="lg:col-span-6 bg-safari-card border border-safari-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-safari-border flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-safari-sand/70">
              Active Inquiries & Reservations ({filteredBookings.length})
            </span>
          </div>

          <div className="divide-y divide-safari-border">
            {filteredBookings.map((b) => {
              const isSelected = selectedBooking?.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className={`p-5 cursor-pointer transition-colors space-y-2 ${
                    isSelected ? "bg-safari-night border-l-4 border-gold-400" : "hover:bg-safari-night/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gold-300 font-semibold">
                      {b.referenceCode}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        b.stage === "confirmed"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                          : b.stage === "in_safari"
                          ? "bg-blue-950 text-blue-300 border border-blue-500/40 animate-pulse"
                          : b.stage === "deposit_pending"
                          ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                          : "bg-safari-surface text-safari-sand/70"
                      }`}
                    >
                      {b.stage.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg text-white font-normal">{b.guest.fullName}</h3>
                  <p className="text-xs text-safari-sand/70 line-clamp-1">{b.customTitle}</p>

                  <div className="pt-2 flex items-center justify-between text-xs font-mono text-safari-sand/60">
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
        </div>

        {/* Selected Booking CRM Workspace */}
        <div className="lg:col-span-6 bg-safari-card border border-safari-border rounded-lg p-6 sm:p-8 space-y-6">
          {selectedBooking ? (
            <>
              {/* Header & Stage Selector */}
              <div className="space-y-3 border-b border-safari-border pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-gold-400">
                    Booking Ref: {selectedBooking.referenceCode}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-safari-sand/60">Stage:</span>
                    <select
                      value={selectedBooking.stage}
                      onChange={(e) => handleStageChange(e.target.value as BookingStage)}
                      className="bg-safari-night border border-safari-border rounded px-2.5 py-1 text-xs font-mono text-gold-300 focus:outline-none focus:border-gold-400"
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
                <p className="text-xs text-safari-sand/80">{selectedBooking.customTitle}</p>
              </div>

              {/* Guest Profile Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono p-4 rounded bg-safari-night border border-safari-border">
                <div className="flex items-center gap-2 text-safari-sand/80">
                  <Mail className="w-3.5 h-3.5 text-gold-400" />
                  <span className="truncate">{selectedBooking.guest.email}</span>
                </div>
                <div className="flex items-center gap-2 text-safari-sand/80">
                  <Phone className="w-3.5 h-3.5 text-gold-400" />
                  <span>{selectedBooking.guest.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-safari-sand/80">
                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                  <span>{selectedBooking.guest.country}</span>
                </div>
                <div className="flex items-center gap-2 text-safari-sand/80">
                  <User className="w-3.5 h-3.5 text-gold-400" />
                  <span>
                    Past Journeys: {selectedBooking.guest.totalTripsWithUs}{" "}
                    {selectedBooking.guest.vipStatus && "★ VIP"}
                  </span>
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="p-4 rounded bg-safari-night border border-safari-border grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] font-mono uppercase text-safari-sand/50 block">TOTAL QUOTE</span>
                  <span className="font-serif text-base text-white">
                    ${selectedBooking.totalSellingPriceUsd.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-safari-sand/50 block">DEPOSIT</span>
                  <span className="font-serif text-base text-gold-300">
                    ${selectedBooking.depositAmountUsd.toLocaleString()}
                  </span>
                  <span className="block text-[9px] font-mono text-emerald-400">
                    {selectedBooking.depositPaid ? "✓ Paid" : "Unpaid"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-safari-sand/50 block">BALANCE DUE</span>
                  <span className="font-serif text-base text-amber-300">
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
                    className="w-full bg-safari-night border border-safari-border rounded p-2.5 text-xs text-white focus:outline-none focus:border-gold-400 font-light"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newNoteText.trim()}
                      className="px-3 py-1.5 rounded bg-gold-400 text-safari-night font-mono text-xs font-semibold uppercase disabled:opacity-50 hover:bg-gold-300 transition-colors"
                    >
                      Append Note
                    </button>
                  </div>
                </form>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedBooking.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded bg-safari-night/70 border border-safari-border text-xs space-y-1"
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
              <div className="pt-2 border-t border-safari-border flex flex-wrap gap-3">
                <Link
                  href="/admin/costing"
                  className="flex-1 py-2 px-3 rounded bg-safari-night hover:bg-safari-surface border border-safari-border text-xs text-center font-mono text-safari-sand hover:text-white transition-colors"
                >
                  Open in Costing Engine
                </Link>
                <Link
                  href={`https://wa.me/${selectedBooking.guest.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  className="py-2 px-4 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Guest
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-xs text-safari-sand/50">
              Select a reservation from the pipeline
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
