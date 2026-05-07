"use client";

import React from "react";
import Link from "next/link";
import { Store, Mail, Phone, MapPin, Share2, Globe, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const isChatPage = pathname?.startsWith("/messages/") && pathname.split("/").length === 3;

  if (isChatPage) return null;

  return (
    <footer className="bg-white text-slate-500 py-16 px-6 border-t border-slate-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="bg-emerald-600 p-2 rounded-xl">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tighter">
              KISII<span className="text-emerald-600">MARKET</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed mb-6">
            The most trusted marketplace for Kisii Campus students. Buy and sell textbooks, electronics, and more within our community.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-emerald-600 transition-colors"><Globe className="w-5 h-5" /></Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors"><MessageSquare className="w-5 h-5" /></Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors"><Share2 className="w-5 h-5" /></Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-slate-800 font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link href="/browse" className="hover:text-emerald-600 transition-colors">Browse Items</Link></li>
            <li><Link href="/sell" className="hover:text-emerald-600 transition-colors">Start Selling</Link></li>
            <li><Link href="/categories" className="hover:text-emerald-600 transition-colors">Categories</Link></li>
            <li><Link href="/safety" className="hover:text-emerald-600 transition-colors">Safety Tips</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-slate-800 font-bold mb-6">Support</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link href="/help" className="hover:text-emerald-600 transition-colors">Help Center</Link></li>
            <li><Link href="/terms" className="hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/contact" className="hover:text-emerald-600 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Developer Info */}
        <div>
          <h4 className="text-slate-800 font-bold mb-6">Developer</h4>
          <div className="flex flex-col gap-3">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Designed and developed by <span className="font-black text-emerald-600">Erick Mutua</span>, a 3rd year Computer Science student at Kisii University. An aspiring software engineer dedicated to building tech solutions that empower communities.
              </p>
            </div>
            <ul className="space-y-3 text-sm font-medium mt-2">
              <li className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
                <a href="mailto:erickmutua150@gmail.com" className="hover:text-emerald-600 transition-colors">erickmutua150@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                <a href="tel:0706546644" className="hover:text-emerald-600 transition-colors">0706546644</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-100 flex flex-col md:row items-center justify-between gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <p>© {new Date().getFullYear()} KISII MARKET. All rights reserved.</p>
        <p>Built for Kisii Campus Students</p>
      </div>
    </footer>
  );
};

export default Footer;
