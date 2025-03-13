import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Image,
  StatusBar,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
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
  MoreHorizontal,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Define sort options
interface SortOption {
  label: string;
  value: string;
  field: "created_at" | "name" | "type" | "producer";
  order: "asc" | "desc";
}

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

// Beverage Item Component
const BeverageItem = ({
  beverage,
  onPress,
}: {
  beverage: Beverage;
  onPress: () => void;
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Theme colors
  const primaryColor = isDark ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)";
  const mutedForegroundColor =
    isDark ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)";
  const destructiveColor = isDark ? "rgb(239, 68, 68)" : "rgb(239, 68, 68)";

  return (
    <TouchableOpacity
      className="py-3 px-4 flex-row items-center gap-3 border-b border-border"
      onPress={onPress}
    >
      <View className="h-12 w-12 rounded-md bg-secondary items-center justify-center">
        {beverage.image_url ?
          <Image
            source={{ uri: beverage.image_url }}
            className="h-12 w-12 rounded-md"
          />
        : <Text className="text-lg">
            {beverage.type === "Beer" ? "🍺" : "🍷"}
          </Text>
        }
      </View>
      <View className="flex-1">
        <Text
          className="text-base font-medium text-foreground"
          numberOfLines={1}
        >
          {beverage.name}
        </Text>
        <Text className="text-sm text-muted-foreground" numberOfLines={1}>
          {beverage.producer}
        </Text>
        <Text className="text-xs text-muted-foreground">
          {beverage.style || beverage.type}
        </Text>
      </View>
      <View className="h-8 w-8 rounded-full items-center justify-center">
        {beverage.liked ?
          <ThumbsUp size={18} color={primaryColor} />
        : beverage.liked === false ?
          <ThumbsDown size={18} color={destructiveColor} />
        : <MoreHorizontal size={18} color={mutedForegroundColor} />}
      </View>
    </TouchableOpacity>
  );
};

