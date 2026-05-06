"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

import Image from "next/image";
import SaveItemButton from "./SaveItemButton";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  condition: string;
  category: string;
  seller: string;
  createdAt?: Date | string;
  isSavedInitial?: boolean;
}

function getRelativeTime(date: Date | string | undefined) {
  if (!date) return "Just now";

  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;

  return `${Math.floor(diffInMonths / 12)}y ago`;
}

const ProductCard = ({ id, title, price, image, condition, category, seller, createdAt, isSavedInitial = false }: ProductCardProps) => {
  return (
    <Link href={`/product/${id}`} className="block relative group">
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-3xl overflow-hidden flex flex-col h-full border border-slate-100 shadow-sm transition-shadow hover:shadow-md"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <Image
            src={image || "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1000&auto=format&fit=crop"}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-2 h-2" /> STUDENT
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-[13px] font-bold text-slate-800 line-clamp-2 flex-1">{title}</h3>
            <div className="text-sm font-black text-emerald-600 shrink-0">
              KSh {price.toLocaleString()}
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between text-slate-400 text-[9px] font-bold uppercase tracking-tight">
            <span className="truncate max-w-[80px]">Kisii Central</span>
            <span suppressHydrationWarning>{getRelativeTime(createdAt)}</span>
          </div>
        </div>
      </motion.div>
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <SaveItemButton productId={id} isSavedInitial={isSavedInitial} className="p-1.5" />
      </div>
    </Link>
  );
};

export default ProductCard;
