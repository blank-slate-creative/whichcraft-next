import { createClient } from "@/utils/supabase/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Get the authentication token from Supabase (server-side)
 */
export async function getServerAuthToken() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

/**
 * Make an authenticated API request (server-side)
 */
export async function serverApiRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
) {
  const token = await getServerAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  // Debug token (only first few characters for security)
  console.log("Token prefix:", token.substring(0, 10) + "...");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body);
  }

  console.log(`Making ${method} request to ${API_URL}${endpoint}`);

  const response = await fetch(`${API_URL}${endpoint}`, options);

  console.log(`Response status:`, response.status);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("API error response:", error);
    throw new Error(
      error.message || `API request failed with status ${response.status}`
    );
  }

  return response.json();
}

/**
 * Server-side API functions for beverages
 */
export const serverBeverageApi = {
  /**
   * Get all beverages for the current user
   */
  getAll: async () => {
    return serverApiRequest("/api/beverages");
  },

  /**
   * Get a specific beverage by ID
   */
  getById: async (id: string) => {
    return serverApiRequest(`/api/beverages/${id}`);
  },

  /**
   * Create a new beverage
   */
  create: async (beverage: any) => {
    return serverApiRequest("/api/beverages", "POST", beverage);
  },

  /**
   * Update an existing beverage
   */
  update: async (id: string, beverage: any) => {
    return serverApiRequest(`/api/beverages/${id}`, "PUT", beverage);
  },

  /**
   * Delete a beverage
   */
  delete: async (id: string) => {
    return serverApiRequest(`/api/beverages/${id}`, "DELETE");
  },
};

export default {
  serverBeverageApi,
};
