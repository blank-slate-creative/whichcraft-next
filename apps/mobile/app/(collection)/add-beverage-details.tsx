import { useState, useEffect } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Beverage } from "@whichcraft/api-client";
import { mobileBeverageApi } from "../../utils/api";
import { useBeverages } from "@whichcraft/beverage-context";
import { ThumbsUp, ThumbsDown, MapPin, Search } from "lucide-react-native";
import { Badge } from "../../components/Badge";
import { useThemeColor } from "../../hooks/useThemeColor";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function AddBeverageDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors, isDark } = useThemeColor();
  const { setBeverages, setAllBeverages } = useBeverages();

  // Parse beverage data from params
  const initialBeverage: Beverage = JSON.parse(params.beverage as string);
  const isManualEntry = params.isManualEntry === "true";

  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [beverageData, setBeverageData] = useState<Beverage>(initialBeverage);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  // Get location permission when component mounts
  useEffect(() => {
    (async () => {
      setIsLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");

      if (status === "granted") {
        // Initialize with user's current location if permission granted
        try {
          const currentLocation = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = currentLocation.coords;

          setMapRegion({
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });

          // If there's already a location in beverageData with coordinates, use that instead
          if (beverageData.location) {
            try {
              const locationObj = JSON.parse(beverageData.location);
              if (locationObj.latitude && locationObj.longitude) {
                setMapRegion({
                  latitude: locationObj.latitude,
                  longitude: locationObj.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                });
              }
            } catch (e) {
              // If location is stored as text, keep using current location
            }
          }
        } catch (error) {
          console.error("Error getting location:", error);
        }
      }
      setIsLocationLoading(false);
    })();
  }, []);

  // Handle map marker drag
  const handleMapMarkerDrag = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMapRegion({
      ...mapRegion,
      latitude,
      longitude,
    });

    // Update beverage data with new location
    const locationData = {
      latitude,
      longitude,
    };
    handleBeverageDataChange({ location: JSON.stringify(locationData) });
  };

  // Get current location
  const getCurrentLocation = async () => {
    if (!locationPermission) {
      Alert.alert(
        "Location Permission Required",
        "Please enable location permissions to use this feature",
        [{ text: "OK" }]
      );
      return;
    }

    setIsLocationLoading(true);
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      // Update beverage data with new location
      const locationData = {
        latitude,
        longitude,
      };
      handleBeverageDataChange({ location: JSON.stringify(locationData) });
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get current location");
    } finally {
      setIsLocationLoading(false);
    }
  };

  // Handle beverage data changes
  const handleBeverageDataChange = (data: Partial<Beverage>) => {
    setBeverageData((prev) => ({ ...prev, ...data }));
  };

  // Handle location search
  const searchLocation = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      let results;
      if (Platform.OS === "ios") {
        // Use MapKit geocoding for iOS
        const geocodeResults = await Location.geocodeAsync(query);

        // Get place details for each location
        const detailedResults = await Promise.all(
          geocodeResults.map(async (result) => {
            const reverseGeocode = await Location.reverseGeocodeAsync({
              latitude: result.latitude,
              longitude: result.longitude,
            });

            const place = reverseGeocode[0];
            return {
              id: `${result.latitude}-${result.longitude}`,
              name: place.name || query,
              address: [place.street, place.city, place.region, place.country]
                .filter(Boolean)
                .join(", "),
              location: {
                latitude: result.latitude,
                longitude: result.longitude,
              },
            };
          })
        );

        setSearchResults(detailedResults);
      } else {
        // Use Google Places API for Android
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            query
          )}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        setSearchResults(data.predictions || []);
      }
    } catch (error) {
      console.error("Location search error:", error);
      Alert.alert("Error", "Failed to search for location");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = async (result: any) => {
    setIsLocationLoading(true);
    try {
      let coordinates;
      let locationName;
      let address;

      if (Platform.OS === "ios") {
        coordinates = {
          latitude: result.location.latitude,
          longitude: result.location.longitude,
        };
        locationName = result.name;
        address = result.address;
      } else {
        // For Android, we need to get the place details
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${result.place_id}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        if (data.result?.geometry?.location) {
          coordinates = {
            latitude: data.result.geometry.location.lat,
            longitude: data.result.geometry.location.lng,
          };
          locationName = result.description;
          address = data.result.formatted_address;
        }
      }

      if (coordinates) {
        setMapRegion({
          ...mapRegion,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        });
        handleBeverageDataChange({
          location: JSON.stringify({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            name: locationName,
            address: address,
          }),
        });
      }
    } catch (error) {
      console.error("Error getting place details:", error);
      Alert.alert("Error", "Failed to get location details");
    } finally {
      setIsLocationLoading(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Handle save beverage
  const handleSaveBeverage = async () => {
    try {
      setIsLoading(true);

      // Make sure we have the required fields
      if (!beverageData.name || !beverageData.type) {
        Alert.alert("Error", "Name and type are required");
        setIsLoading(false);
        return;
      }

      // Prepare the beverage data for saving
      const beverageToSave: Partial<Beverage> = {
        name: beverageData.name,
        producer: beverageData.producer || undefined,
        type: beverageData.type,
        style: beverageData.style || undefined,
        abv: beverageData.abv,
        notes: beverageData.notes || undefined,
        liked: beverageData.liked,
        untappd_beer_id: beverageData.untappd_beer_id || undefined,
        untappd_brewery_id: beverageData.untappd_brewery_id || undefined,
        image_url: beverageData.image_url || undefined,
        location: beverageData.location || undefined,
      };

      // Optimistically update UI
      const newBeverage = {
        ...beverageData,
        id: beverageData.id || `temp-${Date.now()}`,
        created_at: beverageData.created_at || new Date().toISOString(),
      };

      // Update context with new beverage
      setBeverages((prev) => [newBeverage, ...prev]);
      setAllBeverages((prev) => [newBeverage, ...prev]);

      // Save to API
      const savedBeverage = await mobileBeverageApi.create(beverageToSave);

      // Update with actual data from API if needed
      if (newBeverage.id.startsWith("temp-")) {
        setBeverages((prev) =>
          prev.map((b) => (b.id === newBeverage.id ? savedBeverage : b))
        );
        setAllBeverages((prev) =>
          prev.map((b) => (b.id === newBeverage.id ? savedBeverage : b))
        );
      }

      // Reset navigation stack to the collection root
      router.dismissTo("/(collection)");

      // Refresh the collection
      router.setParams({ refresh: "true" });

      setIsLoading(false);
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save beverage");
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      keyboardShouldPersistTaps="never"
      contentInsetAdjustmentBehavior="automatic"
    >
      <Stack.Screen
        options={{
          title: "Add to Collection",
          headerShown: true,
          presentation: "card",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-background"
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View className="gap-6 p-4">
          {isManualEntry ?
            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground">
                  Name*
                </Text>
                <TextInput
                  className="bg-secondary text-foreground rounded-lg py-3 px-4"
                  placeholder="Beer name"
                  placeholderTextColor="#9ca3af"
                  value={beverageData.name}
                  onChangeText={(text) =>
                    handleBeverageDataChange({ name: text })
                  }
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground">
                  Producer
                </Text>
                <TextInput
                  className="bg-secondary text-foreground rounded-lg py-3 px-4"
                  placeholder="Brewery name"
                  placeholderTextColor="#9ca3af"
                  value={beverageData.producer || ""}
                  onChangeText={(text) =>
                    handleBeverageDataChange({ producer: text })
                  }
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground">
                  Style
                </Text>
                <TextInput
                  className="bg-secondary text-foreground rounded-lg py-3 px-4"
                  placeholder="Beer style (IPA, Stout, etc.)"
                  placeholderTextColor="#9ca3af"
                  value={beverageData.style || ""}
                  onChangeText={(text) =>
                    handleBeverageDataChange({ style: text })
                  }
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground">
                  ABV (%)
                </Text>
                <TextInput
                  className="bg-secondary text-foreground rounded-lg py-3 px-4"
                  placeholder="Alcohol percentage"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={
                    beverageData.abv === null ?
                      ""
                    : beverageData.abv?.toString()
                  }
                  onChangeText={(text) =>
                    handleBeverageDataChange({
                      abv: text === "" ? null : parseFloat(text),
                    })
                  }
                />
              </View>
            </View>
          : <View className="items-center mb-2">
              <View className="h-32 w-32 rounded-lg bg-secondary items-center justify-center mb-4">
                {beverageData.image_url ?
                  <Image
                    source={{ uri: beverageData.image_url }}
                    className="h-32 w-32 rounded-lg"
                    resizeMode="cover"
                  />
                : <Text className="text-3xl">
                    {beverageData.type === "Beer" ? "🍺" : "🍷"}
                  </Text>
                }
              </View>
              <Text className="text-2xl font-bold text-foreground">
                {beverageData.name}
              </Text>
              <Text className="text-base text-muted-foreground">
                {beverageData.producer}
              </Text>
              <View className="flex-row items-center gap-2 mt-2">
                {beverageData.style ?
                  <Badge variant="secondary">{beverageData.style}</Badge>
                : null}
                {beverageData.abv !== null ?
                  <Badge variant="secondary">{beverageData.abv}% ABV</Badge>
                : null}
              </View>
            </View>
          }

          {/* Rating */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-foreground mb-2">
              Would you drink it again?
            </Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                className={`flex-1 flex-row items-center justify-center gap-2 p-3 rounded-md ${
                  beverageData.liked === true ? "bg-primary" : "bg-secondary"
                }`}
                onPress={() => handleBeverageDataChange({ liked: true })}
              >
                <ThumbsUp
                  size={20}
                  color={
                    beverageData.liked === true ?
                      colors.background
                    : colors.primary
                  }
                />
                <Text
                  className={`text-base ${
                    beverageData.liked === true ?
                      "text-primary-foreground"
                    : "text-foreground"
                  }`}
                >
                  Absolutely!
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 flex-row items-center justify-center gap-2 p-3 rounded-md ${
                  beverageData.liked === false ?
                    "bg-destructive"
                  : "bg-secondary"
                }`}
                onPress={() => handleBeverageDataChange({ liked: false })}
              >
                <ThumbsDown
                  size={20}
                  color={
                    beverageData.liked === false ? "white" : colors.destructive
                  }
                />
                <Text
                  className={`text-base ${
                    beverageData.liked === false ?
                      "text-white"
                    : "text-foreground"
                  }`}
                >
                  No Way!
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-medium text-foreground">
                Location
              </Text>
              <TouchableOpacity
                className="flex-row items-center gap-1 py-1 px-2 rounded-md bg-secondary"
                onPress={getCurrentLocation}
                disabled={isLocationLoading}
              >
                <MapPin size={14} color={colors.primary} />
                <Text className="text-xs text-primary">
                  {isLocationLoading ? "Loading..." : "Current Location"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Location Search */}
            <View className="mb-2">
              <View className="relative">
                <TextInput
                  className="bg-secondary text-foreground rounded-lg py-3 px-4 pr-10"
                  placeholder="Search for a venue..."
                  placeholderTextColor="#9ca3af"
                  value={searchQuery}
                  onChangeText={searchLocation}
                />
                <View className="absolute right-3 top-3">
                  {isSearching ?
                    <ActivityIndicator size="small" color={colors.primary} />
                  : <Search size={20} color={colors.mutedForeground} />}
                </View>
              </View>

              {searchResults.length > 0 && (
                <View className="bg-secondary rounded-lg mt-1 max-h-40">
                  <ScrollView>
                    {searchResults.map((result, index) => (
                      <TouchableOpacity
                        key={
                          Platform.OS === "ios" ?
                            `${result.id}`
                          : result.place_id
                        }
                        className="p-3 border-b border-border"
                        onPress={() => handleLocationSelect(result)}
                      >
                        <Text className="text-foreground">
                          {Platform.OS === "ios" ?
                            `${result.name}${result.address ? ` • ${result.address}` : ""}`
                          : result.description}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View
              className="overflow-hidden rounded-lg"
              style={{ height: 200 }}
            >
              {locationPermission ?
                <MapView
                  style={styles.map}
                  provider={Platform.OS === "ios" ? undefined : PROVIDER_GOOGLE}
                  region={mapRegion}
                  onRegionChangeComplete={setMapRegion}
                >
                  <Marker
                    coordinate={{
                      latitude: mapRegion.latitude,
                      longitude: mapRegion.longitude,
                    }}
                    draggable
                    onDragEnd={handleMapMarkerDrag}
                    pinColor={colors.primary}
                  />
                </MapView>
              : <View className="flex-1 items-center justify-center bg-secondary">
                  <Text className="text-muted-foreground text-center px-4">
                    Location permission is required to use the map. Please
                    enable location in your device settings.
                  </Text>
                </View>
              }
            </View>
          </View>

          {/* Notes */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-foreground mb-2">
              Notes
            </Text>
            <TextInput
              className="bg-secondary text-foreground p-3 rounded-md min-h-[100]"
              multiline
              numberOfLines={4}
              value={beverageData.notes || ""}
              onChangeText={(text) => handleBeverageDataChange({ notes: text })}
              placeholder="Add notes about this beverage..."
              placeholderTextColor={colors.mutedForeground}
              textAlignVertical="top"
            />
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-between gap-4">
            <TouchableOpacity
              className="py-3 bg-primary rounded-md items-center w-full"
              onPress={handleSaveBeverage}
              disabled={isLoading}
            >
              {isLoading ?
                <ActivityIndicator
                  size="small"
                  color={isDark ? "rgb(10, 10, 10)" : "rgb(250, 250, 250)"}
                />
              : <Text className="text-primary-foreground font-medium">
                  Save
                </Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
