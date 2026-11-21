import Link from 'next/link';
import { Logo } from '@/components/brand/Brand';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav
        aria-label="Main"
        className="container mx-auto flex h-full items-center justify-between px-4 md:px-6"
      >
        <Link href="/" aria-label="WhichCraft home" className="rounded-lg" prefetch={true}>
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/about"
            className="rounded-lg px-4 py-2 font-medium transition-colors hover:bg-accent"
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
