import { createClient } from "@/utils/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Get the authentication token from Supabase
 */
async function getAuthToken() {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

/**
 * Make an authenticated API request
 */
async function apiRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const options: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (body && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `API request failed with status ${response.status}`
    );
  }

  return response.json();
}

/**
 * API functions for beverages
 */
export const beverageApi = {
  /**
   * Get all beverages for the current user
   */
  getAll: async () => {
    return apiRequest("/api/beverages");
  },

  /**
   * Get a specific beverage by ID
   */
  getById: async (id: string) => {
    return apiRequest(`/api/beverages/${id}`);
  },

  /**
   * Create a new beverage
   */
  create: async (beverage: any) => {
    return apiRequest("/api/beverages", "POST", beverage);
  },

  /**
   * Update an existing beverage
   */
  update: async (id: string, beverage: any) => {
    return apiRequest(`/api/beverages/${id}`, "PUT", beverage);
  },

  /**
   * Delete a beverage
   */
  delete: async (id: string) => {
    return apiRequest(`/api/beverages/${id}`, "DELETE");
  },
};

/**
 * API functions for user
 */
export const userApi = {
  /**
   * Get the current user's profile
   */
  getProfile: async () => {
    return apiRequest("/api/users/me");
  },
};

export default {
  beverageApi,
  userApi,
};
