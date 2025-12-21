import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    // Return null when user is signed in, as the UserMenu will handle sign out
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/sign-in" className="py-2 px-4 rounded-md hover:bg-secondary transition-colors">
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
