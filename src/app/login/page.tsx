"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowRight, Loader2, Compass } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam === "unauthorized_role"
      ? "Access restricted. You must have an administrator role (user.app_metadata.role = 'admin') to access Operations Control."
      : null
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      const role = data.user?.app_metadata?.role;
      if (role !== "admin") {
        await supabase.auth.signOut();
        setErrorMessage("Access denied. Your account is authenticated but lacks required 'admin' app_metadata privileges.");
        setIsLoading(false);
        return;
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Authentication failed. Please verify credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-safari-card border border-safari-border rounded-xl p-8 shadow-2xl backdrop-blur-sm">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-400 mb-4">
          <Compass className="w-6 h-6 animate-pulse" />
        </div>
        <h1 className="font-serif text-2xl text-white font-normal tracking-wide">
          Amber Plains
        </h1>
        <p className="text-xs font-mono uppercase tracking-widest text-gold-400 mt-1">
          Operations & Control Center
        </p>
        <p className="text-xs text-safari-sand/60 mt-2">
          Authorized personnel only. Sessions are audited and monitored.
        </p>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-safari-sand/70 mb-1.5">
            Operator Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-safari-sand/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="director@amberplains.co.ke"
              className="w-full pl-10 pr-4 py-2.5 bg-safari-night border border-safari-border rounded text-sm text-white placeholder:text-safari-sand/30 focus:outline-none focus:border-gold-400/80 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-safari-sand/70 mb-1.5">
            Security Key / Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-safari-sand/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-safari-night border border-safari-border rounded text-sm text-white placeholder:text-safari-sand/30 focus:outline-none focus:border-gold-400/80 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-safari-sand/40 hover:text-safari-sand/80 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 bg-gold-400 hover:bg-gold-300 disabled:opacity-50 text-safari-night font-mono font-semibold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Authenticate Session</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer link back to website */}
      <div className="mt-8 pt-6 border-t border-safari-border/60 text-center">
        <Link
          href="/"
          className="text-xs text-safari-sand/60 hover:text-gold-400 transition-colors"
        >
          ← Return to Amber Plains Public Expeditions
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-safari-night flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-gold-400 font-mono text-xs">Loading authentication gateway...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
