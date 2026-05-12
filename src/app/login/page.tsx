"use client";

import React, { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { login } from "@/lib/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";
import GoogleAuthButton from "@/components/GoogleAuthButton";

function LoginContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback") || "/";

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "google_cancelled") setError("Google login was cancelled.");
      else if (errorParam === "google_token_failed") setError("Failed to authenticate with Google. Please try again.");
      else if (errorParam === "google_profile_failed") setError("Failed to retrieve your Google profile.");
      else if (errorParam === "google_no_email") setError("Your Google account must have an email address.");
      else if (errorParam === "google_server_error") setError("Server error during Google login. (Make sure Database URLs are set in Vercel!)");
      else setError("An unknown error occurred during login.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await login({ email, password });

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push(callback);
        // Don't call router.refresh() - it reloads the page and causes products to disappear
      }, 1500);
    } else if (result.requiresVerification) {
      router.push(`/verify?email=${encodeURIComponent(result.email)}`);
    } else {
      setError(result.error || "Failed to login");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-8 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl font-black text-white mb-4">Welcome Back!</h2>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Sign-in successful. We are taking you back to the market...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center py-20 px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20 mx-auto mb-8">
          <span className="text-white font-black text-3xl italic">K</span>
        </div>
        <h2 className="text-center text-4xl font-black text-white tracking-tight">
          Welcome <span className="text-gradient">Back</span>
        </h2>
        <p className="mt-4 text-center text-sm text-slate-500 font-medium">
          New to the market?{" "}
          <Link href="/register" className="font-bold text-emerald-500 hover:text-emerald-400 transition-colors">
            Create an account today
          </Link>
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

            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] block ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="block w-full bg-[#161616] border border-white/5 rounded-2xl py-4 pl-14 pr-14 text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-medium"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-500 hover:text-emerald-500 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex justify-start pt-2 ml-1">
                <Link href="/forgot-password" className="text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors py-1 inline-block">
                  Forgot password?
                </Link>
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
                <>
                  Sign In
                </>
              )}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="bg-[#111111] px-4 text-slate-600">or continue with</span>
              </div>
            </div>

            <GoogleAuthButton callbackPath={callback} label="Continue with Google" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
