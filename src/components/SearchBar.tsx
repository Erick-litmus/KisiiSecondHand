"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchBar() {
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
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="px-6 w-full max-w-7xl mx-auto">
      <form onSubmit={handleSearch} className="relative group">
        <button
          type="submit"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-slate-100 rounded-lg transition-all z-10"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for textbooks, electronics..."
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800 placeholder:text-slate-400 font-medium shadow-sm hover:border-slate-300"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              const params = new URLSearchParams(searchParams.toString());
              params.delete("q");
              router.push(`/browse?${params.toString()}`);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
}
