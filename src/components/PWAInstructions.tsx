"use client";

import React from "react";
import { usePWA } from "@/context/PWAContext";
import { X, Share, PlusSquare, MoreVertical, Download } from "lucide-react";

export default function PWAInstructions() {
  const { showInstructions, setShowInstructions } = usePWA();

  if (!showInstructions) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bg-emerald-500 p-8 text-center relative">
          <button 
            onClick={() => setShowInstructions(false)}
            className="absolute top-6 right-6 w-8 h-8 bg-black/10 rounded-full flex items-center justify-center text-white hover:bg-black/20 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-20 h-20 bg-white rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-xl overflow-hidden">
             <img src="/images/logo-pwa.png" alt="Kisii Market" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-white text-xl font-black uppercase tracking-tight">Install Kisii Market</h2>
          <p className="text-emerald-50 text-xs font-bold mt-2">Get the best experience on your home screen</p>
        </div>

        <div className="p-8 space-y-6">
          {isIOS ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-slate-800">1</span>
                </div>
                <p className="text-sm text-slate-600 font-bold leading-relaxed">
                  Tap the <Share className="w-4 h-4 inline mx-1 text-emerald-500" /> <span className="text-slate-800">Share</span> button in Safari.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-slate-800">2</span>
                </div>
                <p className="text-sm text-slate-600 font-bold leading-relaxed">
                  Scroll down and tap <span className="text-slate-800">"Add to Home Screen"</span> <PlusSquare className="w-4 h-4 inline mx-1 text-emerald-500" />.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-slate-800">1</span>
                </div>
                <p className="text-sm text-slate-600 font-bold leading-relaxed">
                  Tap the <MoreVertical className="w-4 h-4 inline mx-1 text-emerald-500" /> <span className="text-slate-800">Menu</span> in your browser.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-slate-800">2</span>
                </div>
                <p className="text-sm text-slate-600 font-bold leading-relaxed">
                  Tap <span className="text-slate-800">"Install app"</span> or <span className="text-slate-800">"Add to Home screen"</span> <Download className="w-4 h-4 inline mx-1 text-emerald-500" />.
                </p>
              </div>
            </div>
          )}

          <button 
            onClick={() => setShowInstructions(false)}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-lg"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
