import prisma from "@/lib/prisma";
import { approveProduct, rejectProduct } from "@/lib/actions/admin";
import Image from "next/image";
import Link from "next/link";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  MessageSquare,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";

export default async function AdminDashboard() {
  // Use a try-catch for safety during data fetching
  try {
    const pendingProducts = await prisma.product.findMany({
      where: { status: "PENDING" },
      include: {
        category: true,
        seller: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const totalProducts = await prisma.product.count();
    const totalUsers = await prisma.user.count({ where: { isVerified: true } });
    const totalConversations = await prisma.conversation.count();

    const stats = [
      { label: "Total Listings", value: totalProducts, icon: Package, color: "text-sky-500", bg: "bg-sky-500/10" },
      { label: "Active Users", value: totalUsers, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
      { label: "Pending Approval", value: pendingProducts.length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
      { label: "Total Chats", value: totalConversations, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
    ];

    return (
      <div className="space-y-12 bg-slate-50 p-8 rounded-[40px] border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Market Overview</h1>
            <p className="text-slate-500 mt-1">Real-time control center for Kisii Secondhand Market.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.label === "Active Users" ? "/admin/users" : stat.label === "Total Listings" ? "/admin/products" : stat.label === "Total Chats" ? "/admin/messages" : "#"} className="bg-white border border-slate-200 p-8 rounded-[32px] group transition-all shadow-sm hover:shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 ${stat.bg.replace('/10', '')} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border border-slate-100`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.replace('500', '600')}`} />
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{stat.value}</p>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Pending Approval</h2>
              <p className="text-sm text-slate-500 mt-1">New listings requiring moderator review.</p>
            </div>
            <span className="bg-amber-500 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">
              {pendingProducts.length} Requests
            </span>
          </div>

          {pendingProducts.length === 0 ? (
            <div className="p-24 text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">All Clear!</h3>
              <p className="text-slate-500 mt-2">No pending products to review at the moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                    <th className="px-10 py-6">Product Details</th>
                    <th className="px-10 py-6">Seller</th>
                    <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pendingProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/30 transition-all group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group-hover:border-emerald-500/30 transition-all shadow-sm">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-[8px]">NO IMAGE</div>
                            )}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-lg leading-none mb-2">{product.title}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-emerald-700 font-black text-sm">KSh {product.price.toLocaleString()}</span>
                              <span className="w-1 h-1 bg-slate-200 rounded-full" />
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{product.category.name}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <p className="font-bold text-slate-700 text-sm mb-1">{product.seller.name || "Student"}</p>
                        <p className="text-xs text-slate-400">{product.seller.email}</p>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end gap-3">
                          <form action={async () => {
                            "use server";
                            await approveProduct(product.id);
                          }}>
                            <button
                              type="submit"
                              className="h-12 px-6 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-md"
                            >
                              Approve
                            </button>
                          </form>
                          <form action={async () => {
                            "use server";
                            await rejectProduct(product.id);
                          }}>
                            <button
                              type="submit"
                              className="h-12 px-6 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-slate-200 shadow-sm"
                            >
                              Reject
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="p-12 bg-white border border-slate-200 rounded-[40px] text-center shadow-lg">
        <h1 className="text-2xl font-bold text-rose-500">Dashboard Error</h1>
        <p className="text-slate-500 mt-4">{err.message}</p>
        <Link href="/admin" className="mt-8 inline-block px-8 py-4 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-xl shadow-md">Retry Load</Link>
      </div>
    );
  }
}
