import Link from 'next/link';
import NavbarClient from './NavbarClient';
import AuthButton from './AuthButton';
import { createClient } from '@/utils/supabase/server';
import MobileNavHeader from './MobileNavHeader';

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <nav className="bg-background border-b border-b-foreground/10 h-16 z-10">
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
          {session && <NavbarClient />}
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
