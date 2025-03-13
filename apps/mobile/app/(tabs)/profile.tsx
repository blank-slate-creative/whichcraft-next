import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";
import ProfileActions from "../../components/ProfileActions";
import { getGravatarUrl } from "../../utils/gravatar";
import { useColorScheme } from "nativewind";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user } = useAuth();
  const [gravatarUrl, setGravatarUrl] = useState<string>("");
  const userName = user?.email?.split("@")[0] || "User";
  const email = user?.email || "";
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  // Theme colors
  const primaryColor = isDark ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)";
  const mutedForegroundColor =
    isDark ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)";

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
    <View className="flex-1 bg-background">
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
            backgroundColor: isDark ? "rgb(10, 10, 10)" : "rgb(255, 255, 255)",
          },
          headerBorderStyle,
        ]}
      >
        <View className="flex-row items-center justify-between px-4 h-full">
          <Animated.Text
            style={[
              {
                fontSize: 18,
                fontWeight: "600",
                color: primaryColor,
              },
              headerAnimatedStyle,
            ]}
          >
            Profile
          </Animated.Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: contentPaddingTop,
          paddingBottom: 40,
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View className="flex-1 gap-8 px-4">
          <Text className="text-4xl font-bold text-foreground">Profile</Text>

          <View>
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
          </View>

          <ThemeSwitcher />

          <ProfileActions />
        </View>
      </Animated.ScrollView>
    </View>
  );
}
