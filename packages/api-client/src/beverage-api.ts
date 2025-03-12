import { ApiClient } from "./api-client";
import { Beverage, BeverageFilters } from "./types";

/**
 * Beverage API client
 */
export class BeverageApiClient extends ApiClient {
  /**
   * Get all beverages for the current user
   * @param token Authentication token
   * @param filters Optional filters to apply (type, liked, sort_by, sort_order)
   */
  async getAll(token: string, filters?: BeverageFilters): Promise<Beverage[]> {
    let endpoint = "/api/beverages";

    // Add query parameters if filters are provided
    if (filters) {
      const params = new URLSearchParams();

      if (filters.type) {
        params.append("type", filters.type);
      }

      if (filters.liked !== undefined) {
        params.append("liked", filters.liked.toString());
      }

      if (filters.sort_by) {
        params.append("sort_by", filters.sort_by);
      }

      if (filters.sort_order) {
        params.append("sort_order", filters.sort_order);
      }

      const queryString = params.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return this.makeApiRequest(endpoint, token, "GET");
  }

  /**
   * Get a specific beverage by ID
   * @param token Authentication token
   * @param id Beverage ID
   */
  async getById(token: string, id: string): Promise<Beverage> {
    return this.makeApiRequest(`/api/beverages/${id}`, token, "GET");
  }

  /**
   * Create a new beverage
   * @param token Authentication token
   * @param beverage Beverage data
   */
  async create(token: string, beverage: Partial<Beverage>): Promise<Beverage> {
    return this.makeApiRequest("/api/beverages", token, "POST", beverage);
  }

  /**
   * Update an existing beverage
   * @param token Authentication token
   * @param id Beverage ID
   * @param beverage Updated beverage data
   */
  async update(
    token: string,
    id: string,
    beverage: Partial<Beverage>
  ): Promise<Beverage> {
    return this.makeApiRequest(`/api/beverages/${id}`, token, "PUT", beverage);
  }

  /**
   * Delete a beverage
   * @param token Authentication token
   * @param id Beverage ID
   */
  async delete(token: string, id: string): Promise<void> {
    return this.makeApiRequest(`/api/beverages/${id}`, token, "DELETE");
  }
}
