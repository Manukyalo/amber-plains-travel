"use client";

import React, { useState } from "react";
import { Bell, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { appNotifySchema } from "@/types";
import { Button } from "@/components/ui/Button";

export const AppNotifyForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState<"ios" | "android" | "both">("both");
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const result = appNotifySchema.safeParse({
      email,
      devicePlatform: platform,
      consentMarketing: consent,
      honeypot,
    });

    if (!result.success) {
      setErrorMsg(result.error.errors[0]?.message || "Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/app-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Unable to register your request.");
      } else {
        setIsSuccess(true);
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-6 rounded bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-center space-y-2 animate-fadeIn">
        <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-1" />
        <h4 className="font-serif text-lg text-white">You Are on the Guest App Priority List</h4>
        <p className="text-xs text-safari-sand/80 font-light max-w-md mx-auto">
          We will send your activation invite directly as soon as the Amber Plains Companion App
          publishes on the Apple App Store and Google Play.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {/* Honeypot field */}
      <input
        type="text"
        name="website_url_check"
        tabIndex={-1}
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      {errorMsg && (
        <div className="p-3 rounded bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-mono uppercase text-safari-sand/80 mb-1">
          Your Email Address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="guest@domain.com"
          className="w-full bg-safari-night border border-safari-border rounded px-3 py-2.5 text-xs text-white placeholder-safari-sand/40 focus:outline-none focus:border-gold-400 transition-colors"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setPlatform("ios")}
          className={`py-2 px-3 rounded border text-xs font-mono text-center transition-colors ${
            platform === "ios"
              ? "bg-gold-400 text-safari-night border-gold-400 font-semibold"
              : "bg-safari-night text-safari-sand/80 border-safari-border hover:border-gold-400/50"
          }`}
        >
          Apple iOS
        </button>
        <button
          type="button"
          onClick={() => setPlatform("android")}
          className={`py-2 px-3 rounded border text-xs font-mono text-center transition-colors ${
            platform === "android"
              ? "bg-gold-400 text-safari-night border-gold-400 font-semibold"
              : "bg-safari-night text-safari-sand/80 border-safari-border hover:border-gold-400/50"
          }`}
        >
          Android
        </button>
        <button
          type="button"
          onClick={() => setPlatform("both")}
          className={`py-2 px-3 rounded border text-xs font-mono text-center transition-colors ${
            platform === "both"
              ? "bg-gold-400 text-safari-night border-gold-400 font-semibold"
              : "bg-safari-night text-safari-sand/80 border-safari-border hover:border-gold-400/50"
          }`}
        >
          Both Platforms
        </button>
      </div>

      <div className="flex items-start gap-2 pt-1">
        <input
          type="checkbox"
          id="consentMarketing"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-gold-400"
          required
        />
        <label htmlFor="consentMarketing" className="text-[11px] text-safari-sand/70 leading-snug">
          I agree to receive a one-time notification when the companion app is publicly available
          for download. We respect privacy and do not send unsolicited marketing.
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isSubmitting}
        className="w-full"
        rightIcon={<Bell className="w-3.5 h-3.5" />}
      >
        Notify Me at Launch
      </Button>
    </form>
  );
};
