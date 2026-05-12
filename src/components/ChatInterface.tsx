import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { sendMessage, markMessagesAsRead, updateLastActive, getMessages, editMessage, deleteMessage } from "@/lib/actions/chat";
import { Send, User, ChevronLeft, ShieldCheck, MoreVertical, Edit2, Trash2, X, Check, ChevronDown } from "lucide-react";
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

// Memoized Message Bubble component to prevent unnecessary re-renders
const MessageBubble = React.memo(({ 
  msg, 
  isMe, 
  isEditing, 
  isMenuOpen, 
  currentUser, 
  otherUserOnline,
  onMenuToggle,
  onEditClick,
  onDeleteClick,
  onEditCancel,
  onEditSubmit,
  editText,
  setEditText
}: any) => {
  const timeString = useMemo(() => {
    if (!msg.createdAt) return "";
    const d = new Date(msg.createdAt);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [msg.createdAt]);

  return (
    <div className={cn(
      "flex w-full mb-1 group",
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

        {isMe && (
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button 
              onClick={() => onMenuToggle(msg.id)}
              className="p-1 hover:bg-black/20 rounded-full text-white/50 hover:text-white"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-[#233138] border border-white/10 rounded-lg shadow-xl py-1 min-w-[100px] z-20">
                <button 
                  onClick={() => onEditClick(msg)}
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-white/5 flex items-center gap-2 text-slate-200"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button 
                  onClick={() => onDeleteClick(msg.id)}
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-white/5 flex items-center gap-2 text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col min-w-[60px]">
          {isEditing ? (
            <div className="flex flex-col gap-2 min-w-[200px]">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="bg-black/20 border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500 min-h-[60px]"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button onClick={onEditCancel} className="p-1 hover:bg-white/10 rounded text-white/50">
                  <X className="w-4 h-4" />
                </button>
                <button onClick={() => onEditSubmit(msg.id)} className="p-1 hover:bg-emerald-500/20 rounded text-emerald-500">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[14.5px] leading-relaxed mb-1 pr-1">{msg.text}</p>
          )}
          <div className="flex items-center justify-end gap-1 opacity-60 mt-0.5 self-end">
            <span className="text-[10px] font-bold">
              {timeString}
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
});

MessageBubble.displayName = "MessageBubble";

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
  
  // Edit/Delete State
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Scroll State
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadSinceLastScroll, setUnreadSinceLastScroll] = useState(0);
  const isAtBottomRef = useRef(true);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
    // Update last active when user opens the chat
    updateLastActive().catch(console.error);
    
    // Polling fallback: Sync messages every 10 seconds in case Realtime misses something
    const pollInterval = setInterval(async () => {
      try {
        const data = await getMessages(conversationId);
        if (data && Array.isArray(data.messages)) {
          setMessages(prev => {
            const currentMessages = Array.isArray(prev) ? prev : [];
            // Only add messages we don't have yet (deduplicate by id)
            const newMessages = data.messages.filter(
              (m: any) => m && m.id && !currentMessages.some((p: any) => p && p.id === m.id)
            );
            if (newMessages.length === 0) return currentMessages;
            const updated = [...currentMessages, ...newMessages];
            // Always sort to keep conversation order consistent
            return [...updated].sort((a, b) => 
              new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            );
          });
          if (data.otherUserLastActive) {
            const parsed = new Date(data.otherUserLastActive);
            if (!isNaN(parsed.getTime())) {
              setLastActiveDate(parsed.toISOString());
            }
          }
        }
      } catch (err) {
        console.error("Polling sync failed:", err);
      }
    }, 10000);
    
    // Periodic status update while on the page
    const statusInterval = setInterval(() => {
      updateLastActive().catch(console.error);
    }, 120000); // Every 2 minutes
    
    // Periodic re-render to update "Last seen Xm ago"
    const tickInterval = setInterval(() => {
      setTick(t => t + 1);
    }, 60000); // Every minute
    
    return () => {
      clearInterval(pollInterval);
      clearInterval(statusInterval);
      clearInterval(tickInterval);
    };
  }, [conversationId]);

  const [, setTick] = useState(0);

  // Sync last active from props when they change
  useEffect(() => {
    if (initialLastActive) {
      setLastActiveDate(initialLastActive);
    }
  }, [initialLastActive]);

  const [isFirstScroll, setIsFirstScroll] = useState(true);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const isMe = messages.length > 0 && messages[messages.length - 1].senderId === currentUser.id;
      
      if (isFirstScroll) {
        // Instant scroll on first load
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        setIsFirstScroll(false);
        isAtBottomRef.current = true;
      } else if (isAtBottomRef.current || isMe) {
        // Smooth scroll for new messages if we're already at bottom or if it's our own message
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
        setUnreadSinceLastScroll(0);
      } else {
        // Increment unread count if we're scrolled up
        setUnreadSinceLastScroll(prev => prev + 1);
      }
    }
  }, [messages, isFirstScroll, currentUser.id]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      // Update ref immediately
      isAtBottomRef.current = isAtBottom;
      
      // Update state only if changed to prevent unnecessary re-renders
      setShowScrollButton(prev => {
        if (prev !== !isAtBottom) return !isAtBottom;
        return prev;
      });
      
      if (isAtBottom) {
        setUnreadSinceLastScroll(prev => {
           if (prev !== 0) return 0;
           return prev;
        });
      }
    }
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setUnreadSinceLastScroll(0);
    }
  };

  // Memoize grouped messages to prevent expensive re-calculation on every scroll/render
  const groupedMessages = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    
    messages.forEach(msg => {
      if (!msg) return;
      const date = new Date(msg.createdAt || Date.now());
      const dateStr = date.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(msg);
    });
    
    return Object.entries(groups).map(([date, msgs]) => {
      const today = new Date().toLocaleDateString([], { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString([], { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      let displayDate = date;
      if (date === today) displayDate = "Today";
      else if (date === yesterday) displayDate = "Yesterday";
      
      return { date: displayDate, messages: msgs };
    });
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
        
        // Ensure state[otherUser?.id] exists and is an array before checking typing
        if (otherUser?.id) {
          const otherUserPresence = state[otherUser.id] as any[];
          if (Array.isArray(otherUserPresence) && otherUserPresence.length > 0) {
            isOnline = true;
            if (otherUserPresence.some((p: any) => p && p.typing)) {
              isTyping = true;
            }
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
        const newMessage = payload?.payload;
        if (!newMessage || !newMessage.id) return;
        
        if (newMessage.senderId !== currentUser?.id) {
           // Mark this new message as read since the user is actively viewing the chat
           markMessagesAsRead(conversationId).catch(console.error);
           
           // Tell the sender we read their message
           if (channel) {
             channel.send({
               type: 'broadcast',
               event: 'MESSAGES_READ',
               payload: { readerId: currentUser?.id }
             });
           }
        } else {
           // Ignore our own broadcasted messages since we handle them optimistically
           return;
        }
        
        setMessages((prev: any) => {
          const currentMessages = Array.isArray(prev) ? prev : [];
          if (currentMessages.some((m: any) => m && m.id === newMessage.id)) return currentMessages;
          return [...currentMessages, newMessage];
        });
      })
      .on('broadcast', { event: 'MESSAGE_EDITED' }, (payload) => {
        const edited = payload?.payload;
        if (!edited || !edited.id) return;
        setMessages((prev: any) => 
          Array.isArray(prev) ? prev.map((m: any) => m && m.id === edited.id ? { ...m, text: edited.text } : m) : []
        );
      })
      .on('broadcast', { event: 'MESSAGE_DELETED' }, (payload) => {
        const deletedId = payload?.payload?.id;
        if (!deletedId) return;
        setMessages((prev: any) => 
          Array.isArray(prev) ? prev.filter((m: any) => m && m.id !== deletedId) : []
        );
      })
      .on('broadcast', { event: 'MESSAGES_READ' }, (payload) => {
        const readerId = payload?.payload?.readerId;
        if (readerId && readerId !== currentUser?.id) {
          // The other user read our messages, update UI
          setMessages((prev: any) => 
            Array.isArray(prev) ? prev.map((m: any) => 
              m && m.senderId === currentUser?.id && !m.isRead ? { ...m, isRead: true } : m
            ) : []
          );
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Announce ourselves as online and not typing
          await channel.track({ online: true, typing: false });
          
          // Let the other person know we read their messages if they are currently online
          await channel.send({
            type: 'broadcast',
            event: 'MESSAGES_READ',
            payload: { readerId: currentUser.id }
          });
        }
      });

    return () => {
      supabaseBrowserClient.removeChannel(channel);
    };
  }, [conversationId, currentUser?.id, otherUser?.id]);

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

    // Broadcast the new message to the receiver in real time INSTANTLY
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'NEW_MESSAGE',
        payload: optimisticMsg,
      });
    }

    const result = await sendMessage(conversationId, text);
    if (result.success) {
      // Update the optimistic message with the real one from DB
      setMessages((prev: any) => {
        // Remove the optimistic message
        const filtered = prev.filter((m: any) => m.id !== optimisticId);
        // Check if the real message was already added by polling/broadcast
        if (filtered.some((m: any) => m.id === result.message.id)) {
          return filtered;
        }
        // Add the real message and sort
        return [...filtered, result.message].sort((a, b) => 
          new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        );
      });
    } else {
      alert("Failed to send message");
      setMessages((prev: any) => prev.filter((m: any) => m.id !== optimisticId));
      setInputText(text); // Restore text on failure
    }
    setIsSending(false);
  };

  const onMenuToggle = useCallback((msgId: string) => {
    setActiveMenuId(prev => prev === msgId ? null : msgId);
  }, []);

  const onEditClick = useCallback((msg: any) => {
    setEditingMessageId(msg.id);
    setEditText(msg.text);
    setActiveMenuId(null);
  }, []);

  const onDeleteClick = useCallback(async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const result = await deleteMessage(messageId);
    if (result.success) {
      setMessages((prev: any) => prev.filter((m: any) => m.id !== messageId));
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'MESSAGE_DELETED',
          payload: { id: messageId }
        });
      }
    } else {
      alert("Failed to delete message");
    }
    setActiveMenuId(null);
  }, []);

  const handleEditSubmit = async (messageId: string) => {
    if (!editText.trim()) return;
    const result = await editMessage(messageId, editText);
    if (result.success) {
      setMessages((prev: any) => prev.map((m: any) => m.id === messageId ? { ...m, text: editText } : m));
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'MESSAGE_EDITED',
          payload: { id: messageId, text: editText }
        });
      }
      setEditingMessageId(null);
      setEditText("");
    } else {
      alert("Failed to edit message");
    }
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
                {otherUser?.name || "User"}
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
          {otherUser?.id && (
            <ReportUserButton userId={otherUser.id} userName={otherUser.name || "Unknown User"} />
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 whatsapp-bg relative scroll-smooth"
      >
        {groupedMessages.map((group, groupIdx) => (
          <div key={group.date} className="space-y-3">
            {/* Date Header */}
            <div className="sticky top-0 z-20 flex justify-center py-2">
              <span className="bg-[#182229] text-[#8696a0] text-[11px] font-medium px-3 py-1 rounded-lg shadow-sm border border-white/5 uppercase tracking-wider">
                {group.date}
              </span>
            </div>

            {group.messages.map((msg, i) => (
              <MessageBubble 
                key={msg.id || `${groupIdx}-${i}`}
                msg={msg}
                isMe={msg.senderId === currentUser?.id}
                isEditing={editingMessageId === msg.id}
                isMenuOpen={activeMenuId === msg.id}
                currentUser={currentUser}
                otherUserOnline={otherUserOnline}
                onMenuToggle={onMenuToggle}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                onEditCancel={() => setEditingMessageId(null)}
                onEditSubmit={handleEditSubmit}
                editText={editText}
                setEditText={setEditText}
              />
            ))}
          </div>
        ))}

        {/* Scroll to Bottom Button */}
        {showScrollButton && (
          <button 
            onClick={scrollToBottom}
            className="fixed bottom-24 right-6 w-10 h-10 rounded-full bg-[#202c33] text-slate-300 flex items-center justify-center border border-white/10 shadow-xl hover:bg-[#2a3942] hover:text-white transition-all z-30 group"
          >
            <ChevronDown className="w-6 h-6" />
            {unreadSinceLastScroll > 0 && (
              <span className="absolute -top-1 -left-1 bg-emerald-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center animate-bounce">
                {unreadSinceLastScroll}
              </span>
            )}
          </button>
        )}
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
