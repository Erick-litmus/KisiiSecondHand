"use client";

import React, { useState } from "react";
import { createConversation } from "@/lib/actions/chat";
import { useRouter } from "next/navigation";
import { MessageCircle, Loader2 } from "lucide-react";

interface ContactSellerButtonProps {
  productId: string;
  sellerId: string;
}

export default function ContactSellerButton({ productId, sellerId }: ContactSellerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    const result = await createConversation(productId, sellerId);
    
    if (result.success) {
      router.push(`/messages/${result.conversationId}`);
    } else {
      if (result.error === "You must be logged in to chat") {
        router.push("/login");
      } else {
        alert(result.error);
      }
    }
    setIsLoading(false);
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <MessageCircle className="w-5 h-5" />
          Chat with Seller
        </>
      )}
    </button>
  );
}
