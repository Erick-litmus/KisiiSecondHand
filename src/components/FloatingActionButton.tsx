"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

const FloatingActionButton = () => {
  return (
    <Link 
      href="/sell" 
      className="fixed bottom-24 right-6 z-40 bg-emerald-600 text-white p-4 rounded-full shadow-2xl shadow-emerald-600/40 hover:scale-110 transition-transform md:hidden"
    >
      <Plus className="w-8 h-8" />
    </Link>
  );
};

export default FloatingActionButton;
