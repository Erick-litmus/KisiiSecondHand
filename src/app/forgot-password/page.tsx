"use client";

import React, { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/password-reset";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const result = await requestPasswordReset(email);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || "Failed to request password reset");
    }
    
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-8 animate-in zoom-in duration-500 relative z-10">
          <Mail className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl font-black text-white mb-4 relative z-10">Check Your Email</h2>
        <p className="text-slate-400 text-lg max-w-md mx-auto mb-8 relative z-10">
          We've sent a password reset link to your email address. Please check your inbox and spam folder.
        </p>
        <Link 
          href="/login" 
          className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all shadow-xl relative z-10"
        >
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center py-20 px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors mb-8 text-xs font-black uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
        <h2 className="text-4xl font-black text-white tracking-tight">
          Reset <span className="text-gradient">Password</span>
        </h2>
        <p className="mt-4 text-sm text-slate-500 font-medium">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card p-10 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] block ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full bg-[#161616] border border-white/5 rounded-2xl py-4 pl-14 pr-5 text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-medium"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold p-4 rounded-xl flex items-center gap-3 animate-shake">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-black uppercase tracking-widest text-[#0a0a0a] bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50 gap-3 group"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
