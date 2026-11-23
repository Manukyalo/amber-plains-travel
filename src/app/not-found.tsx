import React from "react";
import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="bg-safari-night text-white min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-400 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono uppercase tracking-widest text-gold-400 block">
          404 · Uncharted Territory
        </span>

        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-white">
          Beyond the Field Map
        </h1>

        <p className="text-sm font-light text-safari-sand/80 max-w-md mx-auto leading-relaxed">
          The path you are seeking has drifted into the unmarked bush. Return to our base camp to
          discover our curated safaris and coastal expeditions.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/" variant="primary" size="md">
            Return to Homepage
          </Button>
          <Button href="/safaris" variant="outline" size="md" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Explore Safari Packages
          </Button>
        </div>
      </div>
    </div>
  );
}
