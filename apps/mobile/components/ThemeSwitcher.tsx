import React, { useState, useEffect } from "react";
import { TouchableOpacity, AppState } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";

type ThemeType = "light" | "dark" | "system";

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
          theme === "light" ? "bg-primary" : "bg-secondary"
        }`}
        onPress={() => handleThemeChange("light")}
      >
        <ThemedText
          className={`font-medium ${
            theme === "light" ?
              "text-primary-foreground"
            : "text-secondary-foreground"
          }`}
        >
          Light
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        className={`w-full h-12 rounded-lg items-center justify-center ${
          theme === "dark" ? "bg-primary" : "bg-secondary"
        }`}
        onPress={() => handleThemeChange("dark")}
      >
        <ThemedText
          className={`font-medium ${
            theme === "dark" ?
              "text-primary-foreground"
            : "text-secondary-foreground"
          }`}
        >
          Dark
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        className={`w-full h-12 rounded-lg items-center justify-center ${
          theme === "system" ? "bg-primary" : "bg-secondary"
        }`}
        onPress={() => handleThemeChange("system")}
      >
        <ThemedText
          className={`font-medium ${
            theme === "system" ?
              "text-primary-foreground"
            : "text-secondary-foreground"
          }`}
        >
          System
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
