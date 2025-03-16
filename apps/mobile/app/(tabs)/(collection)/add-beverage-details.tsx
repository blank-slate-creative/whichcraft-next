import { useState } from "react";
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
} from "react-native";
import { useColorScheme } from "nativewind";
import { Beverage } from "@whichcraft/api-client";
import { mobileBeverageApi } from "../../../utils/api";
import { useBeverages } from "@whichcraft/beverage-context";
import { ThumbsUp, ThumbsDown } from "lucide-react-native";
import { Badge } from "../../../components/Badge";
import { ThemeColors } from "../../../constants/Colors";

export default function AddBeverageDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { setBeverages, setAllBeverages } = useBeverages();

  // Theme colors
  const primaryColor = ThemeColors.get(isDark, "primary");
  const mutedForegroundColor = ThemeColors.get(isDark, "mutedForeground");
  const backgroundColor = ThemeColors.get(isDark, "background");

  // Parse beverage data from params
  const initialBeverage: Beverage = JSON.parse(params.beverage as string);
  const isManualEntry = params.isManualEntry === "true";

  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [beverageData, setBeverageData] = useState<Beverage>(initialBeverage);

  // Handle beverage data changes
  const handleBeverageDataChange = (data: Partial<Beverage>) => {
    setBeverageData((prev) => ({ ...prev, ...data }));
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
        pathname: "/(tabs)/(collection)",
        params: { refresh: "true" },
      });
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
            backgroundColor: backgroundColor,
          },
          headerTintColor: primaryColor,
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
                  beverageData.liked === false ?
                    "bg-destructive"
                  : "bg-secondary"
                }`}
                onPress={() => handleBeverageDataChange({ liked: false })}
              >
                <ThumbsDown
                  size={20}
                  color={
                    beverageData.liked === false ?
                      "white"
                    : mutedForegroundColor
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
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
