"use client";

import React from "react";
import { FileText, Shield, Gavel, Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-6">Terms & Policies</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Please read these terms carefully before using our platform.
        </p>
      </div>

      <div className="space-y-12">
        <section className="glass-card p-10 rounded-[40px] border border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
              <Gavel className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold" id="terms">Terms of Service</h2>
          </div>
          <div className="prose prose-invert max-w-none text-slate-400 space-y-4">
            <p>1. <strong>Eligibility:</strong> This platform is exclusively for Kisii University students. Use by non-students is strictly prohibited.</p>
            <p>2. <strong>User Conduct:</strong> Users must provide accurate information about items. Fraudulent listings or harassment of other users will result in immediate bans.</p>
            <p>3. <strong>Transactions:</strong> All transactions are P2P. Kisii Secondhand Market is not responsible for any financial losses or disputes between buyers and sellers.</p>
            <p>4. <strong>Prohibited Items:</strong> Illegal substances, weapons, and stolen property are strictly forbidden from being listed.</p>
          </div>
        </section>

        <section className="glass-card p-10 rounded-[40px] border border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold" id="privacy">Privacy Policy</h2>
          </div>
          <div className="prose prose-invert max-w-none text-slate-400 space-y-4">
            <p>1. <strong>Data Collection:</strong> We only collect minimal information required to list your items (name, campus, items).</p>
            <p>2. <strong>Data Usage:</strong> Your data is used solely to facilitate the marketplace experience and is never sold to third parties.</p>
            <p>3. <strong>Security:</strong> We implement standard security measures to protect your information within our platform.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
