import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date | string | null): string {
  if (!date || date === "null" || date === "undefined") return "Long ago";

  const then = new Date(date);
  // Guard against invalid date objects (NaN)
  if (isNaN(then.getTime())) return "Long ago";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  // Handle edge case where clock skew produces a negative diff
  if (diffInSeconds < 0) return "Just now";
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return then.toLocaleDateString();
}

