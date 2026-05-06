"use client";

import React, { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleSavedItem } from "@/lib/actions/saved";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SaveItemButtonProps {
  productId: string;
  isSavedInitial: boolean;
  className?: string;
}

export default function SaveItemButton({ productId, isSavedInitial, className }: SaveItemButtonProps) {
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation if inside a link
    e.stopPropagation();

    // Optimistic update
    const previousState = isSaved;
    setIsSaved(!isSaved);

    startTransition(async () => {
      const result = await toggleSavedItem(productId);
      if (!result.success) {
        // Revert on error
        setIsSaved(previousState);
        toast.error(result.error || "Failed to save item. Please login.");
      } else {
        if (result.saved) {
          toast.success("Added to Saved Items", {
            icon: "❤️"
          });
        } else {
          toast.success("Removed from Saved Items");
        }
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "p-2 rounded-full transition-all duration-300 shadow-lg",
        isSaved 
          ? "bg-rose-500 text-white shadow-rose-500/30" 
          : "bg-[#0a0a0a]/80 text-white hover:text-rose-500 hover:bg-[#1a1a1a]",
        className
      )}
      title={isSaved ? "Remove from saved" : "Save this item"}
    >
      <Heart className={cn("w-5 h-5", isSaved && "fill-current")} />
    </button>
  );
}
