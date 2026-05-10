import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { MessageSquare, ShieldAlert, Clock, User, ArrowRight, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const conversations = await prisma.conversation.findMany({
    include: {
      product: true,
      buyer: { select: { name: true, email: true } },
      seller: { select: { name: true, email: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-6">
        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-lg shadow-amber-500/10">
          <ShieldAlert className="w-10 h-10 text-amber-500" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Security Monitor</h1>
          <p className="text-slate-500 mt-2">Observing site-wide interactions to ensure platform integrity.</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-amber-500/5 to-transparent">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Live Conversations</h2>
            <p className="text-sm text-slate-500 mt-1">Review message histories between buyers and sellers.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Active Watch</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Participants</th>
                <th className="px-10 py-6">Linked Product</th>
                <th className="px-10 py-6">Latest Interaction</th>
                <th className="px-10 py-6 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {conversations.map((conv) => (
                <tr key={conv.id} className="hover:bg-white/[0.01] transition-all group">
                  <td className="px-10 py-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-sky-500/10 rounded-md flex items-center justify-center text-sky-500 text-[8px] font-black uppercase">B</div>
                        <span className="text-sm font-bold text-white">{conv.buyer.name || conv.buyer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-emerald-500/10 rounded-md flex items-center justify-center text-emerald-500 text-[8px] font-black uppercase">S</div>
                        <span className="text-sm font-bold text-white">{conv.seller.name || conv.seller.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative shadow-lg">
                        {conv.product.image ? (
                          <img src={conv.product.image} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-700 font-bold text-[8px]">NONE</div>
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors truncate max-w-[200px]">
                        {conv.product.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    {conv.messages[0] ? (
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-slate-500 line-clamp-1 italic group-hover:text-slate-400 transition-colors">"{conv.messages[0].text}"</p>
                        <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-1.5 mt-1">
                          <Clock className="w-3 h-3" />
                          {new Date(conv.messages[0].createdAt).toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-700 font-bold italic tracking-wider">INITIATED / NO DATA</span>
                    )}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <Link 
                      href={`/messages/${conv.id}`}
                      className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-white/5 hover:bg-emerald-500 hover:text-[#0a0a0a] border border-white/10 px-5 py-3 rounded-xl transition-all group/btn"
                    >
                      View Log <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {conversations.length === 0 && (
            <div className="py-32 text-center">
              <MessageSquare className="w-12 h-12 text-slate-800 mx-auto mb-4" />
              <p className="text-slate-600 font-black uppercase tracking-[0.2em]">Silence is golden. No active chats.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
