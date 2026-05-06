import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import HorizontalProductCard from "@/components/HorizontalProductCard";
import { Heart, Loader2 } from "lucide-react";
import { getSession } from "@/lib/auth";
import Link from "next/link";

export const metadata = {
  title: "Saved Items | Kisii Market",
};

export default async function SavedItemsPage() {
  const session = await getSession();

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-100 p-8 rounded-[32px] text-center shadow-sm">
          <Heart className="w-16 h-16 text-rose-500 mx-auto mb-6 opacity-20" />
          <h2 className="text-2xl font-black text-slate-800 mb-2">Login Required</h2>
          <p className="text-slate-500 mb-8">You need to be logged in to view your saved items.</p>
          <Link href="/login" className="block w-full bg-emerald-500 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const savedItems = await prisma.savedItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          category: true,
          seller: true,
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex flex-col gap-4 pb-32 bg-slate-50 min-h-screen pt-24">
      {/* Header */}
      <div className="px-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            Saved Items
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">
            {savedItems.length} {savedItems.length === 1 ? "Item" : "Items"} saved
          </p>
        </div>
      </div>

      <div className="h-2 w-full bg-slate-100 my-2" />

      {/* Results List */}
      <div className="px-6 flex flex-col gap-4">
        {savedItems.length > 0 ? (
          savedItems.map(({ product }) => (
            <HorizontalProductCard 
              key={product.id} 
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image || ""}
              category={product.category.name}
              seller={product.seller.name || "Unknown"}
            />
          ))
        ) : (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
              <Heart className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No items saved yet</h3>
            <p className="text-slate-500 max-w-sm mb-8">
              Click the heart icon on items you like to save them for later.
            </p>
            <Link href="/browse" className="bg-slate-200 text-slate-800 px-8 py-4 rounded-xl font-bold hover:bg-slate-300 transition-all">
              Browse Market
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
