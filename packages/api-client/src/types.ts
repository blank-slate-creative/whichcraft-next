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
  abv: number | null;
  name: string;
  type: string;
  producer: string;
  style: string | null;
  notes: string | null;
  image_url: string | null;
  liked: boolean;
  created_at: string;
  untappd_beer_id: number | null;
  untappd_brewery_id: number | null;
  location?: string | null;
}

/**
 * Beer Search Result interface
 */
export interface BeerSearchResult {
  id: number;
  name: string;
  type_name: string;
  rating: number;
  rating_count: number;
  image_url?: string;
  abv: number | null;
  brewery_name: string;
  brewery_id: number;
}

/**
 * Venue Search Result interface
 */
export interface VenueSearchResult {
  id: string;
  name: string;
  primary_category: string;
  categories: string[];
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  image_url?: string;
  has_beer: boolean;
  has_food: boolean;
  has_wine: boolean;
  has_spirits: boolean;
}
