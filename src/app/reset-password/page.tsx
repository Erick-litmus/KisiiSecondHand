"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/actions/password-reset";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";

function ResetPasswordContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!token) {
      setError("Invalid or missing reset token.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsSubmitting(false);
      return;
    }

    const result = await resetPassword(token, newPassword);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      setError(result.error || "Failed to reset password");
      setIsSubmitting(false);
    }
  };

  if (!token && !isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-rose-500/10 rounded-3xl flex items-center justify-center shadow-2xl mb-8">
          <Lock className="w-12 h-12 text-rose-500" />
        </div>
        <h2 className="text-4xl font-black text-white mb-4">Invalid Link</h2>
        <p className="text-slate-400 text-lg max-w-md mx-auto mb-8">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link 
          href="/forgot-password" 
          className="bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0a] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-8 animate-in zoom-in duration-500 relative z-10">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl font-black text-white mb-4 relative z-10">Password Reset!</h2>
        <p className="text-slate-400 text-lg max-w-md mx-auto mb-8 relative z-10">
          Your password has been successfully updated. We are redirecting you to the login page...
        </p>
        <div className="w-12 h-1 w-full max-w-[200px] bg-white/5 rounded-full overflow-hidden relative z-10">
          <div className="h-full bg-emerald-500 animate-[loading_3s_ease-in-out_infinite]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center py-20 px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="text-center text-4xl font-black text-white tracking-tight">
          Create New <span className="text-gradient">Password</span>
        </h2>
        <p className="mt-4 text-center text-sm text-slate-500 font-medium">
          Please enter your new password below. Make sure it's secure.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card p-10 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] block ml-1">
                New Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full bg-[#161616] border border-white/5 rounded-2xl py-4 pl-14 pr-5 text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-medium"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] block ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="block w-full bg-[#161616] border border-white/5 rounded-2xl py-4 pl-14 pr-5 text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-medium"
                  placeholder="••••••••••••"
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
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
