import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import "react-native-reanimated";
import "../global.css";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useColorScheme } from "nativewind";
import { BeverageProvider } from "@whichcraft/beverage-context";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

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

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Force navigation based on auth state
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to sign-in if not authenticated
      router.replace("/sign-in");
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
