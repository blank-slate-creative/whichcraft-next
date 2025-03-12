import { Link } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-6">
        <View className="items-center py-8">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">
            WhichCraft
          </Text>
          <Text className="text-base text-gray-600 dark:text-gray-400 mt-2 text-center">
            Track your favorite beers and wines
          </Text>
        </View>

        <View className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
          <Text className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Welcome, {user?.email?.split("@")[0] || "User"}!
          </Text>
          <Text className="text-gray-600 dark:text-gray-400">
            Start tracking your beverage collection and discover new favorites.
          </Text>
        </View>

        <View className="gap-4">
          <TouchableOpacity className="w-full h-14 bg-gray-100 dark:bg-gray-800 rounded-lg flex-row items-center px-4">
            <View className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 items-center justify-center mr-4">
              <Text className="text-amber-600 dark:text-amber-300 text-lg">
                🍺
              </Text>
            </View>
            <View>
              <Text className="text-base font-medium text-gray-900 dark:text-white">
                My Beers
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                View your beer collection
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="w-full h-14 bg-gray-100 dark:bg-gray-800 rounded-lg flex-row items-center px-4">
            <View className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 items-center justify-center mr-4">
              <Text className="text-red-600 dark:text-red-300 text-lg">🍷</Text>
            </View>
            <View>
              <Text className="text-base font-medium text-gray-900 dark:text-white">
                My Wines
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                View your wine collection
              </Text>
            </View>
          </TouchableOpacity>

          <Link href="/profile" asChild>
            <TouchableOpacity className="w-full h-14 bg-gray-100 dark:bg-gray-800 rounded-lg flex-row items-center px-4">
              <View className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 items-center justify-center mr-4">
                <Text className="text-blue-600 dark:text-blue-300 text-lg">
                  👤
                </Text>
              </View>
              <View>
                <Text className="text-base font-medium text-gray-900 dark:text-white">
                  My Profile
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  View and edit your profile
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
