import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import HorizontalProductCard from "@/components/HorizontalProductCard";
import { Search, Loader2 } from "lucide-react";
import CategoryPills from "@/components/CategoryPills";
import SearchBar from "@/components/SearchBar";

import { getSession } from "@/lib/auth";

async function BrowseContent({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const q = params.q || "";
  const cat = params.category || "All";
  
  const session = await getSession();
  const userId = session?.user?.id;

  const products = await prisma.product.findMany({
    where: {
      status: "APPROVED",
      AND: [
        {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        cat !== "All" ? { category: { name: cat } } : {},
      ],
    },
    include: {
      category: true,
      seller: true,
      ...(userId ? {
        savedBy: {
          where: { userId }
        }
      } : {})
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-4 pb-32 bg-white min-h-screen pt-24">
      {/* Search Bar */}
      <SearchBar />

      {/* Categories Horizontal Scroll */}
      <div className="pt-2">
        <CategoryPills />
      </div>

      <div className="h-2 w-full bg-slate-100 my-2" />

      {/* Results Header */}
      <div className="px-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            {cat === "All" ? "Browse Items" : cat}
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            {products.length} {products.length === 1 ? "Result" : "Results"} found
          </p>
        </div>
      </div>

      {/* Results List */}
      <div className="px-6 flex flex-col gap-4">
        {products.length > 0 ? (
          products.map((product) => {
            const isSavedInitial = userId ? (product as any).savedBy?.length > 0 : false;
            return (
              <HorizontalProductCard 
                key={product.id} 
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image || ""}
                category={product.category.name}
                seller={product.seller.name || "Unknown"}
                isSavedInitial={isSavedInitial}
              />
            );
          })
        ) : (
          <div className="py-20 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                <Search className="w-8 h-8 text-slate-300" />
             </div>
            <p className="text-slate-800 font-bold text-lg mb-2">No items found</p>
            <p className="text-slate-400 text-sm">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowsePage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    }>
      <BrowseContent searchParams={searchParams} />
    </Suspense>
  );
}
