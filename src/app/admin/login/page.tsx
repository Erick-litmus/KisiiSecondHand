"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push("/admin");
        // Don't call router.refresh() - let the navigation handle it naturally
      } else {
        setError("Invalid password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
            <Lock className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3 font-outfit uppercase tracking-tighter">Admin Access</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Secure Authentication Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER SECURE PASSWORD"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700 font-black text-xs tracking-widest"
            />
            <div className="absolute right-8 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition-colors text-slate-700">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in zoom-in-95 duration-300">
              <ShieldAlert className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-500 text-[#0a0a0a] py-5 rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? "CHECKING..." : "ENTER DASHBOARD"}
            {!isSubmitting && <ArrowRight className="w-6 h-6" />}
          </button>
        </form>

        <p className="text-center mt-12 text-slate-700 text-[10px] font-black uppercase tracking-[0.3em]">
          Protected Workspace
        </p>
      </div>
    </div>
  );
}
