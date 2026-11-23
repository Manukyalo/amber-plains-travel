import React from "react";
import { Metadata } from "next";
import { AppLandingClient } from "@/components/app/AppLandingClient";
import { siteSettingsData } from "@/data/siteSettingsData";

export const metadata: Metadata = {
  title: "Amber Plains Companion App | Guest Safari Companion",
  description:
    "Download the Amber Plains Guest Companion App for iOS and Android. Offline safari itineraries, wildlife field guides, and direct guide chat for your Kenya expedition.",
  alternates: {
    canonical: "https://amberplains.co.ke/app",
  },
};

export default function AppLandingPage() {
  const { appleStore, googlePlay, isStoreLive } = siteSettingsData.appUrls;

  return (
    <div className="bg-safari-night text-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AppLandingClient
          appleStoreUrl={appleStore}
          googlePlayUrl={googlePlay}
          isStoreLive={isStoreLive}
        />
      </div>
    </div>
  );
}
