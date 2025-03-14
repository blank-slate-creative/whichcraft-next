import { useState, useEffect, useCallback, useRef } from "react";
import { Stack, useRouter } from "expo-router";
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
  StatusBar,
} from "react-native";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Beverage, BeerSearchResult } from "@whichcraft/api-client";
import { mobileBeverageApi } from "../utils/api";
import { useBeverages } from "@whichcraft/beverage-context";
import {
  ChevronRight,
  Edit,
  Search,
  ThumbsUp,
  ThumbsDown,
  X,
  ArrowLeft,
} from "lucide-react-native";
import { BackButton } from "../components/BackButton";
import { BeverageItem } from "../components/BeverageItem";
import { Badge } from "../components/Badge";

// Steps in the form flow
enum FormStep {
  Search,
  Preferences,
}

export default function AddBeverageScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const { setBeverages, setAllBeverages, allBeverages } = useBeverages();

  // Theme colors
  const primaryColor = isDark ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)";
  const mutedForegroundColor =
    isDark ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)";
  const backgroundColor = isDark ? "rgb(10, 10, 10)" : "rgb(255, 255, 255)";

  // State
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.Search);
  const [isSearchMode, setIsSearchMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Beverage[]>([]);
  const [beverageData, setBeverageData] = useState<Beverage>({
    name: "",
    producer: "",
    type: "Beer",
    style: "",
    notes: "",
    liked: true,
    abv: null,
    id: "",
    image_url: null,
    created_at: "",
    untappd_beer_id: null,
    untappd_brewery_id: null,
  });

  // Debounce search
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handle beverage data changes
  const handleBeverageDataChange = (data: Partial<Beverage>) => {
    setBeverageData((prev) => ({ ...prev, ...data }));
  };

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
    setBeverageData(beverage);
    setCurrentStep(FormStep.Preferences);
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

      // Navigate back to collection with refresh param
      router.replace({
        pathname: "/(tabs)",
        params: { refresh: "true" },
      });
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save beverage");
      setIsLoading(false);
    }
  };

  // Render search step
  const renderSearchStep = () => {
    return (
      <View>
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-1">
            Add to Collection
          </Text>
          <Text className="text-muted-foreground">
            Search for a beer or add details manually
          </Text>
        </View>

        {isSearchMode ?
          <View>
            <View className="relative mb-4">
              <TextInput
                className="bg-secondary text-foreground rounded-lg py-3 pl-10 pr-4"
                placeholder="Search for a beer..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={handleSearchInputChange}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity
                className="absolute left-3 top-3"
                onPress={handleSearch}
              >
                <Search size={16} color={mutedForegroundColor} />
              </TouchableOpacity>
              {searchQuery ?
                <TouchableOpacity
                  className="absolute right-3 top-3"
                  onPress={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  <X size={16} color={mutedForegroundColor} />
                </TouchableOpacity>
              : null}
            </View>

            <View>
              {isLoading ?
                <View className="items-center justify-center py-8">
                  <ActivityIndicator size="large" color={primaryColor} />
                </View>
              : searchResults.length > 0 ?
                <View>
                  <Text className="text-sm font-medium text-foreground mb-2">
                    Search Results
                  </Text>
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
                </View>
              : searchQuery && !isLoading ?
                <View className="py-4 items-center">
                  <Text className="text-muted-foreground">
                    No beers found. Try a different search term or add manually.
                  </Text>
                </View>
              : null}
            </View>
          </View>
        : <View className="space-y-4">
            <View className="space-y-2">
              <Text className="text-sm font-medium text-foreground">Name*</Text>
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

            <View className="space-y-2">
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

            <View className="space-y-2">
              <Text className="text-sm font-medium text-foreground">Style</Text>
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

            <View className="space-y-2">
              <Text className="text-sm font-medium text-foreground">
                ABV (%)
              </Text>
              <TextInput
                className="bg-secondary text-foreground rounded-lg py-3 px-4"
                placeholder="Alcohol percentage"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={
                  beverageData.abv === null ? "" : beverageData.abv?.toString()
                }
                onChangeText={(text) =>
                  handleBeverageDataChange({
                    abv: text === "" ? null : parseFloat(text),
                  })
                }
              />
            </View>

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="flex-row items-center py-2"
                onPress={() => setIsSearchMode(true)}
              >
                <Search
                  size={16}
                  color={mutedForegroundColor}
                  className="mr-2"
                />
                <Text className="text-muted-foreground">Search instead</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-primary py-2 px-4 rounded-lg flex-row items-center"
                onPress={() => setCurrentStep(FormStep.Preferences)}
                disabled={!beverageData.name}
              >
                <Text className="text-primary-foreground font-medium mr-1">
                  Continue
                </Text>
                <ChevronRight
                  size={16}
                  color={isDark ? "rgb(10, 10, 10)" : "rgb(250, 250, 250)"}
                />
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
    );
  };

  // Render preferences step
  const renderPreferencesStep = () => {
    return (
      <View className="space-y-6">
        {/* Beverage Info Header */}
        <View className="items-center mb-2">
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

        {/* Rating */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground mb-2">
            Rating
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
                    isDark ?
                      "rgb(10, 10, 10)"
                    : "rgb(250, 250, 250)"
                  : primaryColor
                }
              />
              <Text
                className={`text-base ${
                  beverageData.liked === true ?
                    "text-primary-foreground"
                  : "text-foreground"
                }`}
              >
                Like
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 flex-row items-center justify-center gap-2 p-3 rounded-md ${
                beverageData.liked === false ? "bg-destructive" : "bg-secondary"
              }`}
              onPress={() => handleBeverageDataChange({ liked: false })}
            >
              <ThumbsDown
                size={20}
                color={
                  beverageData.liked === false ? "white" : mutedForegroundColor
                }
              />
              <Text
                className={`text-base ${
                  beverageData.liked === false ?
                    "text-white"
                  : "text-foreground"
                }`}
              >
                Dislike
              </Text>
            </TouchableOpacity>
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
            placeholderTextColor={mutedForegroundColor}
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
                Save Beer
              </Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Stack.Screen
        options={{
          title:
            currentStep === FormStep.Search ?
              "Add Beer"
            : beverageData.name || "Add Beer",
          headerShown: true,
          headerLeft: () => <BackButton />,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerTintColor: primaryColor,
          animation: "slide_from_right",
          presentation: "card",
          animationDuration: 200,
        }}
      />

      {currentStep === FormStep.Search ?
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 80,
          }}
          keyboardShouldPersistTaps="never"
          showsVerticalScrollIndicator={false}
        >
          {renderSearchStep()}
        </ScrollView>
      : <ScrollView
          className="flex-1"
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 32 + insets.bottom,
          }}
          keyboardShouldPersistTaps="never"
          showsVerticalScrollIndicator={false}
        >
          {renderPreferencesStep()}
        </ScrollView>
      }

      {/* Native Screen Footer */}
      {currentStep === FormStep.Search && isSearchMode && (
        <View
          className="absolute bottom-0 left-0 right-0 border-t border-border bg-background px-4 py-4 z-10"
          style={{ paddingBottom: insets.bottom }}
        >
          <TouchableOpacity
            className="flex-row items-center justify-center py-3 bg-secondary rounded-md"
            onPress={() => setIsSearchMode(false)}
          >
            <Edit size={18} color={primaryColor} className="mr-2" />
            <Text className="text-foreground font-medium">
              Add Manually Instead
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
