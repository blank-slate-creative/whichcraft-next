import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import * as Haptics from "expo-haptics";

type ThemeType = "light" | "dark" | "system";

interface ThemeOption {
  value: ThemeType;
  label: string;
}

const themeOptions: ThemeOption[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function ThemeSwitcher() {
  const { setColorScheme } = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>("system");

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
        if (savedTheme) {
          setTheme(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error("Failed to load theme preference", error);
      }
    };

    loadTheme();
  }, []);

  const handleThemeChange = async (newTheme: ThemeType) => {
    try {
      // Add haptic feedback when changing theme
      if (process.env.EXPO_OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Save the new theme preference
      await AsyncStorage.setItem("theme", newTheme);
      setTheme(newTheme);
      setColorScheme(newTheme);
    } catch (error) {
      console.error("Failed to save theme preference", error);
    }
  };

  return (
    <View>
      <Text className="text-sm font-medium px-1 mb-1">Theme</Text>

      <ThemedView className="rounded-lg overflow-hidden border border-border">
        {themeOptions.map((option, index) => (
          <React.Fragment key={option.value}>
            {index > 0 && <View className="h-[1px] bg-border" />}
            <TouchableOpacity
              className={`py-3 px-4 flex-row justify-between items-center ${
                theme === option.value ? "bg-secondary/50" : ""
              }`}
              onPress={() => handleThemeChange(option.value)}
              activeOpacity={0.7}
            >
              <ThemedText className="font-medium">{option.label}</ThemedText>
              {theme === option.value && (
                <View className="h-3 w-3 rounded-full bg-primary" />
              )}
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </ThemedView>
    </View>
  );
}
