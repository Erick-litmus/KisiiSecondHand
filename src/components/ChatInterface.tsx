"use client";

import React, { useState, useEffect, useRef } from "react";
import { sendMessage, markMessagesAsRead, updateLastActive } from "@/lib/actions/chat";
import { Send, User, ChevronLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn, formatRelativeTime } from "@/lib/utils";
import ReportUserButton from "./ReportUserButton";
import { supabaseBrowserClient } from "@/lib/supabase-client";

interface ChatInterfaceProps {
  conversationId: string;
  initialMessages: any[];
  currentUser: any;
  otherUser: any;
  product: any;
  initialLastActive?: string | null;
}

export default function ChatInterface({ 
  conversationId, 
  initialMessages, 
  currentUser, 
  otherUser,
  product,
  initialLastActive
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [otherUserOnline, setOtherUserOnline] = useState(false);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(initialLastActive || null);
  const [isMounted, setIsMounted] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
    // Update last active when user opens the chat
    updateLastActive().catch(console.error);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initial online check
  useEffect(() => {
    if (initialLastActive) {
      const lastActive = new Date(initialLastActive).getTime();
      const now = new Date().getTime();
      setOtherUserOnline(now - lastActive < 30000);
    }
  }, [initialLastActive]);

  // Realtime subscription & Presence
  useEffect(() => {
    // 1. Set up Supabase Realtime Channel with Presence
    const channel = supabaseBrowserClient.channel(`chat-${conversationId}`, {
      config: {
        presence: {
          key: currentUser.id,
        },
      },
    });
    
    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        let isOnline = false;
        let isTyping = false;
        
        // Ensure state[otherUser.id] exists and is an array before checking typing
        const otherUserPresence = state[otherUser.id] as any[];
        if (otherUserPresence && otherUserPresence.length > 0) {
          isOnline = true;
          if (otherUserPresence.some((p: any) => p.typing)) {
            isTyping = true;
          }
        }
        
        // Update last active if they just went offline
        setOtherUserOnline((prevOnline) => {
          if (prevOnline && !isOnline) {
            setLastActiveDate(new Date().toISOString());
          }
          return isOnline;
        });
        
        setOtherUserTyping(isTyping);
      })
      .on('broadcast', { event: 'NEW_MESSAGE' }, (payload) => {
        const newMessage = payload.payload;
        
        if (newMessage.senderId !== currentUser.id) {
           // Mark this new message as read since the user is actively viewing the chat
           markMessagesAsRead(conversationId).catch(console.error);
        } else {
           // Ignore our own broadcasted messages since we handle them optimistically
           return;
        }
        
        setMessages((prev: any) => {
          if (prev.some((m: any) => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      })
      .on('broadcast', { event: 'MESSAGES_READ' }, (payload) => {
        const { readerId } = payload.payload;
        if (readerId !== currentUser.id) {
          // The other user read our messages, update UI
          setMessages((prev: any) => 
            prev.map((m: any) => 
              m.senderId === currentUser.id && !m.isRead ? { ...m, isRead: true } : m
            )
          );
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Announce ourselves as online and not typing
          await channel.track({ online: true, typing: false });
        }
      });

    return () => {
      supabaseBrowserClient.removeChannel(channel);
    };
  }, [conversationId, currentUser.id, currentUser.name, otherUser.id, otherUser.name]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    
    if (channelRef.current) {
      channelRef.current.track({ online: true, typing: true });
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        if (channelRef.current) channelRef.current.track({ online: true, typing: false });
      }, 2000);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (channelRef.current) channelRef.current.track({ online: true, typing: false });

    setIsSending(true);
    const text = inputText;
    setInputText("");

    // Optimistic Update
    const optimisticId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: optimisticId,
      text,
      senderId: currentUser.id,
      conversationId,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    
    setMessages((prev: any) => [...prev, optimisticMsg]);

    const result = await sendMessage(conversationId, text);
    if (result.success) {
      setMessages((prev: any) => prev.map((m: any) => m.id === optimisticId ? result.message : m));
    } else {
      alert("Failed to send message");
      setMessages((prev: any) => prev.filter((m: any) => m.id !== optimisticId));
      setInputText(text); // Restore text on failure
    }
    setIsSending(false);
  };

  return (
    <div className="flex flex-col h-full w-full mx-auto bg-[#0a0a0a] border-x border-white/5 overflow-hidden">
      {/* Chat Header */}
      <div className="flex-shrink-0 p-4 border-b border-white/5 flex items-center justify-between bg-[#0d0d0d]/50 backdrop-blur-md">
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
              <p className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-colors",
                otherUserOnline ? "text-emerald-500" : "text-slate-400"
              )}>
                {otherUserTyping ? "Typing..." : otherUserOnline ? "Online" : (isMounted && lastActiveDate) ? `Last seen ${formatRelativeTime(lastActiveDate)}` : "Offline"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ReportUserButton userId={otherUser.id} userName={otherUser.name || "Unknown User"} />
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 no-scrollbar whatsapp-bg relative"
      >
        {messages.map((msg, i) => {
          const isMe = msg.senderId === currentUser.id;
          
          return (
            <div key={msg.id || i} className={cn(
              "flex w-full mb-1",
              isMe ? "justify-end" : "justify-start"
            )}>
              <div className={cn(
                "relative max-w-[85%] md:max-w-[70%] px-3 py-1.5 shadow-md",
                isMe 
                  ? "bg-[#005c4b] text-white rounded-lg rounded-tr-none" 
                  : "bg-[#202c33] text-slate-200 rounded-lg rounded-tl-none"
              )}>
                {/* Bubble Tail */}
                <div className={cn(
                  "absolute top-0 w-2 h-2.5",
                  isMe 
                    ? "right-[-8px] border-l-[8px] border-l-[#005c4b] border-b-[10px] border-b-transparent" 
                    : "left-[-8px] border-r-[8px] border-r-[#202c33] border-b-[10px] border-b-transparent"
                )} />

                <div className="flex flex-col gap-1">
                  <p className="text-[13.5px] leading-relaxed pr-16">{msg.text}</p>
                  <div className="absolute bottom-1 right-1.5 flex items-center gap-1">
                    <span className="text-[10px] text-white/50 font-medium">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && (
                      <div className="flex -space-x-1">
                        {/* First Tick (Sent) */}
                        <span className={cn(
                          "text-[10px]",
                          msg.isRead ? "text-[#53bdeb]" : "text-white/50"
                        )}>✓</span>
                        
                        {/* Second Tick (Delivered/Read) */}
                        {(otherUserOnline || msg.isRead) && (
                          <span className={cn(
                            "text-[10px]",
                            msg.isRead ? "text-[#53bdeb]" : "text-white/50"
                          )}>✓</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-3 bg-[#0d0d0d] border-t border-white/5">
        <form onSubmit={handleSend} className="flex gap-2">
          <input 
            type="text"
            inputMode="text"
            enterKeyHint="send"
            value={inputText}
            onChange={handleTextChange}
            placeholder="Type a message..."
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
          />
          <button 
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20 shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
