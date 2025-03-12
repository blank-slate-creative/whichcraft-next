import React, { useState, useEffect } from "react";
import { TouchableOpacity, AppState } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";

type ThemeType = "light" | "dark" | "system";

export function ThemeSwitcher() {
  const { colorScheme, setColorScheme } = useColorScheme();
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
      // Save the new theme preference
      await AsyncStorage.setItem("theme", newTheme);
      setTheme(newTheme);
      setColorScheme(newTheme);
    } catch (error) {
      console.error("Failed to save theme preference", error);
    }
  };

  return (
    <ThemedView className="gap-2">
      <TouchableOpacity
        className={`w-full h-12 rounded-lg items-center justify-center ${
          theme === "light" ?
            "bg-primary dark:bg-primary"
          : "bg-gray-100 dark:bg-gray-800"
        }`}
        onPress={() => handleThemeChange("light")}
      >
        <ThemedText
          className={`font-medium ${
            theme === "light" ?
              "text-primary-foreground dark:text-primary-foreground"
            : "text-gray-900 dark:text-white"
          }`}
        >
          Light
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        className={`w-full h-12 rounded-lg items-center justify-center ${
          theme === "dark" ?
            "bg-primary dark:bg-primary"
          : "bg-gray-100 dark:bg-gray-800"
        }`}
        onPress={() => handleThemeChange("dark")}
      >
        <ThemedText
          className={`font-medium ${
            theme === "dark" ?
              "text-primary-foreground dark:text-primary-foreground"
            : "text-gray-900 dark:text-white"
          }`}
        >
          Dark
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        className={`w-full h-12 rounded-lg items-center justify-center ${
          theme === "system" ?
            "bg-primary dark:bg-primary"
          : "bg-gray-100 dark:bg-gray-800"
        }`}
        onPress={() => handleThemeChange("system")}
      >
        <ThemedText
          className={`font-medium ${
            theme === "system" ?
              "text-primary-foreground dark:text-primary-foreground"
            : "text-gray-900 dark:text-white"
          }`}
        >
          System ({colorScheme === "dark" ? "Dark" : "Light"})
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
