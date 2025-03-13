import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useColorScheme } from "nativewind";

export default function EditBeverageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <Stack.Screen
        options={{
          title: "Edit Beverage",
          headerShown: true,
        }}
      />

      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-foreground text-lg mb-4">
          Edit Beverage Screen (ID: {id})
        </Text>
        <Text className="text-muted-foreground text-center mb-6">
          This is a placeholder for the edit beverage screen. The actual
          implementation would include a form to edit the beverage details.
        </Text>
        <TouchableOpacity
          className="bg-primary px-4 py-2 rounded-md"
          onPress={() => router.back()}
        >
          <Text className="text-primary-foreground">Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
