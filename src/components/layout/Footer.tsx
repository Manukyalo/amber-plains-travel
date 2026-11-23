import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Compass,
  Smartphone,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { siteSettingsData } from "@/data/siteSettingsData";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-safari-night text-safari-sand border-t border-safari-border relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-safari-border/70">
          {/* Col 1: Brand & Heritage */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl text-white font-normal tracking-wide">
                Amber Plains
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-gold-400 font-mono -mt-1">
                Travel · Mombasa & East Africa
              </span>
            </Link>
            <p className="text-sm font-light text-safari-sand/75 leading-relaxed max-w-sm">
              Headquartered on the historic Kenyan coast at Mombasa. We curate bespoke private
              safari expeditions bridging ancient Swahili marine heritage with the untamed
              theaters of Tsavo, Amboseli, and the Maasai Mara.
            </p>

            <div className="pt-2 flex flex-col space-y-2 text-xs text-safari-sand/70">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  {siteSettingsData.address.line1}, {siteSettingsData.address.line2},{" "}
                  {siteSettingsData.address.city}, {siteSettingsData.address.country}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{siteSettingsData.phone} (Mombasa HQ)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{siteSettingsData.email}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Safari Packages */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-gold-400 font-semibold">
              Safaris & Expeditions
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <Link
                  href="/safaris/coastal-and-great-savanna-odyssey"
                  className="hover:text-gold-300 transition-colors"
                >
                  Coastal & Great Savanna (8 Days)
                </Link>
              </li>
              <li>
                <Link
                  href="/safaris/red-elephants-and-tsavo-wilderness"
                  className="hover:text-gold-300 transition-colors"
                >
                  Red Elephants of Tsavo (4 Days)
                </Link>
              </li>
              <li>
                <Link
                  href="/safaris/amboseli-crest-and-kilimanjaro-giants"
                  className="hover:text-gold-300 transition-colors"
                >
                  Amboseli Crest & Kilimanjaro (5 Days)
                </Link>
              </li>
              <li>
                <Link
                  href="/safaris/maasai-mara-migration-wing-safari"
                  className="hover:text-gold-300 transition-colors"
                >
                  Mara Migration Wing Safari (6 Days)
                </Link>
              </li>
              <li>
                <Link
                  href="/safaris/swahili-coast-dhow-and-marine-wilderness"
                  className="hover:text-gold-300 transition-colors"
                >
                  Swahili Coast Dhow & Marine (5 Days)
                </Link>
              </li>
              <li>
                <Link
                  href="/safaris"
                  className="text-gold-400 hover:text-gold-300 font-medium inline-flex items-center gap-1 pt-1"
                >
                  View All Packages <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Destinations & Styles */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-gold-400 font-semibold">
              Destinations
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <Link href="/destinations/tsavo-national-parks" className="hover:text-gold-300 transition-colors">
                  Tsavo East & West
                </Link>
              </li>
              <li>
                <Link href="/destinations/amboseli-and-kilimanjaro" className="hover:text-gold-300 transition-colors">
                  Amboseli & Chyulu Hills
                </Link>
              </li>
              <li>
                <Link href="/destinations/maasai-mara-conservancies" className="hover:text-gold-300 transition-colors">
                  Maasai Mara Conservancies
                </Link>
              </li>
              <li>
                <Link href="/destinations/swahili-coast-mombasa-diani" className="hover:text-gold-300 transition-colors">
                  Mombasa, Diani & Wasini
                </Link>
              </li>
              <li>
                <Link href="/experiences/bush-to-beach-odyssey" className="hover:text-gold-300 transition-colors">
                  Bush-to-Beach Style
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold-300 transition-colors">
                  Curated Safari Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Guest Mobile App & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-gold-400 font-semibold">
              Guest Technology
            </h4>
            <div className="p-4 bg-safari-card rounded border border-safari-border space-y-2">
              <div className="flex items-center gap-2 text-white font-medium text-xs">
                <Smartphone className="w-4 h-4 text-gold-400" />
                <span>Guest Companion App</span>
              </div>
              <p className="text-[11px] text-safari-sand/70 font-light leading-snug">
                Access your offline day-by-day itinerary, live bush navigation, animal field guide,
                and direct guide chat.
              </p>
              <Link
                href="/app"
                className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 pt-1 font-medium"
              >
                Scan QR or Download <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="pt-2 text-[11px] text-safari-sand/60 space-y-1 font-light">
              <p className="flex items-center gap-1.5 text-safari-sand/80">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" /> KATO Bonded Member
              </p>
              <p className="flex items-center gap-1.5 text-safari-sand/80">
                <Compass className="w-3.5 h-3.5 text-gold-400" /> EcoTourism Kenya Certified
              </p>
            </div>
          </div>
        </div>

        {/* Accreditations Ribbon */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 border-b border-safari-border/40 text-[11px] text-safari-sand/60">
          <div className="flex flex-wrap items-center gap-6">
            <span className="font-mono uppercase tracking-wider text-gold-400/80">Recognized by:</span>
            <span>Kenya Association of Tour Operators (KATO)</span>
            <span>•</span>
            <span>Magical Kenya / Kenya Tourism Board</span>
            <span>•</span>
            <span>KPSGA Guide Fellowship</span>
            <span>•</span>
            <span>AMREF Flying Doctors 24/7 Evacuation</span>
          </div>
          <div>
            <Link
              href="/trust-and-safety"
              className="text-gold-400 hover:underline flex items-center gap-1"
            >
              Wilderness Safety & Protocols <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-safari-sand/50 gap-4">
          <p>© {new Date().getFullYear()} Amber Plains Travel Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="hover:text-safari-sand transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-safari-sand transition-colors">
              Terms & Booking Conditions
            </Link>
            <Link href="/trust-and-safety" className="hover:text-safari-sand transition-colors">
              Trust & Safety
            </Link>
            <Link href="/contact" className="hover:text-safari-sand transition-colors">
              Contact Mombasa Office
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
