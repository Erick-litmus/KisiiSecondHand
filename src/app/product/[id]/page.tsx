import React from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Share2, 
  Heart, 
  MessageCircle, 
  ShieldCheck, 
  MapPin, 
  User, 
  Clock, 
  Info,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import ContactSellerButton from "@/components/ContactSellerButton";
import ReportProductButton from "@/components/ReportProductButton";
import MakeOfferButton from "@/components/MakeOfferButton";

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      seller: true,
    },
  });

  if (!product) return null;

  return product;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Fallback image if not provided
  const imageUrl = product.image || "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32 bg-white dark:bg-[#0a0a0a] min-h-screen transition-colors duration-300">
      {/* Breadcrumbs */}
      <Link href="/browse" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors mb-8 group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Column */}
        <div className="space-y-6">
          <div className="aspect-square rounded-[40px] overflow-hidden bg-slate-100 relative group border border-slate-200 shadow-sm">
             <Image 
               src={imageUrl} 
               alt={product.title} 
               fill
               className="object-cover transition-transform duration-700 group-hover:scale-105"
             />
             <button className="absolute top-8 right-8 p-3 bg-white/80 backdrop-blur-md rounded-full text-slate-800 hover:text-rose-500 transition-colors border border-slate-200/50 shadow-sm">
               <Heart className="w-6 h-6" />
             </button>
          </div>

          {product.image2 && (
            <div className="aspect-square rounded-[40px] overflow-hidden bg-slate-100 relative group border border-slate-200 shadow-sm">
               <Image 
                 src={product.image2} 
                 alt={`${product.title} - Alternate View`} 
                 fill
                 className="object-cover transition-transform duration-700 group-hover:scale-105"
               />
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
             <div className="flex gap-2">
               <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">
                 {product.category.name}
               </span>
               <span className="bg-amber-50 text-amber-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-100">
                 {product.condition}
               </span>
             </div>
             <button className="text-slate-400 hover:text-emerald-600 transition-colors">
               <Share2 className="w-5 h-5" />
             </button>
          </div>

          <h1 className="text-4xl font-black mb-4 leading-tight text-slate-900 dark:text-white">{product.title}</h1>
          
          <div className="flex items-center gap-4 mb-8">
             <div className="text-4xl font-black text-emerald-600">
               KSh {product.price.toLocaleString()}
             </div>
             <div className="text-slate-400 flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
               <Clock className="w-4 h-4" />
               Posted Recently
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-8">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
               <Info className="w-4 h-4 text-emerald-600" />
               Description
             </h3>
             <p className="text-slate-600 leading-relaxed">
               {product.description}
             </p>
          </div>

          {/* Seller Card */}
          <div className="bg-emerald-50/30 p-6 rounded-3xl border border-emerald-100 mb-8">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center border border-emerald-200 overflow-hidden">
                      <User className="w-8 h-8 text-emerald-600" />
                   </div>
                   <div>
                      <div className="font-bold text-lg text-slate-900 flex items-center gap-1">
                        {product.seller.name || "Anonymous Seller"}
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="text-sm text-slate-500">Student Seller • Verified</div>
                   </div>
                </div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ContactSellerButton productId={product.id} sellerId={product.sellerId} />
                <MakeOfferButton
                  productId={product.id}
                  sellerId={product.sellerId}
                  productTitle={product.title}
                  askingPrice={product.price}
                />
             </div>
          </div>

          {/* Safety Warning */}
          <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 items-start">
             <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
             <div className="text-xs text-slate-500 leading-relaxed">
                <span className="text-slate-700 font-bold">Campus Safety First:</span> Always meet in public places like the Library or Student Center during daylight hours. Never send money before seeing the item.
             </div>
          </div>

          <div className="flex justify-center mt-6">
             <ReportProductButton productId={product.id} productTitle={product.title} sellerId={product.sellerId} />
          </div>
        </div>
      </div>
    </div>
  );
}
