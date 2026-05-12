"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface BrowseErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function BrowseError({ error, reset }: BrowseErrorProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 relative overflow-hidden pt-24">
            <div className="relative z-10 text-center max-w-md w-full">
                {/* Icon */}
                <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-rose-500/10">
                    <AlertTriangle className="w-12 h-12 text-rose-500" />
                </div>

                <p className="text-rose-500/80 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                    Failed to load
                </p>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">
                    Couldn't Load Products
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">
                    We're having trouble fetching the product listings. This is usually temporary. Please try again.
                </p>

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
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-xs uppercase tracking-widest px-6 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
