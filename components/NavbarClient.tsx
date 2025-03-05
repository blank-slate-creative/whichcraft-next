"use client";

import UserMenu from "./UserMenu";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Beer, BarChart3, Home } from "lucide-react";

export default function NavbarClient() {
  const [userName, setUserName] = useState("User");
  const supabase = createClient();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserName(session.user.email.split("@")[0]);
      }
    };

    getUser();
  }, [supabase]);

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
    <div className="flex items-center gap-4">
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/dashboard"
          className={`text-sm font-medium ${isActive("/dashboard") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <span className="flex items-center gap-1">
            <Beer className="h-4 w-4" />
            Collection
          </span>
        </Link>
        <Link
          href="/dashboard/stats"
          className={`text-sm font-medium ${isActive("/dashboard/stats") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <span className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            Stats
          </span>
        </Link>
        <Link
          href="/about"
          className={`text-sm font-medium ${isActive("/about") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <span className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            About
          </span>
        </Link>
      </div>
      <div className="hidden sm:block">
        <UserMenu userName={userName} />
      </div>
    </div>
  );
}
