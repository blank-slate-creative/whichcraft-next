import { ApiClientConfig } from "./types";

/**
 * Base API client class
 */
export class ApiClient {
  protected apiUrl: string;

  constructor(config: ApiClientConfig) {
    this.apiUrl = config.apiUrl;
  }

  /**
   * Make an authenticated API request with the provided token
   */
  protected async makeApiRequest(
    endpoint: string,
    token: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any
  ) {
    if (!token) {
      throw new Error("Authentication required");
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (body && (method === "POST" || method === "PUT")) {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.apiUrl}${endpoint}`, requestOptions);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `API request failed with status ${response.status}`
      );
    }

    return response.json();
  }
}
