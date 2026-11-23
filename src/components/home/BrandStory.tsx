import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Compass, HeartHandshake, Eye, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const BrandStory: React.FC = () => {
  const pillars = [
    {
      icon: <Compass className="w-5 h-5 text-gold-400" />,
      title: "Mombasa Native Roots",
      desc: "Born on the Swahili Coast in 2014. We understand the seamless geography connecting Kenya's Indian Ocean shores to the interior savannas.",
    },
    {
      icon: <Eye className="w-5 h-5 text-gold-400" />,
      title: "No Minibuses. Only 4x4 Cruisers",
      desc: "Our extended Land Cruisers feature individual suspension, 360° pop-up viewing roofs, 220V inverters for camera gear, and chilled refreshments.",
    },
    {
      icon: <Award className="w-5 h-5 text-gold-400" />,
      title: "KPSGA Certified Naturalists",
      desc: "Every expedition is led by experienced Kenya Professional Safari Guides Association Gold & Silver naturalists with decade-long animal tracking mastery.",
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-gold-400" />,
      title: "Stewardship & Local Conservancies",
      desc: "We prioritize private conservancies where land lease fees flow directly to indigenous Maasai, Samburu, and coastal coastal community land trusts.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-safari-night text-white border-t border-safari-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Brand Story */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase font-mono tracking-widest text-gold-400">
              Why Amber Plains Travel
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
              Crafted by Those Who Call <br />
              <span className="italic text-gold-200">The East African Coast</span> Home
            </h2>
            <div className="w-12 h-px bg-gold-400/60 my-2" />

            <p className="text-base font-light text-safari-sand/85 leading-relaxed">
              Most East African safari operators are anchored in Nairobi, treating the coast as an
              afterthought. We were founded in Mombasa. We view the wildlife corridor through a
              radically different lens: one where the coral breeze of the Indian Ocean meets the
              ancient volcanic soil of Tsavo and Amboseli.
            </p>

            <p className="text-sm font-light text-safari-sand/70 leading-relaxed">
              We reject high-density convoy tourism. When you embark with Amber Plains, your
              expedition is private, unhurried, and personally directed by guides who view the
              savanna not just as a workplace, but as a shared ancestral trust.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Button href="/about" variant="primary" size="md">
                Our Story & Guiding Fellowship
              </Button>
              <Link
                href="/trust-and-safety"
                className="text-xs font-mono uppercase tracking-wider text-safari-sand/80 hover:text-gold-300 underline underline-offset-4"
              >
                Conservation & Safety Protocols
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Core Pillars */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-6 bg-safari-card border border-safari-border rounded space-y-3 hover:border-gold-400/40 transition-colors"
              >
                <div className="p-2.5 w-fit rounded bg-gold-400/10 border border-gold-400/20">
                  {pillar.icon}
                </div>
                <h3 className="font-serif text-xl text-white font-normal">{pillar.title}</h3>
                <p className="text-xs text-safari-sand/75 font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
