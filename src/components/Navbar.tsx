"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  MessageCircle,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  ChevronDown,
  Settings,
  Mail,
  Info,
  Package,
  Star,
  LayoutGrid,
  MessageSquare,
  Heart,
  Home
} from "lucide-react";
import { clearSession } from "@/lib/actions/auth";
import { usePWA } from "@/context/PWAContext";
import { Download } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { canInstall, installApp, isInstalled } = usePWA();

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setSession(data))
      .catch(() => setSession(null));

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pathname]);

  // Fetch notifications when session is available
  useEffect(() => {
    if (!session) return;
    const fetchNotifications = () => {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => {
          if (data.notifications) {
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
          }
        })
        .catch(() => { });
    };
    fetchNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [session]);

  const handleOpenNotifications = () => {
    const willOpen = !isNotificationsOpen;
    setIsNotificationsOpen(willOpen);
    // Mark all as read when opening
    if (willOpen && unreadCount > 0) {
      fetch("/api/notifications/read", { method: "POST" })
        .then(() => setUnreadCount(0))
        .catch(() => { });
    }
  };


  const handleLogout = async () => {
    await clearSession();
    window.location.href = "/";
  };

  const isChatPage = pathname?.startsWith("/messages/") && pathname.split("/").filter(Boolean).length === 2;

  if (isChatPage) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-all duration-500">
              <span className="text-white font-black text-xl italic">K</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none">
                KISII <span className="text-emerald-600">MARKET</span>
              </h1>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Secondhand Exchange</span>
            </div>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          <nav className="flex items-center bg-slate-100 border border-slate-200 rounded-2xl px-2 py-1.5 mr-4">
            <Link href="/" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 px-4 py-2 transition-all rounded-lg hover:bg-white">Home</Link>
            <Link href="/browse" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 px-4 py-2 transition-all rounded-lg hover:bg-white">Browse</Link>
            {canInstall && !isInstalled && (
              <button 
                onClick={installApp}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2 transition-all rounded-lg hover:scale-105 shadow-md shadow-rose-500/20"
              >
                <Download className="w-3 h-3" />
                Install App
              </button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {session && (
              <>
                {/* Notifications Dropdown */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={handleOpenNotifications}
                    className={`w-11 h-11 border rounded-xl flex items-center justify-center transition-all relative group shadow-sm ${isNotificationsOpen
                        ? "bg-amber-500 border-amber-500 text-white"
                        : "bg-slate-100 border-slate-200 text-slate-500 hover:text-amber-500 hover:border-amber-500/30"
                      }`}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className={`absolute top-2 right-2 w-2 h-2 rounded-full border-2 ${isNotificationsOpen ? "bg-[#0a0a0a] border-amber-500" : "bg-amber-500 border-[#0a0a0a]"
                        }`} />
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-slate-200 rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Notifications</p>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-md">{unreadCount} New</span>
                        )}
                      </div>
                      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <Link
                              key={notif.id}
                              href={notif.link || "/messages"}
                              onClick={() => setIsNotificationsOpen(false)}
                              className="block p-4 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer group"
                            >
                              <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.type === "message" ? "bg-emerald-500/10" : notif.type === "success" ? "bg-emerald-500/10" : "bg-amber-500/10"
                                  }`}>
                                  <MessageCircle className={`w-5 h-5 ${notif.type === "message" ? "text-emerald-500" : "text-amber-500"
                                    }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-black mb-1 ${notif.isRead ? "text-slate-400" : "text-white"}`}>{notif.title}</p>
                                  <p className="text-[10px] text-slate-500 leading-relaxed mb-2">{notif.message}</p>
                                  <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">
                                    {new Date(notif.createdAt).toLocaleString("en-KE", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                                  </p>
                                </div>
                                {!notif.isRead && (
                                  <div className="w-2 h-2 bg-amber-500 rounded-full self-start mt-1 shrink-0" />
                                )}
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <Bell className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                            <p className="text-xs text-slate-600 font-bold">No notifications yet</p>
                          </div>
                        )}
                      </div>
                      <Link href="/messages" onClick={() => setIsNotificationsOpen(false)} className="block w-full p-4 text-center text-[10px] font-black text-slate-500 hover:text-white hover:bg-white/5 transition-all uppercase tracking-[0.2em]">
                        View All Messages
                      </Link>
                    </div>
                  )}
                </div>

                <Link href="/messages" className="w-11 h-11 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all relative group shadow-lg">
                  <MessageCircle className="w-5 h-5" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]" />
                </Link>
              </>
            )}

            <Link href="/sell" className="bg-emerald-500 text-[#0a0a0a] h-11 px-6 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:scale-105 transition-all flex items-center">
              List Item
            </Link>

            {session ? (
              /* Professional User Dropdown */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-3 border pl-2 pr-4 py-1.5 rounded-xl transition-all group shadow-sm ${isUserMenuOpen
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-slate-100 border-slate-200 hover:border-emerald-500/30 text-slate-700"
                    }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-inner overflow-hidden ${isUserMenuOpen ? "bg-white/20" : "bg-emerald-500"
                    }`}>
                    {session.user.avatar ? (
                      <img src={session.user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className={`w-4 h-4 ${isUserMenuOpen ? "text-white" : "text-white"}`} />
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${isUserMenuOpen ? "text-white/80" : "text-emerald-500"
                      }`}>Authenticated</p>
                    <p className={`text-xs font-bold leading-none truncate max-w-[100px] ${isUserMenuOpen ? "text-white" : "text-white"
                      }`}>{session.user.name}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isUserMenuOpen ? "rotate-180 text-white" : "text-slate-500"
                    }`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-slate-200 rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-6 border-b border-slate-100 bg-emerald-50/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/20 overflow-hidden">
                          {session.user.avatar ? (
                            <img src={session.user.avatar} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            session.user.name?.[0].toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 truncate max-w-[120px]">{session.user.name}</p>
                          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active Member</span>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 truncate mb-1 flex items-center gap-2">
                        <Mail className="w-3 h-3" /> {session.user.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link href="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-emerald-600 transition-all group">
                        <LayoutGrid className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                        <span className="text-sm font-bold">Seller Dashboard</span>
                      </Link>
                      <Link href="/saved" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-emerald-600 transition-all group">
                        <Heart className="w-5 h-5 text-rose-500" />
                        <span className="text-sm font-bold">Saved Items</span>
                      </Link>
                      <Link href="/messages" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-emerald-600 transition-all group">
                        <MessageSquare className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                        <span className="text-sm font-bold">Inbox & Messages</span>
                      </Link>
                      {session.user.role === "ADMIN" && (
                        <Link href="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 text-slate-300 hover:text-white transition-all group">
                          <ShieldCheck className="w-5 h-5 text-amber-500" />
                          <span className="text-sm font-bold">Admin Controls</span>
                        </Link>
                      )}
                      <div className="h-px bg-white/5 my-2 mx-4" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-rose-500/10 text-rose-500/80 hover:text-rose-400 transition-all group border border-transparent hover:border-rose-500/20"
                      >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Secure Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white px-6 py-2 transition-all">Sign In</Link>
                <Link href="/register" className="bg-white text-[#0a0a0a] h-11 px-8 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white hover:scale-105 transition-all flex items-center">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {session && (
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={handleOpenNotifications}
                className={`relative p-2 transition-colors ${isNotificationsOpen ? "text-amber-500" : "text-slate-400 hover:text-amber-500"}`}
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-[#0a0a0a]" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute top-full right-0 mt-3 w-[calc(100vw-2rem)] max-w-xs bg-[#111111] border border-white/10 rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 z-50">
                  <div className="p-5 border-b border-white/5 flex items-center justify-between">
                    <p className="text-xs font-black text-white uppercase tracking-widest">Notifications</p>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded-md">{unreadCount} New</span>
                    )}
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <Link
                          key={notif.id}
                          href={notif.link || "/messages"}
                          onClick={() => setIsNotificationsOpen(false)}
                          className="block p-4 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer"
                        >
                          <div className="flex gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${notif.type === "message" ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
                              <MessageCircle className={`w-4 h-4 ${notif.type === "message" ? "text-emerald-500" : "text-amber-500"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-black mb-0.5 ${notif.isRead ? "text-slate-400" : "text-white"}`}>{notif.title}</p>
                              <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{notif.message}</p>
                              <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mt-1">
                                {new Date(notif.createdAt).toLocaleString("en-KE", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                              </p>
                            </div>
                            {!notif.isRead && (
                              <div className="w-2 h-2 bg-amber-500 rounded-full self-start mt-1 shrink-0" />
                            )}
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                        <p className="text-xs text-slate-600 font-bold">No notifications yet</p>
                      </div>
                    )}
                  </div>
                  <Link
                    href="/messages"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="block w-full p-4 text-center text-[10px] font-black text-slate-500 hover:text-white hover:bg-white/5 transition-all uppercase tracking-[0.2em]"
                  >
                    View All Messages
                  </Link>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm ${isMobileMenuOpen 
                ? "bg-rose-500 text-white rotate-90" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[80px] bg-white border-b border-slate-200 p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-300 h-[calc(100vh-80px)] overflow-y-auto">
          {session && (
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 overflow-hidden">
                  {session.user.avatar ? (
                    <img src={session.user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Logged in as</p>
                  <p className="text-xl font-black text-slate-800">{session.user.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold truncate max-w-[150px]">{session.user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="bg-white/5 p-4 rounded-2xl flex flex-col items-center gap-2 border border-white/5">
                  <LayoutGrid className="w-6 h-6 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase text-slate-500">Dashboard</span>
                </Link>
                <Link href="/messages" onClick={() => setIsMobileMenuOpen(false)} className="bg-white/5 p-4 rounded-2xl flex flex-col items-center gap-2 border border-white/5">
                  <MessageSquare className="w-6 h-6 text-amber-500" />
                  <span className="text-[10px] font-black uppercase text-slate-500">Inbox</span>
                </Link>
                <Link href="/sell" onClick={() => setIsMobileMenuOpen(false)} className="bg-emerald-500 p-4 rounded-2xl flex flex-col items-center gap-2">
                  <PlusCircle className="w-6 h-6 text-[#0a0a0a]" />
                  <span className="text-[10px] font-black uppercase text-[#0a0a0a]">Sell</span>
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="flex items-center gap-3 p-3 bg-emerald-500 rounded-[20px] text-white hover:bg-emerald-600 transition-all shadow-sm active:scale-95"
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight">Home</span>
            </Link>
            
            <Link 
              href="/browse" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="flex items-center gap-3 p-3 bg-amber-500 rounded-[20px] text-white hover:bg-amber-600 transition-all shadow-sm active:scale-95"
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight">Browse</span>
            </Link>

            {session && (
              <Link 
                href="/saved" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center gap-3 p-3 bg-rose-500 rounded-[20px] text-white hover:bg-rose-600 transition-all shadow-sm active:scale-95"
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight">Saved</span>
              </Link>
            )}

            {session?.user.role === "ADMIN" && (
              <Link 
                href="/admin" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center gap-3 p-3 bg-indigo-600 rounded-[20px] text-white hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight">Admin</span>
              </Link>
            )}
          </div>

          <div className="mt-6 pt-6 flex flex-col gap-4 border-t border-slate-100">
            {canInstall && !isInstalled && (
              <button 
                onClick={() => {
                  installApp();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-3 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-red-600 p-4 rounded-2xl transition-all uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 mb-2"
              >
                <Download className="w-5 h-5" />
                Install App Now
              </button>
            )}
            {session ? (
              <button
                onClick={handleLogout}
                className="w-full mt-4 flex items-center justify-center gap-3 py-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-all duration-300 group shadow-sm"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest">Secure Logout</span>
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-slate-100 text-slate-800 py-4 rounded-xl text-center text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors">Sign In</Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-slate-800 text-white py-4 rounded-xl text-center text-xs font-bold uppercase tracking-widest hover:bg-slate-900 transition-colors shadow-lg">Create Account</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

const PlusCircle = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 8V16M8 12H16M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default Navbar;
