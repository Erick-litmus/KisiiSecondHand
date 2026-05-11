import React from "react";
import { MessageSquare } from "lucide-react";

export default function MessagesLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col pb-24">
      {/* Header skeleton */}
      <div className="border-b border-white/5 px-6 py-5">
        <div className="h-7 w-40 bg-white/5 rounded-xl animate-pulse" />
        <div className="h-3 w-24 bg-white/5 rounded-lg animate-pulse mt-2" />
      </div>

      {/* Conversation list skeleton */}
      <div className="flex-1 divide-y divide-white/5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-6 py-5"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-white/5 animate-pulse shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              {/* Name */}
              <div className="h-4 bg-white/5 rounded-lg animate-pulse w-1/3" />
              {/* Last message */}
              <div className="h-3 bg-white/5 rounded-lg animate-pulse w-3/4" />
            </div>
            {/* Time */}
            <div className="h-3 w-10 bg-white/5 rounded-lg animate-pulse shrink-0" />
          </div>
        ))}
      </div>

      {/* Subtle pulse icon in the center for empty-state feel */}
      <div className="flex flex-col items-center gap-3 py-8 text-slate-800">
        <MessageSquare className="w-8 h-8 animate-pulse" />
        <p className="text-[10px] font-black uppercase tracking-widest">
          Loading conversations…
        </p>
      </div>
    </div>
  );
}
