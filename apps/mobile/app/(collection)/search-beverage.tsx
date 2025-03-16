import { useState, useEffect, useCallback, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Beverage, BeerSearchResult } from "@whichcraft/api-client";
import { BeverageItem } from "../../components/BeverageItem";
import { Search, Edit, X } from "lucide-react-native";
import { useThemeColor } from "../../hooks/useThemeColor";

export default function SearchBeverageScreen() {
  const router = useRouter();
  const { colors, isDark } = useThemeColor();
  const insets = useSafeAreaInsets();

  // Theme colors
  const primaryColor = colors.primary;
  const mutedForegroundColor = colors.mutedForeground;
  const backgroundColor = colors.background;

  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Beverage[]>([]);

  // Debounce search
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handle search input change
  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text);

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Clear search results if input is empty
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }

    // Set new timeout
    debounceTimeout.current = setTimeout(() => {
      if (text.trim().length > 2) {
        handleSearch();
      }
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // Handle search
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);

      // Use the actual beer search API
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL || "https://api.whichcraft.app"}/api/search/beer?q=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        // Transform the search results to match our Beverage interface
        const beverages: Beverage[] = data.map((beer: BeerSearchResult) => ({
          id: "",
          name: beer.name,
          producer: beer.brewery_name || "Unknown Brewery",
          type: "Beer",
          style: beer.type_name || "",
          abv: typeof beer.abv === "number" ? beer.abv : null,
          untappd_beer_id: beer.id,
          untappd_brewery_id: beer.brewery_id,
          image_url: beer.image_url || null,
          liked: true,
          created_at: new Date().toISOString(),
          notes: "",
        }));

        setSearchResults(beverages);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setIsLoading(false);
      Alert.alert("Error", "Failed to search for beverages");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  // Handle select beverage from search results
  const handleSelectBeverage = (beverage: Beverage) => {
    router.push({
      pathname: "/(collection)/add-beverage-details",
      params: { beverage: JSON.stringify(beverage) },
    });
  };

  // Handle manual entry
  const handleManualEntry = () => {
    const emptyBeverage: Beverage = {
      id: "",
      name: "",
      producer: "",
      type: "Beer",
      style: "",
      notes: "",
      liked: true,
      abv: null,
      image_url: null,
      created_at: new Date().toISOString(),
      untappd_beer_id: null,
      untappd_brewery_id: null,
    };

    router.push({
      pathname: "/(collection)/add-beverage-details",
      params: {
        beverage: JSON.stringify(emptyBeverage),
        isManualEntry: "true",
      },
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Add to Collection",
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerShown: true,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerTintColor: primaryColor,
          headerSearchBarOptions: {
            placeholder: "Search for a beer...",
            onChangeText: (e) => handleSearchInputChange(e.nativeEvent.text),
          },
          headerRight: () => (
            <TouchableOpacity
              className="flex-row items-center gap-2"
              onPress={handleManualEntry}
            >
              <Edit size={18} color={primaryColor} />
              <Text className="text-foreground font-medium">Add Manually</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{
          paddingBottom: insets.bottom,
        }}
        keyboardShouldPersistTaps="never"
        contentInsetAdjustmentBehavior="automatic"
      >
        {searchQuery.length === 0 && (
          <View className="p-4">
            <Text className="text-muted-foreground">
              Search for a beer or add one manually.
            </Text>
          </View>
        )}

        <View>
          {isLoading ?
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color={primaryColor} />
            </View>
          : searchResults.length > 0 ?
            <View className="mb-4">
              {searchResults.map((beverage, index) => (
                <BeverageItem
                  key={beverage.id || `search-${index}`}
                  beverage={beverage}
                  onPress={() => handleSelectBeverage(beverage)}
                  showRating={false}
                />
              ))}
            </View>
          : searchQuery.length > 4 && !isLoading ?
            <View className="p-4">
              <Text className="text-muted-foreground">
                No beers found. Try a different search term or add manually.
              </Text>
            </View>
          : null}
        </View>
      </ScrollView>
    </>
  );
}
