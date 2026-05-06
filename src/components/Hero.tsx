"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, ShieldCheck, Zap, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-24 px-6">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full mb-8">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-amber-500 text-sm font-semibold uppercase tracking-wider">Kisii Campus Marketplace</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
            The Smart Way to <br />
            <span className="text-gradient">Buy & Sell</span> on Campus
          </h1>

          <p className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">
            Join thousands of Kisii University students. Turn your unused items into cash, or find amazing deals on textbooks, gadgets, and more.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mb-12">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full glass rounded-2xl py-5 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-white placeholder:text-slate-500"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-amber-500 hover:bg-amber-600 text-white px-6 rounded-xl font-semibold transition-all flex items-center gap-2">
              Search
            </button>
          </div>

          {/* Stats/Trust */}
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="font-bold">5,000+</div>
                <div className="text-xs text-slate-500 uppercase tracking-tighter">Students</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="font-bold">Trusted</div>
                <div className="text-xs text-slate-500 uppercase tracking-tighter">Campus Verified</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative lg:h-[600px] flex items-center justify-center">
        <div className="relative w-full aspect-square max-w-[500px]">
          {/* Floating Elements Mockup */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-orange-600/20 rounded-[40px] border border-white/10 overflow-hidden backdrop-blur-sm shadow-2xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-40 mix-blend-overlay" />
          </div>

          {/* Product Card Floating */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 -right-8 w-64 glass-card p-5 rounded-2xl shadow-2xl z-10"
          >
            <div className="h-32 bg-slate-800 rounded-xl mb-4 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop" alt="iPad" className="w-full h-full object-cover" />
            </div>
            <h4 className="font-bold mb-1">iPad Air 5th Gen</h4>
            <div className="flex justify-between items-center">
              <span className="text-amber-500 font-bold">Ksh 45,000</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded">Like New</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-12 -left-8 w-56 glass-card p-4 rounded-2xl shadow-2xl z-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-500" />
              <div>
                <div className="text-sm font-bold">Sold by Mutua</div>
                <div className="text-[10px] text-slate-500">Verified Seller</div>
              </div>
            </div>
            <div className="text-xs text-slate-300 italic">"Highly recommend! Great condition."</div>
          </motion.div>
        </div>
      </div>
    </div>
    </section>
  );
};

export default Hero;
