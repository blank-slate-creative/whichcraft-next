import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { ThemeSwitcher } from "../../../components/ThemeSwitcher";
import ProfileActions from "../../../components/ProfileActions";
import { getGravatarUrl } from "../../../utils/gravatar";
import { useColorScheme } from "nativewind";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { ThemeColors } from "../../../constants/Colors";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [gravatarUrl, setGravatarUrl] = useState<string>("");
  const userName = user?.email?.split("@")[0] || "User";
  const email = user?.email || "";
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  // Theme colors
  const primaryColor = ThemeColors.get(isDark, "primary");
  const backgroundColor = ThemeColors.get(isDark, "background");
  const mutedForegroundColor = ThemeColors.get(isDark, "mutedForeground");

  useEffect(() => {
    if (email) {
      getGravatarUrl(email, 120).then((url) => setGravatarUrl(url));
    }
  }, [email]);

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

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
    >
      <Stack.Screen
        options={{
          title: "Profile",
          headerShown: true,
          headerLargeTitle: true,
          headerTintColor: primaryColor,
          headerBlurEffect: "regular",
          headerShadowVisible: true,
          headerLargeTitleShadowVisible: false,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
        }}
      />
      <View className="flex-1 gap-8 px-4 py-8">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <View className="h-16 w-16 rounded-full overflow-hidden bg-secondary">
              {gravatarUrl ?
                <Image
                  source={{ uri: gravatarUrl }}
                  className="h-16 w-16"
                  alt={userName}
                />
              : <View className="h-16 w-16 items-center justify-center">
                  <Text className="text-xl font-semibold text-foreground">
                    {userName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              }
            </View>
            <View>
              <Text className="text-xl font-semibold text-foreground">
                {userName}
              </Text>
              <Text className="text-sm text-muted-foreground">{email}</Text>
            </View>
          </View>
        </View>

        <ProfileActions />
      </View>
    </ScrollView>
  );
}
