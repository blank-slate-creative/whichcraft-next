import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export function ExampleComponent() {
  return (
    <View className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <Text className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        NativeWind Example
      </Text>
      <Text className="text-gray-600 dark:text-gray-300 mb-4">
        This component is styled using NativeWind
      </Text>
      <TouchableOpacity className="bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-md">
        <Text className="text-white font-semibold text-center">Tap Me</Text>
      </TouchableOpacity>
    </View>
  );
}
