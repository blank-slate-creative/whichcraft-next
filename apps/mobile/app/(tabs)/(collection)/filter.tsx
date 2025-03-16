import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ThumbsUp, ThumbsDown, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Badge } from "../../../components/Badge";
import { BeverageFilters } from "@whichcraft/api-client";
import { ThemeColors } from "../../../constants/Colors";

export default function FilterScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Get params from URL
  const { liked } = useLocalSearchParams<{
    liked?: string;
  }>();

  // Theme colors
  const primaryForegroundColor = ThemeColors.get(isDark, "primaryForeground");
  const mutedForegroundColor = ThemeColors.get(isDark, "mutedForeground");
  const primaryColor = ThemeColors.get(isDark, "primary");
  const backgroundColor = ThemeColors.get(isDark, "background");
  // Get current filter values from URL params
  const currentLiked =
    liked === "undefined" || liked === undefined ? undefined : liked;

  // Apply filter
  const applyFilter = ({ liked }: { liked?: string }) => {
    router.setParams({
      liked,
    });
  };

  // Clear all filters
  const clearFilters = () => {
    // Navigate back to collection with cleared params
    router.replace({
      pathname: "/(tabs)/(collection)",
      params: {},
    });
  };

  // Close the filter screen
  const closeFilter = () => {
    router.back();
  };

  // Apply and close
  const applyAndClose = () => {
    // Instead of replacing the route, we should go back to dismiss the modal
    // and pass the filter parameters to the previous screen
    router.back();

    // After going back, update the collection screen's params
    router.setParams({
      liked: currentLiked,
      refresh: "true",
    });
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: "Filters",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerTintColor: primaryColor,
          headerLeft: () => (
            <TouchableOpacity onPress={closeFilter} className="ml-2">
              <X size={24} color={primaryColor} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={clearFilters} className="mr-4">
              <Text className="text-primary font-semibold">Reset All</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="p-4">
        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground mb-3">
            Rating
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <Badge
              selected={!currentLiked}
              onPress={() => applyFilter({ liked: undefined })}
            >
              All Ratings
            </Badge>
            <Badge
              selected={currentLiked === "true"}
              onPress={() => applyFilter({ liked: "true" })}
              icon={
                <ThumbsUp
                  size={14}
                  color={
                    currentLiked === "true" ?
                      primaryForegroundColor
                    : mutedForegroundColor
                  }
                  style={{ marginRight: 4 }}
                />
              }
            >
              Liked
            </Badge>
            <Badge
              selected={currentLiked === "false"}
              onPress={() => applyFilter({ liked: "false" })}
              icon={
                <ThumbsDown
                  size={14}
                  color={
                    currentLiked === "false" ?
                      primaryForegroundColor
                    : mutedForegroundColor
                  }
                  style={{ marginRight: 4 }}
                />
              }
            >
              Disliked
            </Badge>
          </View>
        </View>

        <View className="flex-row gap-2 mt-4">
          <TouchableOpacity
            className="flex-1 py-3 border border-border rounded-md items-center"
            onPress={closeFilter}
          >
            <Text className="text-foreground">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-3 bg-primary rounded-md items-center"
            onPress={applyAndClose}
          >
            <Text className="text-primary-foreground">Apply</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
