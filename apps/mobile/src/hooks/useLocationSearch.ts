import { useState, useCallback, useEffect } from "react";
import * as Location from "expo-location";

export interface LocationResult {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export function useLocationSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);

  // Check location permission on mount
  useEffect(() => {
    async function checkPermission() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setHasLocationPermission(status === "granted");
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});
          setCurrentLocation(location);
        }
      } catch (err) {
        console.error("Failed to get location permission:", err);
      }
    }
    checkPermission();
  }, []);

  const searchLocations = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        if (!hasLocationPermission) {
          setError("Location permission is required to provide nearby results");
          setIsLoading(false);
          return;
        }

        // This is a mock implementation
        // In a real app, you would call MapKit JS API here
        // Example: const response = await mapkit.search.autocomplete(searchQuery);
        const mockResults: LocationResult[] =
          currentLocation ?
            [
              {
                id: "1",
                name: "Coffee Shop",
                address: "123 Main St, San Francisco, CA",
                coordinates: {
                  latitude: currentLocation.coords.latitude + 0.01,
                  longitude: currentLocation.coords.longitude + 0.01,
                },
              },
              {
                id: "2",
                name: "Restaurant Example",
                address: "456 Market St, San Francisco, CA",
                coordinates: {
                  latitude: currentLocation.coords.latitude - 0.01,
                  longitude: currentLocation.coords.longitude - 0.01,
                },
              },
              {
                id: "3",
                name: searchQuery + " Venue",
                address: "789 Mission St, San Francisco, CA",
                coordinates: {
                  latitude: currentLocation.coords.latitude + 0.02,
                  longitude: currentLocation.coords.longitude - 0.02,
                },
              },
            ]
          : [];

        setResults(mockResults);
      } catch (err) {
        setError("Failed to search locations");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [hasLocationPermission, currentLocation]
  );

  return {
    query,
    setQuery,
    results,
    setResults,
    isLoading,
    error,
    searchLocations,
  };
}
