"use client";

import React, { useState } from "react";
import { banUser } from "@/lib/actions/admin";
import { UserX, ShieldOff, Loader2 } from "lucide-react";

interface UserBanButtonProps {
  userId: string;
  isBanned: boolean;
}

export default function UserBanButton({ userId, isBanned }: UserBanButtonProps) {
  const [processing, setProcessing] = useState(false);
  const [banned, setBanned] = useState(isBanned);

  const handleBan = async () => {
    if (
      !confirm(
        "Ban this user? Their email, phone, and IP will be blacklisted to prevent re-registration."
      )
    )
      return;

    setProcessing(true);
    const result = await banUser(userId);
    if (result.success) {
      setBanned(true);
    } else {
      alert("Failed to ban user. Please try again.");
    }
    setProcessing(false);
  };

  if (banned) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">
        <ShieldOff className="w-3 h-3" />
        Banned
      </div>
    );
  }

  return (
    <button
      onClick={handleBan}
      disabled={processing}
      title="Ban this user"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
    >
      {processing ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <UserX className="w-3 h-3" />
      )}
      {processing ? "Banning…" : "Ban"}
    </button>
  );
}
