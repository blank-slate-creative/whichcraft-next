import { TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useRouter } from "expo-router";
import { ThemeColors } from "../constants/Colors";

export function BackButton() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const primaryColor = ThemeColors.get(isDark, "primary");

  return (
    <TouchableOpacity onPress={() => router.back()}>
      <ArrowLeft size={24} color={primaryColor} />
    </TouchableOpacity>
  );
}
