import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to display in a friendly format
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }
}

// Format timestamp to relative time
export function formatRelativeTime(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));
  
  if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffMinutes < 1440) { // less than 24 hours
    const hours = Math.floor(diffMinutes / 60);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffMinutes < 10080) { // less than 7 days
    const days = Math.floor(diffMinutes / 1440);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }
}

// Generate avatar placeholder using initials
export function generateInitialsAvatar(name: string): string {
  if (!name) return "";
  
  const names = name.split(" ");
  
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  } else if (names.length === 1) {
    return `${names[0][0]}${names[0][1] || ""}`.toUpperCase();
  }
  
  return "";
}

// Get random avatar URL
export function getAvatarUrl(username: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff`;
}

// Format status with appropriate colors
export type StatusColors = {
  bg: string;
  text: string;
};

export function getStatusColors(status: string): StatusColors {
  switch (status.toLowerCase()) {
    case "planning":
      return { bg: "bg-yellow-100", text: "text-yellow-700" };
    case "in progress":
      return { bg: "bg-green-100", text: "text-green-700" };
    case "in review":
      return { bg: "bg-blue-100", text: "text-blue-700" };
    case "completed":
      return { bg: "bg-purple-100", text: "text-purple-700" };
    case "on hold":
      return { bg: "bg-orange-100", text: "text-orange-700" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700" };
  }
}

// Format tag colors
export function getTagColors(tag: string): StatusColors {
  switch (tag.toLowerCase()) {
    case "design":
      return { bg: "bg-blue-100", text: "text-blue-700" };
    case "frontend":
      return { bg: "bg-purple-100", text: "text-purple-700" };
    case "backend":
      return { bg: "bg-indigo-100", text: "text-indigo-700" };
    case "mobile":
      return { bg: "bg-green-100", text: "text-green-700" };
    case "api":
      return { bg: "bg-yellow-100", text: "text-yellow-700" };
    case "database":
      return { bg: "bg-red-100", text: "text-red-700" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700" };
  }
}
