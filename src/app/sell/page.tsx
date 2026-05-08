"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Tag,
  DollarSign,
  Info,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

import { createProduct } from "@/lib/actions/product";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePreview2, setImagePreview2] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "Electronics",
    condition: "Good",
    description: "",
    image: "",
    image2: "",
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        setSession(data);
        if (!data) {
          router.push("/login?callback=/sell");
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setIsLoadingSession(false);
      }
    };
    
    checkSession();
  }, [router]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isSecond: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (isSecond) {
        setImagePreview2(reader.result as string);
      } else {
        setImagePreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Upload to API
    setIsUploading(true);
    setErrorMessage(null);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      setFormData((prev) => ({ 
        ...prev, 
        ...(isSecond ? { image2: data.url } : { image: data.url })
      }));
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMessage(err.message || "Failed to upload image.");
      if (isSecond) {
        setImagePreview2(null);
      } else {
        setImagePreview(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (e: React.MouseEvent, isSecond: boolean = false) => {
    e.stopPropagation();
    if (isSecond) {
      setImagePreview2(null);
      setFormData((prev) => ({ ...prev, image2: "" }));
      if (fileInputRef2.current) fileInputRef2.current.value = "";
    } else {
      setImagePreview(null);
      setFormData((prev) => ({ ...prev, image: "" }));
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading || isSubmitting) return;

    if (!formData.image) {
      setErrorMessage("Please upload an image for your item.");
      return;
    }

    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue)) {
      setErrorMessage("Please enter a valid price.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      console.log("Submitting form data...");
      const result = await createProduct({
        title: formData.title,
        price: priceValue,
        description: formData.description,
        condition: formData.condition,
        categoryName: formData.category,
        image: formData.image,
        image2: formData.image2,
      });

      console.log("Submission result:", result);

      if (result.success) {
        setStep(2); // Success state
      } else {
        if (result.error === "You must be logged in to sell items") {
          router.push("/login");
        } else {
          setErrorMessage(result.error || "Failed to post listing.");
        }
      }
    } catch (err: any) {
      console.error("Submission error catch block:", err);
      setErrorMessage("Network error or server unavailable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-4xl font-black mb-4 text-white">Submitted Successfully!</h1>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          Your item has been submitted and is <span className="text-amber-500 font-bold">waiting for admin approval</span>. Once reviewed, it will be live on the Kisii Secondhand Market.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              setStep(1);
              setFormData({
                title: "",
                price: "",
                category: "Electronics",
                condition: "Good",
                description: "",
                image: "",
                image2: "",
              });
              setImagePreview(null);
              setImagePreview2(null);
              setErrorMessage(null);
            }}
            className="bg-emerald-500 text-[#1a1a1a] py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
          >
            List Another Item
          </button>
          <Link href="/browse" className="text-slate-500 font-bold hover:text-white transition-colors">
            Browse Other Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 bg-[#0a0a0a] min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-2">Sell an Item</h1>
        <p className="text-slate-500">Post your item to the campus marketplace.</p>
      </div>

        <div className="w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            {/* Image Upload — supports gallery, camera, WhatsApp downloads, HEIC (iOS) */}
            <div className="space-y-2">
              <label className="text-xs font-black text-sky-400 uppercase tracking-widest block">Photos</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Main photo */}
                <div
                  className="relative group aspect-square bg-[#1a1a1a] rounded-2xl border-2 border-dashed border-white/10 overflow-hidden flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all touch-manipulation"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e, false)}
                    accept="image/*,.heic,.heif"
                    className="hidden"
                  />
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => removeImage(e, false)}
                        className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-full shadow-lg z-10 touch-manipulation"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-4 text-center">
                      <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center">
                        <Camera className="w-6 h-6 text-sky-400" />
                      </div>
                      <p className="text-xs font-bold text-slate-400">Main Photo</p>
                      <p className="text-[10px] text-slate-600">Gallery · Camera · WhatsApp</p>
                    </div>
                  )}
                </div>

                {/* Second photo */}
                <div
                  className="relative group aspect-square bg-[#1a1a1a] rounded-2xl border-2 border-dashed border-white/10 overflow-hidden flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all touch-manipulation"
                  onClick={() => fileInputRef2.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef2}
                    onChange={(e) => handleFileChange(e, true)}
                    accept="image/*,.heic,.heif"
                    className="hidden"
                  />
                  {imagePreview2 ? (
                    <>
                      <img src={imagePreview2} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => removeImage(e, true)}
                        className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-full shadow-lg z-10 touch-manipulation"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-4 text-center">
                      <div className="w-12 h-12 bg-slate-500/10 rounded-2xl flex items-center justify-center">
                        <Camera className="w-6 h-6 text-slate-500" />
                      </div>
                      <p className="text-xs font-bold text-slate-500">Extra Photo</p>
                      <p className="text-[10px] text-slate-600">Optional</p>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-slate-600 text-center">Supports JPEG, PNG, HEIC, WebP · Max 10MB per photo</p>
            </div>

            <div className="space-y-6">
              {errorMessage && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500 text-sm font-bold animate-shake">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {errorMessage}
                </div>
              )}

              <div className="space-y-3">
                <label className="text-xs font-black text-sky-400 uppercase tracking-widest block">Item Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter descriptive title"
                  className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-4 px-6 text-white placeholder:text-slate-700 focus:outline-none focus:border-sky-400/50 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-sky-400 uppercase tracking-widest block">Price (Ksh)</label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-amber-500/80">KSH</div>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-4 pl-20 pr-6 text-white placeholder:text-slate-700 focus:outline-none focus:border-sky-400/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-sky-400 uppercase tracking-widest block">Category</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-4 px-6 text-white appearance-none cursor-pointer focus:outline-none focus:border-sky-400/50 transition-all"
                  >
                    <option disabled value="">Select a category</option>
                    <option>Electronics</option>
                    <option>Books</option>
                    <option>Furniture</option>
                    <option>Fashion</option>
                    <option>Shoes</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-sky-400 uppercase tracking-widest block">Condition</label>
                <div className="flex bg-[#131313] p-1.5 rounded-2xl gap-1">
                  {["New", "Like New", "Good", "Used"].map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setFormData({ ...formData, condition: cond })}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
                        formData.condition === cond
                          ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                          : "text-slate-600 hover:text-slate-400"
                      )}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-sky-400 uppercase tracking-widest block">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter detailed description..."
                  className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-4 px-6 text-white placeholder:text-slate-700 focus:outline-none focus:border-sky-400/50 transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading || isSubmitting}
              className={cn(
                "w-full bg-emerald-500 text-[#1a1a1a] py-5 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 mt-4",
                (isUploading || isSubmitting) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Uploading Image...
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Posting Listing...
                </>
              ) : (
                <>
                  List Item <CheckCircle2 className="w-6 h-6" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
  );
}
