"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

const CATEGORIES = [
  { name: "All", image: "/images/categories/all.png" },
  { name: "Electronics", image: "/images/categories/electronics.png" },
  { name: "Books", image: "/images/categories/books.png" },
  { name: "Furniture", image: "/images/categories/furniture.png" },
  { name: "Clothing", image: "/images/categories/clothing.png" },
  { name: "Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400" },
];

const CategoryPills = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "All";

  const handleSelect = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (name === "All") {
      params.delete("category");
    } else {
      params.set("category", name);
    }
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-6 overflow-x-auto pb-4 px-8 max-w-7xl mx-auto no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.name;

        return (
          <div key={cat.name} className="flex flex-col items-center gap-2 shrink-0">
            <button
              onClick={() => handleSelect(cat.name)}
              className={cn(
                "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-300 relative group",
                isActive
                  ? "ring-2 ring-emerald-500 ring-offset-2 scale-105 shadow-md"
                  : "border border-slate-200 hover:border-emerald-300 hover:scale-105 shadow-sm"
              )}
            >
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className={cn(
                  "object-cover transition-transform duration-500 group-hover:scale-110",
                  isActive ? "scale-110" : ""
                )}
              />
            </button>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider transition-colors duration-200",
              isActive ? "text-emerald-700" : "text-slate-500 group-hover:text-emerald-600"
            )}>
              {cat.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryPills;
