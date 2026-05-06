"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { markProductAsSold } from "@/lib/actions/product";

export default function MarkAsSoldButton({ productId }: { productId: string }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleMarkAsSold = async () => {
    setIsUpdating(true);
    const result = await markProductAsSold(productId);
    if (result.error) {
      alert(result.error);
      setIsUpdating(false);
      setShowConfirm(false);
    }
    // Success will trigger revalidate and the page will update
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300">
        <button 
          onClick={handleMarkAsSold}
          disabled={isUpdating}
          className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm Sold"}
        </button>
        <button 
          onClick={() => setShowConfirm(false)}
          disabled={isUpdating}
          className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setShowConfirm(true)}
      title="Mark as Sold"
      className="p-3 bg-white border border-slate-100 hover:bg-emerald-50 rounded-xl transition-all shadow-sm group"
    >
      <CheckCircle2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
    </button>
  );
}
