import { ApiClientConfig } from './types';

/**
 * Base API client class
 */
export class ApiClient {
  private baseUrl: string;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.apiUrl;
  }

  /**
   * Make an authenticated API request with the provided token
   */
  protected async makeApiRequest<T>(
    endpoint: string,
    token?: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `API request failed with status ${response.status}`
      );
    }

    return response.json();
  }
}
