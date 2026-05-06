"use client";

import React from "react";
import { ShieldCheck, Eye, MessageCircle, MapPin, AlertTriangle } from "lucide-react";
import Link from "next/link";

const SAFETY_TIPS = [
  {
    title: "Meet in Public",
    description: "Always meet in crowded campus locations like the Library, Student Center, or the Administration Block during daylight hours.",
    icon: MapPin,
    color: "bg-emerald-500/10 text-emerald-500"
  },
  {
    title: "Inspect Before Paying",
    description: "Check the item thoroughly to ensure it matches the description. For electronics, test them before completing the transaction.",
    icon: Eye,
    color: "bg-emerald-500/10 text-emerald-500"
  },
  {
    title: "Use Secure Chat",
    description: "Keep all communication within the platform. Avoid sharing personal phone numbers or social media profiles until you trust the seller.",
    icon: MessageCircle,
    color: "bg-amber-500/10 text-amber-500"
  },
  {
    title: "No Advance Payments",
    description: "Never send money via M-Pesa or any other method before seeing and verifying the item in person.",
    icon: ShieldCheck,
    color: "bg-indigo-500/10 text-indigo-500"
  }
];

export default function SafetyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-full mb-6">
          <ShieldCheck className="w-4 h-4 text-rose-500" />
          <span className="text-rose-500 text-sm font-semibold uppercase tracking-wider">Campus Safety First</span>
        </div>
        <h1 className="text-5xl font-black mb-6">Trading Safely at Kisii</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Your safety is our top priority. Follow these guidelines to ensure a secure and pleasant trading experience on campus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {SAFETY_TIPS.map((tip) => (
          <div key={tip.title} className="glass-card p-8 rounded-[40px] flex flex-col items-start gap-6">
            <div className={`p-4 rounded-2xl ${tip.color}`}>
              <tip.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
              <p className="text-slate-400 leading-relaxed">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-12 rounded-[40px] bg-rose-500/5 border-rose-500/20">
         <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center shrink-0">
               <AlertTriangle className="w-10 h-10 text-rose-500" />
            </div>
            <div>
               <h2 className="text-2xl font-bold mb-4">See something suspicious?</h2>
               <p className="text-slate-400 mb-6 leading-relaxed">
                 If you encounter a listing that seems too good to be true, or a user who makes you feel uncomfortable, please report it immediately. We take student safety seriously.
               </p>
               <Link href="/contact" className="inline-block bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20">
                 Report a Concern
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
