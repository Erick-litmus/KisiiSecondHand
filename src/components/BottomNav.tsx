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

  const isChatPage = pathname?.startsWith("/messages/") && pathname.split("/").length === 3;

  if (isChatPage) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#8122e4] via-[#e21b5a] to-[#f1840b] border-t border-white/10 px-6 py-4 pb-8 shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
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
                  ? "bg-white/20 text-white scale-110 shadow-lg backdrop-blur-md"
                  : "text-white/60 hover:text-white"
              )}>
                <Icon className="w-5 h-5" />
                {item.label === "Inbox" && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full border-2 border-[#e21b5a]" />
                )}
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-[0.1em] transition-colors duration-300",
                isActive ? "text-white" : "text-white/50 group-hover:text-white/80"
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
