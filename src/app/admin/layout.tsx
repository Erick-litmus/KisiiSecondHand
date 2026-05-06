import React from "react";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { getSession } from "@/lib/auth";
import "../globals.css";

import LogoutButton from "@/components/admin/LogoutButton";
import { MessageSquare, LayoutDashboard, Package, ExternalLink, Users, ShieldCheck } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");
  const session = await getSession();
  
  const isAuthorized = adminSession || (session && session.user.role === "ADMIN");
  
  // Get current pathname from middleware header
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || ""; 
  const isLoginPage = pathname === "/admin/login";

  // If on login page or not authorized (middleware should catch unauthorized, 
  // but we keep this for rendering safety), show children without layout
  if (isLoginPage || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans antialiased">
        <div className="w-full">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans antialiased">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-72 border-r border-white/5 bg-[#0d0d0d] hidden lg:flex flex-col sticky top-0 h-screen">
          <div className="p-8">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-all">
                <span className="text-white font-black text-xl italic">K</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tighter">ADMIN</span>
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">Market Control</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <Link href="/admin" className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${
              pathname === "/admin" ? "bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/10" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}>
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link href="/admin/products" className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${
              pathname === "/admin/products" ? "bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/10" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}>
              <Package className="w-5 h-5" />
              Manage Listings
            </Link>
            <Link href="/admin/messages" className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${
              pathname === "/admin/messages" ? "bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/10" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}>
              <MessageSquare className="w-5 h-5" />
              Chat Monitor
            </Link>
            <Link href="/admin/users" className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${
              pathname === "/admin/users" ? "bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/10" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}>
              <Users className="w-5 h-5" />
              Manage Users
            </Link>
            <Link href="/admin/reports" className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${
              pathname === "/admin/reports" ? "bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/10" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}>
              <ShieldCheck className="w-5 h-5" />
              Reports
            </Link>
          </nav>

          <div className="p-4 mt-auto">
            <div className="bg-white/5 rounded-[24px] p-6 border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Security Status</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-white">Protected Session</span>
              </div>
              <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all">
                <ExternalLink className="w-4 h-4" />
                View Storefront
              </Link>
            </div>
            <div className="mt-4 px-2">
              <LogoutButton />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Header for mobile */}
          <header className="lg:hidden bg-[#0d0d0d] border-b border-white/5 p-6 flex items-center justify-between">
            <Link href="/admin" className="text-xl font-black text-white tracking-tighter">KISII <span className="text-emerald-500">ADMIN</span></Link>
            <LogoutButton />
          </header>
          
          <div className="p-8 lg:p-12 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
