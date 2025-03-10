'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Laptop, Menu, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { signOutAction } from '@/app/actions';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

function SignOutButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="ghost" className="w-full justify-start" disabled={pending}>
      {pending ? 'Signing out...' : 'Sign out'}
    </Button>
  );
}

export default function MobileSidebar({ userName = 'User' }: { userName?: string }) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [_, formAction] = useActionState(signOutAction, null);

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
            <Link href="/" className="font-bold text-xl" onClick={() => setOpen(false)}>
              WhichCraft
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          <div className="py-2">
            <h2 className="mb-2 text-lg font-semibold tracking-tight">Navigation</h2>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href="/collection">Collection</Link>
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

          <div className="py-2">
            <h2 className="mb-2 text-lg font-semibold tracking-tight">Theme</h2>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setTheme('light')}
              >
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setTheme('dark')}
              >
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setTheme('system')}
              >
                <Laptop className="mr-2 h-4 w-4" />
                <span>System</span>
              </Button>
            </div>
          </div>

          <div className="py-2">
            <h2 className="mb-2 text-lg font-semibold tracking-tight">Account</h2>
            <div className="space-y-1">
              <form action={formAction}>
                <SignOutButton />
              </form>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
