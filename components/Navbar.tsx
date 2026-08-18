import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-background border-b border-b-foreground/10 h-16 z-10">
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center px-2 sm:px-3 md:px-4 h-full">
        <Link href="/" className="font-bold text-xl" prefetch={true}>
          WhichCraft
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/about" className="py-2 px-4 rounded-md hover:bg-secondary transition-colors">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
