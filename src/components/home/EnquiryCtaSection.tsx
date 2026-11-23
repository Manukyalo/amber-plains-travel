import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Calendar, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const EnquiryCtaSection: React.FC = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-safari-night text-white overflow-hidden">
      {/* Background with subtle warm gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2000&q=85"
          alt="Elephants in the golden sunset dust of Kenya"
          fill
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.25]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-safari-night via-safari-night/80 to-safari-night/90" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <span className="text-xs uppercase font-mono tracking-widest text-gold-400 mb-3">
          Begin Your Journey
        </span>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-tight mb-6">
          Ready to Craft Your <br />
          <span className="italic text-gold-200">East African Odyssey?</span>
        </h2>

        <p className="max-w-2xl text-base sm:text-lg font-light text-safari-sand/85 leading-relaxed mb-10">
          Whether you dream of waking to lions along the Mara River, photographing Amboseli’s great
          tuskers, or retreating to a secluded dhow anchored off Diani Beach, our Mombasa
          expedition directors stand ready.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Button
            href="/contact"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Design Tailor-Made Safari
          </Button>

          <Link
            href="https://wa.me/254700123456"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-4 text-xs font-mono uppercase tracking-wider rounded border border-gold-400/40 text-gold-300 hover:bg-gold-400/10 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Direct WhatsApp Desk
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-safari-sand/60">
          <span>✓ Guaranteed response within 12 hours</span>
          <span>✓ Completely bespoke, zero pre-packaged tours</span>
          <span>✓ Private 4x4 vehicles & dedicated Gold guides</span>
        </div>
      </div>
    </section>
  );
};
