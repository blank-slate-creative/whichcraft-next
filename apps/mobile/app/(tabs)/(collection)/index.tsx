import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { BeverageApiClient } from "@whichcraft/api-client";
import { Beverage, BeverageFilters } from "@whichcraft/api-client";
import {
  ThumbsUp,
  ThumbsDown,
  Search,
  X,
  XCircle,
  SlidersHorizontal,
  Plus,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Badge } from "../../../components/Badge";
import BeverageItem from "../../../components/BeverageItem";
import { useBeverages } from "@whichcraft/beverage-context";
import { SortSelector, SortOption } from "../../../components/SortSelector";
import { useThemeColor } from "../../../hooks/useThemeColor";

// Define sort options
const sortOptions: SortOption[] = [
  {
    label: "Date Added (Newest)",
    value: "date_desc",
    field: "created_at",
    order: "desc",
  },
  {
    label: "Date Added (Oldest)",
    value: "date_asc",
    field: "created_at",
    order: "asc",
  },
  { label: "Name (A-Z)", value: "name_asc", field: "name", order: "asc" },
  { label: "Name (Z-A)", value: "name_desc", field: "name", order: "desc" },
  { label: "Type", value: "type_asc", field: "type", order: "asc" },
  { label: "Producer", value: "producer_asc", field: "producer", order: "asc" },
];

// Create API client instance
const beverageApi = new BeverageApiClient({
  apiUrl: process.env.EXPO_PUBLIC_API_URL || "https://api.whichcraft.app",
});

