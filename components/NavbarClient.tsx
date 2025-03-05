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

  const navLinks = [
    {
      href: "/dashboard",
      label: "Collection",
      icon: <Beer className="h-4 w-4" />,
    },
    {
      href: "/dashboard/stats",
      label: "Stats",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      href: "/about",
      label: "About",
      icon: <Home className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex items-center gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            prefetch={true}
            className={`text-sm font-medium transition-colors duration-200 ${
              isActive(link.href) ? "text-primary" : (
                "text-muted-foreground hover:text-foreground"
              )
            }`}
          >
            <span className="flex items-center gap-1">
              {link.icon}
              {link.label}
            </span>
          </Link>
        ))}
      </div>
      <div className="hidden sm:block">
        <UserMenu userName={userName} />
      </div>
    </div>
  );
}
