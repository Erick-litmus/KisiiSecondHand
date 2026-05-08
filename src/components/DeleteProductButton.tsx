"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteProduct } from "@/lib/actions/admin";

interface DeleteProductButtonProps {
  productId: string;
}

export default function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to permanently delete this listing? This will also remove all related chats and messages.")) {
      setIsDeleting(true);
      try {
        const result = await deleteProduct(productId);
        if (!result.success) {
          alert(result.error || "Failed to delete product");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("An error occurred while deleting");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm disabled:opacity-50"
      title="Delete"
    >
      {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
    </button>
  );
}
