"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Save, CheckCircle2, Smartphone, AlertCircle } from "lucide-react";
import { siteSettingsData } from "@/data/siteSettingsData";
import { QrCodeCard } from "@/components/app/QrCodeCard";
import { SectionHeader, Card } from "@/components/admin/ui/AdminUIKit";

export default function AdminCmsPage() {
  const [heroTitle, setHeroTitle] = useState("Sanctuary of Untamed Miracles");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "The essence of stillness, wildlife communion, and an unhurried sense of place. Private bespoke safaris seamlessly bridging Kenya’s Swahili coast with the great plains of Tsavo, Amboseli, and the Mara."
  );

  const [isStoreLive, setIsStoreLive] = useState(siteSettingsData.appUrls.isStoreLive);
  const [appleStoreUrl, setAppleStoreUrl] = useState(siteSettingsData.appUrls.appleStore);
  const [googlePlayUrl, setGooglePlayUrl] = useState(siteSettingsData.appUrls.googlePlay);
  const [stableUrl, setStableUrl] = useState(siteSettingsData.appUrls.downloadPage);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSaveCms = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (isStoreLive) {
      if (
        !appleStoreUrl.startsWith("https://apps.apple.com") &&
        appleStoreUrl.trim().length > 0
      ) {
        setValidationError("Apple Store URL must start with https://apps.apple.com/");
        return;
      }
      if (
        !googlePlayUrl.startsWith("https://play.google.com") &&
        googlePlayUrl.trim().length > 0
      ) {
        setValidationError("Google Play URL must start with https://play.google.com/");
        return;
      }
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="Digital Brand Presence & Distribution"
        title="Website CMS & App Distribution Settings"
        action={
          <button
            onClick={handleSaveCms}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-400 text-safari-night font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-300 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" /> Save & Publish Changes
          </button>
        }
      />

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Website content and companion app settings updated successfully.</span>
        </div>
      )}

      {validationError && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSaveCms} className="space-y-8">
        <Card className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-safari-border pb-4">
            <div>
              <h3 className="font-serif text-xl text-white">Homepage Hero & Master Narrative</h3>
              <p className="text-xs text-safari-sand/60">
                Controls the high-contrast editorial typography on the full-bleed hero
              </p>
            </div>
            <span className="text-[10px] font-mono text-gold-400 bg-safari-night px-2.5 py-1 rounded-lg border border-safari-border">
              Editorial Serif
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
                className="w-full bg-safari-night border border-safari-border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400 font-serif"
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
                className="w-full bg-safari-night border border-safari-border rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400 leading-relaxed font-light"
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="border-b border-safari-border pb-4">
            <h3 className="font-serif text-xl text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-gold-400" />
              Guest Mobile App Distribution & Store URLs
            </h3>
            <p className="text-xs text-safari-sand/60 mt-0.5">
              Configure Phase 1/2 &quot;Coming Soon&quot; status or activate live store buttons for Phase 3.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1.5">
                  Permanent Company Universal URL (Encoded into QR)
                </label>
                <input
                  type="text"
                  value={stableUrl}
                  onChange={(e) => setStableUrl(e.target.value)}
                  className="w-full bg-safari-night border border-safari-border rounded-lg px-3.5 py-2.5 text-xs font-mono text-gold-300 focus:outline-none focus:border-gold-400"
                />
                <span className="text-[11px] text-safari-sand/50 block mt-1">
                  Must remain a first-party company link. Never use temporary development/Expo URLs.
                </span>
              </div>

              <div className="p-4 rounded-xl bg-safari-night border border-safari-border flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-serif text-sm text-white block">
                    Production App Status
                  </span>
                  <span className="text-xs text-safari-sand/60">
                    {isStoreLive
                      ? "Production app active on stores. Store buttons visible."
                      : "Phase 1/2 'Coming Soon' state. Waitlist email capture active."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsStoreLive(!isStoreLive)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors ${
                    isStoreLive
                      ? "bg-emerald-600 text-white font-bold"
                      : "bg-amber-600 text-white font-bold"
                  }`}
                >
                  {isStoreLive ? "Live on Stores" : "Coming Soon Mode"}
                </button>
              </div>

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
                    className="w-full bg-safari-night border border-safari-border rounded-lg px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-gold-400"
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
                    className="w-full bg-safari-night border border-safari-border rounded-lg px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center">
              <QrCodeCard showDownloads={true} className="w-full" />
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="font-serif text-xl text-white">Content Entities Registry</h3>
          <p className="text-xs text-safari-sand/60">
            Direct administrative shortcuts to structured site entities
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <Link
              href="/admin/packages"
              className="p-4 rounded-xl bg-safari-night border border-safari-border text-center hover:border-gold-400 transition-colors"
            >
              <span className="font-serif text-xl text-white block">5</span>
              <span className="text-[10px] font-mono uppercase text-safari-sand/60">
                Safari Packages
              </span>
            </Link>

            <Link
              href="/destinations"
              target="_blank"
              className="p-4 rounded-xl bg-safari-night border border-safari-border text-center hover:border-gold-400 transition-colors"
            >
              <span className="font-serif text-xl text-white block">4</span>
              <span className="text-[10px] font-mono uppercase text-safari-sand/60">
                Destinations
              </span>
            </Link>

            <Link
              href="/experiences"
              target="_blank"
              className="p-4 rounded-xl bg-safari-night border border-safari-border text-center hover:border-gold-400 transition-colors"
            >
              <span className="font-serif text-xl text-white block">4</span>
              <span className="text-[10px] font-mono uppercase text-safari-sand/60">
                Travel Styles
              </span>
            </Link>

            <Link
              href="/gallery"
              target="_blank"
              className="p-4 rounded-xl bg-safari-night border border-safari-border text-center hover:border-gold-400 transition-colors"
            >
              <span className="font-serif text-xl text-white block">8</span>
              <span className="text-[10px] font-mono uppercase text-safari-sand/60">
                Gallery Items
              </span>
            </Link>
          </div>
        </Card>
      </form>
    </div>
  );
}
