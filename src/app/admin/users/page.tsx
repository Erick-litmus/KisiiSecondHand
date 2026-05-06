import prisma from "@/lib/prisma";
import Link from "next/link";
import { 
  Users, 
  Mail, 
  Calendar, 
  Shield, 
  User, 
  ArrowLeft,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";
import AdminSearch from "@/components/AdminSearch";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const q = params.q || "";

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ]
    },
    orderBy: { createdAt: "desc" },
    include: {
      items: { select: { id: true } },
    }
  });

  return (
    <div className="space-y-12 bg-slate-50 min-h-screen p-8 rounded-[40px] border border-slate-200 shadow-inner">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link href="/admin" className="text-[10px] font-black text-emerald-600 hover:text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-4 group transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Manage Users</h1>
          <p className="text-slate-500 mt-2">View and manage all registered accounts on the platform.</p>
        </div>
        
        <div className="flex gap-3">
          <AdminSearch placeholder="Search by name or email..." />
          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-all shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Registered Users</h2>
            <p className="text-sm text-slate-400 mt-1">Total database records: {users.length}</p>
          </div>
          <div className="flex items-center gap-3">
             <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
               {users.filter(u => u.role === "ADMIN").length} Admins
             </span>
             <span className="bg-slate-50 text-slate-400 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">
               {users.filter(u => u.role === "USER").length} Members
             </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-10 py-6">Identity</th>
                <th className="px-10 py-6">Email Address</th>
                <th className="px-10 py-6">Access Level</th>
                <th className="px-10 py-6 text-right">Joined</th>
                <th className="px-10 py-6 text-right">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/30 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all shadow-sm ${
                        user.role === "ADMIN" 
                          ? "bg-amber-50 border-amber-100 text-amber-600" 
                          : "bg-emerald-50 border-emerald-100 text-emerald-600"
                      }`}>
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-lg leading-none mb-1.5">{user.name || "Unnamed User"}</p>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">ID: {user.id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-sm font-bold group-hover:text-slate-900 transition-colors">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      {user.role === "ADMIN" ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
                          <Shield className="w-3 h-3" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-400 rounded-lg border border-slate-100">
                          <User className="w-3 h-3" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Member</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-slate-800 mb-1">
                        {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Registration Date</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex flex-col items-end">
                      <span className={`text-xs font-black ${user.items.length > 0 ? "text-emerald-600" : "text-slate-300"}`}>
                        {user.items.length} Items
                      </span>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Total Listings</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="py-32 text-center">
              <Users className="w-12 h-12 text-slate-100 mx-auto mb-4" />
              <p className="text-slate-400 font-black uppercase tracking-[0.2em]">No users found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
