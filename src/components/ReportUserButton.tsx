"use client";

import React, { useState } from "react";
import { AlertTriangle, X, Send, Loader2, CheckCircle2 } from "lucide-react";
import { submitReport } from "@/lib/actions/report";

interface ReportUserButtonProps {
  userId: string;
  userName: string;
}

export default function ReportUserButton({ userId, userName }: ReportUserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    // Add user info to the message
    const message = formData.get("message") as string;
    formData.set("message", `[REPORTING USER ID: ${userId} - Name: ${userName}]\n\nReason: ${message}`);
    formData.set("subject", "Report a Suspicious User/Message");
    formData.set("reportedUserId", userId);
    formData.set("reason", message);

    const result = await submitReport(formData);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 3000);
    } else {
      setError(result.error || "Failed to submit report");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm group border border-rose-500/20"
        title="Report User"
      >
        <AlertTriangle className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsOpen(false)} />
          
          <div className="bg-[#111] border border-white/10 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10 animate-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    Report User
                  </h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">Reporting: {userName}</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {isSuccess ? (
                <div className="py-8 text-center animate-in fade-in duration-500">
                  <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Report Sent</h4>
                  <p className="text-sm text-slate-400 mt-2">Thank you for reporting this user. Our team will review the conversation shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleReport} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Your Name</label>
                    <input name="name" required type="text" placeholder="Your Name" className="w-full bg-black border border-white/10 rounded-2xl py-3 px-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Your Email</label>
                    <input name="email" required type="email" placeholder="student@kisii.university" className="w-full bg-black border border-white/10 rounded-2xl py-3 px-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Reason for Reporting</label>
                    <textarea name="message" required rows={4} placeholder="Describe the suspicious behavior or message..." className="w-full bg-black border border-white/10 rounded-2xl py-3 px-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"></textarea>
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-500/10 text-rose-500 text-xs font-bold rounded-xl border border-rose-500/20">
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-rose-600 text-white py-4 rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Report <Send className="w-4 h-4" /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
