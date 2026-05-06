import React from "react";
import prisma from "@/lib/prisma";
import { ShieldCheck, AlertTriangle, User, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";
import ReportActions from "@/components/admin/ReportActions";

export const metadata = {
  title: "Admin - Reports | Kisii Market",
};

export default async function AdminReportsPage() {
  const pendingReports = await prisma.report.findMany({
    where: { status: "PENDING" },
    include: {
      reporter: { select: { name: true, email: true } },
      reportedUser: { select: { id: true, name: true, email: true, isBanned: true } },
      product: { select: { id: true, title: true } }
    },
    orderBy: { createdAt: "desc" },
  });

  const resolvedReports = await prisma.report.findMany({
    where: { status: { in: ["REVIEWED", "DISMISSED"] } },
    include: {
      reporter: { select: { name: true, email: true } },
      reportedUser: { select: { id: true, name: true, email: true, isBanned: true } },
      product: { select: { id: true, title: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-rose-500" />
          Safety Reports
        </h1>
        <p className="text-slate-400 mt-2">Manage user reports and platform safety.</p>
      </div>

      {/* Pending Reports */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Pending Reports ({pendingReports.length})
        </h2>

        {pendingReports.length === 0 ? (
          <div className="bg-[#0d0d0d] border border-white/5 p-12 rounded-[32px] text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-white">All Clear</h3>
            <p className="text-slate-400 text-sm mt-2">There are no pending reports at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingReports.map((report) => (
              <div key={report.id} className="bg-[#0d0d0d] border border-white/5 p-6 rounded-[24px] flex flex-col md:flex-row gap-6 hover:border-white/10 transition-all">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-rose-500/20">
                        {report.productId ? "Product Report" : "User/Chat Report"}
                      </span>
                      <h3 className="font-bold text-white text-lg mt-3">Reason: {report.reason}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Reported User</p>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-rose-500" />
                        <span className="text-sm text-white font-bold">{report.reportedUser.name || "Unknown"}</span>
                        {report.reportedUser.isBanned && (
                          <span className="bg-rose-500/20 text-rose-500 text-[9px] px-2 py-0.5 rounded-full uppercase font-bold">Banned</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{report.reportedUser.email}</p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Reported By</p>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-white font-bold">{report.reporter.name || "Unknown"}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{report.reporter.email}</p>
                    </div>
                  </div>

                  {report.product && (
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Related Product</p>
                        <p className="text-sm text-white font-bold">{report.product.title}</p>
                      </div>
                      <Link href={`/product/${report.product.id}`} target="_blank" className="text-emerald-500 hover:text-emerald-400 flex items-center gap-1 text-xs font-bold">
                        View Product <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                  <ReportActions 
                    reportId={report.id} 
                    reportedUserId={report.reportedUserId} 
                    isBanned={report.reportedUser.isBanned} 
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolved Reports */}
      {resolvedReports.length > 0 && (
        <div className="space-y-4 pt-8">
          <h2 className="text-xl font-bold text-slate-400">Recent Resolved Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resolvedReports.map((report) => (
              <div key={report.id} className="bg-[#0d0d0d] border border-white/5 p-4 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                    report.status === "DISMISSED" ? "bg-slate-800 text-slate-400" : "bg-emerald-500/10 text-emerald-500"
                  }`}>
                    {report.status}
                  </span>
                  <span className="text-xs text-slate-600">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-300 font-bold truncate">Reported: {report.reportedUser.name}</p>
                <p className="text-xs text-slate-500 truncate mt-1">Reason: {report.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
