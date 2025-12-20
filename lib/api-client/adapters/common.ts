import { BeverageApiClient, DEFAULT_API_URL } from '../index';
import { Beverage, BeverageFilters } from '../types';

/**
 * Generic authentication token getter function
 * This can be implemented for any environment (web, server, etc.)
 */
export type GetAuthTokenFn = () => Promise<string | undefined>;

/**
 * Create a beverage API client with the provided authentication function
 * This is a generic adapter that can be used in any environment
 *
 * @param getAuthToken Function to retrieve the authentication token
 * @param apiUrl Optional API URL (defaults to the environment variable or localhost)
 */
export function createBeverageApi(getAuthToken: GetAuthTokenFn, apiUrl = DEFAULT_API_URL) {
  const beverageApiClient = new BeverageApiClient({ apiUrl });

  return {
    /**
     * Get all beverages for the current user
     * @param filters Optional filters to apply (type, liked, sort_by, sort_order)
     */
    getAll: async (filters?: BeverageFilters): Promise<Beverage[]> => {
      const token = await getAuthToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      return beverageApiClient.getAll(token, filters);
    },

    /**
     * Get a specific beverage by ID
     */
    getById: async (id: string): Promise<Beverage> => {
      const token = await getAuthToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      return beverageApiClient.getById(token, id);
    },

    /**
     * Create a new beverage
     */
    create: async (beverage: Partial<Beverage>): Promise<Beverage> => {
      const token = await getAuthToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      return beverageApiClient.create(token, beverage);
    },

    /**
     * Update an existing beverage
     */
    update: async (id: string, beverage: Partial<Beverage>): Promise<Beverage> => {
      const token = await getAuthToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      return beverageApiClient.update(token, id, beverage);
    },

    /**
     * Delete a beverage
     */
    delete: async (id: string): Promise<void> => {
      const token = await getAuthToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      return beverageApiClient.delete(token, id);
    },
  };
}
