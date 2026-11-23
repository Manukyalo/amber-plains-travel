import React from "react";
import { Star, CheckCircle, Quote } from "lucide-react";
import { Testimonial } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <section className="py-20 lg:py-28 bg-safari-cream text-safari-night">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Guest Reflections"
          title="Voices from the Savannah"
          description="Unedited perspectives from travelers who entrusted their East African journeys to Amber Plains Travel."
          align="center"
          theme="light"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white p-7 rounded border border-safari-sand shadow-editorial flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* 5-Star Rating & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gold-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-safari-sand/80" />
                </div>

                <p className="text-xs sm:text-sm font-light text-safari-stone leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-safari-sand/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base text-safari-night font-medium">
                      {item.guestName}
                    </h4>
                    <span className="text-[11px] text-safari-stone/80 font-mono">
                      {item.country} · {item.travelDate}
                    </span>
                  </div>
                  {item.isVerified && (
                    <span
                      title="Verified Safari Traveler"
                      className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                    >
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>

                <div className="mt-2 text-[10px] font-mono text-gold-600 truncate">
                  {item.tripTitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
