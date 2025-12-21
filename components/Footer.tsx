import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background py-12 text-muted-foreground">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm">
          &copy; {new Date().getFullYear()} WhichCraft. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm">
          <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link
            href="mailto:support@whichcraft.beer"
            className="hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
