import { Slot, Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import "react-native-reanimated";
import "../global.css";
import { AuthProvider, useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import { BeverageProvider } from "@whichcraft/beverage-context";

// Root layout must be exported as default
export default function RootLayout() {
  const { colorScheme: systemColorScheme } = useColorScheme();
  const [theme, setTheme] = useState<string | null>(null);

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
  }, []); // Added dependency array to prevent continuous re-renders

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
        <BeverageProvider initialBeverages={[]}>
          <RootLayoutNav />
        </BeverageProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </View>
  );
}

// Handle navigation based on auth state
function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Force navigation based on auth state
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to sign-in if not authenticated
        router.replace("/sign-in");
      }
    }
  }, [user, loading, router]);

  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If user is not authenticated, show sign-in stack
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

  // If user is authenticated, show collection stack
  return (
    <Stack>
      <Stack.Screen
        name="(collection)"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
