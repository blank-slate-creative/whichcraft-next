import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useColorScheme, View } from "react-native";
import "react-native-reanimated";
import "../global.css";
import { AuthProvider, useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Root layout must be exported as default
export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<string | null>(null);
  const [loaded, setFontsLoaded] = useFonts({
    SpaceGrotesk: require("../assets/fonts/SpaceGrotesk[wght].ttf"),
  });

  // Load theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
        setTheme(savedTheme);
      } catch (error) {
        console.error("Failed to load theme preference", error);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Determine which color scheme to use
  let colorScheme = systemColorScheme;
  if (theme === "light") {
    colorScheme = "light";
  } else if (theme === "dark") {
    colorScheme = "dark";
  }

  return (
    <View className={`${colorScheme === "dark" ? "dark" : ""} h-full`}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
      <StatusBar style="auto" />
    </View>
  );
}

// Handle navigation based on auth state
function RootLayoutNav() {
  const { user, loading } = useAuth();

  // Show splash screen while checking auth state
  if (loading) {
    return null;
  }

  // If user is not authenticated, redirect to sign-in
  if (!user) {
    return (
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            title: "Sign In",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            title: "Sign Up",
            headerShown: false,
          }}
        />
      </Stack>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "systemBackground",
        },
        headerTitleStyle: {
          fontFamily: "SpaceGrotesk",
          color: "systemForeground",
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
