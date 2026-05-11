"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-700/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-md w-full">
        {/* Icon */}
        <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-rose-500/10">
          <AlertTriangle className="w-12 h-12 text-rose-500" />
        </div>

        <p className="text-rose-500/80 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
          Something went wrong
        </p>
        <h1 className="text-4xl font-black text-white tracking-tight mb-4">
          Page Error
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed font-medium mb-2">
          An unexpected error occurred. This is usually a temporary issue —
          please try again.
        </p>
        {error?.digest && (
          <p className="text-slate-700 text-[10px] font-mono mb-8">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-400 text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-2xl transition-all shadow-xl shadow-rose-500/20 hover:-translate-y-0.5"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
