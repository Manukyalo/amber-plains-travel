"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PhoneCall,
  PhoneMissed,
  ShieldAlert,
  CheckCircle,
  Clock,
  User,
  ArrowRight,
  FileText,
  Volume2,
  Sparkles,
} from "lucide-react";
import { mockCallEvents } from "@/data/adminMockData";
import { TelephonyCallEvent } from "@/types/admin";

export default function AdminReceptionistPage() {
  const [callEvents, setCallEvents] = useState<TelephonyCallEvent[]>(mockCallEvents);
  const [selectedCall, setSelectedCall] = useState<TelephonyCallEvent | null>(callEvents[0] || null);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-safari-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Voice Telephony & Inbound Intelligence
          </span>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            AI Receptionist & Missed-Call Lead Capture
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono">
            Provider: Twilio / Africa&apos;s Talking SIP Trunk
          </span>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="p-4 rounded bg-safari-card border border-safari-border text-xs text-safari-sand/80 space-y-1 font-light">
        <span className="font-mono text-gold-400 uppercase font-bold block text-[10px]">
          Consent & Telecommunications Compliance Notice
        </span>
        <p>
          Caller audio recordings and transcripts are processed exclusively following caller
          opt-in consent. If a caller declines recording, raw audio is scrubbed immediately and
          only structured caller intent (party size, travel dates) is preserved for follow-up.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Calls Log */}
        <div className="lg:col-span-6 bg-safari-card border border-safari-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-safari-border flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-safari-sand/70">
              Telephony Call Events ({callEvents.length})
            </span>
          </div>

          <div className="divide-y divide-safari-border">
            {callEvents.map((call) => {
              const isSelected = selectedCall?.id === call.id;
              return (
                <div
                  key={call.id}
                  onClick={() => setSelectedCall(call)}
                  className={`p-5 cursor-pointer transition-colors space-y-2 ${
                    isSelected ? "bg-safari-night border-l-4 border-gold-400" : "hover:bg-safari-night/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-white font-bold flex items-center gap-1.5">
                      {call.status === "completed" ? (
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <PhoneMissed className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      {call.callerNumber}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        call.status === "completed"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                          : "bg-rose-950 text-rose-300 border border-rose-500/40"
                      }`}
                    >
                      {call.status}
                    </span>
                  </div>

                  <p className="text-xs text-safari-sand/70 font-mono">
                    {call.callerCountry} · {call.durationSeconds}s duration
                  </p>

                  {call.extractedIntent?.destinationOfInterest && (
                    <div className="text-xs font-mono text-gold-400">
                      Intent: {call.extractedIntent.destinationOfInterest} ({call.extractedIntent.guestCount} Guests)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Call Inspector & Lead Capture */}
        <div className="lg:col-span-6 bg-safari-card border border-safari-border rounded-lg p-6 sm:p-8 space-y-6">
          {selectedCall ? (
            <>
              <div className="border-b border-safari-border pb-4 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gold-400">Call SID: {selectedCall.callSid.slice(0, 16)}...</span>
                  <span className="text-safari-sand/50">{selectedCall.timestamp.replace("T", " ").slice(0, 16)}</span>
                </div>
                <h2 className="font-serif text-2xl text-white font-normal">
                  {selectedCall.extractedIntent?.callerName || selectedCall.callerNumber}
                </h2>
                <span className="text-xs font-mono text-safari-sand/70">
                  {selectedCall.callerCountry} · Route Provider: {selectedCall.provider.toUpperCase()}
                </span>
              </div>

              {/* Consent status */}
              <div className="p-3 rounded bg-safari-night border border-safari-border flex items-center justify-between text-xs font-mono">
                <span className="text-safari-sand/70">Recording & Transcript Consent:</span>
                <span className={selectedCall.recordingConsentGiven ? "text-emerald-400" : "text-amber-400"}>
                  {selectedCall.recordingConsentGiven ? "✓ Granted by Caller" : "Declined (Scrubbed)"}
                </span>
              </div>

              {/* Transcript snippet */}
              {selectedCall.transcriptSnippet && (
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase text-safari-sand/70 block">
                    AI Transcribed Call Excerpt:
                  </span>
                  <div className="p-4 rounded bg-safari-night border border-safari-border text-xs text-safari-sand/90 leading-relaxed font-light italic">
                    &ldquo;{selectedCall.transcriptSnippet}&rdquo;
                  </div>
                </div>
              )}

              {/* Extracted Intent & Lead Details */}
              {selectedCall.extractedIntent && (
                <div className="p-4 rounded bg-safari-night border border-safari-border space-y-3">
                  <span className="text-[10px] font-mono uppercase text-gold-400 font-bold block">
                    Structured Lead Capture (Pre-Validated)
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-safari-sand/80">
                    <div>
                      <span className="text-safari-sand/50 block text-[10px]">DATES:</span>
                      <span className="text-white">{selectedCall.extractedIntent.travelDates || "Unspecified"}</span>
                    </div>
                    <div>
                      <span className="text-safari-sand/50 block text-[10px]">PARTY:</span>
                      <span className="text-white">{selectedCall.extractedIntent.guestCount || "Unknown"} Guests</span>
                    </div>
                    <div>
                      <span className="text-safari-sand/50 block text-[10px]">TERRITORY:</span>
                      <span className="text-white">{selectedCall.extractedIntent.destinationOfInterest || "Bespoke"}</span>
                    </div>
                    <div>
                      <span className="text-safari-sand/50 block text-[10px]">EST. BUDGET:</span>
                      <span className="text-gold-300 font-bold">
                        ${selectedCall.extractedIntent.targetBudgetUsd?.toLocaleString() || "Open"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions: Human Transfer / Draft Quote */}
              <div className="pt-2 border-t border-safari-border flex gap-3">
                <Link
                  href="/admin/costing"
                  className="flex-1 py-2 px-3 rounded bg-gold-400 hover:bg-gold-300 text-safari-night font-mono text-xs font-bold uppercase text-center transition-colors"
                >
                  Draft Costing Quote
                </Link>
                <button
                  onClick={() => alert(`Escalated to human duty officer for callback: ${selectedCall.callerNumber}`)}
                  className="py-2 px-4 rounded bg-safari-night hover:bg-safari-surface border border-safari-border text-xs font-mono uppercase text-safari-sand hover:text-white transition-colors"
                >
                  Transfer to Director
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-xs text-safari-sand/50">
              Select an inbound telephony event
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
