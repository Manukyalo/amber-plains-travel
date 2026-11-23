import React from "react";
import { Metadata } from "next";
import { ShieldCheck, HeartPulse, Radio, Award, AlertTriangle, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Wilderness Safety & Protocols | Amber Plains Travel",
  description:
    "Learn about our rigorous vehicle maintenance, AMREF Flying Doctors evacuation coverage, armed scout accompaniment, and wildlife safety standards.",
};

export default function TrustAndSafetyPage() {
  return (
    <div className="bg-safari-night text-white min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Wilderness Protocols
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal mt-1 mb-3">
            Guest Safety & Wilderness Standards
          </h1>
          <p className="text-xs font-mono text-safari-sand/60">
            Uncompromising standards for remote East African travel
          </p>
        </div>

        <div className="space-y-10 text-sm font-light text-safari-sand/85 leading-relaxed">
          {/* Pillar 1: AMREF Flying Doctors */}
          <section className="bg-safari-card border border-safari-border rounded-lg p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-gold-400">
              <HeartPulse className="w-6 h-6" />
              <h2 className="font-serif text-2xl text-white font-normal">
                AMREF Flying Doctors 24/7 Evacuation Included
              </h2>
            </div>
            <p>
              Every confirmed traveler on an Amber Plains safari is automatically enrolled under
              the AMREF Flying Doctors Tourist Evacuation Scheme. In the unlikely event of a medical
              emergency anywhere in the remote savanna or coastal waters, a dedicated air ambulance
              aircraft staffed with flight physicians will be dispatched to the nearest airstrip
              to transport the guest to Nairobi’s premier international hospitals.
            </p>
          </section>

          {/* Pillar 2: Fleet Engineering */}
          <section className="bg-safari-card border border-safari-border rounded-lg p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-gold-400">
              <ShieldCheck className="w-6 h-6" />
              <h2 className="font-serif text-2xl text-white font-normal">
                Private Fleet Engineering & Safety Checks
              </h2>
            </div>
            <p>
              Our custom 4x4 Toyota Land Cruisers undergo a comprehensive 42-point safety
              inspection in our Mombasa engineering garage prior to every departure.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-safari-sand/80 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" /> Dual heavy-duty batteries & inverters
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" /> Heavy-duty sand ladders & high-lift jacks
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" /> Long-range HF radios and GPS beacons
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" /> Comprehensive trauma first aid kits
              </li>
            </ul>
          </section>

          {/* Pillar 3: Armed Ranger Accompaniment */}
          <section className="bg-safari-card border border-safari-border rounded-lg p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-gold-400">
              <Award className="w-6 h-6" />
              <h2 className="font-serif text-2xl text-white font-normal">
                Walking Safaris & Conservancy Armed Scouts
              </h2>
            </div>
            <p>
              All guided walking safaris outside vehicles are conducted in strict compliance with
              Kenya Wildlife Service (KWS) statutes. Guests on foot are accompanied at all times by
              at least one armed, state-certified wildlife ranger and an elder indigenous Maasai or
              Samburu tracker.
            </p>
          </section>

          {/* Pillar 4: Wildlife Ethics */}
          <section className="bg-safari-card border border-safari-border rounded-lg p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-gold-400">
              <AlertTriangle className="w-6 h-6 text-gold-400" />
              <h2 className="font-serif text-2xl text-white font-normal">
                Ethical Wildlife Viewing Code
              </h2>
            </div>
            <p>
              We adhere strictly to EcoTourism Kenya’s Gold standard. Our guides will never crowd a
              predator hunt, block animal migratory corridors, or encourage off-road driving in
              fragile reserve habitats. We believe silence, patience, and non-intrusive positioning
              yield the most profound wildlife encounters.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
