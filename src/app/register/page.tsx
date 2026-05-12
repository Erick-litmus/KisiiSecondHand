"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { register } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, User, CheckCircle2, Camera, X, Eye, EyeOff } from "lucide-react";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to API
    setIsUploading(true);
    setError(null);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setAvatarUrl(data.url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Failed to upload image.");
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    setAvatarUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    const result = await register({ email, password, name, avatar: avatarUrl });

    if (result.success) {
      setIsSuccess(true);
      // Wait 2 seconds to show success message before redirecting
      setTimeout(() => {
        router.push(`/verify?email=${encodeURIComponent(result.email)}`);
        // Don't call router.refresh() - it reloads the page and causes products to disappear
      }, 2000);
    } else {
      setError(result.error || "Failed to register");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-8 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl font-black text-white mb-4">Registration Successful!</h2>
        <p className="text-slate-400 text-lg max-w-md mx-auto mb-8">
          Welcome to Kisii Market. We are redirecting you to verify your email...
        </p>
        <div className="w-12 h-1 w-full max-w-[200px] bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 animate-[loading_2s_ease-in-out_infinite]" />
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
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20 mx-auto mb-8">
          <span className="text-white font-black text-3xl italic">K</span>
        </div>
        <h2 className="text-center text-4xl font-black text-white tracking-tight">
          Join the <span className="text-gradient">Marketplace</span>
        </h2>
        <p className="mt-4 text-center text-sm text-slate-500 font-medium">
          Already a member?{" "}
          <Link href="/login" className="font-bold text-emerald-500 hover:text-emerald-400 transition-colors">
            Sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card p-10 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Avatar Upload */}
            <div className="flex justify-center mb-6">
              <div
                className="relative group w-24 h-24 rounded-full bg-[#1a1a1a] border border-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-[#222] transition-all overflow-hidden shadow-inner"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.heic,.heif"
                  className="hidden"
                />
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-8 h-8 text-white" />
                    </button>
                  </>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-slate-500 group-hover:text-emerald-500 transition-colors mb-1" />
                    <span className="text-[8px] font-black uppercase text-slate-500 group-hover:text-emerald-500">Upload</span>
                  </>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] block ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full bg-[#161616] border border-white/5 rounded-2xl py-4 pl-14 pr-5 text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-medium"
                  placeholder="Erick Mutua"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] block ml-1">
                University Email
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
                  placeholder="erick@university.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] block ml-1">
                Create Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
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
                  Create Account
                </>
              )}
            </button>

            {/* OR divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="bg-[#111111] px-4 text-slate-600">or sign up with</span>
              </div>
            </div>

            <GoogleAuthButton callbackPath="/" label="Sign up with Google" />

            <p className="text-[10px] text-center text-slate-600 px-4 leading-relaxed">
              By creating an account, you agree to our <span className="text-slate-400 font-bold underline cursor-pointer">Terms of Service</span> and <span className="text-slate-400 font-bold underline cursor-pointer">Privacy Policy</span>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
