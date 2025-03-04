import Link from "next/link";
import NavbarClient from "./NavbarClient";
import AuthButton from "./AuthButton";
import MobileSidebar from "./MobileSidebar";
import { createClient } from "@/utils/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userName = session?.user?.email?.split("@")[0] || "User";

  return (
    <nav className="w-full border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center p-3 px-5">
        <div className="flex items-center gap-4">
          {session && <MobileSidebar userName={userName} />}
          <Link href="/" className="font-bold text-xl">
            WhichCraft
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <NavbarClient />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
