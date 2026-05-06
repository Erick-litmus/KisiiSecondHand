"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, GraduationCap, ShieldCheck } from "lucide-react";
import Image from "next/image";
import SaveItemButton from "./SaveItemButton";

interface HorizontalProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  seller: string;
  category: string;
  isVerified?: boolean;
  isNew?: boolean;
  isSavedInitial?: boolean;
}

const HorizontalProductCard = ({ id, title, price, image, seller, category, isVerified, isNew, isSavedInitial = false }: HorizontalProductCardProps) => {
  return (
    <Link href={`/product/${id}`} className="block relative group">
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white rounded-3xl p-3 flex gap-4 border border-slate-100 shadow-sm relative transition-shadow hover:shadow-md"
      >
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 bg-slate-50 relative">
          <Image
            src={image || "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1000&auto=format&fit=crop"}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center gap-1 flex-grow pr-12">
          <h3 className="font-bold text-slate-800 line-clamp-1">{title}</h3>

          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span>{seller}</span>
          </div>

          <div className="text-lg font-black text-emerald-700 mt-1">
            KSh {price.toLocaleString()}
          </div>

          <div className="mt-1">
            {isVerified ? (
              <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-emerald-100">
                <ShieldCheck className="w-2.5 h-2.5" /> VERIFIED
              </div>
            ) : isNew ? (
              <div className="inline-flex items-center gap-1 bg-slate-50 text-slate-500 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-slate-100">
                NEW POST
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
      <div className="absolute top-5 right-5 z-10">
        <SaveItemButton productId={id} isSavedInitial={isSavedInitial} />
      </div>
    </Link>
  );
};

export default HorizontalProductCard;
