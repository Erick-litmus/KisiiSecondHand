import React from "react";
export const dynamic = "force-dynamic";
import { 
  Plus, 
  Package, 
  MessageSquare, 
  Eye, 
  Edit3, 
  Trash2,
  TrendingUp,
  DollarSign,
  PackageCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import MarkAsSoldButton from "@/components/MarkAsSoldButton";

const StatsCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
    <div className="flex items-start justify-between mb-4">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-emerald-600 flex items-center gap-1 text-xs font-black uppercase tracking-widest">
        <TrendingUp className="w-3 h-3" />
        {trend}
      </div>
    </div>
    <div className="text-3xl font-black mb-1 text-slate-900">{value}</div>
    <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</div>
  </div>
);

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch real data from Prisma
  const products = await prisma.product.findMany({
    where: { sellerId: userId },
    orderBy: { createdAt: "desc" },
  });

  const totalEarnings = products.reduce((acc, p) => acc + p.price, 0); // Simplified calculation
  const activeListings = products.length;
  
  // Recent conversations
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ buyerId: userId }, { sellerId: userId }],
    },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      buyer: { select: { name: true } },
      seller: { select: { name: true } },
    },
    take: 3,
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black mb-3 tracking-tight text-slate-900">Seller <span className="text-emerald-600">Dashboard</span></h1>
          <p className="text-sm text-slate-500 font-medium">Welcome back, {(session.user.name || "User").split(' ')[0]}! Manage your campus listings here.</p>
        </div>
        <Link href="/sell" className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all shadow-xl shadow-emerald-600/20 hover:-translate-y-1">
          <Plus className="w-5 h-5" />
          List New Item
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatsCard 
          title="Potential Earnings" 
          value={`KSh ${totalEarnings.toLocaleString()}`} 
          icon={DollarSign} 
          trend="+100%" 
          color="bg-emerald-500" 
        />
        <StatsCard 
          title="Your Listings" 
          value={activeListings.toString()} 
          icon={Package} 
          trend="Live" 
          color="bg-indigo-500" 
        />
        <StatsCard 
          title="Profile Trust" 
          value="Verified" 
          icon={Eye} 
          trend="Active" 
          color="bg-amber-500" 
        />
        <StatsCard 
          title="New Inquiries" 
          value={conversations.length.toString()} 
          icon={PackageCheck} 
          trend="Recent" 
          color="bg-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Listings Table */}
        <div className="lg:col-span-2 bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-10">
             <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your Listings</h3>
             <Link href="/browse" className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline">View All</Link>
          </div>
          
          <div className="space-y-6">
             {products.length > 0 ? (
               products.map((item) => (
                 <div key={item.id} className="flex items-center justify-between p-6 rounded-[32px] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Package className="w-8 h-8" />
                            </div>
                          )}
                       </div>
                       <div>
                          <div className="font-black text-lg text-slate-800">{item.title}</div>
                          <div className="text-sm font-bold text-emerald-600">KSh {item.price.toLocaleString()}</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-8">
                       <div className="hidden sm:block text-right">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                          {item.status === "SOLD" ? (
                            <div className="text-[10px] font-black px-3 py-1 rounded-full bg-slate-100 text-slate-500 uppercase tracking-widest border border-slate-200">Sold</div>
                          ) : (
                            <div className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 uppercase tracking-widest border border-emerald-100">Active</div>
                          )}
                       </div>
                       <div className="flex items-center gap-2">
                          <Link href={`/product/${item.id}`} className="p-3 bg-white border border-slate-100 hover:bg-emerald-50 rounded-xl transition-all shadow-sm">
                            <Eye className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                          </Link>
                          {item.status !== "SOLD" && (
                            <MarkAsSoldButton productId={item.id} />
                          )}
                       </div>
                    </div>
                 </div>
               ))
             ) : (
               <div className="py-20 text-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">You haven't listed any items yet.</p>
                  <Link href="/sell" className="text-emerald-600 font-black text-xs uppercase tracking-widest mt-4 inline-block hover:underline">Start Selling Now</Link>
               </div>
             )}
          </div>
        </div>

        {/* Recent Messages/Activity */}
        <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm">
           <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-10">Recent Chats</h3>
           <div className="space-y-8">
              {conversations.length > 0 ? (
                conversations.map((conv) => {
                  const otherUser = session.user.id === conv.buyerId ? conv.seller : conv.buyer;
                  const lastMessage = conv.messages[0]?.text || "No messages yet";
                  
                  return (
                    <div key={conv.id} className="flex gap-4 group">
                       <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center font-black text-amber-700 shrink-0">
                          {otherUser.name ? otherUser.name[0].toUpperCase() : "U"}
                       </div>
                       <div className="min-w-0">
                          <div className="text-sm font-black text-slate-800 mb-1">{otherUser.name || "User"}</div>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-3 font-medium">"{lastMessage}"</p>
                          <Link href={`/messages/${conv.id}`} className="text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all group">
                            Open Chat <MessageSquare className="w-3 h-3 transition-transform group-hover:rotate-12" />
                          </Link>
                       </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                   <p className="text-slate-400 text-sm font-bold">No active conversations yet.</p>
                </div>
              )}
           </div>
           
           <Link href="/messages" className="block w-full mt-10 py-5 bg-slate-50 border border-slate-100 rounded-[24px] text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] text-center hover:bg-slate-100 hover:text-slate-600 transition-all">
             View Full Inbox
           </Link>
        </div>
      </div>
    </div>
  );
}