// Filter Sheet Component
const FilterSheet = ({
  isVisible,
  onClose,
  currentLiked,
  currentSortOption,
  onApplyFilter,
  onClearFilters,
}: {
  isVisible: boolean;
  onClose: () => void;
  currentLiked?: string;
  currentSortOption: SortOption;
  onApplyFilter: (params: {
    liked?: string;
    sortBy?: BeverageFilters["sort_by"];
    sortOrder?: BeverageFilters["sort_order"];
  }) => void;
  onClearFilters: () => void;
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Theme colors
  const primaryForegroundColor =
    isDark ? "rgb(10, 10, 10)" : "rgb(250, 250, 250)";
  const mutedForegroundColor =
    isDark ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)";

  if (!isVisible) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-background rounded-t-xl shadow-lg z-10 h-[80vh]">
      <View className="p-4 border-b border-border">
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-bold text-foreground">Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={mutedForegroundColor} />
          </TouchableOpacity>
        </View>
        <Text className="text-sm text-muted-foreground">
          Filter your beverage collection
        </Text>
      </View>

      <ScrollView className="p-4">
        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground mb-3">
            Rating
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <TouchableOpacity
              className={`py-1 px-3 rounded-full ${!currentLiked ? "bg-primary" : "bg-secondary"}`}
              onPress={() => onApplyFilter({ liked: undefined })}
            >
              <Text
                className={`text-sm ${!currentLiked ? "text-primary-foreground" : "text-foreground"}`}
              >
                All Ratings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`py-1 px-3 rounded-full flex-row items-center ${currentLiked === "true" ? "bg-primary" : "bg-secondary"}`}
              onPress={() => onApplyFilter({ liked: "true" })}
            >
              <ThumbsUp
                size={14}
                color={
                  currentLiked === "true" ?
                    primaryForegroundColor
                  : mutedForegroundColor
                }
                style={{ marginRight: 4 }}
              />
              <Text
                className={`text-sm ${currentLiked === "true" ? "text-primary-foreground" : "text-foreground"}`}
              >
                Liked
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`py-1 px-3 rounded-full flex-row items-center ${currentLiked === "false" ? "bg-primary" : "bg-secondary"}`}
              onPress={() => onApplyFilter({ liked: "false" })}
            >
              <ThumbsDown
                size={14}
                color={
                  currentLiked === "false" ?
                    primaryForegroundColor
                  : mutedForegroundColor
                }
                style={{ marginRight: 4 }}
              />
              <Text
                className={`text-sm ${currentLiked === "false" ? "text-primary-foreground" : "text-foreground"}`}
              >
                Disliked
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground mb-3">
            Sort By
          </Text>
          <View className="gap-2">
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                className={`py-2 px-3 rounded-md ${currentSortOption.value === option.value ? "bg-primary" : "bg-secondary"}`}
                onPress={() =>
                  onApplyFilter({
                    liked: currentLiked || undefined,
                    sortBy: option.field,
                    sortOrder: option.order,
                  })
                }
              >
                <Text
                  className={`text-sm ${currentSortOption.value === option.value ? "text-primary-foreground" : "text-foreground"}`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="flex-row gap-2 mt-4">
          <TouchableOpacity
            className="flex-1 py-2 border border-border rounded-md items-center"
            onPress={onClose}
          >
            <Text className="text-foreground">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-2 bg-primary rounded-md items-center"
            onPress={onClearFilters}
          >
            <Text className="text-primary-foreground">Reset All</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default function HomeScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const { liked, sort_by, sort_order } = useLocalSearchParams<{
    liked?: string;
    sort_by?: BeverageFilters["sort_by"] | "undefined";
    sort_order?: BeverageFilters["sort_order"] | "undefined";
  }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  // Theme colors
  const primaryColor = isDark ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)";
  const primaryForegroundColor =
    isDark ? "rgb(10, 10, 10)" : "rgb(250, 250, 250)";
  const mutedForegroundColor =
    isDark ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)";
  const destructiveColor = isDark ? "rgb(239, 68, 68)" : "rgb(239, 68, 68)";
  const backgroundColor = isDark ? "rgb(10, 10, 10)" : "rgb(255, 255, 255)";

  // Animation values
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Header animation styles
  const HEADER_HEIGHT = 60;
  const TITLE_THRESHOLD = 30;

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, TITLE_THRESHOLD, TITLE_THRESHOLD + 10],
      [0, 0, 1],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, TITLE_THRESHOLD],
      [0, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Border animation style
  const headerBorderStyle = useAnimatedStyle(() => {
    const borderOpacity = interpolate(
      scrollY.value,
      [0, TITLE_THRESHOLD, TITLE_THRESHOLD + 10],
      [0, 0, 1],
      Extrapolation.CLAMP
    );

    return {
      borderBottomWidth: 1,
      borderBottomColor:
        isDark ?
          `rgba(255,255,255,${borderOpacity * 0.1})`
        : `rgba(0,0,0,${borderOpacity * 0.1})`,
    };
  });

  const contentPaddingTop = HEADER_HEIGHT + insets.top;

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

  // State
  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [filteredBeverages, setFilteredBeverages] = useState<Beverage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);

  // Fetch beverages
  const fetchBeverages = useCallback(
    async (filters?: BeverageFilters) => {
      if (!session?.access_token) return;

      try {
        setIsLoading(true);
        const data = await beverageApi.getAll(session.access_token, filters);
        setBeverages(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching beverages:", err);
        setError("Failed to load beverages");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [session]
  );

  // Initial fetch
  useEffect(() => {
    if (session?.access_token) {
      fetchBeverages({
        liked: currentLiked,
        sort_by: currentSortBy,
        sort_order: currentSortOrder,
      });
      setIsRefreshing(false);
    }
  }, [fetchBeverages, session, currentLiked, currentSortBy, currentSortOrder]);

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

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBeverages({
      liked: currentLiked,
      sort_by: currentSortBy,
      sort_order: currentSortOrder,
    });
  };

  // Apply filter
  const applyFilter = useCallback(
    ({
      liked,
      sortBy,
      sortOrder,
    }: {
      liked?: string;
      sortBy?: BeverageFilters["sort_by"];
      sortOrder?: BeverageFilters["sort_order"];
    }) => {
      router.setParams({
        liked,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      setIsFilterSheetVisible(false);
    },
    [router]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    // Completely clear all URL parameters
    router.replace({
      pathname: "/(tabs)",
      params: {},
    });

    setSearchQuery("");
    setIsFilterSheetVisible(false);
  }, [router]);

  // Navigate to beverage detail
  const navigateToBeverageDetail = (id: string) => {
    router.push("/");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Animated Header */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: HEADER_HEIGHT + insets.top,
            paddingTop: insets.top,
            zIndex: 10,
            backgroundColor: backgroundColor,
          },
          headerBorderStyle,
        ]}
      >
        <View className="flex-1 flex-row justify-between items-center px-4">
          <Animated.Text
            style={[headerAnimatedStyle]}
            className="text-foreground font-bold text-lg"
          >
            Collection
          </Animated.Text>
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="flex-row items-center justify-center gap-1"
          >
            <Plus size={18} color={primaryColor} />
            <Text className="text-foreground font-semibold text-md">Add</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.FlatList
        data={filteredBeverages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: contentPaddingTop, // Add extra padding for the static header
          paddingBottom: 80,
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <>
            {/* Static Header */}
            <View className="px-4 pb-4">
              <Text className="text-4xl font-bold text-foreground">
                Collection
              </Text>
            </View>

            {/* Search and Filter */}
            <View className="px-4 pb-2">
              <View className="relative">
                <TextInput
                  className="bg-secondary text-foreground rounded-lg py-3 pl-10 pr-4"
                  placeholder="Search beverages..."
                  placeholderTextColor="#9ca3af"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <View className="absolute left-3 top-3">
                  <Search size={16} color={mutedForegroundColor} />
                </View>
                {searchQuery ?
                  <TouchableOpacity
                    className="absolute right-3 top-3"
                    onPress={() => setSearchQuery("")}
                  >
                    <XCircle size={18} color={mutedForegroundColor} />
                  </TouchableOpacity>
                : null}
              </View>
            </View>

            {/* Filter Button and Active Filters */}
            <View className="px-4 mb-2 flex-row items-center ">
              <TouchableOpacity
                className="bg-secondary py-2 px-3 rounded-full flex-row items-center relative"
                onPress={() => setIsFilterSheetVisible(true)}
              >
                <SlidersHorizontal
                  size={12}
                  color={mutedForegroundColor}
                  style={{ marginRight: 6 }}
                />
                <Text className="text-sm text-foreground font-medium">
                  Filters
                </Text>
                {currentLiked && (
                  <View className="absolute top-1 right-1 h-2.5 w-2.5 bg-primary rounded-full" />
                )}
              </TouchableOpacity>

              {currentLiked !== undefined && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-1 ml-3"
                >
                  <View className="flex-row items-center">
                    <View className="bg-secondary rounded-full py-2 px-3 flex-row items-center">
                      {currentLiked ?
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
                      <Text className="text-sm text-foreground mr-2">
                        {currentLiked ? "Liked" : "Disliked"}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          router.setParams({
                            liked: undefined,
                          })
                        }
                      >
                        <X size={16} color={mutedForegroundColor} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              )}
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
                  : "Start building your collection by adding your first beverage."
                  }
                </Text>
                {!searchQuery ?
                  <TouchableOpacity
                    className="bg-primary py-2 px-4 rounded-lg flex-row items-center"
                    onPress={() => router.push("/")}
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
          </>
        }
        renderItem={({ item }) => (
          <BeverageItem
            beverage={item}
            onPress={() => navigateToBeverageDetail(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[primaryColor]}
            tintColor={primaryColor}
          />
        }
        ListEmptyComponent={
          isLoading || filteredBeverages.length === 0 ?
            null
          : <View className="py-8 items-center">
              <Text className="text-muted-foreground">
                No beverages match your filters
              </Text>
            </View>
        }
      />

      {/* Filter Sheet */}
      <FilterSheet
        isVisible={isFilterSheetVisible}
        onClose={() => setIsFilterSheetVisible(false)}
        currentLiked={currentLiked ? currentLiked.toString() : undefined}
        currentSortOption={currentSortOption}
        onApplyFilter={applyFilter}
        onClearFilters={clearFilters}
      />
    </View>
  );
}
