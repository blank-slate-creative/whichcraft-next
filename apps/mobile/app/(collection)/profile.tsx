import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useAuth } from "../../context/AuthContext";
import ProfileActions from "../../components/ProfileActions";
import { getGravatarUrl } from "../../utils/gravatar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useThemeColor } from "../../hooks/useThemeColor";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [gravatarUrl, setGravatarUrl] = useState<string>("");
  const userName = user?.email?.split("@")[0] || "User";
  const email = user?.email || "";
  const { colors, isDark } = useThemeColor();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (email) {
      getGravatarUrl(email, 120).then((url) => setGravatarUrl(url));
    }
  }, [email]);

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
          headerTintColor: colors.primary,
          headerBlurEffect: "regular",
          headerShadowVisible: true,
          headerLargeTitleShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
      <View className="flex-1 gap-8 p-4">
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
