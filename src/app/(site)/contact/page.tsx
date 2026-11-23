import React from "react";
import { Metadata } from "next";
import { MapPin, Phone, Mail, MessageSquare, Clock, ShieldCheck, Compass } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { siteSettingsData } from "@/data/siteSettingsData";

export const metadata: Metadata = {
  title: "Contact & Bespoke Safari Planning | Amber Plains Travel Mombasa",
  description:
    "Connect directly with our Mombasa safari directors. Inquire about private tailor-made safaris to Tsavo, Amboseli, Maasai Mara, and Diani Beach.",
  alternates: {
    canonical: "https://amberplains.co.ke/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-safari-night text-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeading
          eyebrow="Expedition Inquiries"
          title="Plan Your Tailor-Made Safari"
          description="Every journey we choreograph begins with an unhurried conversation. Share your preferred dates, desired wildlife encounters, and travel style with our Mombasa directors."
          align="center"
          theme="dark"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Comprehensive Enquiry Form */}
          <div className="lg:col-span-8">
            <EnquiryForm />
          </div>

          {/* Right Column: Physical Coordinates, WhatsApp & Duty Hours */}
          <div className="lg:col-span-4 space-y-8">
            {/* Direct WhatsApp Callout */}
            <div className="p-6 bg-safari-card border border-gold-400/40 rounded-lg space-y-4 shadow-luxury">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block">
                Instant Safari Desk
              </span>
              <h4 className="font-serif text-2xl text-white font-normal">
                Direct WhatsApp Concierge
              </h4>
              <p className="text-xs text-safari-sand/80 font-light leading-relaxed">
                For rapid date checks, last-minute coastal transfers, or quick questions while
                planning your trip, message our Mombasa operations director directly.
              </p>
              <a
                href={`https://wa.me/254700123456?text=${encodeURIComponent(
                  "Hello Amber Plains Travel, I would like to discuss planning a private Kenya safari."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-wider transition-colors font-semibold"
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp Now
              </a>
            </div>

            {/* Office Coordinates */}
            <div className="p-6 bg-safari-card border border-safari-border rounded-lg space-y-5 text-xs text-safari-sand/85">
              <h4 className="font-serif text-xl text-white font-normal">
                East Africa Headquarters
              </h4>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Mombasa Main Office:</span>
                    <span className="font-light leading-relaxed">
                      {siteSettingsData.address.line1}, {siteSettingsData.address.line2},{" "}
                      {siteSettingsData.address.city}, {siteSettingsData.address.country}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Compass className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Diani Beach Safari Lounge:</span>
                    <span className="font-light leading-relaxed">
                      Nomad Beach Ridge, Diani Beach Road, South Coast (Guest departures & departures)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">Telephone (Mombasa HQ):</span>
                    <span className="font-mono text-gold-300">{siteSettingsData.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">Email Dispatch:</span>
                    <span className="font-mono text-gold-300">{siteSettingsData.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Operating Hours:</span>
                    <span className="font-light">
                      Mon – Sat: 07:30 – 19:30 EAT <br />
                      Sunday: 08:30 – 16:00 EAT <br />
                      24/7 Duty Officer for in-transit safari guests
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accreditation trust seals */}
            <div className="p-6 bg-safari-night border border-safari-border rounded-lg space-y-2 text-xs text-safari-sand/70">
              <span className="font-mono uppercase tracking-wider text-gold-400/80 block text-[10px]">
                Bonded Credibility
              </span>
              <p className="flex items-center gap-2 text-white">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                Licensed by Tourism Regulatory Authority (TRA)
              </p>
              <p className="flex items-center gap-2 text-white">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                KATO Bonded Protection Scheme
              </p>
              <p className="text-[11px] font-light pt-1">
                All client funds are safeguarded under the Kenya Association of Tour Operators
                bonding agreement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