export default function HomeScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const {
    beverages,
    setBeverages,
    setAllBeverages,
    stats,
    deleteBeverage,
    allBeverages,
  } = useBeverages();
  const { liked, sort_by, sort_order, refresh } = useLocalSearchParams<{
    liked?: string;
    sort_by?: BeverageFilters["sort_by"] | "undefined";
    sort_order?: BeverageFilters["sort_order"] | "undefined";
    refresh?: string;
  }>();
  const { colors, isDark } = useThemeColor();
  const insets = useSafeAreaInsets();

  // Theme colors
  const primaryColor = colors.primary;
  const primaryForegroundColor = colors.primaryForeground;
  const mutedForegroundColor = colors.mutedForeground;
  const destructiveColor = colors.destructive;
  const backgroundColor = colors.background;

  // State
  const [filteredBeverages, setFilteredBeverages] = useState<Beverage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialData, setHasInitialData] = useState(false);

  // Get current filter values from URL params
  const currentLiked =
    liked === "undefined" || liked === undefined ? undefined : liked === "true";
  const currentSortBy =
    sort_by === "undefined" || sort_by === undefined ? "created_at" : sort_by;
  const currentSortOrder =
    sort_order === "undefined" || sort_order === undefined ?
      "desc"
    : sort_order;

  // Find the current sort option
  const currentSortOption =
    sortOptions.find(
      (option) =>
        option.field === currentSortBy && option.order === currentSortOrder
    ) || sortOptions[0];

  // Check if we have data in context that matches our filters
  useEffect(() => {
    // If we already have beverages in the context, use them
    if (allBeverages.length > 0) {
      // Apply filters to the existing data
      let filtered = [...allBeverages];

      if (currentLiked !== undefined) {
        filtered = filtered.filter((b) => b.liked === currentLiked);
      }

      // Apply sorting
      filtered.sort((a, b) => {
        if (currentSortBy === "created_at") {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return currentSortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else if (currentSortBy === "name") {
          return currentSortOrder === "asc" ?
              a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (currentSortBy === "type" && a.type && b.type) {
          return currentSortOrder === "asc" ?
              a.type.localeCompare(b.type)
            : b.type.localeCompare(a.type);
        } else if (currentSortBy === "producer" && a.producer && b.producer) {
          return currentSortOrder === "asc" ?
              a.producer.localeCompare(b.producer)
            : b.producer.localeCompare(a.producer);
        }
        return 0;
      });

      setBeverages(filtered);
      setHasInitialData(true);
    } else {
      setIsLoading(true);
    }
  }, [allBeverages, currentLiked, currentSortBy, currentSortOrder]);

  // Fetch beverages
  const fetchBeverages = useCallback(
    async (filters?: BeverageFilters) => {
      if (!session?.access_token) return;

      try {
        // Only set loading if we don't have initial data
        if (!hasInitialData && !isRefreshing) {
          setIsLoading(true);
        }

        const data = await beverageApi.getAll(session.access_token, filters);
        setBeverages(data);
        setAllBeverages(data);
        setError(null);
        setHasInitialData(true);
      } catch (err) {
        console.error("Error fetching beverages:", err);
        setError("Failed to load beverages");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [session, setBeverages, setAllBeverages, hasInitialData, isRefreshing]
  );

  // Initial fetch - only if we don't have data or if refresh is requested
  useEffect(() => {
    if (session?.access_token && (!hasInitialData || refresh === "true")) {
      fetchBeverages({
        liked: currentLiked,
        sort_by: currentSortBy,
        sort_order: currentSortOrder,
      });
    }
  }, [
    fetchBeverages,
    session,
    currentLiked,
    currentSortBy,
    currentSortOrder,
    hasInitialData,
    refresh,
  ]);

  // Refresh when screen comes into focus - but only if we need fresh data
  useFocusEffect(
    useCallback(() => {
      if (session?.access_token && refresh === "true") {
        fetchBeverages({
          liked: currentLiked,
          sort_by: currentSortBy,
          sort_order: currentSortOrder,
        });
      }
    }, [
      fetchBeverages,
      session,
      currentLiked,
      currentSortBy,
      currentSortOrder,
      refresh,
    ])
  );

  // Apply search filter locally
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBeverages(beverages);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredBeverages(
        beverages.filter(
          (beverage) =>
            beverage.name.toLowerCase().includes(query) ||
            beverage.producer?.toLowerCase().includes(query) ||
            beverage.style?.toLowerCase().includes(query) ||
            beverage.notes?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, beverages]);

  // Handle refresh - always fetch fresh data when manually refreshing
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBeverages({
      liked: currentLiked,
      sort_by: currentSortBy,
      sort_order: currentSortOrder,
    });
  };

  // Clear all filters
  const clearFilters = useCallback(() => {
    // Completely clear all URL parameters
    router.replace({
      pathname: "/(tabs)/(collection)",
      params: {},
    });

    setSearchQuery("");
  }, [router]);

  // Navigate to beverage detail
  const navigateToBeverageDetail = (id: string) => {
    router.push(`/(tabs)/(collection)/${id}`);
  };

  // Navigate to filter screen
  const navigateToFilterScreen = () => {
    router.push({
      pathname: "/(tabs)/(collection)/filter",
      params: {
        liked: currentLiked === undefined ? undefined : String(currentLiked),
      },
    });
  };

  // Handle sort option selection
  const handleSortOptionSelect = (option: SortOption) => {
    router.setParams({
      sort_by: option.field,
      sort_order: option.order,
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentInset={{
        bottom: insets.bottom + 20,
      }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[primaryColor]}
          tintColor={primaryColor}
        />
      }
    >
      <Stack.Screen
        options={{
          title: "Collection",
          headerShadowVisible: true,
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerSearchBarOptions: {
            placeholder: "Search beverages...",
            onChangeText: (e) => setSearchQuery(e.nativeEvent.text),
          },
          headerTintColor: primaryColor,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                router.push("/(tabs)/(collection)/search-beverage")
              }
              className="flex-row items-center justify-center gap-1 mr-4"
            >
              <Plus size={18} color={primaryColor} />
              <Text className="text-foreground font-semibold text-md">Add</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <View className="flex-1 bg-background">
        {/* Filter Button and Active Filters */}
        <View className="px-4 mb-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-2"
          >
            <TouchableOpacity
              className="bg-secondary py-2 px-3 rounded-full flex-row items-center relative mr-2"
              onPress={navigateToFilterScreen}
            >
              <SlidersHorizontal
                size={12}
                color={mutedForegroundColor}
                style={{ marginRight: 6 }}
              />
              <Text className="text-sm text-foreground font-medium">
                Filters
              </Text>
              {currentLiked !== undefined && (
                <View className="absolute top-1 right-1 h-2.5 w-2.5 bg-primary rounded-full" />
              )}
            </TouchableOpacity>

            {currentLiked !== undefined && (
              <Badge
                variant="secondary"
                icon={
                  currentLiked ?
                    <ThumbsUp
                      size={12}
                      color={primaryColor}
                      style={{ marginRight: 6 }}
                    />
                  : <ThumbsDown
                      size={12}
                      color={destructiveColor}
                      style={{ marginRight: 6 }}
                    />
                }
                onRemove={() =>
                  router.setParams({
                    liked: undefined,
                  })
                }
              >
                {currentLiked ? "Liked" : "Disliked"}
              </Badge>
            )}

            {/* Sort Selector - now inside the ScrollView */}
            <View>
              <SortSelector
                options={sortOptions}
                selectedOption={currentSortOption}
                onSelect={handleSortOptionSelect}
              />
            </View>
          </ScrollView>
        </View>

        {/* Error Message */}
        {error && (
          <View className="mx-4 mb-4 bg-destructive/10 p-3 rounded-lg">
            <Text className="text-destructive text-sm">{error}</Text>
          </View>
        )}

        {/* Loading State */}
        {isLoading && !isRefreshing && (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color={primaryColor} />
          </View>
        )}

        {/* Empty State */}
        {!isLoading && filteredBeverages.length === 0 && (
          <View className="items-center justify-center p-4 py-8">
            <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
              <Plus size={32} color={primaryColor} />
            </View>
            <Text className="text-lg font-medium text-foreground mb-2">
              No beverages found
            </Text>
            <Text className="text-center text-muted-foreground mb-4">
              {searchQuery ?
                "Try adjusting your search or filters."
              : "Start building your collection by adding your first beverage."}
            </Text>
            {!searchQuery ?
              <TouchableOpacity
                className="bg-primary py-2 px-4 rounded-lg flex-row items-center"
                onPress={() =>
                  router.push("/(tabs)/(collection)/search-beverage")
                }
              >
                <Plus
                  size={18}
                  color={primaryForegroundColor}
                  style={{ marginRight: 4 }}
                />
                <Text className="text-primary-foreground font-medium">
                  Add Your First Beverage
                </Text>
              </TouchableOpacity>
            : <TouchableOpacity
                className="bg-secondary py-2 px-4 rounded-lg"
                onPress={() => setSearchQuery("")}
              >
                <Text className="text-foreground">Clear Search</Text>
              </TouchableOpacity>
            }
          </View>
        )}

        {/* Beverage List */}
        {!isLoading && filteredBeverages.length > 0 && (
          <View className="flex-1">
            {!isLoading && (
              <Text className="text-muted-foreground px-4 mb-2">
                {stats.totalCount} beverages • {stats.likedCount} liked
              </Text>
            )}
            {filteredBeverages.map((beverage) => (
              <BeverageItem
                key={beverage.id}
                beverage={beverage}
                onPress={() => navigateToBeverageDetail(beverage.id)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
