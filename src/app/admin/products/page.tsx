import prisma from "@/lib/prisma";
import { approveProduct, rejectProduct, deleteProduct } from "@/lib/actions/admin";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Trash2, 
  Check, 
  X as CloseIcon, 
  Search,
  Filter,
  MoreVertical,
  Package
} from "lucide-react";
import AdminSearch from "@/components/AdminSearch";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const q = params.q || "";

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { seller: { name: { contains: q, mode: "insensitive" } } },
      ]
    },
    include: {
      category: true,
      seller: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 bg-slate-50 min-h-screen p-8 rounded-[40px] border border-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link href="/admin" className="text-[10px] font-black text-emerald-600 hover:text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-4 group transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Manage Listings</h1>
          <p className="text-slate-500 mt-2">Audit, approve, or remove marketplace items.</p>
        </div>
        
        <div className="flex gap-3">
          <AdminSearch placeholder="Search listings..." />
          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-all shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-10 py-6">Product Information</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Price</th>
                <th className="px-10 py-6">Seller</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group-hover:border-emerald-500/30 transition-all shadow-sm">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-[8px]">EMPTY</div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-lg leading-none mb-2">{product.title}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{product.category.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        product.status === "APPROVED" ? "bg-emerald-500" :
                        product.status === "PENDING" ? "bg-amber-500" :
                        "bg-rose-500"
                      }`} />
                      <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${
                        product.status === "APPROVED" ? "text-emerald-600" :
                        product.status === "PENDING" ? "text-amber-600" :
                        "text-rose-600"
                      }`}>
                        {product.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right font-black text-slate-800 text-sm">
                    KSh {product.price.toLocaleString()}
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 mb-0.5">{product.seller.name || "Student"}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{product.seller.email}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-2">
                      {product.status !== "APPROVED" && (
                        <form action={async () => {
                          "use server";
                          await approveProduct(product.id);
                        }}>
                          <button className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm" title="Approve">
                            <Check className="w-5 h-5" />
                          </button>
                        </form>
                      )}
                      {product.status !== "REJECTED" && (
                        <form action={async () => {
                          "use server";
                          await rejectProduct(product.id);
                        }}>
                          <button className="w-10 h-10 flex items-center justify-center bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl transition-all shadow-sm" title="Reject">
                            <CloseIcon className="w-5 h-5" />
                          </button>
                        </form>
                      )}
                      <form action={async () => {
                        "use server";
                        await deleteProduct(product.id);
                      }}>
                        <button className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="py-32 text-center">
              <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-black uppercase tracking-[0.2em]">No listings found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
