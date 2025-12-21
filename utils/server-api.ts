import { createBeverageApi } from '@/lib/api-client';
import { createClient } from '@/utils/supabase/server';

/**
 * Get the authentication token from Supabase (server-side)
 */
export async function getServerAuthToken() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

/**
 * Server-side API functions for beverages
 */
export const serverBeverageApi = createBeverageApi(getServerAuthToken);

export default {
  serverBeverageApi,
};
