import { Stack } from "expo-router";

export default function CollectionLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="search-beverage" />
      <Stack.Screen name="add-beverage-details" />
      <Stack.Screen name="profile" />
      <Stack.Screen
        name="filter"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
