"use client";

import React, { useState } from "react";
import { dismissReport, banUser } from "@/lib/actions/admin";
import { Check, UserX, Loader2 } from "lucide-react";

export default function ReportActions({ reportId, reportedUserId, isBanned }: { reportId: string, reportedUserId: string, isBanned: boolean }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDismiss = async () => {
    setIsProcessing(true);
    await dismissReport(reportId);
    setIsProcessing(false);
  };

  const handleBan = async () => {
    if (!confirm("Are you sure you want to ban this user? They will not be able to log in.")) return;
    setIsProcessing(true);
    await banUser(reportedUserId);
    setIsProcessing(false);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleDismiss}
        disabled={isProcessing}
        className="px-3 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold flex items-center gap-1 border border-emerald-500/20 disabled:opacity-50"
      >
        {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
        Dismiss
      </button>

      {!isBanned && (
        <button
          onClick={handleBan}
          disabled={isProcessing}
          className="px-3 py-2 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all text-xs font-bold flex items-center gap-1 border border-rose-500/20 disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserX className="w-3 h-3" />}
          Ban User
        </button>
      )}
    </div>
  );
}
