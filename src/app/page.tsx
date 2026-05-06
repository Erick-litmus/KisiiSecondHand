import prisma from "@/lib/prisma";
import ListingGrid from "@/components/ListingGrid";
import CategoryPills from "@/components/CategoryPills";
import FloatingActionButton from "@/components/FloatingActionButton";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { Suspense } from "react";

import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();
  const userId = session?.user?.id;

  const products = await prisma.product.findMany({
    where: { status: "APPROVED" },
    include: {
      category: true,
      seller: true,
      ...(userId ? {
        savedBy: {
          where: { userId }
        }
      } : {})
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8 pb-32 bg-slate-50 min-h-screen">
      {/* Hero Section with Campus Background */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "480px" }}>
        {/* Background image using img tag for reliability */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/kisii%20ict.jpg"
          alt="Kisii University Campus"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            zIndex: 0,
          }}
        />

        {/* Subtle bottom gradient so text is readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.55) 100%)",
            zIndex: 1,
          }}
        />

        {/* Hero content */}
        <div
          className="relative flex flex-col justify-end px-6 pb-10 gap-3"
          style={{ zIndex: 2, minHeight: "480px" }}
        >
          <span
            className="inline-block self-start bg-emerald-500/30 border border-emerald-400/60 text-white text-xs font-semibold uppercase tracking-widest rounded-full px-4 py-1 backdrop-blur-sm"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
          >
            Kisii University Campus
          </span>
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-white leading-tight"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}
          >
            Kisii Secondhand <span className="text-emerald-300">Marketplace</span>
          </h1>
          <p
            className="text-slate-100 text-sm sm:text-base max-w-lg"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}
          >
            Buy &amp; sell quality items within the Kisii University community. Safe, simple, and local.
          </p>
          <div>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-7 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 text-sm"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Search Bar Container */}
      <div className="pt-2">
        <SearchBar />
      </div>

      {/* Categories Section */}
      <div className="flex flex-col gap-4">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Categories</h2>
          <Link href="/browse" className="text-emerald-600 font-bold text-xs uppercase tracking-wider hover:text-emerald-500 transition-colors">View All</Link>
        </div>
        <Suspense fallback={<div className="h-24 animate-pulse bg-slate-100 rounded-2xl mx-6" />}>
          <CategoryPills />
        </Suspense>
      </div>

      {/* New Listings Section */}
      <div className="flex flex-col gap-4">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <h2 className="text-xl font-bold text-slate-800">New Listings</h2>
        </div>
        <ListingGrid products={products} userId={userId} />
      </div>

      <FloatingActionButton />
    </div>
  );
}
