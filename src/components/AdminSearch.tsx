"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

interface AdminSearchProps {
  placeholder?: string;
}

export default function AdminSearch({ placeholder = "Search..." }: AdminSearchProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative group min-w-[280px]">
      <button
        type="submit"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-slate-200 rounded-lg transition-all z-10"
        title="Search"
      >
        <Search className="w-4 h-4" />
      </button>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 pl-11 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            const params = new URLSearchParams(searchParams.toString());
            params.delete("q");
            router.push(`?${params.toString()}`);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full text-slate-400 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </form>
  );
}
