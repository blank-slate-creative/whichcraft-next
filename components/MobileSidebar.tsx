"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { UserMenuItems } from "./UserMenu";
import { useState } from "react";

export default function MobileSidebar({
  userName = "User",
}: {
  userName?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>
            <Link
              href="/"
              className="font-bold text-xl"
              onClick={() => setOpen(false)}
            >
              WhichCraft
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          <div className="py-2">
            <h2 className="mb-2 text-lg font-semibold tracking-tight">
              Navigation
            </h2>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href="/about">About</Link>
              </Button>
            </div>
          </div>

          <UserMenuItems userName={userName} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
