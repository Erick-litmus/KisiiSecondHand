"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter out empty strings and take up to 2 images
  const validImages = images.filter(img => img && img.length > 0);
  const mainImage = validImages[activeIndex] || "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="space-y-6">
      {/* Main Large Preview */}
      <div className="aspect-square rounded-[40px] overflow-hidden bg-slate-100 relative group border border-slate-200 shadow-sm">
        <Image
          src={mainImage}
          alt={title}
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <button className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full text-slate-800 hover:text-rose-500 transition-colors border border-slate-200/50 shadow-sm z-10 active:scale-90 transition-transform">
          <Heart className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-4">
          {validImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all active:scale-95 touch-manipulation",
                activeIndex === index 
                  ? "border-emerald-500 shadow-lg shadow-emerald-500/20" 
                  : "border-slate-200"
              )}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
