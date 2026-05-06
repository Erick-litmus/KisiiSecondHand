"use client";

import React, { useState, useEffect, useRef } from "react";
import { sendMessage } from "@/lib/actions/chat";
import { Send, User, ChevronLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ReportUserButton from "./ReportUserButton";

interface ChatInterfaceProps {
  conversationId: string;
  initialMessages: any[];
  currentUser: any;
  otherUser: any;
  product: any;
}

export default function ChatInterface({ 
  conversationId, 
  initialMessages, 
  currentUser, 
  otherUser,
  product
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simple polling for new messages (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/messages/${conversationId}`);
        if (response.ok) {
          const newMessages = await response.json();
          setMessages(newMessages);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [conversationId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    setIsSending(true);
    const text = inputText;
    setInputText("");

    const result = await sendMessage(conversationId, text);
    if (result.success) {
      setMessages([...messages, result.message]);
    } else {
      alert("Failed to send message");
      setInputText(text); // Restore text on failure
    }
    setIsSending(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto bg-[#0a0a0a] rounded-[40px] shadow-2xl border border-white/5 overflow-hidden">
      {/* Chat Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0d0d0d]/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/messages" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-all shadow-sm">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <User className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-bold text-white leading-none mb-1 flex items-center gap-1">
                {otherUser.name || "User"}
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Now</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/product/${product.id}`} className="hidden sm:flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all shadow-sm group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/10">
              <img src={product.image} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="pr-4">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inquiry about</div>
               <div className="text-xs font-bold text-white truncate max-w-[120px]">{product.title}</div>
            </div>
          </Link>
          <ReportUserButton userId={otherUser.id} userName={otherUser.name || "Unknown User"} />
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar whatsapp-bg"
      >
        {messages.map((msg, i) => {
          const isMe = msg.senderId === currentUser.id;
          
          return (
            <div key={msg.id || i} className={cn(
              "flex flex-col max-w-[80%] md:max-w-[70%]",
              isMe ? "ml-auto items-end" : "mr-auto items-start"
            )}>
              <div className={cn(
                "p-4 rounded-[20px] text-sm leading-relaxed relative",
                isMe 
                  ? "bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-900/20" 
                  : "bg-[#1f2c33] text-slate-200 rounded-tl-none"
              )}>
                {msg.text}
              </div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 px-2 flex items-center gap-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {isMe && <span className="text-emerald-500">✓✓</span>}
              </span>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#0d0d0d] border-t border-white/5">
        <form onSubmit={handleSend} className="flex gap-3">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
          />
          <button 
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20 shrink-0"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}
