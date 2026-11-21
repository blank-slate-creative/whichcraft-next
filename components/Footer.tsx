import Link from 'next/link';
import { Logo } from '@/components/brand/Brand';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background py-12 text-muted-foreground">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <Link href="/" aria-label="WhichCraft home" className="rounded-lg">
            <Logo size={28} wordmarkClassName="text-xl text-foreground" />
          </Link>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} WhichCraft. All rights reserved.
          </div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link href="/privacy-policy" className="transition-colors hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="transition-colors hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="/support" className="transition-colors hover:text-foreground">
            Support
          </Link>
        </nav>
      </div>
    </footer>
  );
}
