import React from "react";
import { Smartphone, WifiOff, Map, Compass, Bell } from "lucide-react";
import { QrCodeCard } from "@/components/app/QrCodeCard";

export const AppPromoSection: React.FC = () => {
  const appFeatures = [
    {
      icon: <WifiOff className="w-5 h-5 text-gold-400" />,
      title: "100% Offline Wilderness Cache",
      desc: "Full day-by-day itinerary, lodge vouchers, and emergency medical contacts function deep in Tsavo without cellular signal.",
    },
    {
      icon: <Map className="w-5 h-5 text-gold-400" />,
      title: "Interactive Bush Field Map",
      desc: "Track your Land Cruiser's live GPS route through conservancies and mark your Big Five sightings in real time.",
    },
    {
      icon: <Compass className="w-5 h-5 text-gold-400" />,
      title: "East Africa Wildlife Field Guide",
      desc: "Curated profiles and calls for over 350 birds and mammals, written by our KPSGA Gold naturalists.",
    },
    {
      icon: <Bell className="w-5 h-5 text-gold-400" />,
      title: "Direct Concierge & Guide Link",
      desc: "Coordinate bush flight transfers, dietary requests, and coastal dhow departures directly with your safari director.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-safari-night text-white border-t border-safari-border relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: App Story & Features */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/15 border border-gold-400/30 text-gold-300 text-xs font-mono uppercase tracking-widest">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Amber Plains Companion</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
              Your Private Safari Concierge, <br />
              <span className="italic text-gold-200">Deep in the Remote Wild</span>
            </h2>

            <p className="text-base font-light text-safari-sand/85 leading-relaxed">
              Before setting out on the red plains of Tsavo or boarding your bush flight into the
              Mara, every Amber Plains guest receives digital access to our bespoke companion app.
              Engineered specifically for remote East African topography where internet is scarce
              and wildlife moves fast.
            </p>

            {/* 4 Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {appFeatures.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="p-2 rounded bg-safari-card border border-safari-border shrink-0 mt-0.5">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-serif text-base text-white font-medium">{f.title}</h4>
                    <p className="text-xs text-safari-sand/70 font-light mt-0.5 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Branded QR Code Card */}
          <div className="lg:col-span-5 flex justify-center">
            <QrCodeCard showDownloads={false} className="w-full max-w-md" />
          </div>
        </div>
      </div>
    </section>
  );
};
