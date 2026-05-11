"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { MessageSquare, RefreshCw, Home, WifiOff } from "lucide-react";

interface MessagesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MessagesError({ error, reset }: MessagesErrorProps) {
  useEffect(() => {
    // Log to console for debugging without exposing to the user
    console.error("[Messages Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-rose-500/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-sm w-full">
        {/* Icon */}
        <div className="w-24 h-24 bg-indigo-500/10 border border-indigo-500/20 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/10">
          <MessageSquare className="w-10 h-10 text-indigo-400" />
          <span className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center">
            <WifiOff className="w-4 h-4 text-rose-400" />
          </span>
        </div>

        <p className="text-indigo-400/80 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
          Chat Unavailable
        </p>
        <h1 className="text-3xl font-black text-white tracking-tight mb-4">
          Could Not Load Messages
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed font-medium mb-8">
          There was a temporary problem connecting to the chat service. Your
          messages are safe — this is usually resolved within a few seconds.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 hover:-translate-y-0.5"
          >
            <RefreshCw className="w-4 h-4" />
            Reconnect
          </button>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-black text-xs uppercase tracking-widest px-6 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
