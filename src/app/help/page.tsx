"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, MessageSquare, BookOpen, UserCheck, Search, ArrowRight } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    q: "How do I list an item for sale?",
    a: "Simply click on the 'Sell Item' button in the navigation bar. You'll be asked to provide details like title, price, category, and images of the item. Make sure to describe the condition accurately to attract buyers."
  },
  {
    q: "Is it free to use Kisii Secondhand Market?",
    a: "Yes! The platform is completely free for all Kisii University students. We don't charge any listing fees or commissions. Our goal is to help students save money."
  },
  {
    q: "How do I pay for an item?",
    a: "Payments are handled directly between the buyer and seller. We recommend paying in cash or via M-Pesa only after you have inspected the item in person at a safe campus location."
  },
  {
    q: "Can I sell items if I'm not a student?",
    a: "Currently, our platform is exclusive to Kisii University students to ensure a safe and trusted community environment. You must use your student credentials to verify your account."
  },
  {
    q: "What should I do if a seller is unresponsive?",
    a: "If a seller hasn't replied to your messages within 48 hours, we recommend looking for similar items from other sellers. You can also report unresponsive or suspicious profiles to our support team."
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = FAQS.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pb-32">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-6 text-slate-900 tracking-tight">How can we <span className="text-emerald-600">help?</span></h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          Find answers to common questions and learn how to get the most out of our campus marketplace.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-16 group">
        <button className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 group-focus-within:text-emerald-500 hover:bg-slate-50 rounded-full transition-all">
          <Search className="w-6 h-6" />
        </button>
        <input 
          type="text" 
          placeholder="Search for topics (e.g. 'payment', 'selling')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-[32px] py-6 pl-16 pr-8 text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {[
          { title: "Getting Started", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50", link: "/register" },
          { title: "Safety Guide", icon: UserCheck, color: "text-amber-600", bg: "bg-amber-50", link: "/safety" },
          { title: "Contact Support", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50", link: "/contact" },
        ].map((item) => (
          <Link 
            key={item.title} 
            href={item.link}
            className="bg-white border border-slate-100 p-8 rounded-[40px] flex flex-col items-center gap-4 hover:border-emerald-200 hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm"
          >
            <div className={`p-5 rounded-3xl ${item.bg} ${item.color}`}>
              <item.icon className="w-8 h-8" />
            </div>
            <span className="font-black text-slate-800 uppercase tracking-widest text-xs">{item.title}</span>
          </Link>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900">
          <HelpCircle className="w-8 h-8 text-emerald-600" />
          Frequently Asked Questions
        </h2>
        
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, i) => (
            <div 
              key={i} 
              className={`bg-white border transition-all duration-300 rounded-[32px] overflow-hidden ${
                openFaq === i ? "border-emerald-500 shadow-lg shadow-emerald-500/5" : "border-slate-100 hover:border-emerald-200"
              }`}
            >
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-8 py-6 text-left flex items-center justify-between group"
              >
                <span className={`text-lg font-bold transition-colors ${openFaq === i ? "text-emerald-700" : "text-slate-800"}`}>
                  {faq.q}
                </span>
                <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-emerald-500" : ""}`} />
              </button>
              
              <div className={`px-8 transition-all duration-300 ease-in-out overflow-hidden ${
                openFaq === i ? "max-h-96 pb-8 opacity-100" : "max-h-0 opacity-0"
              }`}>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
             <p className="text-slate-400 font-bold">No results found for "{searchQuery}"</p>
          </div>
        )}
      </div>

      <div className="mt-20 bg-emerald-600 p-12 rounded-[48px] text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <h2 className="text-3xl font-black mb-4 relative z-10">Still have questions?</h2>
        <p className="text-emerald-50 mb-10 max-w-md mx-auto font-medium relative z-10">
          Our support team is here to help you. Reach out to us and we'll get back to you as soon as possible.
        </p>
        <Link 
          href="/contact"
          className="inline-flex items-center gap-3 bg-white text-emerald-700 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-50 transition-all shadow-xl relative z-10 group"
        >
          Contact Support
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
