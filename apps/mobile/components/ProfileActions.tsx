import React from "react";
import { TouchableOpacity, Alert } from "react-native";
import { ThemedText } from "./ThemedText";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";

export default function ProfileActions() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error: any) {
      Alert.alert("Error", error.message || "An unexpected error occurred");
    }
  };

  return (
    <TouchableOpacity
      className="h-10 border-primary border rounded-lg items-center justify-center px-4"
      onPress={handleSignOut}
    >
      <ThemedText className="text-primary font-medium">Sign Out</ThemedText>
    </TouchableOpacity>
  );
}
