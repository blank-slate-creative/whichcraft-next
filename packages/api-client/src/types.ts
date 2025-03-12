/**
 * API client configuration
 */
export interface ApiClientConfig {
  apiUrl: string;
}

/**
 * Beverage filters
 */
export interface BeverageFilters {
  type?: string;
  liked?: boolean;
  sort_by?: "name" | "type" | "producer" | "created_at";
  sort_order?: "asc" | "desc";
}

/**
 * Beverage interface
 */
export interface Beverage {
  id: string;
  name: string;
  type: string;
  producer?: string;
  liked?: boolean;
  created_at: string;
  [key: string]: any;
}
