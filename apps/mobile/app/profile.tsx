import React from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error: any) {
      Alert.alert("Error", error.message || "An unexpected error occurred");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-6">
        <View className="items-center py-8">
          <View className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 items-center justify-center mb-4">
            <Text className="text-3xl text-blue-600 dark:text-blue-300">
              {user?.email?.[0]?.toUpperCase() || "?"}
            </Text>
          </View>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            {user?.email || "User"}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user?.id}
          </Text>
        </View>

        <View className="space-y-4 mt-6">
          <View className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Account Information
            </Text>
            <View className="space-y-3">
              <View>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </Text>
                <Text className="text-base text-gray-900 dark:text-white">
                  {user?.email || "Not available"}
                </Text>
              </View>
              <View>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Last Sign In
                </Text>
                <Text className="text-base text-gray-900 dark:text-white">
                  {user?.last_sign_in_at ?
                    new Date(user.last_sign_in_at).toLocaleString()
                  : "Not available"}
                </Text>
              </View>
            </View>
          </View>

          <View className="space-y-2">
            <TouchableOpacity
              className="w-full h-12 bg-blue-600 rounded-lg items-center justify-center"
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "This feature is not yet implemented."
                )
              }
            >
              <Text className="text-white font-medium">Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full h-12 bg-red-600 rounded-lg items-center justify-center"
              onPress={handleSignOut}
            >
              <Text className="text-white font-medium">Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
