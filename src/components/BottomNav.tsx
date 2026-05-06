"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, LayoutGrid, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const pathname = usePathname();
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setSession(data))
      .catch(() => setSession(null));
  }, [pathname]);

  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Browse", icon: LayoutGrid, path: "/browse" },
    { label: "Sell", icon: PlusCircle, path: "/sell" },
    { label: "Inbox", icon: MessageSquare, path: "/messages" },
    { label: "Account", icon: User, path: session ? "/dashboard" : "/login" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5 px-6 py-4 pb-8">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path === "/login" && pathname === "/register");

          return (
            <Link
              key={item.label}
              href={item.path}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className={cn(
                "p-2.5 rounded-2xl transition-all duration-300 relative",
                isActive
                  ? "bg-emerald-500 text-[#0a0a0a] shadow-lg shadow-emerald-500/20 scale-110"
                  : "text-slate-500 hover:text-white"
              )}>
                <Icon className="w-5 h-5" />
                {item.label === "Inbox" && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-[#0a0a0a]" />
                )}
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-[0.1em] transition-colors duration-300",
                isActive ? "text-emerald-500" : "text-slate-600 group-hover:text-slate-400"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
