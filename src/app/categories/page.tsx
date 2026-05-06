"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight
} from "lucide-react";

const CATEGORIES = [
  { name: "Electronics", image: "/images/categories/electronics.png", count: 124 },
  { name: "Books", image: "/images/categories/books.png", count: 85 },
  { name: "Furniture", image: "/images/categories/furniture.png", count: 42 },
  { name: "Clothing", image: "/images/categories/clothing.png", count: 57 },
  { name: "Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400", count: 31 },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Shop by Category</h1>
        <p className="text-slate-500 font-medium">Find exactly what you need by browsing our curated categories.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <Link 
            key={cat.name} 
            href={`/browse?category=${cat.name}`}
            className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-500/20 transition-all flex flex-col items-start gap-6 overflow-hidden relative"
          >
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50" />
            
            <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-inner">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            
            <div className="flex-grow z-10">
               <h3 className="text-2xl font-bold text-slate-800 mb-1">{cat.name}</h3>
               <p className="text-slate-500 text-sm font-medium">{cat.count} Items Available</p>
            </div>

            <div className="w-full flex items-center justify-between pt-4 border-t border-slate-100 z-10">
               <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600 transition-colors uppercase tracking-widest">Browse Category</span>
               <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                  <ArrowRight className="w-5 h-5" />
               </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
