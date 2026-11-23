import React from "react";
import { Metadata } from "next";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Amber Plains Travel Mombasa",
  description:
    "Our privacy commitments under the Kenya Data Protection Act and international GDPR standards. Confidential safari enquiry handling.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-safari-night text-white min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Legal & Trust
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal mt-1 mb-3">
            Privacy Policy & Data Discretion
          </h1>
          <p className="text-xs font-mono text-safari-sand/60">
            Effective: January 2026 · Amber Plains Travel Ltd (Mombasa, Kenya)
          </p>
        </div>

        <div className="space-y-8 text-sm font-light text-safari-sand/85 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-white font-normal">1. Principles of Discretion</h2>
            <p>
              At Amber Plains Travel Ltd, we curate journeys for discerning international guests.
              We consider privacy and discretion as fundamental pillars of luxury hospitality.
              This policy explains how we collect, safeguard, and process your travel data in
              compliance with the Kenya Data Protection Act (2019) and the European Union General
              Data Protection Regulation (GDPR).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-white font-normal">2. Information We Collect</h2>
            <p>
              When inquiring about or booking an East African expedition with us, we collect only
              the necessary details required to legally secure national park permits, domestic bush
              flights, and lodge reservations:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Guest identity: Full legal names, nationalities, and passport details for Kenya Wildlife Service (KWS) park gate manifests.</li>
              <li>Contact coordinates: Email address, international phone / WhatsApp number.</li>
              <li>Health & dietary requests: Medical evacuation details, allergies, and physical mobility needs.</li>
              <li>Payment verification: Transaction references processed through encrypted banking partners (we never store card credentials on our servers).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-white font-normal">3. Non-Disclosure & Third Parties</h2>
            <p>
              We do not sell, rent, or lease guest information to third-party marketing brokers.
              Your details are disclosed solely to verified operational providers directly
              involved in your safari (e.g. Kenya Wildlife Service rangers, AMREF Flying Doctors,
              and chartered flight manifests).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-white font-normal">4. Guest Rights & Contact</h2>
            <p>
              You maintain the absolute right to request an inspection, amendment, or complete
              erasure of your personal coordinates following the conclusion of your journey.
              Inquiries regarding data stewardship may be addressed to our Data Protection Officer:
            </p>
            <div className="p-4 bg-safari-card border border-safari-border rounded font-mono text-xs text-gold-300">
              Data Protection Officer · Amber Plains Travel Ltd <br />
              Email: privacy@amberplains.co.ke <br />
              Bamburi Beach Ridge, Mombasa, Kenya
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
