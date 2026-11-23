import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Compass, ShieldCheck, Award, HeartHandshake, Eye, CheckCircle2, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Our Guiding Fellowship & Heritage | Amber Plains Travel",
  description:
    "Founded in Mombasa in 2014, Amber Plains Travel is a KATO-bonded bespoke East African safari operator rooted in wildlife stewardship, certified naturalists, and custom 4x4 Land Cruisers.",
  alternates: {
    canonical: "https://amberplains.co.ke/about",
  },
};

export default function AboutPage() {
  const leadership = [
    {
      name: "David Ndung'u",
      role: "Head Safari Director & Master Naturalist",
      bio: "With over 18 years leading private charters through Tsavo, Amboseli, and the Mara, David is a certified KPSGA Silver guide renowned for bird sound identification and predator tracking.",
      image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Amina Hassan",
      role: "Mombasa Cultural Curator & Coastal Director",
      bio: "A Mombasa native with deep maritime ties to the Swahili coast. Amina choreographs our dhow marine expeditions, Old Town historical walks, and beach villa stays.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Ole Lenku",
      role: "Maasai Conservancies Liaison & Ranger",
      bio: "Born in the Mara ecosystem, Ole Lenku manages our direct partnerships with local landowner families, ensuring ethical walking safaris and direct conservancy dividends.",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="bg-safari-night text-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Intro Section */}
        <SectionHeading
          eyebrow="Our Heritage & Philosophy"
          title="Rooted in the Coast, Devoted to the Wild"
          description="Amber Plains Travel was founded in Mombasa in 2014 with a singular conviction: that East African safaris should be deeply personal, ecologically responsible, and seamlessly connected to Kenya’s coastal heritage."
          align="center"
          theme="dark"
        />

        {/* Narrative & Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-lg overflow-hidden bg-safari-card border border-safari-border shadow-luxury">
            <Image
              src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85"
              alt="Amber Plains custom Land Cruiser at dawn"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
              The Mombasa Advantage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight">
              Why We Call The Swahili Coast Our Anchor
            </h2>
            <div className="w-12 h-px bg-gold-400" />

            <p className="text-sm font-light text-safari-sand/85 leading-relaxed">
              While the international travel industry historically channeled all safaris through
              Nairobi’s congested ring roads, we recognized that the true romantic soul of Kenya
              lives in the historic corridor connecting the Indian Ocean to the Great Savannas.
            </p>

            <p className="text-sm font-light text-safari-sand/75 leading-relaxed">
              Arriving in Mombasa or relaxing at a beach villa in Diani or Watamu, our guests do
              not lose days in transit. Within three hours of leaving the surf, you are in the
              heart of Tsavo East watching red-dust coated elephants bathe in the Galana River.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-mono text-safari-sand/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400" /> KATO Bonded Member
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400" /> EcoTourism Kenya Gold
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400" /> AMREF Flying Doctors
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400" /> 100% Private Fleet
              </div>
            </div>
          </div>
        </div>

        {/* Guiding Standards & Fleet */}
        <section className="bg-safari-card border border-safari-border rounded-lg p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
              The Vehicle & The Guide
            </span>
            <h3 className="font-serif text-3xl font-normal text-white mt-1">
              The Standard We Never Compromise
            </h3>
            <p className="text-xs text-safari-sand/70 font-light mt-2 leading-relaxed">
              Your safari is only as extraordinary as the eyes scanning the grass and the vehicle
              carrying you through the sand rivers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-safari-night border border-safari-border rounded space-y-3">
              <Eye className="w-6 h-6 text-gold-400" />
              <h4 className="font-serif text-xl text-white">Custom 4x4 Cruisers</h4>
              <p className="text-xs text-safari-sand/75 font-light leading-relaxed">
                Extended wheelbase, custom heavy-duty shock absorption, guaranteed window seats,
                pop-up 360° roof, inverter charging ports, and chilled storage. We never deploy
                minibuses.
              </p>
            </div>

            <div className="p-6 bg-safari-night border border-safari-border rounded space-y-3">
              <Award className="w-6 h-6 text-gold-400" />
              <h4 className="font-serif text-xl text-white">KPSGA Certified Guides</h4>
              <p className="text-xs text-safari-sand/75 font-light leading-relaxed">
                All lead guides hold Kenya Professional Safari Guides Association Silver or Gold
                credentials. Decades of spoor tracking, ornithology, and respectful wildlife
                etiquette.
              </p>
            </div>

            <div className="p-6 bg-safari-night border border-safari-border rounded space-y-3">
              <HeartHandshake className="w-6 h-6 text-gold-400" />
              <h4 className="font-serif text-xl text-white">Conservancy Land Dividends</h4>
              <p className="text-xs text-safari-sand/75 font-light leading-relaxed">
                We champion private community conservancies where guest bed-night levies directly
                fund local indigenous education, healthcare, and anti-poaching wildlife rangers.
              </p>
            </div>
          </div>
        </section>

        {/* Guiding Fellowship Leadership */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
              The Team
            </span>
            <h3 className="font-serif text-3xl font-normal text-white mt-1">
              Meet Our Safari Directors
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((leader, i) => (
              <div
                key={i}
                className="bg-safari-card border border-safari-border rounded overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square overflow-hidden bg-safari-dark">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400">
                      {leader.role}
                    </span>
                    <h4 className="font-serif text-2xl text-white">{leader.name}</h4>
                    <p className="text-xs text-safari-sand/75 font-light leading-relaxed pt-1">
                      {leader.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Next Action CTA */}
        <div className="p-8 sm:p-12 bg-safari-card border border-gold-400/30 rounded-lg text-center space-y-4">
          <h3 className="font-serif text-3xl text-white font-normal">
            Begin an Unhurried Conversation
          </h3>
          <p className="text-xs sm:text-sm text-safari-sand/80 font-light max-w-xl mx-auto">
            Speak directly with our Mombasa expedition planners to discuss dates, seasonal wildlife
            movements, and tailor-made logistics.
          </p>
          <div className="pt-2">
            <Button href="/contact" variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Contact Expedition Desk
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
