import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { BeverageApiClient, Beverage } from "@whichcraft/api-client";
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Trash2,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "../../components/Badge";
import BeverageItem from "../../components/BeverageItem";

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

  // Theme colors
  const primaryColor = isDark ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)";
  const mutedForegroundColor =
    isDark ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)";
  const destructiveColor = isDark ? "rgb(239, 68, 68)" : "rgb(239, 68, 68)";
  const backgroundColor = isDark ? "rgb(10, 10, 10)" : "rgb(255, 255, 255)";

  // State
  const [beverage, setBeverage] = useState<Beverage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch beverage details
  useEffect(() => {
    const fetchBeverage = async () => {
      if (!session?.access_token || !id) return;

      try {
        setIsLoading(true);
        const data = await beverageApi.getById(session.access_token, id);
        setBeverage(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching beverage:", err);
        setError("Failed to load beverage details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBeverage();
  }, [session, id]);

  // Handle rating update
  const handleRatingUpdate = async (liked: boolean) => {
    if (!session?.access_token || !beverage) return;

    try {
      setIsUpdating(true);
      const updatedBeverage = await beverageApi.update(
        session.access_token,
        beverage.id,
        { liked }
      );
      setBeverage(updatedBeverage);
    } catch (err) {
      console.error("Error updating rating:", err);
      Alert.alert("Error", "Failed to update rating");
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
              await beverageApi.delete(session.access_token, beverage.id);
              router.back();
            } catch (err) {
              console.error("Error deleting beverage:", err);
              Alert.alert("Error", "Failed to delete beverage");
              setIsUpdating(false);
            }
          },
        },
      ]
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <Stack.Screen
        options={{
          title: beverage?.name || "Beverage Details",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <ArrowLeft size={24} color={primaryColor} />
            </TouchableOpacity>
          ),
        }}
      />

      {isLoading ?
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      : error ?
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-destructive text-lg mb-4">{error}</Text>
          <TouchableOpacity
            className="bg-primary px-4 py-2 rounded-md"
            onPress={() => router.back()}
          >
            <Text className="text-primary-foreground">Go Back</Text>
          </TouchableOpacity>
        </View>
      : beverage ?
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Use BeverageItem for basic info */}
          <View className="py-4">
            <BeverageItem
              beverage={beverage}
              showRating={false}
              hideBottomBorder={true}
              disabled={true}
              titleStyle={{ fontSize: 20, fontWeight: "bold" }}
              subtitleStyle={{ fontSize: 16 }}
            />
          </View>

          {/* Content */}
          <View className="px-4">
            {/* Type and Style */}
            <View className="flex-row flex-wrap gap-2 mb-6">
              <Badge variant="secondary">{beverage.type}</Badge>
              {beverage.style && (
                <Badge variant="secondary">{beverage.style}</Badge>
              )}
              {beverage.abv && (
                <Badge variant="secondary">{beverage.abv}% ABV</Badge>
              )}
            </View>

            {/* Rating */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-foreground mb-3">
                Your Rating
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-md flex-row items-center justify-center gap-2 ${
                    beverage.liked === true ? "bg-primary" : "bg-secondary"
                  }`}
                  onPress={() => handleRatingUpdate(true)}
                  disabled={isUpdating}
                >
                  <ThumbsUp
                    size={18}
                    color={
                      beverage.liked === true ?
                        isDark ?
                          "rgb(10, 10, 10)"
                        : "rgb(250, 250, 250)"
                      : primaryColor
                    }
                  />
                  <Text
                    className={`font-medium ${
                      beverage.liked === true ?
                        "text-primary-foreground"
                      : "text-foreground"
                    }`}
                  >
                    Like
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-1 py-3 rounded-md flex-row items-center justify-center gap-2 ${
                    beverage.liked === false ? "bg-destructive" : "bg-secondary"
                  }`}
                  onPress={() => handleRatingUpdate(false)}
                  disabled={isUpdating}
                >
                  <ThumbsDown
                    size={18}
                    color={
                      beverage.liked === false ?
                        isDark ?
                          "rgb(10, 10, 10)"
                        : "rgb(250, 250, 250)"
                      : destructiveColor
                    }
                  />
                  <Text
                    className={`font-medium ${
                      beverage.liked === false ?
                        "text-destructive-foreground"
                      : "text-foreground"
                    }`}
                  >
                    Dislike
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Notes */}
            {beverage.notes && (
              <View className="mb-6">
                <Text className="text-sm font-medium text-foreground mb-2">
                  Notes
                </Text>
                <View className="bg-secondary p-3 rounded-md">
                  <Text className="text-foreground">{beverage.notes}</Text>
                </View>
              </View>
            )}

            {/* Date Added */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-foreground mb-2">
                Added On
              </Text>
              <Text className="text-muted-foreground">
                {formatDate(beverage.created_at)}
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                className="flex-1 py-3 bg-primary rounded-md flex-row items-center justify-center gap-2"
                onPress={() => router.push(`/beverage/edit/${beverage.id}`)}
              >
                <Edit
                  size={18}
                  color={isDark ? "rgb(10, 10, 10)" : "rgb(250, 250, 250)"}
                />
                <Text className="text-primary-foreground font-medium">
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="mt-3 py-3 border border-destructive rounded-md flex-row items-center justify-center gap-2"
              onPress={handleDelete}
            >
              <Trash2 size={18} color={destructiveColor} />
              <Text className="text-destructive font-medium">Delete</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      : null}
    </View>
  );
}
