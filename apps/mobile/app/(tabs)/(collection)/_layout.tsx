import { Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";

export default function CollectionLayout() {
  const { colors } = useTheme();

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="search-beverage" />
      <Stack.Screen name="add-beverage-details" />
    </Stack>
  );
}
