"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOTP } from "@/lib/actions/auth";
import { Loader2, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";

function VerifyContent() {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  useEffect(() => {
    setMounted(true);
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await verifyOTP({ email, code });

    if (result.success) {
      router.push("/");
      router.refresh();
    } else {
      setError(result.error || "Failed to verify code");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center py-20 px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 shadow-xl shadow-emerald-500/10 mx-auto mb-8">
          <Mail className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-center text-4xl font-black text-white tracking-tight">
          Check your <span className="text-gradient">Email</span>
        </h2>
        <p className="mt-4 text-center text-sm text-slate-400 font-medium max-w-sm mx-auto">
          We sent a 6-digit verification code to <span className="text-white font-bold">{email}</span>. The code expires in 15 minutes.
        </p>
        <p className="mt-2 text-center text-[10px] text-emerald-500/60 font-black uppercase tracking-widest">
          Check your Spam or Promotions folder if you don't see it!
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card p-10 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="code" className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] block ml-1 text-center">
                Enter Verification Code
              </label>
              <div className="relative group mt-4">
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="block w-full bg-[#161616] border border-white/5 rounded-2xl py-5 text-white focus:outline-none focus:border-emerald-500/50 transition-all text-center text-3xl font-black tracking-[0.5em] placeholder-slate-700/50"
                  placeholder="000000"
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
              disabled={isSubmitting || code.length !== 6}
              className="w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-black uppercase tracking-widest text-[#0a0a0a] bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50 gap-3 group mt-8"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Verify Account <ShieldCheck className="w-5 h-5" />
                </>
              )}
            </button>
            
            <p className="mt-6 text-center text-xs text-slate-500 font-medium">
              Didn't receive a code?{" "}
              <Link href="/login" className="font-bold text-emerald-500 hover:text-emerald-400 transition-colors">
                Return to login and try again
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
