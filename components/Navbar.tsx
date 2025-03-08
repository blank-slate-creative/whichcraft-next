import Link from 'next/link';
import NavbarClient from './NavbarClient';
import AuthButton from './AuthButton';
import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MobileNavHeader from './MobileNavHeader';

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background border-b border-b-foreground/10 h-16 z-10">
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center px-2 sm:px-3 md:px-4 h-full">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-xl hidden md:block" prefetch={true}>
            WhichCraft
          </Link>

          {/* Show mobile nav header (title and back button) on mobile */}
          <div className="md:hidden">
            <MobileNavHeader />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session && (
            <Button
              className="bg-primary hover:bg-primary/90 hidden md:flex transition-colors duration-200"
              size="sm"
              asChild
            >
              <Link href="/dashboard/add" prefetch={true}>
                <Plus className="h-4 w-4 mr-1" />
                Add Beverage
              </Link>
            </Button>
          )}
          {session && <NavbarClient />}
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
