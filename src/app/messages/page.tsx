import React from "react";
import { getConversations } from "@/lib/actions/chat";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { MessageCircle, ShoppingBag, Clock, User, ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";

export default async function MessagesPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const conversations = await getConversations();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pb-32">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Your Messages</h1>
          <p className="text-slate-500 font-medium">Keep track of your conversations with buyers and sellers.</p>
        </div>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-[40px] p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No messages yet</h3>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">
            When you contact a seller or someone contacts you, the conversation will appear here.
          </p>
          <Link 
            href="/browse" 
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
          >
            Start Browsing <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {conversations.map((conv) => {
            const isBuyer = conv.buyerId === session.user.id;
            const otherUser = isBuyer ? conv.seller : conv.buyer;
            const lastMessage = conv.messages[0];

            return (
              <Link 
                key={conv.id} 
                href={`/messages/${conv.id}`}
                className="group bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex items-center gap-5 relative overflow-hidden"
              >
                {/* Product Image Thumbnail */}
                <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  <img 
                    src={conv.product.image || "/images/placeholder.jpg"} 
                    alt={conv.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-800 truncate pr-4">{otherUser.name || "User"}</h3>
                    {lastMessage && (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(lastMessage.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">
                      {conv.product.title}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 truncate italic">
                    {lastMessage ? lastMessage.text : "No messages yet..."}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
