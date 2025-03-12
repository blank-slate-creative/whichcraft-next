import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useAuth } from "../context/AuthContext";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import ProfileActions from "../components/ProfileActions";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { getGravatarUrl } from "../utils/gravatar";
import { Image } from "react-native";

export default function ProfileScreen() {
  const { user } = useAuth();
  const [gravatarUrl, setGravatarUrl] = useState<string>("");
  const userName = user?.email?.split("@")[0] || "User";
  const email = user?.email || "";

  useEffect(() => {
    if (email) {
      getGravatarUrl(email, 120).then((url) => setGravatarUrl(url));
    }
  }, [email]);

  return (
    <ScrollView className="flex-1 bg-background">
      <ThemedView className="container px-4 py-6">
        <ThemedText type="title" className="mb-8 hidden md:flex">
          Profile
        </ThemedText>

        <ThemedView className="mb-8">
          <ThemedView className="flex-row items-center justify-between">
            <ThemedView className="flex-row items-center gap-4">
              <ThemedView className="h-16 w-16 rounded-full overflow-hidden bg-muted">
                {gravatarUrl ?
                  <Image
                    source={{ uri: gravatarUrl }}
                    className="h-16 w-16"
                    alt={userName}
                  />
                : <ThemedView className="h-16 w-16 items-center justify-center">
                    <ThemedText className="text-xl font-semibold">
                      {userName.charAt(0).toUpperCase()}
                    </ThemedText>
                  </ThemedView>
                }
              </ThemedView>
              <ThemedView>
                <ThemedText className="text-xl font-semibold">
                  {userName}
                </ThemedText>
                <ThemedText className="text-sm text-muted-foreground">
                  {email}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ProfileActions />
          </ThemedView>
        </ThemedView>

        <ThemedView>
          <ThemedText className="text-lg font-semibold mb-4">Theme</ThemedText>
          <ThemeSwitcher />
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}
