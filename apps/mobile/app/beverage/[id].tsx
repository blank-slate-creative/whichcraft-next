import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
  TextInput,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { BeverageApiClient, Beverage } from "@whichcraft/api-client";
import { ThumbsUp, ThumbsDown, Trash2 } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "../../components/Badge";
import { BackButton } from "../../components/BackButton";
import { debounce } from "../../utils/functions";
import { useBeverages } from "@whichcraft/beverage-context";

// Create API client instance
const beverageApi = new BeverageApiClient({
  apiUrl: process.env.EXPO_PUBLIC_API_URL || "https://api.whichcraft.app",
});

export default function BeverageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useAuth();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const { deleteBeverage, setBeverages, setAllBeverages, beverages } =
    useBeverages();

  // Theme colors
  const primaryColor = isDark ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)";
  const mutedForegroundColor =
    isDark ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)";
  const destructiveColor = isDark ? "rgb(239, 68, 68)" : "rgb(239, 68, 68)";
  const backgroundColor = isDark ? "rgb(10, 10, 10)" : "rgb(255, 255, 255)";

  // State
  const [beverage, setBeverage] = useState<Beverage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Find cached beverage from context
  useEffect(() => {
    if (id) {
      // Try to get the beverage from context first
      const cachedBeverage = beverages.find((b) => b.id === id);
      if (cachedBeverage) {
        setBeverage(cachedBeverage);
        setNotes(cachedBeverage.notes || "");
        setIsLoading(false);
      } else {
        // If not in context, we'll need to fetch it
        setIsLoading(true);
      }
    }
  }, [id, beverages]);

  // Fetch beverage details if not in context
  useEffect(() => {
    const fetchBeverage = async () => {
      if (!session?.access_token || !id || !isLoading) return;

      try {
        const data = await beverageApi.getById(session.access_token, id);
        setBeverage(data);
        setNotes(data.notes || "");
        setError(null);
      } catch (err) {
        console.error("Error fetching beverage:", err);
        setError("Failed to load beverage details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBeverage();
  }, [session, id, isLoading]);

  // Handle notes update with debounce
  const debouncedUpdate = useCallback(
    debounce(async (newNotes: string) => {
      if (!session?.access_token || !beverage) return;

      // Store the previous state for rollback if needed
      const previousBeverage = { ...beverage };

      // Create optimistic update
      const optimisticBeverage = { ...beverage, notes: newNotes };

      // We don't update the local beverage state here since we already
      // updated the notes input field for immediate feedback

      try {
        setIsSaving(true);

        // Optimistically update the context
        setBeverages((prev) =>
          prev.map((b) => (b.id === beverage.id ? optimisticBeverage : b))
        );
        setAllBeverages((prev) =>
          prev.map((b) => (b.id === beverage.id ? optimisticBeverage : b))
        );

        // Make the API call
        const updatedBeverage = await beverageApi.update(
          session.access_token,
          beverage.id,
          { notes: newNotes }
        );

        // Update with the server response
        setBeverage(updatedBeverage);
        setBeverages((prev) =>
          prev.map((b) => (b.id === updatedBeverage.id ? updatedBeverage : b))
        );
        setAllBeverages((prev) =>
          prev.map((b) => (b.id === updatedBeverage.id ? updatedBeverage : b))
        );
      } catch (err) {
        console.error("Error updating notes:", err);
        Alert.alert("Error", "Failed to update notes");

        // Rollback to previous state on error
        setBeverage(previousBeverage);
        setBeverages((prev) =>
          prev.map((b) => (b.id === beverage.id ? previousBeverage : b))
        );
        setAllBeverages((prev) =>
          prev.map((b) => (b.id === beverage.id ? previousBeverage : b))
        );
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    [session, beverage, setBeverages, setAllBeverages]
  );

  // Handle notes change
  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    debouncedUpdate(newNotes);
  };

  // Handle rating update with optimistic updates
  const handleRatingUpdate = async (liked: boolean) => {
    if (!session?.access_token || !beverage) return;

    // Store the previous state for rollback if needed
    const previousBeverage = { ...beverage };

    // Optimistically update the UI
    const optimisticBeverage = { ...beverage, liked };
    setBeverage(optimisticBeverage);

    // Optimistically update the context
    setBeverages((prev) =>
      prev.map((b) => (b.id === beverage.id ? optimisticBeverage : b))
    );
    setAllBeverages((prev) =>
      prev.map((b) => (b.id === beverage.id ? optimisticBeverage : b))
    );

    try {
      setIsUpdating(true);
      // Make the API call
      const updatedBeverage = await beverageApi.update(
        session.access_token,
        beverage.id,
        { liked }
      );

      // Update with the server response
      setBeverage(updatedBeverage);
      setBeverages((prev) =>
        prev.map((b) => (b.id === updatedBeverage.id ? updatedBeverage : b))
      );
      setAllBeverages((prev) =>
        prev.map((b) => (b.id === updatedBeverage.id ? updatedBeverage : b))
      );
    } catch (err) {
      console.error("Error updating rating:", err);
      Alert.alert("Error", "Failed to update rating");

      // Rollback to previous state on error
      setBeverage(previousBeverage);
      setBeverages((prev) =>
        prev.map((b) => (b.id === beverage.id ? previousBeverage : b))
      );
      setAllBeverages((prev) =>
        prev.map((b) => (b.id === beverage.id ? previousBeverage : b))
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!session?.access_token || !beverage) return;

    Alert.alert(
      "Delete Beverage",
      `Are you sure you want to delete "${beverage.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsUpdating(true);

              // Optimistically delete from context
              deleteBeverage(beverage.id);

              // Navigate back immediately for better UX
              router.back();

              // Then perform the actual API call
              await beverageApi.delete(session.access_token, beverage.id);
            } catch (err) {
              console.error("Error deleting beverage:", err);

              // We've already navigated away, so just log the error
              // In a production app, you might want to show a toast or notification
              // that appears on the collection screen
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={backgroundColor}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => <BackButton />,
          title: beverage?.name || "Beverage Details",
          animation: "slide_from_right",
          presentation: "card",
          animationDuration: 200,
        }}
      />

      {isLoading ?
        <View className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      : error || !beverage ?
        <View className="flex-1 items-center justify-center bg-background">
          <Text className="text-foreground">
            {error || "Beverage not found"}
          </Text>
        </View>
      : <ScrollView
          className="flex-1 bg-background"
          contentContainerStyle={{ paddingBottom: insets.bottom }}
        >
          <View className="p-4">
            {/* Beverage Image */}
            <View className="items-center mb-6">
              <View className="h-32 w-32 rounded-lg bg-secondary items-center justify-center mb-4">
                {beverage.image_url ?
                  <Image
                    source={{ uri: beverage.image_url }}
                    className="h-32 w-32 rounded-lg"
                    resizeMode="cover"
                  />
                : <Text className="text-3xl">
                    {beverage.type === "Beer" ? "🍺" : "🍷"}
                  </Text>
                }
              </View>
              <Text className="text-2xl font-bold text-foreground">
                {beverage.name}
              </Text>
              <Text className="text-base text-muted-foreground">
                {beverage.producer}
              </Text>
              <View className="flex-row items-center gap-2 mt-2">
                {beverage.style ?
                  <Badge variant="secondary">{beverage.style}</Badge>
                : null}
                {beverage.abv !== null ?
                  <Badge variant="secondary">{beverage.abv}% ABV</Badge>
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
                    beverage.liked === true ? "bg-primary" : "bg-secondary"
                  }`}
                  onPress={() => handleRatingUpdate(true)}
                  disabled={isUpdating}
                >
                  <ThumbsUp
                    size={20}
                    color={beverage.liked === true ? "white" : primaryColor}
                  />
                  <Text
                    className={`text-base ${
                      beverage.liked === true ? "text-white" : "text-foreground"
                    }`}
                  >
                    Like
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 flex-row items-center justify-center gap-2 p-3 rounded-md ${
                    beverage.liked === false ? "bg-destructive" : "bg-secondary"
                  }`}
                  onPress={() => handleRatingUpdate(false)}
                  disabled={isUpdating}
                >
                  <ThumbsDown
                    size={20}
                    color={
                      beverage.liked === false ? "white" : destructiveColor
                    }
                  />
                  <Text
                    className={`text-base ${
                      beverage.liked === false ?
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
                Notes{" "}
                {isSaving && (
                  <Text className="text-xs text-muted-foreground">
                    Saving...
                  </Text>
                )}
              </Text>
              <TextInput
                className="bg-secondary text-foreground p-3 rounded-md min-h-[100]"
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={handleNotesChange}
                placeholder="Add notes about this beverage..."
                placeholderTextColor={mutedForegroundColor}
              />
            </View>

            {/* Date Added */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-foreground mb-2">
                Date Added
              </Text>
              <Text className="text-base text-muted-foreground">
                {new Date(beverage.created_at).toLocaleDateString()}
              </Text>
            </View>

            {/* Delete Button */}
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 p-3 rounded-md bg-destructive"
              onPress={handleDelete}
              disabled={isUpdating}
            >
              <Trash2 size={20} color="white" />
              <Text className="text-base text-white">Delete Beverage</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      }
    </>
  );
}
