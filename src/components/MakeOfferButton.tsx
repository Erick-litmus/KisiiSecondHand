"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, Loader2, X, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { createConversation, sendMessage } from "@/lib/actions/chat";

interface MakeOfferButtonProps {
  productId: string;
  sellerId: string;
  productTitle: string;
  askingPrice: number;
}

export default function MakeOfferButton({
  productId,
  sellerId,
  productTitle,
  askingPrice,
}: MakeOfferButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const discount =
    offerPrice && !isNaN(Number(offerPrice))
      ? Math.round(((askingPrice - Number(offerPrice)) / askingPrice) * 100)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const price = Number(offerPrice);
    if (!price || price <= 0) {
      setError("Please enter a valid offer price.");
      return;
    }
    if (price > askingPrice * 1.5) {
      setError("Offer price seems too high. Are you sure?");
      return;
    }

    setIsLoading(true);

    // 1. Create or get existing conversation
    const convResult = await createConversation(productId, sellerId);
    if (!convResult.success) {
      if (convResult.error === "You must be logged in to chat") {
        router.push("/login");
        return;
      }
      setError(convResult.error || "Failed to start conversation.");
      setIsLoading(false);
      return;
    }

    // 2. Send a structured offer message
    const offerMsg = `💰 *PRICE OFFER*\n\nHi! I'm interested in "${productTitle}".\n\nYour asking price: KSh ${askingPrice.toLocaleString()}\nMy offer: *KSh ${price.toLocaleString()}*${note ? `\n\nNote: ${note}` : ""}\n\nLooking forward to your response!`;

    const msgResult = await sendMessage(convResult.conversationId!, offerMsg);
    setIsLoading(false);

    if (msgResult.success) {
      setSent(true);
      setTimeout(() => {
        router.push(`/messages/${convResult.conversationId}`);
      }, 1800);
    } else {
      setError(msgResult.error || "Failed to send offer.");
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]"
      >
        <Tag className="w-5 h-5" />
        Make an Offer
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal Panel */}
          <div className="relative w-full sm:max-w-md bg-white dark:bg-[#111111] rounded-t-[32px] sm:rounded-[32px] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <Tag className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white">Make an Offer</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Price Negotiation</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {sent ? (
              /* Success State */
              <div className="p-10 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-xl font-black text-slate-900 dark:text-white">Offer Sent!</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your offer of <span className="font-bold text-amber-500">KSh {Number(offerPrice).toLocaleString()}</span> has been sent to the seller. Redirecting to chat…
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                {/* Asking Price Reference */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Asking Price</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      KSh {askingPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate max-w-[120px]">{productTitle}</p>
                  </div>
                </div>

                {/* Your Offer Input */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                    Your Offer (KSh)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">KSh</span>
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder={String(Math.round(askingPrice * 0.85))}
                      min={1}
                      className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3.5 pl-14 pr-4 text-lg font-black text-slate-900 dark:text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                    />
                  </div>
                  {/* Discount badge */}
                  {discount !== null && (
                    <div className={`mt-2 flex items-center gap-1.5 text-xs font-bold ${discount > 0 ? "text-emerald-600 dark:text-emerald-400" : discount < 0 ? "text-rose-500" : "text-slate-400"}`}>
                      {discount > 0 ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : discount < 0 ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : null}
                      {discount === 0
                        ? "Same as asking price"
                        : discount > 0
                        ? `${discount}% below asking price`
                        : `${Math.abs(discount)}% above asking price`}
                    </div>
                  )}
                </div>

                {/* Optional Note */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                    Note <span className="font-normal text-slate-400 normal-case tracking-normal">(optional)</span>
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder="E.g. I can pick it up today, or swap for a book..."
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-slate-700 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none"
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-100 dark:border-rose-500/20">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || !offerPrice}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Tag className="w-4 h-4" />
                      Send Offer to Seller
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 font-medium">
                  Your offer will be sent as a chat message. The seller can accept, counter, or decline.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
