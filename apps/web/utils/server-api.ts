import { createClient } from '@/utils/supabase/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get the authentication token from Supabase (server-side)
 */
export async function getServerAuthToken() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

/**
 * Make an authenticated API request with the provided token
 */
async function makeApiRequest(
  endpoint: string,
  token: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
) {
  if (!token) {
    throw new Error('Authentication required');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const requestOptions: RequestInit = {
    method,
    headers,
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, requestOptions);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Make an authenticated API request (server-side)
 */
export async function serverApiRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
) {
  const token = await getServerAuthToken();

  if (!token) {
    throw new Error('Authentication required');
  }

  return makeApiRequest(endpoint, token, method, body);
}

/**
 * Server-side API functions for beverages
 */
export const serverBeverageApi = {
  /**
   * Get all beverages for the current user
   * @param filters Optional filters to apply (type, liked, sort_by, sort_order)
   */
  getAll: async (filters?: {
    type?: string;
    liked?: boolean;
    sort_by?: 'name' | 'type' | 'producer' | 'created_at';
    sort_order?: 'asc' | 'desc';
  }) => {
    let endpoint = '/api/beverages';

    // Add query parameters if filters are provided
    if (filters) {
      const params = new URLSearchParams();

      if (filters.type) {
        params.append('type', filters.type);
      }

      if (filters.liked !== undefined) {
        params.append('liked', filters.liked.toString());
      }

      if (filters.sort_by) {
        params.append('sort_by', filters.sort_by);
      }

      if (filters.sort_order) {
        params.append('sort_order', filters.sort_order);
      }

      const queryString = params.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return serverApiRequest(endpoint, 'GET');
  },

  /**
   * Get a specific beverage by ID
   */
  getById: async (id: string) => {
    return serverApiRequest(`/api/beverages/${id}`, 'GET');
  },

  /**
   * Create a new beverage
   */
  create: async (beverage: any) => {
    return serverApiRequest('/api/beverages', 'POST', beverage);
  },

  /**
   * Update an existing beverage
   */
  update: async (id: string, beverage: any) => {
    return serverApiRequest(`/api/beverages/${id}`, 'PUT', beverage);
  },

  /**
   * Delete a beverage
   */
  delete: async (id: string) => {
    return serverApiRequest(`/api/beverages/${id}`, 'DELETE');
  },
};

export default {
  serverBeverageApi,
};
