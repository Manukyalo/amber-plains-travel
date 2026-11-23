"use client";

import React, { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors securely without leaking sensitive info
    console.error("Admin Control Centre error:", error.message);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-safari-card border border-rose-500/30 rounded-xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <AlertOctagon className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 block">
            System Fault Intercepted
          </span>
          <h2 className="font-serif text-2xl text-white font-normal">
            Operational Disruption
          </h2>
          <p className="text-xs text-safari-sand/70 leading-relaxed">
            The requested control module encountered an unexpected condition. Your session remains secure.
          </p>
        </div>

        {error.digest && (
          <div className="p-2.5 rounded bg-safari-night border border-safari-border text-[10px] font-mono text-safari-sand/50">
            Fault Digest: {error.digest}
          </div>
        )}

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-gold-400 hover:bg-gold-300 text-safari-night font-mono text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Operation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
