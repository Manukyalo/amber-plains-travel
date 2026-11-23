import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Booking Conditions | Amber Plains Travel",
  description:
    "Booking terms, deposit schedule, cancellation protocols, and KATO bonding conditions for Amber Plains Travel safaris.",
};

export default function TermsPage() {
  return (
    <div className="bg-safari-night text-white min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Terms of Service
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal mt-1 mb-3">
            Terms & Booking Conditions
          </h1>
          <p className="text-xs font-mono text-safari-sand/60">
            Kenya Association of Tour Operators (KATO) Standard Agreement
          </p>
        </div>

        <div className="space-y-8 text-sm font-light text-safari-sand/85 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-white font-normal">1. Booking Confirmation & Deposits</h2>
            <p>
              To confirm a bespoke safari reservation, a non-refundable commitment deposit of 30%
              of the total quotation is required. This allows us to immediately secure exclusive
              tented camp suites, private domestic flight seats, and Kenya Wildlife Service
              conservation permits.
            </p>
            <p>
              The balance of 70% is due sixty (60) days prior to the scheduled date of arrival in
              Kenya. For reservations made within 60 days of travel, payment in full is required
              upon confirmation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-white font-normal">2. Cancellation Protocols</h2>
            <p>
              Cancellations must be notified in writing to our Mombasa headquarters. The following
              scale of cancellation fees applies based on the date notice is received:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>More than 60 days prior: Deposit forfeited.</li>
              <li>59 to 30 days prior: 50% of the total safari cost forfeited.</li>
              <li>29 days or fewer prior (or no-show): 100% of the total safari cost forfeited.</li>
            </ul>
            <p className="text-xs text-gold-300">
              * We strongly advise all guests to procure comprehensive travel insurance that includes
              trip cancellation coverage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-white font-normal">3. KATO Bond Protection</h2>
            <p>
              Amber Plains Travel is a fully bonded member of the Kenya Association of Tour
              Operators (KATO). Under the KATO bonding scheme, client funds are protected against
              company insolvency or default.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-white font-normal">4. Force Majeure & Itinerary Adjustments</h2>
            <p>
              Wildlife movements and road conditions across the African bush can change rapidly.
              While we make every endeavor to execute itineraries precisely as published, our Head
              Guides reserve the right to alter routes or accommodations when necessary to ensure
              guest safety and optimal wildlife viewing.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
