"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";


export default function MainContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatPage = pathname?.startsWith("/messages/") && pathname.split("/").length === 3;

  return (
    <main className={cn(
      "min-h-screen w-full overflow-x-hidden",
      isChatPage ? "pt-0" : "pt-20"
    )}>
      {children}
    </main>
  );
}
