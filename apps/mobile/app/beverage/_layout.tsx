import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";

export default function BeverageLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDark ? "rgb(10, 10, 10)" : "rgb(255, 255, 255)",
        },
        animation: "slide_from_right",
        presentation: "card",
        animationDuration: 200,
      }}
    />
  );
}
