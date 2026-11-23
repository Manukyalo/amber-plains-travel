"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Save,
  CheckCircle2,
  Smartphone,
  Download,
  AlertCircle,
  ExternalLink,
  QrCode as QrIcon,
} from "lucide-react";
import { siteSettingsData } from "@/data/siteSettingsData";
import { QrCodeCard } from "@/components/app/QrCodeCard";

export default function AdminCmsPage() {
  const [heroTitle, setHeroTitle] = useState("Sanctuary of Untamed Miracles");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "The essence of stillness, wildlife communion, and an unhurried sense of place. Private bespoke safaris seamlessly bridging Kenya’s Swahili coast with the great plains of Tsavo, Amboseli, and the Mara."
  );

  // App Distribution Settings
  const [isStoreLive, setIsStoreLive] = useState(siteSettingsData.appUrls.isStoreLive);
  const [appleStoreUrl, setAppleStoreUrl] = useState(siteSettingsData.appUrls.appleStore);
  const [googlePlayUrl, setGooglePlayUrl] = useState(siteSettingsData.appUrls.googlePlay);
  const [stableUrl, setStableUrl] = useState(siteSettingsData.appUrls.downloadPage);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSaveCms = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate URLs before publishing if marked live
    if (isStoreLive) {
      if (!appleStoreUrl.startsWith("https://apps.apple.com") && appleStoreUrl.trim().length > 0) {
        setValidationError("Apple Store URL must start with https://apps.apple.com/");
        return;
      }
      if (!googlePlayUrl.startsWith("https://play.google.com") && googlePlayUrl.trim().length > 0) {
        setValidationError("Google Play URL must start with https://play.google.com/");
        return;
      }
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-safari-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Digital Brand Presence & Distribution
          </span>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            Website CMS & App Distribution Settings
          </h1>
        </div>

        <button
          onClick={handleSaveCms}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-gold-400 text-safari-night font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-300 transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" /> Save & Publish Changes
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Website content and companion app settings updated successfully.</span>
        </div>
      )}

      {validationError && (
        <div className="p-4 rounded bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSaveCms} className="space-y-10">
        {/* Section 1: Homepage Editorial Headline & Visual Hero */}
        <section className="bg-safari-card border border-safari-border rounded-lg p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-safari-border pb-4">
            <div>
              <h3 className="font-serif text-xl text-white">Homepage Hero & Master Narrative</h3>
              <p className="text-xs text-safari-sand/60">Controls the high-contrast editorial typography on the full-bleed hero</p>
            </div>
            <span className="text-[10px] font-mono text-gold-400 bg-safari-night px-2.5 py-1 rounded border border-safari-border">
              Singita-Inspired Serif
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1.5">
                Primary Editorial Headline
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full bg-safari-night border border-safari-border rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400 font-serif"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1.5">
                Concise Supporting Copy (Displayed beneath title)
              </label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full bg-safari-night border border-safari-border rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400 leading-relaxed font-light"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Guest Companion App & QR Distribution Settings */}
        <section className="bg-safari-card border border-safari-border rounded-lg p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-safari-border pb-4">
            <div>
              <h3 className="font-serif text-xl text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-gold-400" />
                Guest Mobile App Distribution & Store URLs
              </h3>
              <p className="text-xs text-safari-sand/60">
                Configure Phase 1/2 &quot;Coming Soon&quot; status or activate live store buttons for Phase 3.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              {/* Stable first-party download link */}
              <div>
                <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1.5">
                  Permanent Company Universal URL (Encoded into QR)
                </label>
                <input
                  type="text"
                  value={stableUrl}
                  onChange={(e) => setStableUrl(e.target.value)}
                  className="w-full bg-safari-night border border-safari-border rounded px-3 py-2.5 text-xs font-mono text-gold-300 focus:outline-none focus:border-gold-400"
                />
                <span className="text-[11px] text-safari-sand/50 block mt-1">
                  Must remain a first-party company link. Never use temporary development/Expo URLs.
                </span>
              </div>

              {/* Status toggle */}
              <div className="p-4 rounded bg-safari-night border border-safari-border flex items-center justify-between">
                <div>
                  <span className="font-serif text-sm text-white block">Production App Status</span>
                  <span className="text-xs text-safari-sand/60">
                    {isStoreLive
                      ? "Production app active on stores. Store buttons visible."
                      : "Phase 1/2 'Coming Soon' state. Waitlist email capture active."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsStoreLive(!isStoreLive)}
                  className={`px-4 py-1.5 rounded text-xs font-mono uppercase transition-colors ${
                    isStoreLive
                      ? "bg-emerald-600 text-white font-bold"
                      : "bg-amber-600 text-white font-bold"
                  }`}
                >
                  {isStoreLive ? "Live on Stores" : "Coming Soon Mode"}
                </button>
              </div>

              {/* Store URLs */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1">
                    Official Apple App Store URL (Phase 3)
                  </label>
                  <input
                    type="url"
                    placeholder="https://apps.apple.com/app/amber-plains-companion/id123456789"
                    value={appleStoreUrl}
                    onChange={(e) => setAppleStoreUrl(e.target.value)}
                    className="w-full bg-safari-night border border-safari-border rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1">
                    Official Google Play Store URL (Phase 3)
                  </label>
                  <input
                    type="url"
                    placeholder="https://play.google.com/store/apps/details?id=ke.co.amberplains.companion"
                    value={googlePlayUrl}
                    onChange={(e) => setGooglePlayUrl(e.target.value)}
                    className="w-full bg-safari-night border border-safari-border rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>
            </div>

            {/* QR Artwork Preview & Vector Download */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <QrCodeCard showDownloads={true} className="w-full" />
            </div>
          </div>
        </section>

        {/* Section 3: Quick Content Registry Links */}
        <section className="bg-safari-card border border-safari-border rounded-lg p-6 sm:p-8 space-y-4">
          <h3 className="font-serif text-xl text-white">Content Entities Registry</h3>
          <p className="text-xs text-safari-sand/60">Direct administrative shortcuts to structured site entities</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <Link
              href="/admin/packages"
              className="p-4 rounded bg-safari-night border border-safari-border text-center hover:border-gold-400 transition-colors"
            >
              <span className="font-serif text-xl text-white block">5</span>
              <span className="text-[10px] font-mono uppercase text-safari-sand/60">Safari Packages</span>
            </Link>

            <Link
              href="/destinations"
              target="_blank"
              className="p-4 rounded bg-safari-night border border-safari-border text-center hover:border-gold-400 transition-colors"
            >
              <span className="font-serif text-xl text-white block">4</span>
              <span className="text-[10px] font-mono uppercase text-safari-sand/60">Destinations</span>
            </Link>

            <Link
              href="/experiences"
              target="_blank"
              className="p-4 rounded bg-safari-night border border-safari-border text-center hover:border-gold-400 transition-colors"
            >
              <span className="font-serif text-xl text-white block">4</span>
              <span className="text-[10px] font-mono uppercase text-safari-sand/60">Travel Styles</span>
            </Link>

            <Link
              href="/gallery"
              target="_blank"
              className="p-4 rounded bg-safari-night border border-safari-border text-center hover:border-gold-400 transition-colors"
            >
              <span className="font-serif text-xl text-white block">8</span>
              <span className="text-[10px] font-mono uppercase text-safari-sand/60">Gallery Items</span>
            </Link>
          </div>
        </section>
      </form>
    </div>
  );
}
