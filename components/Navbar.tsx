import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-background border-b border-b-foreground/10 h-16 z-10">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center h-full">
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
