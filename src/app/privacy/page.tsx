"use client";

import React from "react";
import { Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-6">Privacy Policy</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          We value your privacy and are committed to protecting your personal data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {[
          { title: "Data Security", description: "Your information is protected using industry-standard encryption.", icon: Lock, color: "bg-emerald-500" },
          { title: "Transparency", description: "We are clear about what data we collect and how we use it.", icon: Eye, color: "bg-emerald-500" },
          { title: "Control", description: "You have full control over your listings and personal profile data.", icon: Database, color: "bg-amber-500" },
          { title: "No Third Parties", description: "We never share or sell your data to external advertisers.", icon: Shield, color: "bg-amber-500" },
        ].map((item) => (
          <div key={item.title} className="glass-card p-8 rounded-[40px] flex flex-col items-start gap-6">
            <div className={`p-4 rounded-2xl ${item.color}/10 text-${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-10 rounded-[40px] border border-white/5 space-y-8">
        <h2 className="text-2xl font-bold">Information We Collect</h2>
        <div className="space-y-4 text-slate-400 leading-relaxed">
          <p>We collect information you provide directly to us when you create a listing, communicate with other users, or contact our support team. This may include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your name and contact information</li>
            <li>Details of items you list for sale</li>
            <li>Photos of your products</li>
            <li>Messages you send through our platform</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
