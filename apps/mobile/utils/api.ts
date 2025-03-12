import { createBeverageApi } from "@whichcraft/api-client";
import { supabase } from "./supabase";

/**
 * Get the authentication token from Supabase (mobile)
 */
export async function getMobileAuthToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

/**
 * Mobile API functions for beverages
 */
export const mobileBeverageApi = createBeverageApi(getMobileAuthToken);

export default {
  mobileBeverageApi,
};
