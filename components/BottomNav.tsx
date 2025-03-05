"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Beer, BarChart3, Home, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show bottom nav on auth pages
  if (pathname.includes("/auth") || pathname === "/") {
    return null;
  }

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    if (path !== "/dashboard" && pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-10 md:hidden">
      <div className="flex items-center justify-around h-16">
        <Button
          variant={isActive("/dashboard") ? "default" : "ghost"}
          size="icon"
          className="flex flex-col items-center justify-center h-full w-full rounded-none"
          asChild
        >
          <Link href="/dashboard">
            <div className="flex flex-col items-center">
              <Beer className="h-5 w-5" />
              <span className="text-xs mt-1">Collection</span>
            </div>
          </Link>
        </Button>
        <Button
          variant={isActive("/dashboard/stats") ? "default" : "ghost"}
          size="icon"
          className="flex flex-col items-center justify-center h-full w-full rounded-none"
          asChild
        >
          <Link href="/dashboard/stats">
            <div className="flex flex-col items-center">
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs mt-1">Stats</span>
            </div>
          </Link>
        </Button>
        <Button
          variant={isActive("/about") ? "default" : "ghost"}
          size="icon"
          className="flex flex-col items-center justify-center h-full w-full rounded-none"
          asChild
        >
          <Link href="/about">
            <div className="flex flex-col items-center">
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">About</span>
            </div>
          </Link>
        </Button>
        <Button
          variant={isActive("/profile") ? "default" : "ghost"}
          size="icon"
          className="flex flex-col items-center justify-center h-full w-full rounded-none"
          asChild
        >
          <Link href="/profile">
            <div className="flex flex-col items-center">
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">Profile</span>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
}
