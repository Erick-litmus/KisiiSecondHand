import React from "react";

export default function ChatPageLoading() {
  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col">
      {/* Chat Header skeleton */}
      <div className="border-b border-white/5 px-5 py-4 flex items-center gap-4 shrink-0">
        {/* Back button placeholder */}
        <div className="w-9 h-9 rounded-xl bg-white/5 animate-pulse" />
        {/* Avatar */}
        <div className="w-11 h-11 rounded-2xl bg-white/5 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-3 w-20 bg-white/5 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Message bubbles skeleton */}
      <div className="flex-1 overflow-hidden px-5 py-6 space-y-4">
        {/* Received message */}
        <div className="flex items-end gap-2 justify-start">
          <div className="w-8 h-8 rounded-xl bg-white/5 animate-pulse shrink-0" />
          <div className="h-10 w-48 bg-white/5 rounded-2xl rounded-bl-sm animate-pulse" />
        </div>
        {/* Sent message */}
        <div className="flex items-end gap-2 justify-end">
          <div className="h-10 w-36 bg-emerald-500/10 rounded-2xl rounded-br-sm animate-pulse" />
        </div>
        {/* Received message */}
        <div className="flex items-end gap-2 justify-start">
          <div className="w-8 h-8 rounded-xl bg-white/5 animate-pulse shrink-0" />
          <div className="h-16 w-64 bg-white/5 rounded-2xl rounded-bl-sm animate-pulse" />
        </div>
        {/* Sent message */}
        <div className="flex items-end gap-2 justify-end">
          <div className="h-10 w-44 bg-emerald-500/10 rounded-2xl rounded-br-sm animate-pulse" />
        </div>
        {/* Received message */}
        <div className="flex items-end gap-2 justify-start">
          <div className="w-8 h-8 rounded-xl bg-white/5 animate-pulse shrink-0" />
          <div className="h-10 w-52 bg-white/5 rounded-2xl rounded-bl-sm animate-pulse" />
        </div>
      </div>

      {/* Input skeleton */}
      <div className="border-t border-white/5 px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="flex-1 h-12 bg-white/5 rounded-2xl animate-pulse" />
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 animate-pulse shrink-0" />
      </div>
    </div>
  );
}
