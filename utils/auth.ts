import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Checks if a user is authenticated and redirects to the specified path if they are or aren't
 * @param options Configuration options
 * @returns The authenticated user if available
 */
export async function checkAuth({
  redirectTo,
  redirectIfFound,
}: {
  redirectTo?: string;
  redirectIfFound?: boolean;
} = {}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hasUser = !!user;

  // If redirectTo is set, handle redirects based on auth state
  if (redirectTo) {
    if (redirectIfFound && hasUser) {
      redirect(redirectTo);
    }

    if (!redirectIfFound && !hasUser) {
      redirect(redirectTo);
    }
  }

  return { user };
}

/**
 * Redirects authenticated users to the dashboard
 */
export async function redirectAuthenticatedToHome() {
  await checkAuth({
    redirectTo: '/dashboard',
    redirectIfFound: true,
  });
}

/**
 * Ensures a user is authenticated, redirecting to sign-in if not
 * @returns The authenticated user
 */
export async function requireAuth() {
  const { user } = await checkAuth({
    redirectTo: '/sign-in',
    redirectIfFound: false,
  });
  return { user };
}
