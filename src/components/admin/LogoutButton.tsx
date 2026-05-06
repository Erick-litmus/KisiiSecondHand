"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { clearSession } from "@/lib/actions/auth";

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      // 1. Clear legacy admin session
      await fetch("/api/admin/logout", {
        method: "POST",
      });

      // 2. Clear new user session
      await clearSession();

      // 3. Force a full refresh and redirect
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="w-full h-12 flex items-center justify-center gap-3 text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
    >
      <LogOut className="w-4 h-4" />
      {isLoggingOut ? "LOGGING OUT..." : "SECURE LOGOUT"}
    </button>
  );
}
