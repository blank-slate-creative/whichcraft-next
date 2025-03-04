import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { signOutAction } from "@/app/actions";
import { Button } from "./ui/button";

export default async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return (
      <form action={signOutAction}>
        <Button type="submit" variant="outline">
          Sign Out
        </Button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/sign-in"
        className="py-2 px-4 rounded-md hover:bg-secondary transition-colors"
      >
        Sign In
      </Link>
      <Link
        href="/sign-up"
        className="py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}
