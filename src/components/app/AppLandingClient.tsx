"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Smartphone,
  Apple,
  Play,
  QrCode as QrIcon,
  WifiOff,
  MapPin,
  Compass,
  Bell,
  Download,
  ShieldCheck,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { QrCodeCard } from "@/components/app/QrCodeCard";
import { AppNotifyForm } from "@/components/app/AppNotifyForm";
import { Button } from "@/components/ui/Button";

interface AppLandingClientProps {
  appleStoreUrl: string;
  googlePlayUrl: string;
  isStoreLive: boolean;
}

export const AppLandingClient: React.FC<AppLandingClientProps> = ({
  appleStoreUrl,
  googlePlayUrl,
  isStoreLive,
}) => {
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "desktop">("desktop");

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setDeviceType("ios");
    } else if (/android/i.test(userAgent)) {
      setDeviceType("android");
    } else {
      setDeviceType("desktop");
    }
  }, []);

  return (
    <div className="space-y-16">
      {/* Device-aware Hero Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Store actions & Coming Soon info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/15 border border-gold-400/30 text-gold-300 text-xs font-mono uppercase tracking-widest">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Amber Plains Companion · Native Expo App</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-tight">
            Your Safari Companion <br />
            <span className="italic text-gold-200">Across Remote East Africa</span>
          </h1>

          <p className="text-base font-light text-safari-sand/85 leading-relaxed max-w-xl">
            Designed for guests traveling through the wilderness of Tsavo, Amboseli, and the Mara.
            Access your day-by-day field schedule, animal species field guide, vehicle GPS tracks,
            and offline camp vouchers—all without cellular signal.
          </p>

          {/* Conditional Store Buttons or Coming Soon State */}
          {isStoreLive ? (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono uppercase tracking-wider text-safari-sand/70 block">
                Official Production Release:
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={appleStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded bg-white text-safari-night hover:bg-gold-200 font-sans font-semibold text-xs transition-colors shadow-md"
                >
                  <Apple className="w-5 h-5 fill-current" />
                  <div className="text-left">
                    <span className="block text-[9px] uppercase tracking-wider font-mono">
                      Download on
                    </span>
                    <span className="text-sm">Apple App Store</span>
                  </div>
                </a>

                <a
                  href={googlePlayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded bg-white text-safari-night hover:bg-gold-200 font-sans font-semibold text-xs transition-colors shadow-md"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <div className="text-left">
                    <span className="block text-[9px] uppercase tracking-wider font-mono">
                      Get it on
                    </span>
                    <span className="text-sm">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-safari-card border border-gold-400/40 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-gold-400/20 text-gold-300 border border-gold-400/40 text-[10px] font-mono uppercase tracking-widest font-semibold">
                  Phase 3 Rollout Notice
                </span>
                <span className="text-[11px] font-mono text-safari-sand/60">
                  Detected Device:{" "}
                  <span className="text-gold-400 uppercase font-bold">{deviceType}</span>
                </span>
              </div>

              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal mb-1">
                  Mobile App Coming Soon
                </h3>
                <p className="text-xs text-safari-sand/80 font-light leading-relaxed">
                  The Amber Plains Companion App for iOS and Android is currently in final QA for
                  offline cartography and species recognition. Store links will activate once
                  officially approved by Apple and Google.
                </p>
              </div>

              {/* Priority Notification Form */}
              <div className="pt-2 border-t border-safari-border">
                <span className="text-xs font-mono uppercase tracking-wider text-gold-400 block mb-2">
                  Receive Early Access & VIP Activation Pass:
                </span>
                <AppNotifyForm />
              </div>
            </div>
          )}

          {/* Web Fallback Options */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-mono text-safari-sand/70">
            <span>Prefer immediate travel coordination?</span>
            <Link href="/contact" className="text-gold-400 hover:text-gold-300 underline">
              Plan via Web Portal →
            </Link>
          </div>
        </div>

        {/* Right Column: Branded QR Code Generator & Print Vector Downloads */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <QrCodeCard showDownloads={true} className="w-full" />
        </div>
      </div>

      {/* Offline Capabilities Overview */}
      <section className="bg-safari-card border border-safari-border rounded-lg p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Engineered for Deep Savannah
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Why Our Guests Love the Companion App
          </h2>
          <p className="text-xs text-safari-sand/70 font-light">
            Designed specifically for remote game drives where cell towers do not exist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-safari-night border border-safari-border rounded space-y-3">
            <WifiOff className="w-6 h-6 text-gold-400" />
            <h4 className="font-serif text-xl text-white">Full Offline Field Cache</h4>
            <p className="text-xs text-safari-sand/75 font-light leading-relaxed">
              Upon booking confirmation, your entire itinerary, driver profile, gate permits, and
              camp contacts are encrypted and downloaded locally to your smartphone.
            </p>
          </div>

          <div className="p-6 bg-safari-night border border-safari-border rounded space-y-3">
            <Compass className="w-6 h-6 text-gold-400" />
            <h4 className="font-serif text-xl text-white">350+ Species Field Guide</h4>
            <p className="text-xs text-safari-sand/75 font-light leading-relaxed">
              Identify elusive bird calls, antelope tracks, and big cat subspecies with audio recordings
              and ecological notes written by KPSGA Silver naturalists.
            </p>
          </div>

          <div className="p-6 bg-safari-night border border-safari-border rounded space-y-3">
            <ShieldCheck className="w-6 h-6 text-gold-400" />
            <h4 className="font-serif text-xl text-white">AMREF SOS Satellite Link</h4>
            <p className="text-xs text-safari-sand/75 font-light leading-relaxed">
              Direct emergency coordinates transmission for 24/7 Flying Doctors medical evacuation
              throughout Kenya and northern Tanzania.
            </p>
          </div>
        </div>
      </section>

      {/* QR Code Usage & Security Policy */}
      <section className="p-6 sm:p-8 bg-safari-night border border-safari-border rounded-lg space-y-3 text-xs text-safari-sand/75">
        <h4 className="font-serif text-lg text-white font-normal flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gold-400" />
          First-Party QR Code Security Architecture
        </h4>
        <p className="leading-relaxed">
          The Amber Plains QR code strictly encodes our first-party universal link (
          <code className="text-gold-300 font-mono">https://amberplains.co.ke/app</code>). It
          contains no guest names, booking references, or financial tokens. When scanned on print
          collateral in our vehicles or lodges, it safely directs the user’s camera to the official
          store listing or our responsive web portal.
        </p>
      </section>
    </div>
  );
};
