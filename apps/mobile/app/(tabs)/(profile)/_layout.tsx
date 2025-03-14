import { Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";

export default function ProfileLayout() {
  const { colors } = useTheme();

  return (
    <Stack>
      <Stack.Screen name="profile" />
    </Stack>
  );
}
