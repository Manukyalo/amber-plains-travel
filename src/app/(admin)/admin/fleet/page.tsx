"use client";

import React, { useState } from "react";
import { Wrench, Plus } from "lucide-react";
import { mockVehicles } from "@/data/adminMockData";
import { SafariVehicle } from "@/types/admin";
import {
  SectionHeader,
  Card,
  StatusBadge,
  EmptyState,
} from "@/components/admin/ui/AdminUIKit";

export default function AdminFleetPage() {
  const [vehicles] = useState<SafariVehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<SafariVehicle | null>(
    vehicles[0] || null
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Mombasa Engineering Depot"
        title="4x4 Safari Fleet & Trip Allocations"
        action={
          <button
            onClick={() => alert("Vehicle onboarding form opened.")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400 text-safari-night font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-300 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Register New Vehicle
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Card noPadding className="lg:col-span-7 overflow-hidden">
          <div className="px-5 py-4 border-b border-safari-border">
            <span className="text-xs font-mono uppercase tracking-wider text-safari-sand/70">
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
                    isSelected
                      ? "bg-safari-night border-l-2 border-gold-400"
                      : "hover:bg-safari-night/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-white tracking-wider">
                      {v.registrationPlate}
                    </span>
                    <StatusBadge
                      status={v.status.replace("_", " ")}
                      variant={
                        v.status === "available"
                          ? "confirmed"
                          : v.status === "on_safari"
                          ? "in_safari"
                          : "alert"
                      }
                    />
                  </div>

                  <h3 className="font-serif text-base text-safari-sand font-normal">
                    {v.makeModel}
                  </h3>

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
        </Card>

        <Card className="lg:col-span-5 space-y-6">
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

              <div className="grid grid-cols-3 gap-2.5 text-center text-xs font-mono">
                <div className="p-3 rounded-xl bg-safari-night border border-safari-border">
                  <span className="text-safari-sand/50 text-[10px] block">CAPACITY</span>
                  <span className="text-white font-bold mt-0.5 block">
                    {selectedVehicle.passengerCapacity} Seats
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-safari-night border border-safari-border">
                  <span className="text-safari-sand/50 text-[10px] block">220V INVERTER</span>
                  <span className="text-gold-300 font-bold mt-0.5 block">
                    {selectedVehicle.hasInverter220v ? "Installed" : "None"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-safari-night border border-safari-border">
                  <span className="text-safari-sand/50 text-[10px] block">BUSH FRIDGE</span>
                  <span className="text-gold-300 font-bold mt-0.5 block">
                    {selectedVehicle.hasFridge ? "Active" : "None"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-safari-night border border-safari-border space-y-2 text-xs font-mono">
                <span className="text-[10px] uppercase text-gold-400 font-bold block">
                  Service & Maintenance Telemetry
                </span>
                <div className="flex justify-between text-safari-sand/80">
                  <span>Current Odometer:</span>
                  <span className="text-white">
                    {selectedVehicle.currentKilometers.toLocaleString()} KM
                  </span>
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

              <div className="pt-2 border-t border-safari-border flex gap-3">
                <button
                  onClick={() =>
                    alert(`Maintenance logged for ${selectedVehicle.registrationPlate}`)
                  }
                  className="flex-1 py-2.5 rounded-lg bg-safari-night hover:bg-safari-surface border border-safari-border text-xs font-mono text-safari-sand hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5 text-gold-400" /> Log Workshop Service
                </button>
              </div>
            </>
          ) : (
            <EmptyState message="Select a vehicle to inspect telemetry" />
          )}
        </Card>
      </div>
    </div>
  );
}
