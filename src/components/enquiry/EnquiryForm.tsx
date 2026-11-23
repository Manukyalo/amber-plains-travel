"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Send, Shield, Sparkles } from "lucide-react";
import { EnquiryFormData, enquirySchema, EnquirySubmissionResult } from "@/types";
import { Button } from "@/components/ui/Button";

interface EnquiryFormProps {
  initialPackageTitle?: string;
  className?: string;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  initialPackageTitle,
  className = "",
}) => {
  const [formData, setFormData] = useState<Partial<EnquiryFormData>>({
    fullName: "",
    email: "",
    phone: "",
    preferredDates: "",
    dateFlexibility: "flexible_month",
    adultsCount: 2,
    childrenCount: 0,
    childrenAges: "",
    packageOrDestination: initialPackageTitle || "Bespoke East African Safari",
    travelStyle: "bush_to_beach",
    budgetRangePerPersonUsd: "6000_to_10000",
    specialRequests: "",
    honeypot: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<EnquirySubmissionResult | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value, 10) || 0 : value,
    }));

    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionResult(null);

    // Client-side Zod validation
    const parsed = enquirySchema.safeParse(formData);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      // Scroll to first error
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmissionResult({
          success: false,
          message: data.error || "Unable to send enquiry. Please contact us on WhatsApp.",
          errors: data.errors,
        });
        if (data.errors) {
          setFieldErrors(data.errors);
        }
      } else {
        setSubmissionResult({
          success: true,
          referenceNumber: data.referenceNumber,
          message: data.message,
        });
      }
    } catch {
      setSubmissionResult({
        success: false,
        message: "Network connection disrupted. Please reach our Mombasa desk directly on WhatsApp or phone.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionResult?.success) {
    return (
      <div className="bg-safari-card border border-gold-400/50 rounded-lg p-8 sm:p-12 text-center text-white space-y-6 shadow-luxury animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-gold-400">
            Registration Confirmed
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-normal text-white">
            Expedition Enquiry Received
          </h3>
          <div className="inline-block px-4 py-1.5 bg-safari-night border border-gold-400/40 rounded font-mono text-sm text-gold-300 my-2">
            Reference: {submissionResult.referenceNumber}
          </div>
        </div>

        <p className="text-sm font-light text-safari-sand/85 max-w-xl mx-auto leading-relaxed">
          {submissionResult.message}
        </p>

        <div className="pt-6 border-t border-safari-border max-w-md mx-auto text-xs text-safari-sand/60 space-y-2">
          <p>Need immediate coordination? Our Mombasa Operations Desk is active 24/7:</p>
          <p className="font-mono text-gold-400">+254 700 123 456 (Phone & WhatsApp)</p>
        </div>

        <div className="pt-4">
          <button
            onClick={() => setSubmissionResult(null)}
            className="text-xs uppercase font-mono tracking-wider text-gold-400 hover:text-gold-300 underline underline-offset-4"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`bg-safari-card border border-safari-border rounded-lg p-6 sm:p-10 shadow-luxury text-white space-y-8 ${className}`}
    >
      {/* Honeypot field for anti-spam (visually hidden from real users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_url">Leave this empty</label>
        <input
          type="text"
          id="website_url"
          name="honeypot"
          tabIndex={-1}
          autoComplete="off"
          value={formData.honeypot || ""}
          onChange={handleChange}
        />
      </div>

      {submissionResult && !submissionResult.success && (
        <div
          role="alert"
          className="p-4 rounded bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-3"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div>
            <span className="font-semibold block mb-0.5">Submission Alert:</span>
            {submissionResult.message}
          </div>
        </div>
      )}

      {/* Group 1: Contact Coordinates */}
      <div>
        <h4 className="font-serif text-xl text-white font-normal mb-1 flex items-center gap-2">
          <span className="text-gold-400 font-mono text-xs">01.</span>
          Lead Guest Coordinates
        </h4>
        <p className="text-xs text-safari-sand/60 font-light mb-4">
          All details are treated with confidential safari discretion. We never share your data.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName || ""}
              onChange={handleChange}
              placeholder="e.g. Eleanor Vance"
              className={`w-full bg-safari-night border rounded px-3 py-2.5 text-xs text-white focus:outline-none transition-colors ${
                fieldErrors.fullName ? "border-rose-500" : "border-safari-border focus:border-gold-400"
              }`}
            />
            {fieldErrors.fullName && (
              <span className="text-[11px] text-rose-400 mt-1 block">
                {fieldErrors.fullName[0]}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="vance@example.com"
              className={`w-full bg-safari-night border rounded px-3 py-2.5 text-xs text-white focus:outline-none transition-colors ${
                fieldErrors.email ? "border-rose-500" : "border-safari-border focus:border-gold-400"
              }`}
            />
            {fieldErrors.email && (
              <span className="text-[11px] text-rose-400 mt-1 block">{fieldErrors.email[0]}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1">
              Phone / WhatsApp *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className={`w-full bg-safari-night border rounded px-3 py-2.5 text-xs text-white focus:outline-none transition-colors ${
                fieldErrors.phone ? "border-rose-500" : "border-safari-border focus:border-gold-400"
              }`}
            />
            {fieldErrors.phone && (
              <span className="text-[11px] text-rose-400 mt-1 block">{fieldErrors.phone[0]}</span>
            )}
          </div>
        </div>
      </div>

      {/* Group 2: Party Composition & Travel Window */}
      <div className="pt-4 border-t border-safari-border/70">
        <h4 className="font-serif text-xl text-white font-normal mb-1 flex items-center gap-2">
          <span className="text-gold-400 font-mono text-xs">02.</span>
          Expedition Window & Party Size
        </h4>
        <p className="text-xs text-safari-sand/60 font-light mb-4">
          Tell us when you plan to arrive in Kenya and who is traveling.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1">
              Estimated Dates / Month *
            </label>
            <input
              type="text"
              name="preferredDates"
              required
              value={formData.preferredDates || ""}
              onChange={handleChange}
              placeholder="e.g. Mid-September 2026 or Sep 12-22"
              className={`w-full bg-safari-night border rounded px-3 py-2.5 text-xs text-white focus:outline-none transition-colors ${
                fieldErrors.preferredDates
                  ? "border-rose-500"
                  : "border-safari-border focus:border-gold-400"
              }`}
            />
            {fieldErrors.preferredDates && (
              <span className="text-[11px] text-rose-400 mt-1 block">
                {fieldErrors.preferredDates[0]}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1">
              Flexibility
            </label>
            <select
              name="dateFlexibility"
              value={formData.dateFlexibility}
              onChange={handleChange}
              className="w-full bg-safari-night border border-safari-border rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              <option value="exact">Exact Dates Only</option>
              <option value="flexible_week">Flexible within +/- 1 Week</option>
              <option value="flexible_month">Flexible within Month</option>
              <option value="exploring">Just Exploring Options</option>
            </select>
          </div>

          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1">
                Adults *
              </label>
              <input
                type="number"
                name="adultsCount"
                min="1"
                max="30"
                value={formData.adultsCount}
                onChange={handleChange}
                className="w-full bg-safari-night border border-safari-border rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1">
                Children
              </label>
              <input
                type="number"
                name="childrenCount"
                min="0"
                max="20"
                value={formData.childrenCount}
                onChange={handleChange}
                className="w-full bg-safari-night border border-safari-border rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>
        </div>

        {Number(formData.childrenCount) > 0 && (
          <div className="mt-3">
            <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1">
              Ages of Children (helps us recommend age-appropriate camps & malaria zones)
            </label>
            <input
              type="text"
              name="childrenAges"
              value={formData.childrenAges || ""}
              onChange={handleChange}
              placeholder="e.g. 7, 12, 15"
              className="w-full bg-safari-night border border-safari-border rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            />
          </div>
        )}
      </div>

      {/* Group 3: Safari Ambition & Style */}
      <div className="pt-4 border-t border-safari-border/70">
        <h4 className="font-serif text-xl text-white font-normal mb-1 flex items-center gap-2">
          <span className="text-gold-400 font-mono text-xs">03.</span>
          Expedition Focus & Budget
        </h4>
        <p className="text-xs text-safari-sand/60 font-light mb-4">
          Choose your travel style and approximate budget tier per person.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1">
              Safari Package or Region
            </label>
            <input
              type="text"
              name="packageOrDestination"
              value={formData.packageOrDestination || ""}
              onChange={handleChange}
              placeholder="e.g. Coastal & Great Savanna Odyssey"
              className="w-full bg-safari-night border border-safari-border rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1">
              Travel Style
            </label>
            <select
              name="travelStyle"
              value={formData.travelStyle}
              onChange={handleChange}
              className="w-full bg-safari-night border border-safari-border rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              <option value="bush_to_beach">Bush-to-Beach Combination</option>
              <option value="luxury_fly_in">Luxury Fly-in Wing Safari</option>
              <option value="classic_big_five">Classic Big Five Overland 4x4</option>
              <option value="private_photographic">Private Photographic Safari</option>
              <option value="bespoke_family">Multi-Gen Family Expedition</option>
              <option value="honeymoon">Honeymoon & Romantic Sanctuary</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1">
              Target Budget (USD / Person)
            </label>
            <select
              name="budgetRangePerPersonUsd"
              value={formData.budgetRangePerPersonUsd}
              onChange={handleChange}
              className="w-full bg-safari-night border border-safari-border rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              <option value="under_3000">$2,000 - $3,000 (Short coastal safaris)</option>
              <option value="3000_to_6000">$3,000 - $6,000 (Classic luxury camps)</option>
              <option value="6000_to_10000">$6,000 - $10,000 (Signature fly-in)</option>
              <option value="10000_plus">$10,000+ (Ultra-luxury private reserves)</option>
              <option value="bespoke">Bespoke / Custom scope</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1">
            Special Interests & Desired Wilderness Encounters (Optional)
          </label>
          <textarea
            name="specialRequests"
            rows={4}
            value={formData.specialRequests || ""}
            onChange={handleChange}
            placeholder="Share any specific wildlife dreams (e.g. Great Migration crossings, tusker bull photography), dietary preferences, anniversary celebrations, or coastal beach extensions..."
            className="w-full bg-safari-night border border-safari-border rounded px-3 py-2.5 text-xs text-white placeholder-safari-sand/40 focus:outline-none focus:border-gold-400 leading-relaxed"
          />
        </div>
      </div>

      {/* Submission CTA */}
      <div className="pt-4 border-t border-safari-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-safari-sand/60 flex items-center gap-2">
          <Shield className="w-4 h-4 text-gold-400 shrink-0" />
          <span>KATO Bonded Protection · No payment taken at this stage</span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          rightIcon={<Send className="w-3.5 h-3.5" />}
          className="w-full sm:w-auto"
        >
          Submit Expedition Enquiry
        </Button>
      </div>
    </form>
  );
};
