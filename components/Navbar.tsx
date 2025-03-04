import Link from "next/link";
import NavbarClient from "./NavbarClient";
import AuthButton from "./AuthButton";

export default async function Navbar() {
  return (
    <nav className="w-full border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center p-3 px-5">
        <Link href="/" className="font-bold text-xl">
          WhichCraft
        </Link>
        <div className="flex items-center gap-4">
          <NavbarClient />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
