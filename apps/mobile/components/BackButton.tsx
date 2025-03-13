import { TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useRouter } from "expo-router";

export function BackButton() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const primaryColor = isDark ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)";

  return (
    <TouchableOpacity onPress={() => router.back()}>
      <ArrowLeft size={24} color={primaryColor} />
    </TouchableOpacity>
  );
}
