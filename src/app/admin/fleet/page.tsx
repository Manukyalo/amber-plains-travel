"use client";

import React, { useState } from "react";
import {
  Truck,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Clock,
  Plus,
  Zap,
  Snowflake,
  ShieldCheck,
} from "lucide-react";
import { mockVehicles } from "@/data/adminMockData";
import { SafariVehicle } from "@/types/admin";

export default function AdminFleetPage() {
  const [vehicles, setVehicles] = useState<SafariVehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<SafariVehicle | null>(vehicles[0] || null);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-safari-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Mombasa Engineering Depot
          </span>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            4x4 Safari Fleet & Trip Allocations
          </h1>
        </div>

        <button
          onClick={() => alert("Vehicle onboarding form opened.")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gold-400 text-safari-night font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-300 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Register New Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Fleet Grid */}
        <div className="lg:col-span-7 bg-safari-card border border-safari-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-safari-border flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-safari-sand/70">
              Fleet Assets ({vehicles.length})
            </span>
          </div>

          <div className="divide-y divide-safari-border">
            {vehicles.map((v) => {
              const isSelected = selectedVehicle?.id === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`p-5 cursor-pointer transition-colors space-y-2 ${
                    isSelected ? "bg-safari-night border-l-4 border-gold-400" : "hover:bg-safari-night/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-white tracking-wider">
                      {v.registrationPlate}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        v.status === "available"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                          : v.status === "on_safari"
                          ? "bg-blue-950 text-blue-300 border border-blue-500/40"
                          : "bg-rose-950 text-rose-300 border border-rose-500/40"
                      }`}
                    >
                      {v.status.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="font-serif text-base text-safari-sand font-normal">{v.makeModel}</h3>

                  <div className="flex flex-wrap gap-3 text-xs font-mono text-safari-sand/60 pt-1">
                    <span>{v.passengerCapacity} Window Seats</span>
                    <span>•</span>
                    <span>{v.currentKilometers.toLocaleString()} KM</span>
                    {v.currentTripRef && (
                      <>
                        <span>•</span>
                        <span className="text-gold-400">Trip: {v.currentTripRef}</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Vehicle Specs & Maintenance Log */}
        <div className="lg:col-span-5 bg-safari-card border border-safari-border rounded-lg p-6 space-y-6">
          {selectedVehicle ? (
            <>
              <div className="border-b border-safari-border pb-4 space-y-1">
                <span className="text-xs font-mono uppercase text-gold-400">
                  Vehicle Registration: {selectedVehicle.registrationPlate}
                </span>
                <h2 className="font-serif text-2xl text-white font-normal">
                  {selectedVehicle.makeModel}
                </h2>
              </div>

              {/* Specs badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-3 rounded bg-safari-night border border-safari-border">
                  <span className="text-safari-sand/50 text-[10px] block">CAPACITY</span>
                  <span className="text-white font-bold">{selectedVehicle.passengerCapacity} Seats</span>
                </div>
                <div className="p-3 rounded bg-safari-night border border-safari-border">
                  <span className="text-safari-sand/50 text-[10px] block">220V INVERTER</span>
                  <span className="text-gold-300 font-bold">
                    {selectedVehicle.hasInverter220v ? "Installed" : "None"}
                  </span>
                </div>
                <div className="p-3 rounded bg-safari-night border border-safari-border">
                  <span className="text-safari-sand/50 text-[10px] block">BUSH FRIDGE</span>
                  <span className="text-gold-300 font-bold">
                    {selectedVehicle.hasFridge ? "Active" : "None"}
                  </span>
                </div>
              </div>

              {/* Maintenance Telemetry */}
              <div className="p-4 rounded bg-safari-night border border-safari-border space-y-2 text-xs font-mono">
                <span className="text-[10px] uppercase text-gold-400 font-bold block">
                  Service & Maintenance Telemetry
                </span>
                <div className="flex justify-between text-safari-sand/80">
                  <span>Current Odometer:</span>
                  <span className="text-white">{selectedVehicle.currentKilometers.toLocaleString()} KM</span>
                </div>
                <div className="flex justify-between text-safari-sand/80">
                  <span>Last Service Date:</span>
                  <span className="text-white">{selectedVehicle.lastServiceDate}</span>
                </div>
                <div className="flex justify-between text-safari-sand/80">
                  <span>Next Service Due At:</span>
                  <span className="text-gold-300 font-bold">
                    {selectedVehicle.nextServiceKilometers.toLocaleString()} KM
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-safari-border flex gap-3">
                <button
                  onClick={() => alert(`Maintenance logged for ${selectedVehicle.registrationPlate}`)}
                  className="flex-1 py-2 rounded bg-safari-night hover:bg-safari-surface border border-safari-border text-xs font-mono text-safari-sand hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5" /> Log Workshop Service
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-xs text-safari-sand/50">
              Select a vehicle to inspect telemetry
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
